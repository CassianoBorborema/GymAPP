import crypto from "node:crypto";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { UpdateWorkoutInput } from "../dto/WorkoutDTO.js";
import { Workout } from "../../domain/aggregates/Workout.js";
import { WorkoutItem } from "../../domain/aggregates/WorkoutItem.js";

export class UpdateWorkout {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(input: UpdateWorkoutInput): Promise<Workout> {
    const treino = await this.workoutRepository.findById(input.id);
    if (!treino) {
      throw new Error("Treino não encontrado para atualização.");
    }

    if (input.title) {
      treino.setTitle(input.title);
    }

    if (input.items) {
      if (input.items.length === 0) {
        throw new Error("O treino deve ter pelo menos um exercício.");
      }

      const novoItems = input.items.map(
        (item) =>
          new WorkoutItem(
            crypto.randomUUID(),
            item.exerciseId,
            item.sets,
            item.reps,
            item.restTime,
            item.observations,
          ),
      );

      treino.replaceItems(novoItems);
    }

    await this.workoutRepository.update(treino);
    return treino;
  }
}
