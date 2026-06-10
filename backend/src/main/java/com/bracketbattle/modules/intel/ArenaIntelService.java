package com.bracketbattle.modules.intel;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArenaIntelService {

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.api-url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    private final ArenaIntelMatchRepository matchRepository;
    private final ArenaIntelPredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public List<Map<String, Object>> getMatchesGroupedByDate() {
        List<ArenaIntelMatch> matches = matchRepository.findAllByOrderByMatchDateAsc();

        Map<LocalDate, List<ArenaIntelMatch>> grouped = matches.stream()
            .collect(Collectors.groupingBy(m -> m.getMatchDate().toLocalDate(),
                LinkedHashMap::new, Collectors.toList()));

        return grouped.entrySet().stream()
            .map(entry -> {
                Map<String, Object> group = new LinkedHashMap<>();
                group.put("date", entry.getKey().toString());
                group.put("matches", entry.getValue().stream()
                    .map(this::toMatchDto)
                    .collect(Collectors.toList()));
                return group;
            })
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTodayMatches() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return matchRepository.findMatchesByDateRange(start, end)
            .stream().map(this::toMatchDto).collect(Collectors.toList());
    }

    public Map<String, Object> getMatch(Long id) {
        ArenaIntelMatch match = matchRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Match not found"));
        return toMatchDto(match);
    }

    @Transactional
    public Map<String, Object> getPrediction(Long matchId) {
        ArenaIntelMatch match = matchRepository.findById(matchId)
            .orElseThrow(() -> new RuntimeException("Match not found"));

        Optional<ArenaIntelPrediction> cached = predictionRepository
            .findByMatchIdAndExpiresAtAfter(matchId, LocalDateTime.now());

        if (cached.isPresent()) {
            log.info("Returning cached prediction for match {}", matchId);
            return parsePrediction(cached.get());
        }

        log.info("Generating new prediction for {} vs {}", match.getTeam1(), match.getTeam2());
        String predictionJson = generatePrediction(match);

        ArenaIntelPrediction prediction = ArenaIntelPrediction.builder()
            .match(match)
            .predictionJson(predictionJson)
            .generatedAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusHours(6))
            .build();

        predictionRepository.save(prediction);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("match", toMatchDto(match));
        try {
            result.put("prediction", objectMapper.readValue(predictionJson, Map.class));
        } catch (Exception e) {
            result.put("prediction", Map.of("error", "Failed to parse prediction"));
        }
        return result;
    }

    private String generatePrediction(ArenaIntelMatch match) {
        String prompt = String.format("""
            You are a world-class football analyst. Analyze this upcoming match at the FIFA World Cup 2026:
            
            %s (%s) vs %s (%s)
            Date: %s
            Venue: %s
            Group: %s
            
            Based on your knowledge of both teams' recent form, head-to-head history, squad quality, 
            playing style, and World Cup performance, provide a detailed statistical analysis.
            
            Return ONLY valid JSON with no markdown, no backticks, no preamble. Exactly this structure:
            {
              "predictedWinner": "team name or Draw",
              "predictedScore": "2-1",
              "confidencePercent": 72,
              "riskRating": "LOW",
              "winProbabilities": {"team1": 55, "draw": 20, "team2": 25},
              "team1Form": ["W","W","D","W","L"],
              "team1FormDetails": ["brief result 1", "brief result 2", "brief result 3", "brief result 4", "brief result 5"],
              "team2Form": ["W","L","W","D","W"],
              "team2FormDetails": ["brief result 1", "brief result 2", "brief result 3", "brief result 4", "brief result 5"],
              "headToHead": "summary of last 5-10 meetings",
              "keyInsights": ["insight 1", "insight 2", "insight 3"],
              "team1Strengths": ["strength 1", "strength 2", "strength 3"],
              "team1Weaknesses": ["weakness 1", "weakness 2"],
              "team2Strengths": ["strength 1", "strength 2", "strength 3"],
              "team2Weaknesses": ["weakness 1", "weakness 2"],
              "upsetPotentialPercent": 25,
              "overUnder": {"line": 2.5, "overPercent": 60, "prediction": "Over"},
              "btts": {"prediction": "Yes", "percent": 55},
              "predictedCorners": {"min": 8, "max": 11},
              "predictedCards": {"min": 2, "max": 4},
              "likelyGoalscorers": [
                {"name": "Player Name", "team": "team name", "percent": 35, "type": "Anytime"},
                {"name": "Player Name", "team": "team name", "percent": 25, "type": "Anytime"},
                {"name": "Player Name", "team": "team name", "percent": 20, "type": "First Half"}
              ],
              "suggestedCombo": ["leg 1", "leg 2", "leg 3", "leg 4"],
              "comboProbabilityPercent": 28,
              "matchSummary": "2-3 sentence narrative analysis of the match",
              "disclaimer": "Statistical analysis for entertainment purposes only. Not financial advice."
            }
            
            Be realistic and accurate. Use your knowledge of current international football.
            """,
            match.getTeam1(), match.getTeam1Flag(),
            match.getTeam2(), match.getTeam2Flag(),
            match.getMatchDate().toString(),
            match.getVenue(),
            match.getGroupName()
        );

        List<Map<String, String>> messages = List.of(
            Map.of("role", "user", "content", prompt)
        );

        Map<String, Object> requestBody = Map.of(
            "model", groqModel,
            "messages", messages,
            "max_tokens", 1500,
            "temperature", 0.3
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                groqApiUrl, HttpMethod.POST, entity, Map.class
            );

            Map body = response.getBody();
            List choices = (List) body.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            String content = (String) message.get("content");

            content = content.trim();
            if (content.startsWith("```")) {
                content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            }

            objectMapper.readValue(content, Map.class);
            return content;

        } catch (Exception e) {
            log.error("Groq prediction error: {}", e.getMessage());
            return getFallbackPrediction(match);
        }
    }

    private String getFallbackPrediction(ArenaIntelMatch match) {
        return String.format("""
            {
              "predictedWinner": "%s",
              "predictedScore": "1-0",
              "confidencePercent": 50,
              "riskRating": "HIGH",
              "winProbabilities": {"team1": 40, "draw": 30, "team2": 30},
              "team1Form": ["W","D","W","L","W"],
              "team1FormDetails": ["Recent form data unavailable"],
              "team2Form": ["D","W","L","W","D"],
              "team2FormDetails": ["Recent form data unavailable"],
              "headToHead": "Historical data temporarily unavailable.",
              "keyInsights": ["Analysis temporarily unavailable. Please try again shortly."],
              "team1Strengths": ["Data loading"],
              "team1Weaknesses": ["Data loading"],
              "team2Strengths": ["Data loading"],
              "team2Weaknesses": ["Data loading"],
              "upsetPotentialPercent": 35,
              "overUnder": {"line": 2.5, "overPercent": 50, "prediction": "Under"},
              "btts": {"prediction": "No", "percent": 45},
              "predictedCorners": {"min": 8, "max": 10},
              "predictedCards": {"min": 2, "max": 4},
              "likelyGoalscorers": [{"name": "TBD", "team": "%s", "percent": 25, "type": "Anytime"}],
              "suggestedCombo": ["%s to win", "Under 2.5 goals"],
              "comboProbabilityPercent": 30,
              "matchSummary": "Analysis is being generated. Please refresh in a moment.",
              "disclaimer": "Statistical analysis for entertainment purposes only. Not financial advice."
            }
            """, match.getTeam1(), match.getTeam1(), match.getTeam1());
    }

    private Map<String, Object> parsePrediction(ArenaIntelPrediction prediction) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("match", toMatchDto(prediction.getMatch()));
        try {
            result.put("prediction", objectMapper.readValue(prediction.getPredictionJson(), Map.class));
        } catch (Exception e) {
            result.put("prediction", Map.of("error", "Failed to parse prediction"));
        }
        return result;
    }

    private Map<String, Object> toMatchDto(ArenaIntelMatch m) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", m.getId());
        dto.put("team1", m.getTeam1());
        dto.put("team2", m.getTeam2());
        dto.put("team1Flag", m.getTeam1Flag());
        dto.put("team2Flag", m.getTeam2Flag());
        dto.put("competition", m.getCompetition());
        dto.put("matchDate", m.getMatchDate().toString());
        dto.put("venue", m.getVenue());
        dto.put("groupName", m.getGroupName());
        dto.put("stage", m.getStage());
        dto.put("status", m.getStatus());
        dto.put("actualScore", m.getActualScore());
        dto.put("actualWinner", m.getActualWinner());
        return dto;
    }
}