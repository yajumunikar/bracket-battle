import API from "./auth";

export interface WorkoutRequest {
  goal: string;
  fitnessLevel: string;
  daysPerWeek: number;
  sessionLength: string;
  equipment: string;
  age?: number;
  weight?: number;
  weightUnit?: string;
  height?: string;
  gender?: string;
  limitations?: string;
}

export const generateWorkoutPlan = async (
  request: WorkoutRequest
): Promise<string> => {
  const response = await API.post("/workout/generate", request);
  return response.data.plan;
};
