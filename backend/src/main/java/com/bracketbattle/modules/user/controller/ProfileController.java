package com.bracketbattle.modules.user.controller;

import com.bracketbattle.common.exception.AppException;
import com.bracketbattle.common.response.ApiResponse;
import com.bracketbattle.modules.registration.repository.RegistrationRepository;
import com.bracketbattle.modules.tournament.repository.TournamentRepository;
import com.bracketbattle.modules.user.dto.ProfileDto;
import com.bracketbattle.modules.user.entity.User;
import com.bracketbattle.modules.user.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final RegistrationRepository registrationRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> getMyProfile(
            @AuthenticationPrincipal Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));
        return ResponseEntity.ok(ApiResponse.success(buildProfile(user)));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<ProfileDto>> getProfile(
            @PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("User not found"));
        return ResponseEntity.ok(ApiResponse.success(buildProfile(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(
            @AuthenticationPrincipal Long userId,
            @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));
        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(buildProfile(user), "Profile updated"));
    }

    @Data
    static class UpdateProfileRequest {
        private String displayName;
        private String bio;
        private String avatarUrl;
    }

    private ProfileDto buildProfile(User user) {
        int organized = tournamentRepository
                .countByOrganizerIdAndDeletedAtIsNull(user.getId());
        int played = registrationRepository
                .countByUserId(user.getId());
        return ProfileDto.from(user, organized, played);
    }
}