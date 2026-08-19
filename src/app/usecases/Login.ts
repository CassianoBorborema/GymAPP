import jwt from "jsonwebtoken";
import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";

export class Login {
  constructor(
    private alunoRepository: AlunoRepository,
    private instructorRepository: InstructorRepository,
  ) {}

  async execute(input: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    const { email, password } = input;

    const instructor = await this.instructorRepository.findByEmail(email);
    if (instructor && instructor.password === password) {
      const token = jwt.sign(
        { sub: instructor.id, role: "instructor" },
        process.env.JWT_SECRET ?? "dev-secret",
        { expiresIn: "7d" },
      );
      return { token };
    }

    const aluno = await this.alunoRepository.findByEmail(email);
    if (aluno && aluno.password === password) {
      const token = jwt.sign(
        { sub: aluno.id, role: "aluno" },
        process.env.JWT_SECRET ?? "dev-secret",
        { expiresIn: "7d" },
      );
      return { token };
    }

    throw new Error("Invalid credentials");
  }
}
