import { Instructor } from "../../domain/entities/Instructor.js";
import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";

export class InMemoryInstructorRepository implements InstructorRepository {
  private instructors: Instructor[] = [];

  async save(instructor: Instructor): Promise<void> {
    this.instructors.push(instructor);
    console.log(`[InMemory DB] Instrutor ${instructor.name} salvo com sucesso`);
  }

  async findById(id: string): Promise<Instructor | null> {
    return this.instructors.find((i) => i.id === id) || null;
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    return this.instructors.find((i) => i.email === email) || null;
  }

  async findAll(): Promise<Instructor[]> {
    return this.instructors;
  }

  async delete(id: string): Promise<void> {
    this.instructors = this.instructors.filter((i) => i.id !== id);
    console.log(`[InMemory DB] Instrutor ${id} removido`);
  }
}