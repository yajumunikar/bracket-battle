import API from "./auth";

export const getIntelMatches = () => API.get("/intel/matches");

export const getIntelTodayMatches = () => API.get("/intel/matches/today");

export const getIntelMatch = (id: number) => API.get(`/intel/matches/${id}`);

export const getIntelPrediction = (id: number) =>
  API.get(`/intel/matches/${id}/prediction`);
