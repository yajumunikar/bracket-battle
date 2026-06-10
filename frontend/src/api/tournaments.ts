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
  streamUrl: string | null;
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

export const registerForTournament = (tournamentId: number) =>
  API.post(`/tournaments/${tournamentId}/registrations`);

export const checkRegistration = (tournamentId: number) =>
  API.get<{ success: boolean; data: boolean }>(
    `/tournaments/${tournamentId}/registrations/me`
  );

export const unregisterFromTournament = (tournamentId: number) =>
  API.delete(`/tournaments/${tournamentId}/registrations`);

export const updateStreamUrl = (
  tournamentId: number,
  streamUrl: string | null
) => API.put(`/tournaments/${tournamentId}/stream`, { streamUrl });
