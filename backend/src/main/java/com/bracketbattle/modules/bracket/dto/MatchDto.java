package com.bracketbattle.modules.bracket.dto;

import com.bracketbattle.modules.bracket.entity.Match;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MatchDto {
    private Long id;
    private Integer roundNumber;
    private Integer matchNumber;
    private Long player1Id;
    private String player1Username;
    private Long player2Id;
    private String player2Username;
    private Long winnerId;
    private String winnerUsername;
    private Integer player1Score;
    private Integer player2Score;
    private String status;
    private Long nextMatchId;

    public static MatchDto from(Match m) {
        return MatchDto.builder()
                .id(m.getId())
                .roundNumber(m.getRoundNumber())
                .matchNumber(m.getMatchNumber())
                .player1Id(m.getPlayer1() != null ? m.getPlayer1().getId() : null)
                .player1Username(m.getPlayer1() != null ? m.getPlayer1().getUsername() : null)
                .player2Id(m.getPlayer2() != null ? m.getPlayer2().getId() : null)
                .player2Username(m.getPlayer2() != null ? m.getPlayer2().getUsername() : null)
                .winnerId(m.getWinner() != null ? m.getWinner().getId() : null)
                .winnerUsername(m.getWinner() != null ? m.getWinner().getUsername() : null)
                .player1Score(m.getPlayer1Score())
                .player2Score(m.getPlayer2Score())
                .status(m.getStatus().name())
                .nextMatchId(m.getNextMatch() != null ? m.getNextMatch().getId() : null)
                .build();
    }
}