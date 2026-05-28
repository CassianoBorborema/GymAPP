import { Exercise } from "../../../domain/entities/Exercise.js";
import type { ExerciseRepository } from "../../../domain/repositories/ExerciseRepository.js";
import type { MuscleGroup } from "../../../domain/entities/Exercise.js";
import { prisma } from "./prisma.js";

const DEFAULT_MUSCLE_GROUP: MuscleGroup = "Peito";

type ExerciseRow = {
  id: string;
  name: string;
  videoUrl: string | null;
  description: string | null;
};

function toDomain(row: ExerciseRow): Exercise {
  return new Exercise(
    row.id,
    row.name,
    DEFAULT_MUSCLE_GROUP,
    row.videoUrl ?? undefined,
    row.description ?? undefined,
  );
}

export class PrismaExerciseRepository implements ExerciseRepository {
  async save(exercise: Exercise): Promise<void> {
    await prisma.exercise.create({
      data: {
        id: exercise.id,
        name: exercise.name,
        videoUrl: exercise.videoUrl ?? null,
        description: exercise.description ?? null,
      },
    });
  }

  async update(exercise: Exercise): Promise<void> {
    await prisma.exercise.update({
      where: { id: exercise.id },
      data: {
        name: exercise.name,
        videoUrl: exercise.videoUrl ?? null,
        description: exercise.description ?? null,
      },
    });
  }

  async findByName(name: string): Promise<Exercise[]> {
    const exercises = await prisma.exercise.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
    });
    return exercises.map(toDomain);
  }

  async findByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]> {
    const all = await this.findByName("");
    return all.filter((e) => e.muscleGroup === muscleGroup);
  }

  async findById(id: string): Promise<Exercise | null> {
    const row = await prisma.exercise.findUnique({
      where: { id },
    });
    return row ? toDomain(row) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.exercise.delete({
      where: { id },
    });
  }
}
