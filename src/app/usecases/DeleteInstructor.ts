import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";
import type { InstructorIdInput } from "../dto/InstructorDTO.js";

export class DeleteInstructor {
  constructor(private instructorRepository: InstructorRepository) {}

  async execute(input: InstructorIdInput): Promise<void> {
    const instructor = await this.instructorRepository.findById(input.id);
    if (!instructor) {
      throw new Error("Instrutor não encontrado para deleção.");
    }
    await this.instructorRepository.delete(input.id);
  }
}
