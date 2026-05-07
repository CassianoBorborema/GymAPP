import crypto from "node:crypto";
import { Workout } from "../../domain/aggregates/Workout.js";
import { WorkoutItem } from "../../domain/aggregates/WorkoutItem.js";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { CreateWorkoutInput } from "../dto/WorkoutDTO.js";

export class CriarTreino {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(input: CreateWorkoutInput): Promise<Workout> {
    if (!input.instructorId) {
      throw new Error("Apenas instrutores podem criar treinos");
    }

    const items = input.items.map(
      (item: typeof input.items[0]) =>
        new WorkoutItem(
          crypto.randomUUID(),
          item.exerciseId,
          item.sets,
          item.reps,
          item.restTime,
          item.observations,
        ),
    );

    const novoTreino = new Workout(
      crypto.randomUUID(),
      input.alunoId,
      input.instructorId,
      input.title,
      items,
    );

    await this.workoutRepository.save(novoTreino);

    return novoTreino;
  }
}