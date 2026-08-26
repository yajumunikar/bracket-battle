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
public class CoverLetterController {

    private static final Logger log = LoggerFactory.getLogger(CoverLetterController.class);

    private final CoverLetterService coverLetterService;
    private final ResumeAnalysisService resumeAnalysisService;

    public CoverLetterController(CoverLetterService coverLetterService,
                                  ResumeAnalysisService resumeAnalysisService) {
        this.coverLetterService = coverLetterService;
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping(value = "/cover-letter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generateCoverLetter(
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart("jobDescription") String jobDescription,
            @RequestPart(value = "resumeText", required = false) String resumeText
    ) {
        log.info("Cover letter request — file: {}, resumeText provided: {}",
                file != null ? file.getOriginalFilename() : "none",
                resumeText != null && !resumeText.isBlank());

        if (jobDescription == null || jobDescription.isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Job description is required."));
        }

        try {
            String finalResumeText = resumeText;

            // If a file was uploaded, extract text from it
            if (file != null && !file.isEmpty()) {
                if (!file.getContentType().equals("application/pdf")) {
                    return ResponseEntity.badRequest().body(java.util.Map.of("error", "Only PDF files are supported."));
                }
                finalResumeText = resumeAnalysisService.extractText(file);
            }

            if (finalResumeText == null || finalResumeText.isBlank()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "Please upload a resume or analyze one first."));
            }

            String coverLetter = coverLetterService.generate(finalResumeText, jobDescription);
            return ResponseEntity.ok(java.util.Map.of("coverLetter", coverLetter));

        } catch (Exception e) {
            log.error("Cover letter generation failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Generation failed. Please try again."));
        }
    }
}