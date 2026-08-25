package com.bracketbattle.modules.resume;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resume")
@CrossOrigin(origins = "*")
public class JobSearchController {

    private static final Logger log = LoggerFactory.getLogger(JobSearchController.class);

    private final JobSearchService jobSearchService;

    public JobSearchController(JobSearchService jobSearchService) {
        this.jobSearchService = jobSearchService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> searchJobs(
            @RequestParam String query,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "1") int page
    ) {
        log.info("Job search request — query: {}, location: {}, page: {}", query, location, page);

        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Search query is required."));
        }

        try {
            JobSearchResponse response = jobSearchService.searchJobs(query, location, page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Job search failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}