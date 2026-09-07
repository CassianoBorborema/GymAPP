export interface CreateWorkoutInput {
  title: string;
  alunoId: string;
  instructorId: string;
  items: {
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: number;
    observations?: string;
  }[];
}

export interface ListWorkoutsInput {
  alunoId: string;
}

export interface SearchWorkoutByTitleInput {
  title: string;
}

export interface DeleteWorkoutInput {
  id: string;
}

export interface UpdateWorkoutInput {
  id: string;
  title?: string;
  items?: {
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: number;
    observations?: string;
  }[];
}

export interface WorkoutIdInput {
  id: string;
}

export interface WorkoutItemOutput {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  restTime: number | undefined;
  observations: string | undefined;
}

export interface WorkoutOutput {
  id: string;
  title: string;
  alunoId: string;
  instructorId: string;
  createdAt: string;
  items: WorkoutItemOutput[];
}
