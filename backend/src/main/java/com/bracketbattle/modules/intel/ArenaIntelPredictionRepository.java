package com.bracketbattle.modules.intel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ArenaIntelPredictionRepository extends JpaRepository<ArenaIntelPrediction, Long> {

    Optional<ArenaIntelPrediction> findByMatchId(Long matchId);

    Optional<ArenaIntelPrediction> findByMatchIdAndExpiresAtAfter(Long matchId, LocalDateTime now);
}