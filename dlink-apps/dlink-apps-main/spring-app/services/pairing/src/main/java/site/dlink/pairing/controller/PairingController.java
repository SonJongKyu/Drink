package site.dlink.pairing.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import site.dlink.pairing.dto.WinePairingRequest;
import site.dlink.pairing.dto.YangjuPairingRequest;
import site.dlink.pairing.service.PairingService;

@Tag(name = "Pairing API", description = "와인 및 양주에 대한 안주 추천 API")
@RestController
@RequestMapping("/api/v1/pairing")
@RequiredArgsConstructor
public class PairingController {

    private final PairingService pairingService;

    /**
     * (1) 와인 안주 추천
     */
    @Operation(
            summary = "와인 안주 추천",
            description = "와인 정보와 카테고리를 입력받아 추천 안주를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "추천 안주 반환 성공",
                            content = @Content(schema = @Schema(implementation = JsonNode.class))),
                    @ApiResponse(responseCode = "400", description = "요청 파라미터 오류", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @PostMapping("/wine")
    public JsonNode getWinePairing(@RequestBody WinePairingRequest request) {
        return pairingService.getWinePairingRecommendation(request);
    }

    /**
     * (2) 양주 안주 추천
     */
    @Operation(
            summary = "양주 안주 추천",
            description = "양주 정보와 카테고리를 입력받아 추천 안주를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "추천 안주 반환 성공",
                            content = @Content(schema = @Schema(implementation = JsonNode.class))),
                    @ApiResponse(responseCode = "400", description = "요청 파라미터 오류", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @PostMapping("/yangju")
    public JsonNode getYangjuPairing(@RequestBody YangjuPairingRequest request) {
        return pairingService.getYangjuPairingRecommendation(request);
    }
}
