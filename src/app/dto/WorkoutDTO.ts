

export interface WorkoutInput{
    alunoId: string;
    title: string;
    instructorId: string;
    items: {
        exerciseId: string;
        sets: number;
        reps: number;
        restTime:number;
        observations?:string;
    }[];

}