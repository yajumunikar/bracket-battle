import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1",
});

// Request interceptor — attach token
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("bb_user");
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

// Response interceptor — handle expired/invalid token
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      localStorage.removeItem("bb_user");
      window.location.href = "/login?reason=session_expired";
    }

    return Promise.reject(error);
  }
);

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
