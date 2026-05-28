import crypto from "node:crypto";
import { Exercise } from "../../domain/entities/Exercise.js";
import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { CriarExercicioInput } from "../dto/ExerciseDTO.js";

export class CreateExercise {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: CriarExercicioInput): Promise<Exercise> {
    if (!input.instructorId) {
      throw new Error("Apenas instrutores podem criar exercícios");
    }

    const exerciseExistente = await this.exerciseRepository.findByName(
      input.name,
    );

    if (exerciseExistente.length > 0) {
      throw new Error("Exercício com este nome já existe");
    }

    const novoExercicio = new Exercise(
      crypto.randomUUID(),
      input.name,
      input.muscleGroup,
      input.videoUrl,
      input.description,
    );

    await this.exerciseRepository.save(novoExercicio);

    return novoExercicio;
  }
}
