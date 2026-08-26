package com.bracketbattle.modules.workout;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WorkoutService {

    private static final Logger log = LoggerFactory.getLogger(WorkoutService.class);

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.api-url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generate(WorkoutRequest request) {
        String prompt = buildPrompt(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", groqModel);
        body.put("messages", List.of(message));
        body.put("max_tokens", 2500);
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(groqApiUrl, requestEntity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) throw new RuntimeException("Empty response from Groq");

            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> messageMap = (Map<String, Object>) firstChoice.get("message");
            return (String) messageMap.get("content");

        } catch (Exception e) {
            log.error("Groq workout call failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate workout plan. Please try again.");
        }
    }

    private String buildPrompt(WorkoutRequest r) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert certified personal trainer and fitness coach.\n\n");
        sb.append("Create a detailed, personalized weekly workout plan based on the following information:\n\n");

        sb.append("GOAL: ").append(r.getGoal()).append("\n");
        sb.append("FITNESS LEVEL: ").append(r.getFitnessLevel()).append("\n");
        sb.append("DAYS PER WEEK: ").append(r.getDaysPerWeek()).append("\n");
        sb.append("SESSION LENGTH: ").append(r.getSessionLength()).append("\n");
        sb.append("EQUIPMENT: ").append(r.getEquipment()).append("\n");

        if (r.getAge() != null) sb.append("AGE: ").append(r.getAge()).append("\n");
        if (r.getWeight() != null) sb.append("WEIGHT: ").append(r.getWeight()).append(" ").append(r.getWeightUnit() != null ? r.getWeightUnit() : "lbs").append("\n");
        if (r.getHeight() != null && !r.getHeight().isBlank()) sb.append("HEIGHT: ").append(r.getHeight()).append("\n");
        if (r.getGender() != null && !r.getGender().isBlank()) sb.append("GENDER: ").append(r.getGender()).append("\n");
        if (r.getLimitations() != null && !r.getLimitations().isBlank()) sb.append("LIMITATIONS/INJURIES: ").append(r.getLimitations()).append("\n");

        sb.append("""
                
                Generate a complete weekly workout plan with the following structure:
                
                1. Start with a brief OVERVIEW (2-3 sentences) explaining the plan philosophy and what the user can expect.
                
                2. For each workout day, provide:
                   - Day name and muscle focus (e.g. "Day 1 — Chest & Triceps")
                   - Warm-up (3-5 minutes, 2-3 exercises)
                   - Main workout (list each exercise with: sets x reps, rest time, and a brief form tip)
                   - Cool-down (2-3 minutes, 2-3 stretches)
                
                3. For rest days, just note "Rest Day — Active Recovery" with 1-2 light activity suggestions.
                
                4. End with TIPS section — 3-4 personalized tips based on their goal and level.
                
                Format it cleanly with clear sections, emoji for visual interest, and make it motivating and actionable.
                Be specific with exercise names, sets, reps, and rest periods. Never be vague.
                Tailor everything to their fitness level — beginners get simpler exercises, advanced get more complex movements.
                """);

        return sb.toString();
    }
}