package site.dlink.auth.jwt.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import site.dlink.auth.exception.OAuthUserWithoutPasswordException;
import site.dlink.auth.jwt.custom.CustomUserDetails;
import site.dlink.auth.jwt.provider.JwtTokenProvider;
import site.dlink.common.constants.JwtConstants;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * client가 /login으로 요청 ➡ 이 클래스 필터 ➡ server가 받음
 * username, password을 사용하여 인증 시도 (attemptAuthentication 메소드)
 * ❌ 인증 실패 : response > status : 401 (UNAUTHORIZED)
 * ⭕ 인증 성공 (successfulAuthentication 메소드) ➡ JWT 생성
 * ➡ response안에 headers안에 authorization에 JWT 담기
 */
@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        // 필터 URL 경로 설정 : /login
        setFilterProcessesUrl(JwtConstants.AUTH_LOGIN_URL);
    }

    /**
     * 🔐 인증 시도 메소드
     * : /login 경로로 요청하면, 필터로 걸러서 인증을 시도
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        log.info("로그인 인증 시도...");

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // ✅ Authentication 객체 생성 후 authenticationManager에게 전달
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);

        try {
            return authenticationManager.authenticate(authRequest); // 인증 객체를 SecurityContextHolder에 저장
        } catch (OAuthUserWithoutPasswordException e) {
            log.warn("인증 실패: {}", e.getMessage());
            sendErrorResponse(response, HttpServletResponse.SC_CONFLICT, "소셜 계정 가입자입니다.");
            return null;
        } catch (AuthenticationException e) {
            log.info("인증 실패: {}", e.getMessage());
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
            return null;
        }
    }

    /**
     * 인증 성공 메소드
     * <p>
     * - JWT 을 생성
     * - JWT 를 응답 헤더에 설정
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authentication) throws IOException, ServletException {

        log.info("인증 성공!");

        CustomUserDetails customMember = (CustomUserDetails) authentication.getPrincipal();
        String id = customMember.getUser().getId();
        String email = customMember.getUser().getEmail();
        String name = customMember.getUser().getName();
        List<String> roles = customMember.getUser().getRoles();

        // 💍 JWT 토큰 생성 요청
        String jwt = jwtTokenProvider.createToken(id, email, name, roles);

        // 💍 { Authorization : Bearer + {jwt} }
        response.addHeader(JwtConstants.TOKEN_HEADER, JwtConstants.TOKEN_PREFIX + jwt);
        response.setStatus(200);
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) {
        try {
            response.setStatus(status);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonResponse = objectMapper.writeValueAsString(
                    Map.of("status", status, "error", message));

            response.getWriter().write(jsonResponse);
        } catch (IOException e) {
            log.error("에러 응답을 생성하는 중 오류 발생", e);
        }
    }
}