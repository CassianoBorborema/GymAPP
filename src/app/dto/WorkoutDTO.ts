export interface CreateWorkoutInput {
  title: string;
  description?: string;
  alunoId: string;
  instructorId: string;
  items: {
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: string;
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
  description?: string;
  items?: {
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: string;
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
  restTime: string | undefined;
  observations: string | undefined;
}

export interface WorkoutOutput {
  id: string;
  title: string;
  description: string | undefined;
  alunoId: string;
  instructorId: string;
  createdAt: string;
  items: WorkoutItemOutput[];
}
