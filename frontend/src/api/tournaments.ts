import API from "./auth";

export interface Tournament {
  id: number;
  title: string;
  slug: string;
  description: string;
  gameName: string;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  organizerUsername: string;
}

export interface TournamentsResponse {
  success: boolean;
  data: {
    content: Tournament[];
  };
}

export const getTournaments = () =>
  API.get<TournamentsResponse>("/tournaments");
