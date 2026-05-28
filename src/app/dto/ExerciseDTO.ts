import type { MuscleGroup } from "../../domain/entities/Exercise.js";

export interface CriarExercicioInput {
  name: string;
  muscleGroup: MuscleGroup;
  videoUrl?: string;
  description?: string;
  instructorId: string;
}

export interface SearchExerciseInput {
  name?: string;
  muscleGroup?: MuscleGroup;
}

export interface ExerciseIdInput {
  id: string;
}

export interface UpdateExerciseInput{
  id: string;
  name?: string;
  muscleGroup?: MuscleGroup;
  videoUrl?: string;
  description?: string;
  instructorId?: string;
}

export interface DeleteExerciseInput {
  id: string;
}