import { apiClient } from "@/lib/api";
import type { LoginInput, AuthResponse, LogoutResponse } from "./auth.types";

export const loginApi = (data: LoginInput): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>("/auth/login", data);
};

export const getMeApi = (): Promise<AuthResponse> => {
  return apiClient.get<AuthResponse>("/auth/me");
};

export const logoutApi = (): Promise<LogoutResponse> => {
  return apiClient.post<LogoutResponse>("/auth/logout");
};
