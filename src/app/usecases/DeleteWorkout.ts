import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { DeleteWorkoutInput } from "../dto/WorkoutDTO.js";

export class DeleteWorkout {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(input: DeleteWorkoutInput): Promise<void> {
    const treino = await this.workoutRepository.findById(input.id);
    if (!treino) {
      throw new Error("Treino não encontrado para deleção.");
    }

    await this.workoutRepository.delete(input.id);
  }
}
