import { Workout } from "../../domain/aggregates/Workout.js";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";

export class InMemoryWorkoutRepository implements WorkoutRepository {
  private workouts: Workout[] = [];

  async save(workout: Workout): Promise<void> {
    this.workouts.push(workout);
    console.log(`[InMemory DB] Treino ${workout.title} salvo com sucesso`);
  }

  async update(workout: Workout): Promise<void> {
    const index = this.workouts.findIndex((w) => w.id === workout.id);
    if (index === -1) {
      throw new Error("Treino não encontrado para atualização.");
    }
    this.workouts[index] = workout;
    console.log(`[InMemory DB] Treino ${workout.id} atualizado com sucesso`);
  }

  async findById(id: string): Promise<Workout | null> {
    return this.workouts.find((w) => w.id === id) || null;
  }

  async findByAlunoId(alunoId: string): Promise<Workout[]> {
    return this.workouts.filter((w) => w.alunoId === alunoId);
  }

  async delete(id: string): Promise<void> {
    this.workouts = this.workouts.filter((w) => w.id !== id);
    console.log(`[InMemory DB] Treino ${id} removido`);
  }

  async findByTitle(title: string): Promise<Workout[]> {
    return this.workouts.filter((w) =>
      w.title.toLowerCase().includes(title.toLowerCase()),
    );
  }
}