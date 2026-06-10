package com.bracketbattle.modules.intel;

import com.bracketbattle.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/intel")
@RequiredArgsConstructor
public class ArenaIntelController {

    private final ArenaIntelService arenaIntelService;

    @GetMapping("/matches")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllMatches() {
        return ResponseEntity.ok(ApiResponse.success(
            arenaIntelService.getMatchesGroupedByDate()));
    }

    @GetMapping("/matches/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTodayMatches() {
        return ResponseEntity.ok(ApiResponse.success(
            arenaIntelService.getTodayMatches()));
    }

    @GetMapping("/matches/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMatch(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            arenaIntelService.getMatch(id)));
    }

    @GetMapping("/matches/{id}/prediction")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPrediction(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            arenaIntelService.getPrediction(id)));
    }
}