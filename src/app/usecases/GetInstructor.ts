import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";
import type { InstructorIdInput } from "../dto/InstructorDTO.js";
import { Instructor } from "../../domain/entities/Instructor.js";

export class GetInstructor {
  constructor(private instructorRepository: InstructorRepository) {}

  async execute(input: InstructorIdInput): Promise<Instructor> {
    const instructor = await this.instructorRepository.findById(input.id);
    if (!instructor) {
      throw new Error("Instrutor não encontrado.");
    }
    return instructor;
  }
}
