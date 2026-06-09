package com.bracketbattle.modules.bracket.controller;

import com.bracketbattle.common.response.ApiResponse;
import com.bracketbattle.modules.bracket.dto.BracketDto;
import com.bracketbattle.modules.bracket.dto.MatchDto;
import com.bracketbattle.modules.bracket.service.BracketService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/bracket")
@RequiredArgsConstructor
public class BracketController {

    private final BracketService bracketService;

    @PostMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BracketDto>> generateBracket(
            @PathVariable Long tournamentId,
            @AuthenticationPrincipal Long userId) {
        BracketDto bracket = bracketService.generateBracket(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(bracket, "Bracket generated successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<BracketDto>> getBracket(
            @PathVariable Long tournamentId) {
        BracketDto bracket = bracketService.getBracket(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(bracket));
    }

    @PostMapping("/matches/{matchId}/result")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MatchDto>> reportResult(
            @PathVariable Long tournamentId,
            @PathVariable Long matchId,
            @RequestBody ReportResultRequest request,
            @AuthenticationPrincipal Long userId) {
        MatchDto match = bracketService.reportResult(
                matchId, request.getWinnerId(), userId,
                request.getPlayer1Score(), request.getPlayer2Score());
        return ResponseEntity.ok(ApiResponse.success(match, "Result reported"));
    }

    @Data
    static class ReportResultRequest {
        private Long winnerId;
        private Integer player1Score;
        private Integer player2Score;
    }
}