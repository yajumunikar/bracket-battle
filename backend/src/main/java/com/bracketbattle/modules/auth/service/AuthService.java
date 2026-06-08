package com.bracketbattle.modules.auth.service;

import com.bracketbattle.common.exception.AppException;
import com.bracketbattle.modules.auth.dto.AuthResponse;
import com.bracketbattle.modules.auth.dto.LoginRequest;
import com.bracketbattle.modules.auth.dto.RegisterRequest;
import com.bracketbattle.modules.auth.security.JwtProvider;
import com.bracketbattle.modules.user.entity.User;
import com.bracketbattle.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw AppException.conflict("Email already in use");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw AppException.conflict("Username already taken");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            role = User.Role.PLAYER;
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .role(role)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        String accessToken = jwtProvider.generateAccessToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .displayName(savedUser.getDisplayName())
                .role(savedUser.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> AppException.unauthorized(
                    "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw AppException.unauthorized("Invalid email or password");
        }

        if (user.getBannedAt() != null) {
            throw AppException.forbidden("Your account has been banned");
        }

        String accessToken = jwtProvider.generateAccessToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole().name())
                .build();
    }
}