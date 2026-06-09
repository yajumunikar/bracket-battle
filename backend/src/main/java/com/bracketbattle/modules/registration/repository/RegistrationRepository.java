package com.bracketbattle.modules.registration.repository;

import com.bracketbattle.modules.registration.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByTournamentIdAndUserId(Long tournamentId, Long userId);

    long countByTournamentId(Long tournamentId);

    Optional<Registration> findByTournamentIdAndUserId(Long tournamentId, Long userId);

    List<Registration> findByTournamentId(Long tournamentId);

    int countByUserId(Long userId);
}