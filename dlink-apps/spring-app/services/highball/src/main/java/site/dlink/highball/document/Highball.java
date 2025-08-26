package site.dlink.highball.document;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import site.dlink.highball.enums.HighballCateEnum;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@Document(collection = "highball")
@Builder
public class Highball {

    @Id
    private String id;

    private HighballCateEnum category;
    private String name;
    private String glass;
    private String imageFilename;
    private String imageUrl;
    private String making;
    private String writeUser;

    @Builder.Default
    private Integer likeCount = 0;
    @Builder.Default
    private Map<String, String> ingredients = new HashMap<>();
    @Builder.Default
    private Set<String> likedUsers = new HashSet<>();
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
