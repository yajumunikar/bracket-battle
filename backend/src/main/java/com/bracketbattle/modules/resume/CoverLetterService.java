package com.bracketbattle.modules.resume;

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
public class CoverLetterService {

    private static final Logger log = LoggerFactory.getLogger(CoverLetterService.class);

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.api-url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generate(String resumeText, String jobDescription) {
        String truncatedResume = truncate(resumeText, 3000);
        String truncatedJd = truncate(jobDescription, 1500);

        String prompt = buildPrompt(truncatedResume, truncatedJd);

        log.info("CoverLetter using key prefix: {}", groqApiKey != null ? groqApiKey.substring(0, 8) : "NULL");
        log.info("CoverLetter using URL: {}", groqApiUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", groqModel);
        body.put("messages", List.of(message));
        body.put("max_tokens", 2000);
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(groqApiUrl, request, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) throw new RuntimeException("Empty response from Groq");

            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> messageMap = (Map<String, Object>) firstChoice.get("message");
            return (String) messageMap.get("content");

        } catch (Exception e) {
            log.error("Groq cover letter call failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate cover letter. Please try again.");
        }
    }

    private String buildPrompt(String resumeText, String jobDescription) {
        return """
                You are an expert career coach and professional writer specializing in cover letters that get interviews.
                
                Write a compelling, personalized cover letter based on the candidate's resume and the job description below.
                
                RESUME:
                """ + resumeText + """
                
                JOB DESCRIPTION:
                """ + jobDescription + """
                
                Instructions:
                - Write in first person, professional but warm tone
                - Opening paragraph: hook the reader, mention the specific role and company if identifiable
                - Middle paragraphs: highlight 2-3 most relevant experiences/skills from the resume that match the job
                - Use specific examples and achievements from the resume, not generic statements
                - Closing paragraph: express enthusiasm, mention you'd love to discuss further, call to action
                - Length: 3-4 paragraphs, under 400 words
                - Do NOT include placeholder text like [Your Name] or [Date] — write the letter body only
                - Do NOT include a subject line or email header
                - Start directly with "Dear Hiring Manager," or a more specific salutation if the company is identifiable
                - End with "Sincerely," followed by the candidate's name from the resume
                - Make it sound human and genuine, not templated
                """;
    }

    private String truncate(String text, int maxChars) {
        if (text == null) return null;
        if (text.length() <= maxChars) return text;
        return text.substring(0, maxChars) + "...";
    }
}