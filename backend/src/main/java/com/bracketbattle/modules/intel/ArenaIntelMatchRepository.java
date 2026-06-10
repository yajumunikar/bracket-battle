package com.bracketbattle.modules.intel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ArenaIntelMatchRepository extends JpaRepository<ArenaIntelMatch, Long> {

    List<ArenaIntelMatch> findAllByOrderByMatchDateAsc();

    @Query("SELECT m FROM ArenaIntelMatch m WHERE m.matchDate >= :start AND m.matchDate < :end ORDER BY m.matchDate ASC")
    List<ArenaIntelMatch> findMatchesByDateRange(LocalDateTime start, LocalDateTime end);

    @Query("SELECT m FROM ArenaIntelMatch m WHERE m.matchDate >= :now ORDER BY m.matchDate ASC")
    List<ArenaIntelMatch> findUpcomingMatches(LocalDateTime now);
}