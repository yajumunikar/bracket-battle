import API from "./auth";

export interface Game {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  platform: string;
  active: boolean;
}

export interface GamesResponse {
  success: boolean;
  data: Game[];
}

export const getGames = () => API.get<GamesResponse>("/games");
