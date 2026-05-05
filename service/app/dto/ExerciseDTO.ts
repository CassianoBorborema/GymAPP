import { MuscleGroup } from "../../domain/entities/Exercise";

export interface CriarExercicioInput {
  name: string;
  muscleGroup: MuscleGroup;
  videoURL?: string;
  description?: string;
}
