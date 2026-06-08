package com.bracketbattle.modules.registration.dto;

import com.bracketbattle.modules.registration.entity.Registration;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class RegistrationDto {
    private Long id;
    private Long tournamentId;
    private String tournamentTitle;
    private Long userId;
    private String username;
    private String status;
    private Instant registeredAt;
    private Integer seed;

    public static RegistrationDto from(Registration r) {
        return RegistrationDto.builder()
                .id(r.getId())
                .tournamentId(r.getTournament().getId())
                .tournamentTitle(r.getTournament().getTitle())
                .userId(r.getUser().getId())
                .username(r.getUser().getUsername())
                .status(r.getStatus().name())
                .registeredAt(r.getRegisteredAt())
                .seed(r.getSeed())
                .build();
    }
}