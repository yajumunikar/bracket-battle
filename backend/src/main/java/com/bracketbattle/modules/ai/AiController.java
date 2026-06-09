package com.bracketbattle.modules.ai;

import com.bracketbattle.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@RequestBody ChatRequest request) {
        String reply = aiService.chat(request.getMessages());
        return ResponseEntity.ok(ApiResponse.success(new ChatResponse(reply), "OK"));
    }
}