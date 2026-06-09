import API from "./auth";

export interface MatchDto {
  id: number;
  roundNumber: number;
  matchNumber: number;
  player1Id: number | null;
  player1Username: string | null;
  player2Id: number | null;
  player2Username: string | null;
  winnerId: number | null;
  winnerUsername: string | null;
  player1Score: number | null;
  player2Score: number | null;
  status: string;
  nextMatchId: number | null;
}

export interface BracketDto {
  id: number;
  tournamentId: number;
  tournamentTitle: string;
  totalRounds: number;
  status: string;
  matches: MatchDto[];
}

export interface BracketResponse {
  success: boolean;
  data: BracketDto;
}

export const getBracket = (tournamentId: number) =>
  API.get<BracketResponse>(`/tournaments/${tournamentId}/bracket`);

export const generateBracket = (tournamentId: number) =>
  API.post<BracketResponse>(`/tournaments/${tournamentId}/bracket/generate`);

export const reportResult = (
  tournamentId: number,
  matchId: number,
  winnerId: number,
  player1Score: number,
  player2Score: number
) =>
  API.post(`/tournaments/${tournamentId}/bracket/matches/${matchId}/result`, {
    winnerId,
    player1Score,
    player2Score,
  });
