import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";
import type { UpdateInstructorInput } from "../dto/InstructorDTO.js";
import { Instructor } from "../../domain/entities/Instructor.js";

export class UpdateInstructor {
  constructor(private instructorRepository: InstructorRepository) {}

  async execute(input: UpdateInstructorInput): Promise<Instructor> {
    const instructor = await this.instructorRepository.findById(input.id);
    if (!instructor) {
      throw new Error("Instrutor não encontrado para atualização.");
    }

    if (input.email && input.email !== instructor.email) {
      const emailExistente = await this.instructorRepository.findByEmail(
        input.email,
      );
      if (emailExistente && emailExistente.id !== instructor.id) {
        throw new Error("Este e-mail já está em uso por outro instrutor.");
      }
      instructor.email = input.email;
    }

    if (input.name) {
      instructor.name = input.name;
    }

    if (input.password) {
      const bcrypt = await import("bcryptjs");
      const hashed = await bcrypt.hash(input.password, 10);
      instructor.setPassword(hashed);
    }

    await this.instructorRepository.update(instructor);
    return instructor;
  }
}
