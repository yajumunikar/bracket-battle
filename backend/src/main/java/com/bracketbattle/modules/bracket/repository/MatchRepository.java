package com.bracketbattle.modules.bracket.repository;

import com.bracketbattle.modules.bracket.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByBracketIdOrderByRoundNumberAscMatchNumberAsc(Long bracketId);
    List<Match> findByBracketIdAndRoundNumber(Long bracketId, Integer roundNumber);
}