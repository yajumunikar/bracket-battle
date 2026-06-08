package com.bracketbattle.modules.tournament.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class CreateTournamentRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotNull(message = "Game is required")
    private Long gameId;

    private String description;

    @NotNull(message = "Format is required")
    private String format = "SINGLE_ELIMINATION";

    @NotNull(message = "Max participants is required")
    @Min(value = 4, message = "Minimum 4 participants")
    private Integer maxParticipants;

    private String prizeDescription;
    private String rules;
    private BigDecimal entryFee;
    private BigDecimal prizePool;
    private Instant registrationClosesAt;
    private Instant startsAt;
}