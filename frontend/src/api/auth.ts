import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("bb_user");
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    username: string;
    displayName: string;
    email: string;
    role: string;
    userId: number;
    tokenType: string | null;
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
