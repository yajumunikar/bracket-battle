import API from "./auth";

export interface Game {
  id: number;
  name: string;
  slug: string;
}

export interface GamesResponse {
  success: boolean;
  data: Game[];
}

export const getGames = () => API.get<GamesResponse>("/games");
