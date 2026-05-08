import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { ExerciseIdInput } from "../dto/ExerciseDTO.js";
import { Exercise } from "../../domain/entities/Exercise.js";

export class GetExercise {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: ExerciseIdInput): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findById(input.id);
    if (!exercise) {
      throw new Error("Exercício não encontrado.");
    }
    return exercise;
  }
}
