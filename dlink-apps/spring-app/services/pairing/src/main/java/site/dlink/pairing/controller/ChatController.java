package site.dlink.pairing.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Chat API", description = "AI 챗봇과의 대화를 생성하는 API")
@RestController
@RequestMapping("/api/v1/pairing")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    /**
     * (1) AI 챗봇 응답 생성
     */
    @Operation(
            summary = "AI 챗봇 응답 생성",
            description = "입력 메시지를 기반으로 AI 챗봇이 생성한 응답을 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "AI 응답 생성 성공",
                            content = @Content(schema = @Schema(implementation = Map.class))),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @GetMapping("/chat")
    public Map<String, String> generate(
            @Parameter(description = "AI 챗봇에 전달할 메시지", required = true, example = "What is a good wine to pair with steak?")
            @RequestParam String message) {
        String response = chatClient.prompt(message).call().content();
        return Map.of("prompt", message, "response", response);
    }
}
