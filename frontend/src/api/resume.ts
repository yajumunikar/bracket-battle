import API from "./auth";

export interface ScoreBreakdown {
  impactAndAchievements: number;
  keywordMatch: number;
  formattingAndClarity: number;
  atsCompatibility: number;
  quantifiedResults: number;
}

export interface AtsAnalysis {
  score: number;
  explanation: string;
  issues: string[];
}

export interface KeywordMatch {
  present: string[];
  missing: string[];
}

export interface BulletRewrite {
  before: string;
  after: string;
}

export interface ResumeAnalysisResponse {
  overallScore: number;
  grade: string;
  summary: string;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsAnalysis: AtsAnalysis;
  keywordMatch: KeywordMatch;
  bulletRewrites: BulletRewrite[];
}

export const analyzeResume = async (
  file: File,
  jobDescription?: string
): Promise<ResumeAnalysisResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (jobDescription && jobDescription.trim()) {
    formData.append("jobDescription", jobDescription.trim());
  }

  const response = await API.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
