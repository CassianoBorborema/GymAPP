import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { AlunoIdInput } from "../dto/AlunoDTO.js";
import { Aluno } from "../../domain/entities/Aluno.js";

export class GetAluno {
  constructor(private alunoRepository: AlunoRepository) {}

  async execute(input: AlunoIdInput): Promise<Aluno> {
    const aluno = await this.alunoRepository.findById(input.id);

    if (!aluno) {
      throw new Error("Aluno não encontrado.");
    }

    return aluno;
  }
}
