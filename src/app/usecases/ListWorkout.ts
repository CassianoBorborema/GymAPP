import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { ListWorkoutsInput } from "../dto/WorkoutDTO.js";
import { Workout } from "../../domain/aggregates/Workout.js";

export class ListWorkout {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(input: ListWorkoutsInput): Promise<Workout[]> {
    if (!input.alunoId) {
      throw new Error("ID do aluno é obrigatório para listar treinos.");
    }

    return this.workoutRepository.findByAlunoId(input.alunoId);
  }
}
