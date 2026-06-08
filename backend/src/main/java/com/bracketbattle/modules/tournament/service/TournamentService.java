package com.bracketbattle.modules.tournament.service;

import com.bracketbattle.common.exception.AppException;
import com.bracketbattle.modules.game.entity.Game;
import com.bracketbattle.modules.game.repository.GameRepository;
import com.bracketbattle.modules.tournament.dto.CreateTournamentRequest;
import com.bracketbattle.modules.tournament.dto.TournamentDto;
import com.bracketbattle.modules.tournament.entity.Tournament;
import com.bracketbattle.modules.tournament.repository.TournamentRepository;
import com.bracketbattle.modules.user.entity.User;
import com.bracketbattle.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @Transactional
    public TournamentDto createTournament(CreateTournamentRequest request,
                                          Long organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> AppException.notFound("Game not found"));

        String slug = generateSlug(request.getTitle());

        Tournament.Format format;
        try {
            format = Tournament.Format.valueOf(request.getFormat());
        } catch (IllegalArgumentException e) {
            format = Tournament.Format.SINGLE_ELIMINATION;
        }

        Tournament tournament = Tournament.builder()
                .organizer(organizer)
                .game(game)
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .format(format)
                .maxParticipants(request.getMaxParticipants())
                .prizeDescription(request.getPrizeDescription())
                .rules(request.getRules())
                .entryFee(request.getEntryFee() != null ?
                    request.getEntryFee() : java.math.BigDecimal.ZERO)
                .prizePool(request.getPrizePool())
                .registrationClosesAt(request.getRegistrationClosesAt())
                .startsAt(request.getStartsAt())
                .status(Tournament.Status.DRAFT)
                .build();

        Tournament saved = tournamentRepository.save(tournament);
        log.info("Tournament created: {} by {}", saved.getTitle(),
            organizer.getUsername());

        return TournamentDto.from(saved);
    }

    @Transactional
    public TournamentDto publishTournament(Long tournamentId, Long organizerId) {
        Tournament tournament = getTournamentByIdOrThrow(tournamentId);
        validateOrganizer(tournament, organizerId);

        tournament.setStatus(Tournament.Status.OPEN);
        return TournamentDto.from(tournamentRepository.save(tournament));
    }

    @Transactional(readOnly = true)
    public Page<TournamentDto> listTournaments(String status, Long gameId,
                                                Pageable pageable) {
        Tournament.Status statusEnum = null;
        if (status != null) {
            try {
                statusEnum = Tournament.Status.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        return tournamentRepository
                .findByFilters(statusEnum, gameId, pageable)
                .map(TournamentDto::from);
    }

    @Transactional(readOnly = true)
    public TournamentDto getTournament(Long id) {
        Tournament tournament = getTournamentByIdOrThrow(id);
        return TournamentDto.from(tournament);
    }

    @Transactional(readOnly = true)
    public Page<TournamentDto> getMyTournaments(Long organizerId,
                                                 Pageable pageable) {
        return tournamentRepository
                .findByOrganizerIdAndDeletedAtIsNull(organizerId, pageable)
                .map(TournamentDto::from);
    }

    @Transactional
    public TournamentDto lockRegistrations(Long tournamentId, Long organizerId) {
        Tournament tournament = getTournamentByIdOrThrow(tournamentId);
        validateOrganizer(tournament, organizerId);

        tournament.setStatus(Tournament.Status.LOCKED);
        return TournamentDto.from(tournamentRepository.save(tournament));
    }

    @Transactional
    public void deleteTournament(Long tournamentId, Long organizerId) {
        Tournament tournament = getTournamentByIdOrThrow(tournamentId);
        validateOrganizer(tournament, organizerId);

        tournament.setDeletedAt(java.time.Instant.now());
        tournamentRepository.save(tournament);
    }

    private Tournament getTournamentByIdOrThrow(Long id) {
        return tournamentRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> AppException.notFound(
                    "Tournament not found"));
    }

    private void validateOrganizer(Tournament tournament, Long userId) {
        if (!tournament.getOrganizer().getId().equals(userId)) {
            throw AppException.forbidden(
                "You are not the organizer of this tournament");
        }
    }

    private String generateSlug(String title) {
        String slug = Normalizer.normalize(title, Normalizer.Form.NFD);
        slug = Pattern.compile("[^\\p{ASCII}]").matcher(slug).replaceAll("");
        slug = slug.toLowerCase(Locale.ENGLISH)
                   .replaceAll("[^a-z0-9\\s-]", "")
                   .replaceAll("[\\s-]+", "-")
                   .replaceAll("^-|-$", "");

        String baseSlug = slug;
        int counter = 1;
        while (tournamentRepository.findBySlugAndDeletedAtIsNull(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}