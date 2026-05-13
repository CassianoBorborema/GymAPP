import { Exercise } from "../../../domain/entities/Exercise.js";
import type { ExerciseRepository } from "../../../domain/repositories/ExerciseRepository.js";
import type { MuscleGroup } from "../../../domain/entities/Exercise.js";

export class InMemoryExerciseRepository implements ExerciseRepository {
  private exercises: Exercise[] = [];

  async save(exercise: Exercise): Promise<void> {
    this.exercises.push(exercise);
    console.log(`[InMemory DB] Exercício ${exercise.name} salvo com sucesso`);
  }

  async update(exercise: Exercise): Promise<void> {
    const index = this.exercises.findIndex((e) => e.id === exercise.id);
    if (index === -1) {
      throw new Error("Exercício não encontrado para atualização.");
    }
    this.exercises[index] = exercise;
    console.log(`[InMemory DB] Exercício ${exercise.id} atualizado com sucesso`);
  }

  async findByName(name: string): Promise<Exercise[]> {
    return this.exercises.filter((e) =>
      e.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  async findByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]> {
    return this.exercises.filter((e) => e.muscleGroup === muscleGroup);
  }

  async findById(id: string): Promise<Exercise | null> {
    return this.exercises.find((e) => e.id === id) || null;
  }
}