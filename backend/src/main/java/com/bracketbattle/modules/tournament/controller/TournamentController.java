
package com.bracketbattle.modules.tournament.controller;

import com.bracketbattle.common.response.ApiResponse;
import com.bracketbattle.modules.tournament.dto.CreateTournamentRequest;
import com.bracketbattle.modules.tournament.dto.TournamentDto;
import com.bracketbattle.modules.tournament.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TournamentDto>> createTournament(
            @Valid @RequestBody CreateTournamentRequest request,
            @AuthenticationPrincipal Long userId) {

        TournamentDto tournament = tournamentService
            .createTournament(request, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(tournament,
                    "Tournament created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TournamentDto>>> listTournaments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size,
            Sort.by("createdAt").descending());
        Page<TournamentDto> tournaments = tournamentService
            .listTournaments(status, gameId, pageable);
        return ResponseEntity.ok(ApiResponse.success(tournaments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentDto>> getTournament(
            @PathVariable Long id) {

        TournamentDto tournament = tournamentService.getTournament(id);
        return ResponseEntity.ok(ApiResponse.success(tournament));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TournamentDto>> publishTournament(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {

        TournamentDto tournament = tournamentService
            .publishTournament(id, userId);
        return ResponseEntity.ok(ApiResponse.success(tournament,
            "Tournament published successfully"));
    }

    @PostMapping("/{id}/lock")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TournamentDto>> lockRegistrations(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {

        TournamentDto tournament = tournamentService
            .lockRegistrations(id, userId);
        return ResponseEntity.ok(ApiResponse.success(tournament,
            "Registrations locked"));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<TournamentDto>>> getMyTournaments(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size,
            Sort.by("createdAt").descending());
        Page<TournamentDto> tournaments = tournamentService
            .getMyTournaments(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(tournaments));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteTournament(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {

        tournamentService.deleteTournament(id, userId);
        return ResponseEntity.ok(
            ApiResponse.success(null, "Tournament deleted"));
    }
}