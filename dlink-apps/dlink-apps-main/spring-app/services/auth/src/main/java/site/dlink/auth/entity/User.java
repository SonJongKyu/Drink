package site.dlink.auth.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "users") 
public class User {

    @Id 
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String name;

    private String profileImageUri;

    private String authProvider;

    private List<String> roles;
}
