import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { WorkoutIdInput } from "../dto/WorkoutDTO.js";
import { Workout } from "../../domain/aggregates/Workout.js";

export class GetWorkout {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(input: WorkoutIdInput): Promise<Workout> {
    const workout = await this.workoutRepository.findById(input.id);
    if (!workout) {
      throw new Error("Treino não encontrado.");
    }
    return workout;
  }
}
