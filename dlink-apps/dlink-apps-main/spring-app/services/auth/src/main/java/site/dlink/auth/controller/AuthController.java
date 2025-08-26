package site.dlink.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import site.dlink.auth.dto.GetUserDto;
import site.dlink.auth.dto.JoinDto;
import site.dlink.auth.dto.SocialLoginRequest;
import site.dlink.auth.service.AuthService;
import site.dlink.auth.service.UserService;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Auth API", description = "회원 인증 및 소셜 로그인 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @Operation(
            summary = "사용자 조회",
            description = "시스템에 등록된 사용자의 정보를 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "사용자 목록 조회 성공"),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @GetMapping("/user")
    public GetUserDto getAllUsers(@RequestParam String id) {
        return userService.getUserDtoById(id);
    }

    @Operation(
            summary = "회원 가입",
            description = "이메일, 비밀번호, 이름 등 필수 정보를 입력받아 회원 가입을 처리합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "회원 가입 성공",
                            content = @Content(schema = @Schema(implementation = Map.class))),
                    @ApiResponse(responseCode = "400", description = "유효성 검사 실패", content = @Content),
                    @ApiResponse(responseCode = "409", description = "이미 존재하는 사용자", content = @Content)
            }
    )
    @PostMapping("/user")
    public ResponseEntity<?> join(
            @Parameter(description = "회원 가입 요청 DTO", required = true)
            @RequestBody @Valid JoinDto joinDto) {
        log.info("가입 요청: email={}, name={}", joinDto.getEmail(), joinDto.getName());
        return ResponseEntity.ok(authService.join(joinDto));
    }

    @Operation(
            summary = "회원 정보 수정",
            description = "이메일 기반으로 회원의 이름, 비밀번호 등의 정보를 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "회원 정보 수정 성공",
                            content = @Content(schema = @Schema(implementation = Map.class))),
                    @ApiResponse(responseCode = "404", description = "회원 정보 없음", content = @Content),
                    @ApiResponse(responseCode = "400", description = "요청 값 유효성 실패", content = @Content)
            }
    )
    @PutMapping("/user")
    public ResponseEntity<?> updateUser(
            @Parameter(description = "회원 정보 수정 요청 DTO", required = true)
            @RequestBody @Valid JoinDto joinDto) {
        log.info("회원 정보 수정 요청: email={}, name={}", joinDto.getEmail(), joinDto.getName());
        return ResponseEntity.ok(authService.updateUser(joinDto));
    }

    /**
     * (4) 소셜 로그인
     */
    @Operation(
            summary = "소셜 로그인",
            description = "소셜 플랫폼 인증 후, JWT를 반환합니다. (provider: google, kakao 등)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "소셜 로그인 성공",
                            content = @Content(schema = @Schema(implementation = Map.class))),
                    @ApiResponse(responseCode = "400", description = "소셜 로그인 실패", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(
            @Parameter(description = "소셜 로그인 요청 DTO", required = true)
            @RequestBody SocialLoginRequest request) {
        log.info("소셜 로그인 요청: provider={}, email={}", request.getProvider(), request.getEmail());

        try {
            Map<String, String> result = new HashMap<>();
            result.put("jwt", authService.loginBySocial(request));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("소셜 로그인 처리 오류", e);
            return ResponseEntity.badRequest().body("소셜 로그인 실패");
        }
    }

}
