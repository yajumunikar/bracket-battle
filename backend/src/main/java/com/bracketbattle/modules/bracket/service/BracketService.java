package com.bracketbattle.modules.bracket.service;

import com.bracketbattle.common.exception.AppException;
import com.bracketbattle.modules.bracket.dto.BracketDto;
import com.bracketbattle.modules.bracket.dto.MatchDto;
import com.bracketbattle.modules.bracket.entity.Bracket;
import com.bracketbattle.modules.bracket.entity.Match;
import com.bracketbattle.modules.bracket.repository.BracketRepository;
import com.bracketbattle.modules.bracket.repository.MatchRepository;
import com.bracketbattle.modules.registration.entity.Registration;
import com.bracketbattle.modules.registration.repository.RegistrationRepository;
import com.bracketbattle.modules.tournament.entity.Tournament;
import com.bracketbattle.modules.tournament.repository.TournamentRepository;
import com.bracketbattle.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BracketService {

    private final BracketRepository bracketRepository;
    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;
    private final RegistrationRepository registrationRepository;

    @Transactional
    public BracketDto generateBracket(Long tournamentId, Long organizerId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> AppException.notFound("Tournament not found"));

        if (!tournament.getOrganizer().getId().equals(organizerId)) {
            throw AppException.forbidden("You are not the organizer of this tournament");
        }

        if (bracketRepository.existsByTournamentId(tournamentId)) {
            throw AppException.conflict("Bracket already exists for this tournament");
        }

        List<Registration> registrations = registrationRepository.findByTournamentId(tournamentId);
        if (registrations.size() < 2) {
            throw AppException.badRequest("Need at least 2 participants to generate a bracket");
        }

        List<User> players = registrations.stream()
                .map(Registration::getUser)
                .collect(Collectors.toList());
        Collections.shuffle(players);

        int totalRounds = (int) Math.ceil(Math.log(players.size()) / Math.log(2));
        int bracketSize = (int) Math.pow(2, totalRounds);

        Bracket bracket = Bracket.builder()
                .tournament(tournament)
                .totalRounds(totalRounds)
                .status(Bracket.BracketStatus.ACTIVE)
                .build();
        bracket = bracketRepository.save(bracket);

        List<Match> allMatches = new ArrayList<>();

        // Generate all rounds bottom-up
        int matchesInRound = bracketSize / 2;
        List<Match> previousRoundMatches = null;

        for (int round = 1; round <= totalRounds; round++) {
            List<Match> roundMatches = new ArrayList<>();
            for (int matchNum = 1; matchNum <= matchesInRound; matchNum++) {
                Match match = Match.builder()
                        .bracket(bracket)
                        .tournament(tournament)
                        .roundNumber(round)
                        .matchNumber(matchNum)
                        .status(Match.MatchStatus.PENDING)
                        .build();
                roundMatches.add(match);
            }
            List<Match> saved = matchRepository.saveAll(roundMatches);
            allMatches.addAll(saved);

            // Link previous round matches to this round
            if (previousRoundMatches != null) {
                for (int i = 0; i < previousRoundMatches.size(); i++) {
                    Match prevMatch = previousRoundMatches.get(i);
                    Match nextMatch = saved.get(i / 2);
                    prevMatch.setNextMatch(nextMatch);
                }
                matchRepository.saveAll(previousRoundMatches);
            }

            previousRoundMatches = saved;
            matchesInRound /= 2;
        }

        // Seed round 1 with players + byes
        List<Match> round1 = allMatches.stream()
                .filter(m -> m.getRoundNumber() == 1)
                .sorted((a, b) -> a.getMatchNumber().compareTo(b.getMatchNumber()))
                .collect(Collectors.toList());

        for (int i = 0; i < round1.size(); i++) {
            Match match = round1.get(i);
            int p1Index = i * 2;
            int p2Index = i * 2 + 1;

            if (p1Index < players.size()) {
                match.setPlayer1(players.get(p1Index));
            }
            if (p2Index < players.size()) {
                match.setPlayer2(players.get(p2Index));
            } else {
                // BYE — player 1 auto-advances
                match.setStatus(Match.MatchStatus.BYE);
                match.setWinner(match.getPlayer1());
            }
        }
        matchRepository.saveAll(round1);

        // Update tournament status
        tournament.setStatus(Tournament.Status.IN_PROGRESS);
        tournamentRepository.save(tournament);

        List<MatchDto> matchDtos = matchRepository
                .findByBracketIdOrderByRoundNumberAscMatchNumberAsc(bracket.getId())
                .stream().map(MatchDto::from).collect(Collectors.toList());

        return BracketDto.from(bracket, matchDtos);
    }

    @Transactional(readOnly = true)
    public BracketDto getBracket(Long tournamentId) {
        Bracket bracket = bracketRepository.findByTournamentId(tournamentId)
                .orElseThrow(() -> AppException.notFound("Bracket not found for this tournament"));

        List<MatchDto> matches = matchRepository
                .findByBracketIdOrderByRoundNumberAscMatchNumberAsc(bracket.getId())
                .stream().map(MatchDto::from).collect(Collectors.toList());

        return BracketDto.from(bracket, matches);
    }

    @Transactional
    public MatchDto reportResult(Long matchId, Long winnerId, Long organizerId,
                                  Integer player1Score, Integer player2Score) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> AppException.notFound("Match not found"));

        if (!match.getTournament().getOrganizer().getId().equals(organizerId)) {
            throw AppException.forbidden("You are not the organizer of this tournament");
        }

        if (match.getStatus() == Match.MatchStatus.COMPLETED) {
            throw AppException.badRequest("Match is already completed");
        }

        User winner = null;
        if (match.getPlayer1() != null && match.getPlayer1().getId().equals(winnerId)) {
            winner = match.getPlayer1();
        } else if (match.getPlayer2() != null && match.getPlayer2().getId().equals(winnerId)) {
            winner = match.getPlayer2();
        } else {
            throw AppException.badRequest("Winner must be one of the match participants");
        }

        match.setWinner(winner);
        match.setPlayer1Score(player1Score);
        match.setPlayer2Score(player2Score);
        match.setStatus(Match.MatchStatus.COMPLETED);
        matchRepository.save(match);

        // Advance winner to next match
        if (match.getNextMatch() != null) {
            Match nextMatch = match.getNextMatch();
            if (nextMatch.getPlayer1() == null) {
                nextMatch.setPlayer1(winner);
            } else {
                nextMatch.setPlayer2(winner);
            }
            nextMatch.setStatus(Match.MatchStatus.IN_PROGRESS);
            matchRepository.save(nextMatch);
        } else {
            // Final match completed
            Bracket bracket = match.getBracket();
            bracket.setStatus(Bracket.BracketStatus.COMPLETED);
            bracketRepository.save(bracket);

            Tournament tournament = match.getTournament();
            tournament.setStatus(Tournament.Status.COMPLETED);
            tournamentRepository.save(tournament);
        }

        return MatchDto.from(match);
    }
}