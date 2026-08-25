package com.bracketbattle.modules.resume;

import java.util.List;

public class JobSearchResponse {

    private int totalResults;
    private List<JobListing> jobs;

    public JobSearchResponse() {}

    public JobSearchResponse(int totalResults, List<JobListing> jobs) {
        this.totalResults = totalResults;
        this.jobs = jobs;
    }

    public int getTotalResults() { return totalResults; }
    public void setTotalResults(int totalResults) { this.totalResults = totalResults; }

    public List<JobListing> getJobs() { return jobs; }
    public void setJobs(List<JobListing> jobs) { this.jobs = jobs; }

    public static class JobListing {
        private String jobId;
        private String title;
        private String company;
        private String location;
        private String employmentType;
        private String salary;
        private String description;
        private String applyLink;
        private String postedAt;
        private boolean isRemote;
        private String companyLogo;

        public JobListing() {}

        public String getJobId() { return jobId; }
        public void setJobId(String jobId) { this.jobId = jobId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getEmploymentType() { return employmentType; }
        public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

        public String getSalary() { return salary; }
        public void setSalary(String salary) { this.salary = salary; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getApplyLink() { return applyLink; }
        public void setApplyLink(String applyLink) { this.applyLink = applyLink; }

        public String getPostedAt() { return postedAt; }
        public void setPostedAt(String postedAt) { this.postedAt = postedAt; }

        public boolean isRemote() { return isRemote; }
        public void setRemote(boolean remote) { isRemote = remote; }

        public String getCompanyLogo() { return companyLogo; }
        public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }
    }
}