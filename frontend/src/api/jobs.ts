import API from "./auth";

export interface JobListing {
  jobId: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary: string | null;
  description: string | null;
  applyLink: string;
  postedAt: string | null;
  remote: boolean;
  companyLogo: string | null;
}

export interface JobSearchResponse {
  totalResults: number;
  jobs: JobListing[];
}

export const searchJobs = async (
  query: string,
  location?: string,
  page = 1
): Promise<JobSearchResponse> => {
  const params: Record<string, string | number> = { query, page };
  if (location && location.trim()) params.location = location.trim();

  const response = await API.get("/resume/jobs", { params });
  return response.data;
};
