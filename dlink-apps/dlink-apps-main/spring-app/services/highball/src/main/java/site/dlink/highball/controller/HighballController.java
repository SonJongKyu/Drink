package site.dlink.highball.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.Instant;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.highball.document.Highball;
import site.dlink.highball.enums.HighballCateEnum;
import site.dlink.highball.service.AwsS3Service;
import site.dlink.highball.service.HighballService;

@RequestMapping("/api/v1/highball")
@RestController
@RequiredArgsConstructor
@Slf4j
public class HighballController {

    private final HighballService highballService;
    private final AwsS3Service awsS3Service;

    @Operation(summary = "하이볼 레시피 등록", description = "하이볼 레시피와 이미지를 등록합니다.")
    @PostMapping(value = "/recipe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadHighballRecipe(
            @RequestParam String userId, // 작성자
            @RequestParam String name, // 하이볼 이름
            @RequestParam HighballCateEnum category, // 카테고리
            @RequestParam String making, // 만드는 방법
            @RequestPart(required = false) MultipartFile imageFile, // 이미지 파일
            @RequestPart(required = false) String ingredients // JSON 형식 재료
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> ingredientsMap = new HashMap<>();

            // 🟡 재료 파싱
            if (ingredients != null && !ingredients.isBlank()) {
                try {
                    ingredientsMap = objectMapper.readValue(ingredients, new TypeReference<Map<String, String>>() {
                    });
                } catch (Exception e) {
                    log.error("재료 JSON 파싱 실패", e);
                    return ResponseEntity.status(400).body("재료 형식이 잘못되었습니다.");
                }
            }

            // 🟡 이미지 업로드 처리
            Map<String, String> uploadResultMap = Optional.ofNullable(
                    awsS3Service.uploadFile(imageFile)).orElseGet(HashMap::new);

            String imageFilename = uploadResultMap.getOrDefault("fileName", "");
            String imageUrl = uploadResultMap.getOrDefault("fileUrl", "");

            // 🟡 Highball 객체 생성
            Highball highball = Highball.builder()
                    .name(name)
                    .category(category)
                    .glass("Highball Glass")
                    .making(making)
                    .ingredients(ingredientsMap)
                    .imageFilename(imageFilename)
                    .imageUrl(imageUrl)
                    .writeUser(userId)
                    .likeCount(0)
                    .likedUsers(new HashSet<>())
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            // 🟡 Highball 저장
            highballService.saveHighball(highball, userId);

            return ResponseEntity.ok(highball.getId());

        } catch (Exception e) {
            log.error("하이볼 레시피 업로드 실패", e);
            return ResponseEntity.status(500).body("업로드 실패: " + e.getMessage());
        }
    }

    @Operation(summary = "하이볼 레시피 삭제", description = "하이볼 레시피와 이미지를 삭제합니다.")
    @DeleteMapping("/recipe/{id}")
    public ResponseEntity<String> deleteHighballRecipe(
            @Parameter(description = "삭제할 하이볼 레시피의 ID", required = true) @PathVariable String id) {
        Highball highball = highballService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다: " + id));

        String imageFilename = highball.getImageFilename();
        if (imageFilename != null && !imageFilename.isEmpty()) {
            awsS3Service.deleteFile(imageFilename);
        }

        highballService.deleteHighball(id);
        return ResponseEntity.ok("레시피 삭제 성공: " + id);
    }

    @Operation(summary = "id로 레시피 조회")
    @GetMapping("/{id}")
    public Highball findById(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String id) {
        return highballService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다: " + id));
    }

    @Operation(summary = "카테고리별 레시피 조회")
    @GetMapping("/category")
    public List<Highball> findByCategory(@RequestParam HighballCateEnum category) {
        return highballService.findByCategory(category);
    }

    @Operation(summary = "좋아요 토글", description = "사용자가 좋아요를 누르면 추가, 다시 누르면 취소합니다.")
    @PostMapping("/{highballId}/like")
    public ResponseEntity<String> toggleLike(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String highballId,
            @Parameter(description = "사용자의 고유 ID", example = "67asdkjdjaslkdjdskda") @RequestParam String userId) {
        long likeCount = highballService.toggleLike(highballId, userId);
        return ResponseEntity.ok("" + likeCount);
    }

    @Operation(summary = "좋아요 수 조회", description = "특정 하이볼의 현재 좋아요 수를 반환합니다.")
    @GetMapping("/{id}/like-count")
    public ResponseEntity<?> getLikeCount(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String id) {
        int likeCount = highballService.countLikedUsers(id);
        return ResponseEntity.ok(likeCount);
    }

    @Operation(summary = "하이볼 레시피 수정", description = "하이볼 레시피와 이미지를 수정합니다.")
    @PutMapping(value = "/recipe/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateHighballRecipe(
            @PathVariable String id,
            @RequestParam String userId, // 수정 요청한 사용자 ID (소유자 확인 로직 추가 가능)
            @RequestParam String name, // 수정할 하이볼 이름
            @RequestParam HighballCateEnum category, // 수정할 카테고리
            @RequestParam String making, // 수정할 만드는 방법
            @RequestPart(required = false) MultipartFile imageFile, // 새 이미지 파일 (선택)
            @RequestPart(required = false) String ingredients // 수정할 재료(JSON 문자열)
    ) {
        try {
            // 기존 레시피 조회
            Highball existingHighball = highballService.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다: " + id));

            // 재료 파싱 (제공된 경우)
            Map<String, String> ingredientsMap = existingHighball.getIngredients();
            if (ingredients != null && !ingredients.isBlank()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    ingredientsMap = objectMapper.readValue(ingredients, new TypeReference<Map<String, String>>() {
                    });
                } catch (Exception e) {
                    log.error("재료 JSON 파싱 실패", e);
                    return ResponseEntity.status(400).body("재료 형식이 잘못되었습니다.");
                }
            }

            // 새 이미지 파일이 제공되면 기존 이미지를 삭제하고 새 파일 업로드
            if (imageFile != null && !imageFile.isEmpty()) {
                String oldImageFilename = existingHighball.getImageFilename();
                if (oldImageFilename != null && !oldImageFilename.equals("default.jpg")) {
                    awsS3Service.deleteFile(oldImageFilename);
                }
                Map<String, String> uploadResultMap = Optional.ofNullable(awsS3Service.uploadFile(imageFile))
                        .orElseGet(HashMap::new);
                String newImageFilename = uploadResultMap.getOrDefault("fileName", "");
                String newImageUrl = uploadResultMap.getOrDefault("fileUrl", "");
                existingHighball.setImageFilename(newImageFilename);
                existingHighball.setImageUrl(newImageUrl);
            }

            // 필드 업데이트
            existingHighball.setName(name);
            existingHighball.setCategory(category);
            existingHighball.setMaking(making);
            existingHighball.setIngredients(ingredientsMap);
            existingHighball.setUpdatedAt(Instant.now());

            // 업데이트 저장 (서비스의 updateHighball 메서드 호출)
            highballService.updateHighball(existingHighball, userId);

            return ResponseEntity.ok(existingHighball.getId());
        } catch (Exception e) {
            log.error("하이볼 레시피 수정 실패", e);
            return ResponseEntity.status(500).body("수정 실패: " + e.getMessage());
        }
    }

}
