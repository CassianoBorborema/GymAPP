import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { UpdateAlunoInput } from "../dto/AlunoDTO.js";
import { Aluno } from "../../domain/entities/Aluno.js";

export class UpdateAluno {
  constructor(private alunoRepository: AlunoRepository) {}

  async execute(input: UpdateAlunoInput): Promise<Aluno> {
    const aluno = await this.alunoRepository.findById(input.id);
    if (!aluno) {
      throw new Error("Aluno não encontrado para atualização.");
    }

    if (input.email && input.email !== aluno.email) {
      const emailExistente = await this.alunoRepository.findByEmail(input.email);
      if (emailExistente && emailExistente.id !== aluno.id) {
        throw new Error("Este e-mail já está em uso por outro aluno.");
      }
      aluno.email = input.email;
    }

    if (input.name) {
      aluno.name = input.name;
    }

    if (input.weight !== undefined) {
      aluno.weight = input.weight;
    }

    if (input.password) {
      aluno.setPassword(input.password);
    }

    await this.alunoRepository.update(aluno);
    return aluno;
  }
}
