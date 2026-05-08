import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { SearchWorkoutByTitleInput } from "../dto/WorkoutDTO.js";
import { Workout } from "../../domain/aggregates/Workout.js";

export class SearchWorkoutByTitle {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(input: SearchWorkoutByTitleInput): Promise<Workout[]> {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error("O título é obrigatório para buscar treinos.");
    }

    return this.workoutRepository.findByTitle(input.title);
  }
}
