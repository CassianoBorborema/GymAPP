import { Exercise } from "../../domain/entities/Exercise";
import { ExerciseRepository } from "../../domain/repositories/ExerciseRepository";
import { CriarExercicioInput } from "../dto/ExerciseDTO";

export class CriarExercicio {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(input);
}
