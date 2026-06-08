import API from "./auth";

export interface Tournament {
  id: number;
  title: string;
  slug: string;
  description: string;
  gameName: string;
  format: string;
  tournamentType: string;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  prizeDescription: string;
  rules: string;
  startDate: string;
  endDate: string;
  organizerUsername: string;
  bannerUrl: string | null;
}

export interface TournamentsResponse {
  success: boolean;
  data: {
    content: Tournament[];
  };
}

export interface TournamentResponse {
  success: boolean;
  data: Tournament;
}

export const getTournaments = () =>
  API.get<TournamentsResponse>("/tournaments");

export const getTournament = (id: number) =>
  API.get<TournamentResponse>(`/tournaments/${id}`);
