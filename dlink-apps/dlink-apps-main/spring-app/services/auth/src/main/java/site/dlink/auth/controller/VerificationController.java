package site.dlink.auth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.dlink.auth.service.VerificationService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class VerificationController {
    private final VerificationService verificationService;

    @PostMapping("/email/send")
    public ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
        log.info("이메일 인증 요청: email={}", email);
        try {
            verificationService.sendVerificationCode(email);
            return ResponseEntity.ok(Map.of("message", "인증 코드가 전송되었습니다."));
        } catch (Exception e) {
            log.error("이메일 인증 오류: email={}, error={}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "인증 코드 전송 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/email/verify")
    public ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean isValid = verificationService.verifyCode(email, code);
        Map<String, Boolean> response = new HashMap<>();
        response.put("verified", isValid);

        return ResponseEntity.ok(response);
    }
}
