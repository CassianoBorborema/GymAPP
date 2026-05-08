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