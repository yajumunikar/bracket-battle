package com.bracketbattle.modules.tournament.entity;

import com.bracketbattle.modules.game.entity.Game;
import com.bracketbattle.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "tournaments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Format format = Format.SINGLE_ELIMINATION;

    @Column(name = "tournament_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TournamentType tournamentType = TournamentType.ONE_V_ONE;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.DRAFT;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Column(name = "current_participants", nullable = false)
    @Builder.Default
    private Integer currentParticipants = 0;

    @Column(name = "entry_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal entryFee = BigDecimal.ZERO;

    @Column(name = "prize_description", columnDefinition = "TEXT")
    private String prizeDescription;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @Column(name = "registration_closes_at")
    private Instant registrationClosesAt;

    @Column(name = "starts_at")
    private Instant startsAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Version
    private Long version;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Format {
        SINGLE_ELIMINATION, DOUBLE_ELIMINATION, ROUND_ROBIN
    }

    public enum TournamentType {
        ONE_V_ONE, TEAM
    }

    public enum Status {
        DRAFT, OPEN, LOCKED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}