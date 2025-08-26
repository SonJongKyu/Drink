package site.dlink.review.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.dlink.review.dto.ReviewRequest;
import site.dlink.review.service.ReviewService;

import java.util.Map;

@Tag(name = "Review API", description = "술(와인/양주) 리뷰 관리 API (userId 기반)")
@RestController
@RequestMapping("/api/v1/review/{category}/{drinkId}")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * (1) 전체 리뷰 조회
     */
    @Operation(
            summary = "전체 리뷰 조회",
            description = "특정 카테고리와 음료(drinkId)에 대해 모든 사용자 리뷰(Map<userId, {rating, content}>)를 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "전체 리뷰 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllReviews(
            @Parameter(description = "술 카테고리 (예: wine, whiskey 등)", required = true, example = "wine")
            @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true, example = "65f2c1a9b4f1c8e89d9c2e77")
            @PathVariable String drinkId
    ) {
        Map<String, Object> allReviews = reviewService.getAllReviews(category, drinkId);
        if (allReviews == null || allReviews.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(allReviews);
    }

    /**
     * (2) 새 리뷰 추가
     */
    @Operation(
            summary = "새 리뷰 추가",
            description = "특정 카테고리와 음료에 대해 특정 사용자(userId)의 리뷰를 추가하거나 업데이트합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 추가 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "음료를 찾을 수 없음", content = @Content)
            }
    )
    @PostMapping("/{userId}")
    public ResponseEntity<Document> createReview(
            @Parameter(description = "술 카테고리 (예: wine, whiskey 등)", required = true, example = "wine")
            @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true, example = "65f2c1a9b4f1c8e89d9c2e77")
            @PathVariable String drinkId,
            @Parameter(description = "사용자 ID", required = true, example = "user123")
            @PathVariable String userId,
            @RequestBody ReviewRequest reviewBody
    ) {
        Document updatedDoc = reviewService.createReview(category, drinkId, userId, reviewBody);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }

    /**
     * (3) 리뷰 수정
     */
    @Operation(
            summary = "리뷰 수정",
            description = "특정 카테고리 및 음료(drinkId)의 특정 사용자(userId) 리뷰를 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 수정 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @PutMapping("/{userId}")
    public ResponseEntity<Document> updateReviewByUserId(
            @Parameter(description = "술 카테고리 (예: wine, whiskey 등)", required = true, example = "wine")
            @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true, example = "65f2c1a9b4f1c8e89d9c2e77")
            @PathVariable String drinkId,
            @Parameter(description = "사용자 ID", required = true, example = "user123")
            @PathVariable String userId,
            @RequestBody ReviewRequest request
    ) {
        Document updatedDoc = reviewService.updateReviewByUserId(category, drinkId, userId, request);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }

    /**
     * (4) 리뷰 삭제
     */
    @Operation(
            summary = "리뷰 삭제",
            description = "특정 카테고리 및 음료(drinkId)의 특정 사용자(userId) 리뷰를 삭제합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @DeleteMapping("/{userId}")
    public ResponseEntity<Document> deleteReviewByUserId(
            @Parameter(description = "술 카테고리 (예: wine, whiskey 등)", required = true, example = "wine")
            @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true, example = "65f2c1a9b4f1c8e89d9c2e77")
            @PathVariable String drinkId,
            @Parameter(description = "사용자 ID", required = true, example = "user123")
            @PathVariable String userId
    ) {
        Document updatedDoc = reviewService.deleteReviewByUserId(category, drinkId, userId);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }
}
