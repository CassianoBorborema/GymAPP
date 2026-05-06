import { Workout } from "../aggregates/Workout.js";
export interface WorkoutRepository{

    save(workout: Workout): Promise<void>;

    findById(id:string): Promise<Workout | null>;

    findByAlunoId(alunoId: string):Promise<Workout[]>

    findByTitle(title: string): Promise<Workout[]>;
    
    delete(id: string): Promise<void>;

}