package com.bracketbattle.modules.tournament.repository;

import com.bracketbattle.modules.tournament.entity.Tournament;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    Optional<Tournament> findBySlugAndDeletedAtIsNull(String slug);

    Optional<Tournament> findByIdAndDeletedAtIsNull(Long id);

    Page<Tournament> findByDeletedAtIsNull(Pageable pageable);

    @Query("SELECT t FROM Tournament t WHERE t.deletedAt IS NULL " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:gameId IS NULL OR t.game.id = :gameId)")
    Page<Tournament> findByFilters(
        @Param("status") Tournament.Status status,
        @Param("gameId") Long gameId,
        Pageable pageable
    );

    Page<Tournament> findByOrganizerIdAndDeletedAtIsNull(
        Long organizerId, Pageable pageable);
}