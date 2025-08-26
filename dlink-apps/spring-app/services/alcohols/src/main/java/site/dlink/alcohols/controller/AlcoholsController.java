package site.dlink.alcohols.controller;

import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import site.dlink.alcohols.service.WineService;
import site.dlink.alcohols.service.YangjuService;

@Tag(name = "Alcohols API", description = "와인 및 양주 정보 조회 API")
@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class AlcoholsController {

    private final YangjuService yangjuService;
    private final WineService wineService;

    @Operation(
            summary = "술 정보 조회 (ID 기반)",
            description = "MongoDB에서 와인 또는 양주의 정보를 ID를 통해 검색합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "술 정보 조회 성공",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(responseCode = "404", description = "해당 ID에 해당하는 술 정보를 찾을 수 없음",
                            content = @Content)
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<?> getAlcoholById(
            @Parameter(description = "술 문서의 MongoDB ObjectId", required = true, example = "65f2c1a9b4f1c8e89d9c2e77")
            @PathVariable String id) {
        
        // 양주 정보 조회
        Document yangjuDoc = yangjuService.findDocumentById(id);
        if (yangjuDoc != null) {
            return ResponseEntity.ok(yangjuDoc.toJson());
        }

        // 와인 정보 조회
        Document wineDoc = wineService.findDocumentById(id);
        if (wineDoc != null) {
            wineDoc.append("category", "wine");
            return ResponseEntity.ok(wineDoc.toJson());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Alcohol document not found");
    }
}
