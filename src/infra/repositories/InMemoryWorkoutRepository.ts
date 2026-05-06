import { Workout } from "../../domain/aggregates/Workout.js";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";

export class InMemoryWorkoutRepository implements WorkoutRepository {
  private workouts: Workout[] = [];

  async save(workout: Workout): Promise<void> {
    this.workouts.push(workout);
    console.log(`[InMemory DB] Treino ${workout.title} salvo com sucesso`);
  }

  async findById(id: string): Promise<Workout | null> {
    return this.workouts.find((w) => w.id === id) || null;
  }

  async findByAlunoId(alunoId: string): Promise<Workout[]> {
    return this.workouts.filter((w) => w.alunoid === alunoId);
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