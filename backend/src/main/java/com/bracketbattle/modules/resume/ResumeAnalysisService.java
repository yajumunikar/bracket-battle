package com.bracketbattle.modules.resume;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ResumeAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ResumeAnalysisService.class);

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.api-url}")
private String groqApiUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String groqModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeAnalysisResponse analyze(MultipartFile file, String jobDescription) throws IOException {
        // 1. Extract text from PDF
        String resumeText = extractTextFromPdf(file);

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new IllegalArgumentException("Could not extract text from the uploaded PDF. Please ensure the file is not scanned or image-based.");
        }

        // 2. Truncate to avoid token limits
        String truncatedResume = truncate(resumeText, 3000);
        String truncatedJd = (jobDescription != null && !jobDescription.isBlank())
                ? truncate(jobDescription, 1000)
                : null;

        // 3. Build prompt and call Groq
        String prompt = buildPrompt(truncatedResume, truncatedJd);

        log.info("Using Groq URL: {} | Model: {} | Key prefix: {}", groqApiUrl, groqModel, groqApiKey.substring(0, 10));
        String rawJson = callGroq(prompt);

        // 4. Parse and return
        return parseResponse(rawJson);
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getInputStream().readAllBytes())) {            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String truncate(String text, int maxChars) {
        if (text == null) return null;
        if (text.length() <= maxChars) return text;
        return text.substring(0, maxChars) + "...";
    }

    private String buildPrompt(String resumeText, String jobDescription) {
        StringBuilder sb = new StringBuilder();

        sb.append("You are an expert resume coach and ATS specialist with 10+ years of experience helping engineers land jobs at top tech companies.\n\n");

        sb.append("Analyze the following resume");
        if (jobDescription != null) {
            sb.append(" against the provided job description");
        }
        sb.append(" and return a detailed JSON analysis.\n\n");

        sb.append("RESUME:\n").append(resumeText).append("\n\n");

        if (jobDescription != null) {
            sb.append("JOB DESCRIPTION:\n").append(jobDescription).append("\n\n");
        }

        sb.append("""
                Return ONLY a valid JSON object with NO markdown, NO backticks, NO preamble. Exactly this structure:
                {
                  "overallScore": <integer 0-100>,
                  "grade": <"A+"|"A"|"A-"|"B+"|"B"|"B-"|"C+"|"C"|"C-"|"D"|"F">,
                  "summary": "<2-3 sentence overall assessment>",
                  "scoreBreakdown": {
                    "impactAndAchievements": <0-100>,
                    "keywordMatch": <0-100>,
                    "formattingAndClarity": <0-100>,
                    "atsCompatibility": <0-100>,
                    "quantifiedResults": <0-100>
                  },
                  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
                  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
                  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>", "<actionable suggestion 4>"],
                  "atsAnalysis": {
                    "score": <0-100>,
                    "explanation": "<explanation of ATS score>",
                    "issues": ["<issue 1>", "<issue 2>"]
                  },
                  "keywordMatch": {
                    "present": ["<keyword found in resume>", ...],
                    "missing": ["<keyword NOT in resume but important>", ...]
                  },
                  "bulletRewrites": [
                    {
                      "before": "<original weak bullet point from the resume>",
                      "after": "<improved version with metrics, action verbs, and impact>"
                    },
                    {
                      "before": "<another original bullet>",
                      "after": "<improved version>"
                    }
                  ]
                }
                
                Rules:
                - overallScore must be an integer between 0 and 100
                - All arrays must have at least 2 items
                - bulletRewrites must have exactly 2 items — pick the 2 weakest bullet points from the actual resume
                - keywordMatch.present and keywordMatch.missing must each have 4-8 items
                - strengths must have exactly 4 items
                - weaknesses must have exactly 3 items
                - suggestions must have exactly 4 items
                - Never return null for any field
                - Return ONLY the JSON object, nothing else
                """);

        return sb.toString();
    }

    private String callGroq(String prompt) {
        String url = groqApiUrl;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", groqModel);
        body.put("messages", List.of(message));
        body.put("max_tokens", 2500);
        body.put("temperature", 0.3);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) throw new RuntimeException("Empty response from Groq");

            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> messageMap = (Map<String, Object>) firstChoice.get("message");
            return (String) messageMap.get("content");

        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage());
            throw new RuntimeException("Failed to get analysis from AI. Please try again.");
        }
    }

    private ResumeAnalysisResponse parseResponse(String rawJson) {
        try {
            // Strip markdown fences if present
            String clean = rawJson.trim();
            if (clean.startsWith("```")) {
                clean = clean.replaceAll("```json", "").replaceAll("```", "").trim();
            }
            return objectMapper.readValue(clean, ResumeAnalysisResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse Groq response: {}", e.getMessage());
            log.debug("Raw response was: {}", rawJson);
            throw new RuntimeException("Failed to parse analysis results. Please try again.");
        }
    }

    public String extractText(MultipartFile file) throws IOException {
        return extractTextFromPdf(file);
    }
}