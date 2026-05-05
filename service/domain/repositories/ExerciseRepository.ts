import { Exercise } from "../entities/Exercise";
import { MuscleGroup } from "../entities/Exercise";

export interface ExerciseRepository {
  save(exercise: Exercise): Promise<void>;

  findByName(name: string): Promise<Exercise[]>;

  findByMuscleGroup(muscleGroup: MuscleGroup): Promise<MuscleGroup | null>;
}
