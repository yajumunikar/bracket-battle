import API from "./auth";

export interface Profile {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
  tournamentsOrganized: number;
  tournamentsPlayed: number;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export const getMyProfile = () => API.get<ProfileResponse>("/users/me");
export const getUserProfile = (username: string) =>
  API.get<ProfileResponse>(`/users/${username}`);
