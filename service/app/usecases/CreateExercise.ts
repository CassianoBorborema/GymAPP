import crypto from "node:crypto";
import { Exercise } from "../../domain/entities/Exercise.js";
import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";
import type { CriarExercicioInput } from "../dto/ExerciseDTO.js";

export class CriarExercicio {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input: CriarExercicioInput): Promise<Exercise> {
    const exerciseExistente = await this.exerciseRepository.findByName(
      input.name,
    );

    if (exerciseExistente) {
      throw new Error("Exercício já existe");
    }

    const novoExercicio = new Exercise(
      crypto.randomUUID(),
      input.name,
      input.muscleGroup,
      input.videoURL,
      input.description,
    );

    await this.exerciseRepository.save(novoExercicio);

    return novoExercicio;
  }
}
