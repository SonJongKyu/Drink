package site.dlink.auth.exception;

import org.springframework.security.core.AuthenticationException;

public class OAuthUserWithoutPasswordException extends AuthenticationException {
    public OAuthUserWithoutPasswordException(String email) {
        super("OAuth 회원이며 비밀번호가 설정되지 않은 사용자: " + email);
    }
}