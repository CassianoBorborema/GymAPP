import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { UpdateExerciseInput } from "../dto/ExerciseDTO.js";
import { Exercise } from "../../domain/entities/Exercise.js";

export class UpdateExercise {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: UpdateExerciseInput): Promise<Exercise> {
    if (!input.id) {
      throw new Error("ID do exercício é obrigatório para atualização.");
    }

    const exercise = await this.exerciseRepository.findById(input.id);
    if (!exercise) {
      throw new Error("Exercício não encontrado para atualização.");
    }

    if (input.name) {
      exercise.name = input.name;
    }

    if (input.muscleGroup) {
      exercise.muscleGroup = input.muscleGroup;
    }

    if (input.videoUrl !== undefined) {
      exercise.videoUrl = input.videoUrl;
    }

    if (input.description !== undefined) {
      exercise.description = input.description;
    }

    if (input.instructorId) {
      // Apenas validação de permissão; não há relacionamento direto no exercício.
      if (!input.instructorId.trim()) {
        throw new Error("Instrutor inválido para atualizar o exercício.");
      }
    }

    await this.exerciseRepository.update(exercise);
    return exercise;
  }
}
