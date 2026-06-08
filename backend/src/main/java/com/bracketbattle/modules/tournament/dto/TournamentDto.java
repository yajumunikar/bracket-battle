package com.bracketbattle.modules.tournament.dto;

import com.bracketbattle.modules.tournament.entity.Tournament;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class TournamentDto {

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String format;
    private String tournamentType;
    private String status;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private BigDecimal entryFee;
    private BigDecimal prizePool;
    private String prizeDescription;
    private String bannerUrl;
    private String rules;
    private Instant registrationClosesAt;
    private Instant startsAt;
    private Instant completedAt;
    private Instant createdAt;

    // Organizer info
    private Long organizerId;
    private String organizerUsername;
    private String organizerDisplayName;

    // Game info
    private Long gameId;
    private String gameName;
    private String gameSlug;

    public static TournamentDto from(Tournament t) {
        return TournamentDto.builder()
                .id(t.getId())
                .title(t.getTitle())
                .slug(t.getSlug())
                .description(t.getDescription())
                .format(t.getFormat().name())
                .tournamentType(t.getTournamentType().name())
                .status(t.getStatus().name())
                .maxParticipants(t.getMaxParticipants())
                .currentParticipants(t.getCurrentParticipants())
                .entryFee(t.getEntryFee())
                .prizePool(t.getPrizePool())
                .prizeDescription(t.getPrizeDescription())
                .bannerUrl(t.getBannerUrl())
                .rules(t.getRules())
                .registrationClosesAt(t.getRegistrationClosesAt())
                .startsAt(t.getStartsAt())
                .completedAt(t.getCompletedAt())
                .createdAt(t.getCreatedAt())
                .organizerId(t.getOrganizer().getId())
                .organizerUsername(t.getOrganizer().getUsername())
                .organizerDisplayName(t.getOrganizer().getDisplayName())
                .gameId(t.getGame().getId())
                .gameName(t.getGame().getName())
                .gameSlug(t.getGame().getSlug())
                .build();
    }
}