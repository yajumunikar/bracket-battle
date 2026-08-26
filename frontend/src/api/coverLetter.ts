import API from "./auth";

export const generateCoverLetter = async (
  jobDescription: string,
  resumeText?: string,
  file?: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  if (file) formData.append("file", file);
  if (resumeText) formData.append("resumeText", resumeText);

  const response = await API.post("/resume/cover-letter", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.coverLetter;
};
