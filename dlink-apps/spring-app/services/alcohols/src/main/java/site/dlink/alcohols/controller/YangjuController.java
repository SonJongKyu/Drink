package site.dlink.alcohols.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import site.dlink.alcohols.document.es.YangjuEs;
import site.dlink.alcohols.service.YangjuService;

@Tag(name = "Yangju API", description = "양주 정보 관리 API")
@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class YangjuController {

        private final YangjuService yangjuService;

        @Operation(summary = "모든 양주 조회", description = "ElasticSearch에 저장된 모든 양주 정보를 페이징하여 반환합니다.", responses = {
                        @ApiResponse(responseCode = "200", description = "양주 목록 조회 성공", content = @Content(schema = @Schema(implementation = Page.class))),
                        @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터", content = @Content)
        })
        @GetMapping("/yangjus")
        public Page<YangjuEs> getAllAlcohols(
                        @Parameter(description = "페이지 번호 (0부터 시작)", example = "0") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "페이지 크기 (기본 10개)", example = "10") @RequestParam(defaultValue = "10") int size) {
                return yangjuService.findAllYangjus(page, size);
        }

        @Operation(summary = "양주 검색", description = "키워드를 기반으로 양주를 ElasticSearch에서 검색합니다.", responses = {
                        @ApiResponse(responseCode = "200", description = "검색 결과 반환 성공", content = @Content(schema = @Schema(implementation = Page.class))),
                        @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터", content = @Content)
        })
        @GetMapping("/yangjus/search")
        public Page<YangjuEs> searchAlcohols(
                        @Parameter(description = "검색 키워드 (예: Whiskey, Vodka)", required = true, example = "Whiskey") @RequestParam String keyword,
                        @Parameter(description = "페이지 번호 (0부터 시작)", example = "0") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "페이지 크기 (기본 10개)", example = "10") @RequestParam(defaultValue = "10") int size) {
                return yangjuService.searchYangjusByKeyword(keyword, page, size);
        }

        @Operation(summary = "양주 필터링 조회", description = "가격, 도수, 용량 및 카테고리(Elasticsearch 인덱스) 기준으로 양주 목록을 조회합니다.", responses = {
                        @ApiResponse(responseCode = "200", description = "필터링된 양주 목록 조회 성공", content = @Content(schema = @Schema(implementation = Page.class))),
                        @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터", content = @Content)
        })
        @GetMapping("/yangjus/filter")
        public Page<YangjuEs> filterAlcohols(
                        @Parameter(description = "최소 가격", example = "10000") @RequestParam Optional<Integer> minPrice,
                        @Parameter(description = "최대 가격", example = "50000") @RequestParam Optional<Integer> maxPrice,
                        @Parameter(description = "최소 도수", example = "5.0") @RequestParam Optional<Float> minPercent,
                        @Parameter(description = "최대 도수", example = "40.0") @RequestParam Optional<Float> maxPercent,
                        @Parameter(description = "최소 용량 (ml)", example = "500") @RequestParam Optional<Integer> minVolume,
                        @Parameter(description = "최대 용량 (ml)", example = "1000") @RequestParam Optional<Integer> maxVolume,
                        @Parameter(description = "카테고리 (Elasticsearch 인덱스 값, 예: 'whiskey', 'vodka')", example = "whiskey") @RequestParam Optional<String> category,
                        @Parameter(description = "페이지 번호 (0부터 시작)", example = "0") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "페이지 크기 (기본 10개)", example = "10") @RequestParam(defaultValue = "10") int size) {

                return yangjuService.filterYangjuEs(minPrice, maxPrice, minPercent, maxPercent, minVolume, maxVolume,
                                category, page, size);
        }
}
