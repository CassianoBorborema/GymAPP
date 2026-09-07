import { Exercise } from "../../../domain/entities/Exercise.js";
import type { ExerciseRepository } from "../../../domain/repositories/ExerciseRepository.js";
import type { MuscleGroup } from "../../../domain/entities/Exercise.js";
import { prisma } from "./prisma.js";

type ExerciseRow = {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl: string | null;
  description: string | null;
};

function toDomain(row: ExerciseRow): Exercise {
  return new Exercise(
    row.id,
    row.name,
    row.muscleGroup as MuscleGroup,
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
        muscleGroup: exercise.muscleGroup,
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
        muscleGroup: exercise.muscleGroup,
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
    const exercises = await prisma.exercise.findMany({
      where: { muscleGroup },
    });
    return exercises.map(toDomain);
  }

  async findAll(): Promise<Exercise[]> {
    const exercises = await prisma.exercise.findMany();
    return exercises.map(toDomain);
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
