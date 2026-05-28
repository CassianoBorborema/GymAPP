import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { DeleteExerciseInput } from "../dto/ExerciseDTO.js";

export class DeleteExercise {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: DeleteExerciseInput): Promise<void> {
    await this.exerciseRepository.delete(input.id);
  }
}
