export type Role = "instructor" | "aluno";

export type Session = {
  token: string;
  id: string;
  role: Role;
  name: string;
};

export type Aluno = {
  id: string;
  name: string;
  email: string;
  weight: number;
  CPF: string;
};

export type Instructor = {
  id: string;
  name: string;
  email: string;
};

export type MuscleGroup = "Peito" | "Costas" | "Pernas" | "Ombros" | "Braços";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  videoUrl?: string;
  description?: string;
};

export type WorkoutItem = {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  restTime?: string;
  observations?: string;
};

export type Workout = {
  id: string;
  title: string;
  description?: string;
  alunoId: string;
  instructorId: string;
  createdAt: string;
  items: WorkoutItem[];
};

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Braços",
];
