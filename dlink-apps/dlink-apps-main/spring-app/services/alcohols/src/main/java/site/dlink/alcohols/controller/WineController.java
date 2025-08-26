package site.dlink.alcohols.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import site.dlink.alcohols.document.es.WineEs;
import site.dlink.alcohols.service.WineService;

@Tag(name = "Wine API", description = "와인 정보 조회 및 검색 API")
@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    @Operation(
            summary = "전체 와인 조회",
            description = "저장된 모든 와인 정보를 페이지네이션 형식으로 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "전체 와인 목록 조회 성공",
                            content = @Content(schema = @Schema(implementation = Page.class))),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @GetMapping("/wines")
    public Page<WineEs> getAllWines(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        return wineService.findAllWines(page, size);
    }

    @Operation(
            summary = "와인 검색",
            description = "키워드를 포함한 와인 정보를 페이지네이션 형식으로 검색 및 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "검색된 와인 목록 조회 성공",
                            content = @Content(schema = @Schema(implementation = Page.class))),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @GetMapping("/wines/search")
    public Page<WineEs> searchWines(
            @Parameter(description = "검색 키워드 (와인명, 품종 등)", required = true, example = "Chardonnay")
            @RequestParam String keyword,
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        return wineService.searchWinesByKeyword(keyword, page, size);
    }
}
