import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { Aluno } from "../../domain/entities/Aluno.js";
import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { CadastrarAlunoInput } from "../dto/AlunoDTO.js";

export class CreateAluno {
  constructor(private alunoRepository: AlunoRepository) {}

  async execute(input: CadastrarAlunoInput): Promise<Aluno> {
    const emailExistente = await this.alunoRepository.findByEmail(input.email);

    if (emailExistente) {
      throw new Error("Este e-mail já está em uso.");
    }

    const cpfExistente = await this.alunoRepository.findByCPF(input.CPF);

    if (cpfExistente) {
      throw new Error("Este CPF já está cadastrado.");
    }

    const hashed = await bcrypt.hash(input.password, 10);

    const novoAluno = new Aluno(
      crypto.randomUUID(),
      input.name,
      input.email,
      input.weight,
      input.CPF,
      hashed,
    );

    await this.alunoRepository.save(novoAluno);

    return novoAluno;
  }
}
