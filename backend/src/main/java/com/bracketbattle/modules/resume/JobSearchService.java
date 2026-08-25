package com.bracketbattle.modules.resume;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class JobSearchService {

    private static final Logger log = LoggerFactory.getLogger(JobSearchService.class);

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.jsearch-url}")
    private String jsearchUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public JobSearchResponse searchJobs(String query, String location, int page) {
        try {
            String searchQuery = buildQuery(query, location);

            String url = UriComponentsBuilder.fromHttpUrl(jsearchUrl)
                    .queryParam("query", searchQuery)
                    .queryParam("page", page)
                    .queryParam("num_pages", 1)
                    .queryParam("date_posted", "all")
                    .build()
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", rapidApiKey);
            headers.set("X-RapidAPI-Host", "jsearch.p.rapidapi.com");

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || !"OK".equals(body.get("status"))) {
                log.warn("JSearch returned non-OK status");
                return new JobSearchResponse(0, new ArrayList<>());
            }

            Object rawData = body.get("data");
            List<Map<String, Object>> data;
            if (rawData instanceof List) {
                data = (List<Map<String, Object>>) rawData;
            } else if (rawData instanceof Map) {
                Map<String, Object> dataMap = (Map<String, Object>) rawData;
                Object jobs = dataMap.get("jobs");
                data = jobs instanceof List ? (List<Map<String, Object>>) jobs : new ArrayList<>();
            } else {
                data = new ArrayList<>();
            }
            if (data == null) return new JobSearchResponse(0, new ArrayList<>());

            List<JobSearchResponse.JobListing> jobs = new ArrayList<>();
            for (Map<String, Object> item : data) {
                JobSearchResponse.JobListing job = new JobSearchResponse.JobListing();

                job.setJobId(getString(item, "job_id"));
                job.setTitle(getString(item, "job_title"));
                job.setCompany(getString(item, "employer_name"));
                job.setLocation(buildLocation(item));
                job.setEmploymentType(getString(item, "job_employment_type"));
                job.setRemote(Boolean.TRUE.equals(item.get("job_is_remote")));
                job.setApplyLink(getString(item, "job_apply_link"));
                job.setCompanyLogo(getString(item, "employer_logo"));
                job.setPostedAt(getString(item, "job_posted_at_datetime_utc"));
                job.setSalary(buildSalary(item));

                // Short description snippet
                String desc = getString(item, "job_description");
                if (desc != null && desc.length() > 300) {
                    desc = desc.substring(0, 300) + "...";
                }
                job.setDescription(desc);

                jobs.add(job);
            }

            Object total = body.get("total_count");
            int totalCount = total instanceof Number ? ((Number) total).intValue() : jobs.size();

            return new JobSearchResponse(totalCount, jobs);

        } catch (Exception e) {
            log.error("JSearch API call failed: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch job listings. Please try again.");
        }
    }

    private String buildQuery(String query, String location) {
        if (location != null && !location.isBlank()) {
            return query + " in " + location;
        }
        return query;
    }

    private String buildLocation(Map<String, Object> item) {
        String city = getString(item, "job_city");
        String state = getString(item, "job_state");
        String country = getString(item, "job_country");

        if (Boolean.TRUE.equals(item.get("job_is_remote"))) return "Remote";

        List<String> parts = new ArrayList<>();
        if (city != null) parts.add(city);
        if (state != null) parts.add(state);
        if (country != null && parts.isEmpty()) parts.add(country);

        return parts.isEmpty() ? "Location not specified" : String.join(", ", parts);
    }

    private String buildSalary(Map<String, Object> item) {
        Object min = item.get("job_min_salary");
        Object max = item.get("job_max_salary");
        String period = getString(item, "job_salary_period");

        if (min == null && max == null) return null;

        String salaryStr = "";
        if (min != null && max != null) {
            salaryStr = "$" + formatSalary(min) + " – $" + formatSalary(max);
        } else if (min != null) {
            salaryStr = "$" + formatSalary(min) + "+";
        } else {
            salaryStr = "Up to $" + formatSalary(max);
        }

        if (period != null) salaryStr += " / " + period.toLowerCase();
        return salaryStr;
    }

    private String formatSalary(Object val) {
        if (val instanceof Number) {
            int v = ((Number) val).intValue();
            if (v >= 1000) return String.format("%,d", v);
            return String.valueOf(v);
        }
        return val.toString();
    }

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val instanceof String ? (String) val : null;
    }
}