import crypto from "node:crypto";
import { Instructor } from "../../domain/entities/Instructor.js";
import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";
import type { InstructorInputDTO } from "../dto/InstructorDTO.js";

export class CreateInstructor {
  constructor(private instructorRepository: InstructorRepository) {}

  async execute(input: InstructorInputDTO): Promise<Instructor> {
    const emailExistente = await this.instructorRepository.findByEmail(
      input.email,
    );

    if (emailExistente) {
      throw new Error("Este e-mail já está cadastrado para um instrutor.");
    }

    const novoInstrutor = new Instructor(
      crypto.randomUUID(),
      input.name,
      input.email,
      input.password,
    );

    await this.instructorRepository.save(novoInstrutor);

    return novoInstrutor;
  }
}
