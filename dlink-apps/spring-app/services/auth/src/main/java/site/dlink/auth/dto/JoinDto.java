package site.dlink.auth.dto;

import java.util.Collections;
import java.util.List;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class JoinDto {
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", message = "유효한 이메일 형식이 아닙니다.")
    private String email;
    private String password;
    private String name;
    private List<String> roles = Collections.singletonList("ROLE_USER");
}
