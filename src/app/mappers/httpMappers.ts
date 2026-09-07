import type { Workout } from "../../domain/aggregates/Workout.js";
import type { WorkoutItem } from "../../domain/aggregates/WorkoutItem.js";
import type { Aluno } from "../../domain/entities/Aluno.js";
import type { Exercise } from "../../domain/entities/Exercise.js";
import type { Instructor } from "../../domain/entities/Instructor.js";
import type { AlunoOutput } from "../dto/AlunoDTO.js";
import type { ExerciseOutput } from "../dto/ExerciseDTO.js";
import type { InstructorOutput } from "../dto/InstructorDTO.js";
import type { WorkoutItemOutput, WorkoutOutput } from "../dto/WorkoutDTO.js";

export function toAlunoOutput(aluno: Aluno): AlunoOutput {
  return {
    id: aluno.id,
    name: aluno.name,
    email: aluno.email,
    weight: aluno.weight,
    CPF: aluno.CPF,
  };
}

export function toInstructorOutput(instructor: Instructor): InstructorOutput {
  return {
    id: instructor.id,
    name: instructor.name,
    email: instructor.email,
  };
}

export function toExerciseOutput(exercise: Exercise): ExerciseOutput {
  return {
    id: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    videoUrl: exercise.videoUrl,
    description: exercise.description,
  };
}

export function toWorkoutItemOutput(item: WorkoutItem): WorkoutItemOutput {
  return {
    id: item.id,
    exerciseId: item.exerciseId,
    sets: item.sets,
    reps: item.reps,
    restTime: item.restTime,
    observations: item.observations,
  };
}

export function toWorkoutOutput(workout: Workout): WorkoutOutput {
  return {
    id: workout.id,
    title: workout.title,
    alunoId: workout.alunoId,
    instructorId: workout.instructorId,
    description: workout.description,
    createdAt: workout.createdAt.toISOString(),
    items: workout.getItems().map(toWorkoutItemOutput),
  };
}
