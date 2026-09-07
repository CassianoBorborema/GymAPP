import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
  }): Promise<{ token: string; id: string; role: "instructor" | "aluno"; name: string }> {
    const { email, password } = input;
    const secret = process.env.JWT_SECRET ?? "dev-secret";

    const instructor = await this.instructorRepository.findByEmail(email);
    if (instructor) {
      const match = await bcrypt.compare(password, instructor.getPassword());
      if (match) {
        const token = jwt.sign(
          { sub: instructor.id, role: "instructor" },
          secret,
          { expiresIn: "7d" },
        );
        return {
          token,
          id: instructor.id,
          role: "instructor",
          name: instructor.name,
        };
      }
    }

    const aluno = await this.alunoRepository.findByEmail(email);
    if (aluno) {
      const match = await bcrypt.compare(password, aluno.getPassword());
      if (match) {
        const token = jwt.sign(
          { sub: aluno.id, role: "aluno" },
          secret,
          { expiresIn: "7d" },
        );
        return { token, id: aluno.id, role: "aluno", name: aluno.name };
      }
    }

    throw new Error("Invalid credentials");
  }
}
