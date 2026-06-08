package com.bracketbattle.modules.game.repository;

import com.bracketbattle.modules.game.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByActiveTrue();
    Optional<Game> findBySlug(String slug);
}