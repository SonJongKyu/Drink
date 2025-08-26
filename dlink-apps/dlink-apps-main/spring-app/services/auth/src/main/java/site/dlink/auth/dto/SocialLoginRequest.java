package site.dlink.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLoginRequest {
    private String provider;
    private String accessToken;
    @NotBlank(message = "이메일이 없습니다.")
    private String email;
    private String name;
    private String image;
}

