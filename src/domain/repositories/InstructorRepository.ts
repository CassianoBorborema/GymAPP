import { Instructor } from "../entities/Instructor.js";

export interface InstructorRepository {
  save(instructor: Instructor): Promise<void>;

  findById(id: string): Promise<Instructor | null>;

  findByEmail(email: string): Promise<Instructor | null>;

  findAll(): Promise<Instructor[]>;

  delete(id: string): Promise<void>;
}