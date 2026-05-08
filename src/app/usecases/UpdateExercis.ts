import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { SearchExerciseInput } from "../dto/ExerciseDTO.js";
import { Exercise } from "../../domain/entities/Exercise.js";

export class SearchExercise {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: SearchExerciseInput): Promise<Exercise[]> {
    if (!input.name && !input.muscleGroup) {
      throw new Error("Informe nome ou grupo muscular para buscar exercícios.");
    }

    if (input.name && input.muscleGroup) {
      const exerciciosPorNome = await this.exerciseRepository.findByName(
        input.name,
      );
      return exerciciosPorNome.filter(
        (exercise) => exercise.muscleGroup === input.muscleGroup,
      );
    }

    if (input.name) {
      return this.exerciseRepository.findByName(input.name);
    }

    return this.exerciseRepository.findByMuscleGroup(input.muscleGroup!);
  }
}
