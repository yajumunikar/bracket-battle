package com.bracketbattle.modules.game.controller;

import com.bracketbattle.common.response.ApiResponse;
import com.bracketbattle.modules.game.entity.Game;
import com.bracketbattle.modules.game.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/games")
@RequiredArgsConstructor
public class GameController {

    private final GameRepository gameRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Game>>> getAllGames() {
        List<Game> games = gameRepository.findByActiveTrue();
        return ResponseEntity.ok(ApiResponse.success(games));
    }
}