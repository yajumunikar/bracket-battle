package com.bracketbattle.modules.bracket.repository;

import com.bracketbattle.modules.bracket.entity.Bracket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BracketRepository extends JpaRepository<Bracket, Long> {
    Optional<Bracket> findByTournamentId(Long tournamentId);
    boolean existsByTournamentId(Long tournamentId);
}