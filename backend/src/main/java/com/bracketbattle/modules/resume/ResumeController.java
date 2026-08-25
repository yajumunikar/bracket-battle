package com.bracketbattle.modules.resume;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeController(ResumeAnalysisService resumeAnalysisService) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeResume(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "jobDescription", required = false) String jobDescription
    ) {
        log.info("Resume analysis request received. File: {}, Size: {} bytes, JD provided: {}",
                file.getOriginalFilename(), file.getSize(), jobDescription != null && !jobDescription.isBlank());

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(errorResponse("No file uploaded."));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body(errorResponse("Only PDF files are supported."));
        }

        if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
            return ResponseEntity.badRequest().body(errorResponse("File size must be under 5MB."));
        }

        try {
            ResumeAnalysisResponse response = resumeAnalysisService.analyze(file, jobDescription);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(errorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Resume analysis failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse("Analysis failed. Please try again."));
        }
    }

    private java.util.Map<String, String> errorResponse(String message) {
        return java.util.Map.of("error", message);
    }
}