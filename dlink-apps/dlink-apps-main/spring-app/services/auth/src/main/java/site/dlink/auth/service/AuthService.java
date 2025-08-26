package site.dlink.auth.service;

import java.util.Collections;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.auth.dto.JoinDto;
import site.dlink.auth.dto.SocialLoginRequest;
import site.dlink.auth.entity.User;
import site.dlink.auth.jwt.provider.JwtTokenProvider;
import site.dlink.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public User join(JoinDto joinDto) {

        joinDto.setPassword(passwordEncoder.encode(joinDto.getPassword()));
        User newUser = modelMapper.map(joinDto, User.class);
        log.info("가입 완료");
        return userRepository.save(newUser);
    }

    @Transactional
    public User updateUser(JoinDto joinDto) {
        return userRepository.findByEmail(joinDto.getEmail())
                .map(existingUser -> {
                    existingUser.setName(joinDto.getName());
                    existingUser.setPassword(passwordEncoder.encode(joinDto.getPassword()));
                    return userRepository.save(existingUser); // 기존 userId 유지됨
                })
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + joinDto.getEmail()));
    }
    

    public User joinBySocial(SocialLoginRequest request) {

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .profileImageUri(request.getImage())
                .authProvider(request.getProvider())
                .password("")
                .roles(Collections.singletonList("ROLE_USER"))
                .build();

        log.info("소셜 가입 완료");
        return userRepository.save(user);
    }

    public String loginBySocial(SocialLoginRequest request) {
        // 유저 조회 후, 없으면 바로 회원가입
        User user = userService.findByEmail(request.getEmail())
                                .orElseGet(() -> joinBySocial(request));
        // JWT 발급
        return jwtTokenProvider.createToken(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles());
    }

}