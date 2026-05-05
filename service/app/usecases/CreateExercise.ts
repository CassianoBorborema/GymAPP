import crypto from "node:crypto"; // Importante para o ID
import { Exercise } from "../../domain/entities/Exercise";
import { ExerciseRepository } from "../../domain/repositories/ExerciseRepository";
import { CriarExercicioInput } from "../dto/ExerciseDTO";

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
      input.videoUrl,
      input.description,
    );

    await this.exerciseRepository.save(novoExercicio);

    return novoExercicio;
  }
}
