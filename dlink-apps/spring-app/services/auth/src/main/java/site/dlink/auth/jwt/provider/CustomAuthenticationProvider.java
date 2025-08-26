package site.dlink.auth.jwt.provider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.auth.entity.User;
import site.dlink.auth.exception.OAuthUserWithoutPasswordException;
import site.dlink.auth.repository.UserRepository;
import site.dlink.auth.jwt.custom.CustomUserDetails;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        Optional<User> optionalUser = userRepository.findByEmail(username);
        if (optionalUser.isEmpty()) {
            log.error("존재하지 않는 사용자: {}", username);
            throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        User user = optionalUser.get();

        // ✅ OAuth 가입자인데 비밀번호가 없는 경우 → 409 Conflict 처리
        if (user.getAuthProvider() != null && (user.getPassword() == null || user.getPassword().isEmpty())) {
            throw new OAuthUserWithoutPasswordException(username);
        }

        // ✅ 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.error("비밀번호 불일치: {}", username);
            throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // ✅ 인증 객체 반환 (Spring Security에서 사용자 인증 성공)
        return new UsernamePasswordAuthenticationToken(
                new CustomUserDetails(user), null, new CustomUserDetails(user).getAuthorities()
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
