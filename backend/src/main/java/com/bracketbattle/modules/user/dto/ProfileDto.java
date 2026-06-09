package com.bracketbattle.modules.user.dto;

import com.bracketbattle.modules.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class ProfileDto {
    private Long id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private String role;
    private Instant createdAt;
    private int tournamentsOrganized;
    private int tournamentsPlayed;

    public static ProfileDto from(User u, int organized, int played) {
        return ProfileDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .displayName(u.getDisplayName())
                .avatarUrl(u.getAvatarUrl())
                .bio(u.getBio())
                .role(u.getRole().name())
                .createdAt(u.getCreatedAt())
                .tournamentsOrganized(organized)
                .tournamentsPlayed(played)
                .build();
    }
}