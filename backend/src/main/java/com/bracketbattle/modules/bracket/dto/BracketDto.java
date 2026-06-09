package com.bracketbattle.modules.bracket.dto;

import com.bracketbattle.modules.bracket.entity.Bracket;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class BracketDto {
    private Long id;
    private Long tournamentId;
    private String tournamentTitle;
    private Integer totalRounds;
    private String status;
    private List<MatchDto> matches;

    public static BracketDto from(Bracket b, List<MatchDto> matches) {
        return BracketDto.builder()
                .id(b.getId())
                .tournamentId(b.getTournament().getId())
                .tournamentTitle(b.getTournament().getTitle())
                .totalRounds(b.getTotalRounds())
                .status(b.getStatus().name())
                .matches(matches)
                .build();
    }
}