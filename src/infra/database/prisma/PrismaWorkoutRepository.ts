import { Workout } from "../../../domain/aggregates/Workout.js";
import { WorkoutItem } from "../../../domain/aggregates/WorkoutItem.js";
import type { WorkoutRepository } from "../../../domain/repositories/WorkoutRepository.js";
import { prisma } from "./prisma.js";

type WorkoutWithItems = {
  id: string;
  title: string;
  description: string | null;
  alunoId: string;
  instructorId: string;
  createdAt: Date;
  items: {
    id: string;
    exerciseId: string;
    sets: number;
    reps: number;
    restTime?: string | null;
    observations?: string | null;
  }[];
};

function toWorkoutItem(row: WorkoutWithItems["items"][number]): WorkoutItem {
  return new WorkoutItem(
    row.id,
    row.exerciseId,
    row.sets,
    row.reps,
    row.restTime ?? "",
    row.observations ?? undefined,
  );
}

function toDomain(row: WorkoutWithItems): Workout {
  return new Workout(
    row.id,
    row.alunoId,
    row.instructorId,
    row.title,
    row.description ?? undefined,
    row.items.map(toWorkoutItem),
    row.createdAt,
  );
}

const includeItems = { items: true } as const;

function itemsCreateData(workout: Workout) {
  return workout.getItems().map((item) => ({
    id: item.id,
    exerciseId: item.exerciseId,
    sets: item.sets,
    reps: item.reps,
    restTime: item.restTime,
    observations: item.observations,
  })) as any;
}

export class PrismaWorkoutRepository implements WorkoutRepository {
  async save(workout: Workout): Promise<void> {
    await prisma.workout.create({
      data: {
        id: workout.id,
        title: workout.title,
        ...(workout.description === undefined
          ? {}
          : { description: workout.description }),
        alunoId: workout.alunoId,
        instructorId: workout.instructorId,
        createdAt: workout.createdAt,
        items: {
          create: itemsCreateData(workout),
        },
      },
    });
  }

  async update(workout: Workout): Promise<void> {
    await prisma.$transaction([
      prisma.workoutItem.deleteMany({ where: { workoutId: workout.id } }),
      prisma.workout.update({
        where: { id: workout.id },
        data: {
          title: workout.title,
          ...(workout.description === undefined
            ? {}
            : { description: workout.description }),
          alunoId: workout.alunoId,
          instructorId: workout.instructorId,
          items: {
            create: itemsCreateData(workout),
          },
        },
      }),
    ]);
  }

  async findById(id: string): Promise<Workout | null> {
    const row = await prisma.workout.findUnique({
      where: { id },
      include: includeItems,
    });
    return row ? toDomain(row) : null;
  }

  async findByAlunoId(alunoId: string): Promise<Workout[]> {
    const rows = await prisma.workout.findMany({
      where: { alunoId },
      include: includeItems,
    });
    return rows.map(toDomain);
  }

  async findByInstructorId(instructorId: string): Promise<Workout[]> {
    const rows = await prisma.workout.findMany({
      where: { instructorId },
      include: includeItems,
    });
    return rows.map(toDomain);
  }

  async findByTitle(title: string): Promise<Workout[]> {
    const rows = await prisma.workout.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      include: includeItems,
    });
    return rows.map(toDomain);
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.workoutItem.deleteMany({ where: { workoutId: id } }),
      prisma.workout.delete({ where: { id } }),
    ]);
  }
}
