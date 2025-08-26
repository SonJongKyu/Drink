package site.dlink.apiGateway.validator;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import site.dlink.apiGateway.props.JwtProps;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtValidator {

    private final SecretKey key;

    public JwtValidator(JwtProps jwtProps) {
        if (jwtProps.getSecretKey() == null || jwtProps.getSecretKey().isEmpty()) {
            throw new IllegalStateException("❌ JWT 시크릿 키가 설정되지 않았습니다. application.yml 또는 환경 변수를 확인하세요.");
        }
        this.key = Keys.hmacShaKeyFor(jwtProps.getSecretKey().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * JWT 검증 (서명 확인 + 만료 체크)
     *
     * @param token JWT 토큰
     * @return true(유효) / false(유효하지 않음)
     */
    public boolean validateToken(String token) {
        try {
            // jwt 검증
            var claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // 만료 시간 확인
            Date expiration = claims.getExpiration();
            if (expiration != null && expiration.before(new Date())) {
                log.warn("❌ JWT 토큰이 만료됨: 만료시간 = {}", expiration);
                return false;
            }

            log.info("✅ JWT 검증 성공");
            return true;

        } catch (ExpiredJwtException e) {
            log.warn("❌ JWT 만료됨: {}", e.getMessage());
        } catch (SignatureException e) {
            log.warn("❌ JWT 서명 검증 실패: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("❌ JWT 검증 실패: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("❌ 알 수 없는 오류 발생: {}", e.getMessage());
        }
        return false;
    }
}
