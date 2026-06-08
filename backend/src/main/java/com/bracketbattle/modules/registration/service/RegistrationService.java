package com.bracketbattle.modules.registration.service;

import com.bracketbattle.common.exception.AppException;
import com.bracketbattle.modules.registration.dto.RegistrationDto;
import com.bracketbattle.modules.registration.entity.Registration;
import com.bracketbattle.modules.registration.repository.RegistrationRepository;
import com.bracketbattle.modules.tournament.entity.Tournament;
import com.bracketbattle.modules.tournament.repository.TournamentRepository;
import com.bracketbattle.modules.user.entity.User;
import com.bracketbattle.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    @Transactional
    public RegistrationDto register(Long tournamentId, Long userId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> AppException.notFound("Tournament not found"));

        if (!tournament.getStatus().name().equals("OPEN")) {
            throw AppException.badRequest("Tournament is not open for registration");
        }

        long current = registrationRepository.countByTournamentId(tournamentId);
        if (current >= tournament.getMaxParticipants()) {
            throw AppException.badRequest("Tournament is full");
        }

        if (registrationRepository.existsByTournamentIdAndUserId(tournamentId, userId)) {
            throw AppException.conflict("You are already registered for this tournament");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Registration registration = Registration.builder()
                .tournament(tournament)
                .user(user)
                .status(Registration.RegistrationStatus.CONFIRMED)
                .build();

        registrationRepository.save(registration);

        // Increment participant count
        tournament.setCurrentParticipants(tournament.getCurrentParticipants() + 1);
        tournamentRepository.save(tournament);

        return RegistrationDto.from(registration);
    }

    @Transactional
    public void unregister(Long tournamentId, Long userId) {
        Registration registration = registrationRepository
                .findByTournamentIdAndUserId(tournamentId, userId)
                .orElseThrow(() -> AppException.notFound("Registration not found"));

        if (!registration.getTournament().getStatus().name().equals("OPEN")) {
            throw AppException.badRequest("Cannot withdraw from a locked or live tournament");
        }

        registrationRepository.delete(registration);

        // Decrement participant count
        Tournament tournament = registration.getTournament();
        tournament.setCurrentParticipants(Math.max(0, tournament.getCurrentParticipants() - 1));
        tournamentRepository.save(tournament);
    }

    public boolean isRegistered(Long tournamentId, Long userId) {
        return registrationRepository.existsByTournamentIdAndUserId(tournamentId, userId);
    }
}