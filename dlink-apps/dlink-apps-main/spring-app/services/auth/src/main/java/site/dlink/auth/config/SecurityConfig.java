package site.dlink.auth.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.auth.jwt.custom.CustomUserDetailsService;
import site.dlink.auth.jwt.filter.JwtAuthenticationFilter;
import site.dlink.auth.jwt.provider.JwtTokenProvider;
import site.dlink.auth.props.NextProps;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final NextProps nextProps;
    private final Environment environment;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            AuthenticationManager authenticationManager) throws Exception {

        http.csrf(csrf -> csrf.disable()); // csrf의 경우 Rest 서버에선 필요 없음
        http.httpBasic(basic -> basic.disable()); // httpbasic은 기본 autorization 헤더 사용, jwt를 위해 비활성화
        http.formLogin(login -> login.disable()); // form기반 인증 비활성화
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // jwt 사용을 위해
                                                                                                           // jsessionid
                                                                                                           // 비활성화

        // jwt 필터 설정
        http
                .addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);
                // .addFilterBefore(new JwtRequestFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        // 인증 설정
        http.userDetailsService(customUserDetailsService);

        // dev 환경에서 swagger-ui 허용
        if (environment.matchesProfiles("dev")) {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers("/v3/api-docs/**").permitAll()
                    .requestMatchers("/swagger-ui/**").permitAll()
                    .requestMatchers("/swagger-resources/**").permitAll()
                    .requestMatchers("/api-docs/**").permitAll()
                    .requestMatchers("/webjars/**").permitAll());
        }

        // 인가 설정
        http.authorizeHttpRequests(auth -> auth
                // .requestMatchers("/public/**").permitAll()
                // .requestMatchers("/api/test/**").permitAll()
                // .requestMatchers(HttpMethod.POST, "/api/v1/auth/user", "/api/v1/auth/social-login").permitAll()
                // .requestMatchers("/api/v1/auth/**").hasAnyRole("USER")
                // .anyRequest().authenticated());
                .anyRequest().permitAll());

        // http.logout(logout -> logout.logoutUrl("/logout")
        //         .logoutSuccessHandler((req, res, auth) -> {
        //             log.info("로그아웃...");
        //             res.setStatus(HttpStatus.OK.value());
        //         })
        //         .invalidateHttpSession(true)
        //         .deleteCookies("JSESSIONID")
        //         .permitAll());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(nextProps.getUri()));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}