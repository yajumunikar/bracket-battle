package com.bracketbattle.modules.registration.controller;

import com.bracketbattle.common.response.ApiResponse;
import com.bracketbattle.modules.registration.dto.RegistrationDto;
import com.bracketbattle.modules.registration.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationDto>> register(
            @PathVariable Long tournamentId,
            @AuthenticationPrincipal Long userId) {
        RegistrationDto dto = registrationService.register(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(dto, "Successfully registered!"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> unregister(
            @PathVariable Long tournamentId,
            @AuthenticationPrincipal Long userId) {
        registrationService.unregister(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Registration cancelled"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Boolean>> checkRegistration(
            @PathVariable Long tournamentId,
            @AuthenticationPrincipal Long userId) {
        boolean registered = registrationService.isRegistered(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(registered));
    }
}