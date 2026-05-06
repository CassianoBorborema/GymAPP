import type { MuscleGroup } from "../../domain/entities/Exercise.js";

export interface CriarExercicioInput {
  name: string;
  muscleGroup: MuscleGroup;
  videoURL?: string;
  description?: string;
}
