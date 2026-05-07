import { Exercise } from "../entities/Exercise.js";
import type { MuscleGroup } from "../entities/Exercise.js";

export interface ExerciseRepository {
  
  save(exercise: Exercise): Promise<void>;

  findByName(name: string): Promise<Exercise[]>;

  findByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]>;

  findById(id: string): Promise<Exercise | null>;
}
