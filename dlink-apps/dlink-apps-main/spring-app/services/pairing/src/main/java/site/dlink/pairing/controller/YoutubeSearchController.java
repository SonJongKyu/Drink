package site.dlink.pairing.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.dlink.pairing.service.YoutubeSearchService;

@Tag(name = "YouTube Shorts Search API", description = "유튜브 숏츠 검색 API (요리에 대한 숏츠 링크 제공)")
@RestController
@RequestMapping("/api/v1/pairing")
@RequiredArgsConstructor
public class YoutubeSearchController {

    private final YoutubeSearchService youtubeSearchService;

    /**
     * (1) YouTube Shorts 검색
     */
    @Operation(
            summary = "YouTube Shorts 검색",
            description = "입력된 요리에 대해 YouTube Shorts 영상을 검색하여 링크를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "숏츠 링크 반환 성공",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @GetMapping("/shorts/search")
    public ResponseEntity<String> getShortsLink(
            @Parameter(description = "검색할 요리명", required = true, example = "스테이크 레시피")
            @RequestParam String dish) {
        try {
            String shortsLink = youtubeSearchService.getShortsLink(dish);
            return ResponseEntity.ok(shortsLink);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
