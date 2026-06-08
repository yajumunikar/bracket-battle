import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  data?: Record<string, string>;
}

export const extractErrors = (
  err: unknown
): { general: string; fields: Record<string, string> } => {
  const axiosErr = err as AxiosError<ApiError>;
  const body = axiosErr.response?.data;
  if (body?.error === "VALIDATION_ERROR" && body.data) {
    return {
      general: body.message ?? "Please fix the errors below",
      fields: body.data,
    };
  }
  return {
    general: body?.message ?? "Something went wrong. Please try again.",
    fields: {},
  };
};

export const loginRequest = (email: string, password: string) =>
  API.post<AuthResponse>("/auth/login", { email, password });

export const registerRequest = (
  username: string,
  email: string,
  password: string
) =>
  API.post<AuthResponse>("/auth/register", {
    username,
    email,
    password,
    displayName: username,
  });

export default API;
