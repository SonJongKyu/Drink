package site.dlink.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {
    private final JavaMailSender mailSender;
    private static final int CODE_EXPIRY_MINUTES = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    // 이메일과 인증 코드 저장 (서버 메모리에서 관리)
    private final Map<String, VerificationEntry> verificationCodes = new ConcurrentHashMap<>();

    // 인증 코드 저장 클래스 (코드와 만료시간 포함)
    private static class VerificationEntry {
        String code;
        LocalDateTime expiryTime;

        VerificationEntry(String code, LocalDateTime expiryTime) {
            this.code = code;
            this.expiryTime = expiryTime;
        }
    }

    // 6자리 랜덤 인증 코드 생성
    private String generateVerificationCode() {
        return String.format("%06d", RANDOM.nextInt(1000000));
    }

    // 이메일로 인증 코드 전송 및 메모리에 저장
    public void sendVerificationCode(String email) {
        String code = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES);

        // 메모리에 저장
        verificationCodes.put(email, new VerificationEntry(code, expiryTime));

        // 이메일 전송
        sendEmail(email, code);
    }

    // 인증 코드 이메일 발송
    private void sendEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("DLink 이메일 인증 코드");
        message.setText("이메일 인증 코드: " + code + "\n이 코드는 " + CODE_EXPIRY_MINUTES + "분 동안 유효합니다.");
        mailSender.send(message);
        log.info("이메일 인증 코드 전송 완료: {} -> {}", email, code);
    }

    // 인증 코드 검증 (성공 시 true 반환)
    public boolean verifyCode(String email, String code) {
        VerificationEntry entry = verificationCodes.get(email);
        if (entry == null || entry.expiryTime.isBefore(LocalDateTime.now())) {
            return false; 
        }
        return entry.code.equals(code);
    }

    // 주기적으로 만료된 코드 삭제 (1분마다 실행)
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    public void cleanupExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        verificationCodes.entrySet().removeIf(entry -> entry.getValue().expiryTime.isBefore(now));
    }
}
