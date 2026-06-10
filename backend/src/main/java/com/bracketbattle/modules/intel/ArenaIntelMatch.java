package com.bracketbattle.modules.intel;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "arena_intel_matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArenaIntelMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String team1;

    @Column(nullable = false)
    private String team2;

    @Column(name = "team1_flag")
    private String team1Flag;

    @Column(name = "team2_flag")
    private String team2Flag;

    @Column(nullable = false)
    private String competition;

    @Column(name = "match_date", nullable = false)
    private LocalDateTime matchDate;

    private String venue;

    @Column(name = "group_name")
    private String groupName;

    private String stage;

    @Column(name = "actual_score")
    private String actualScore;

    @Column(name = "actual_winner")
    private String actualWinner;

    @Column(nullable = false)
    private String status;
}