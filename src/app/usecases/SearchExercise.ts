import type { Exercise } from "../../domain/entities/Exercise.js";
import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { SearchExerciseInput } from "../dto/ExerciseDTO.js";

export class SearchExercise {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: SearchExerciseInput): Promise<Exercise[]> {
    if (!input.name && !input.muscleGroup) {
      return this.exerciseRepository.findAll();
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
