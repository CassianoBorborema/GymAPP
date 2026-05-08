import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { BuscarAlunoInput } from "../dto/AlunoDTO.js";
import { Aluno } from "../../domain/entities/Aluno.js";

export class SearchAluno {
  constructor(private alunoRepository: AlunoRepository) {}

  async execute(input: BuscarAlunoInput): Promise<Aluno[]> {
    if (!input.CPF && !input.email) {
      throw new Error("Informe CPF ou e-mail para buscar o aluno.");
    }

    if (input.CPF && input.email) {
      const alunoPorCPF = await this.alunoRepository.findByCPF(input.CPF);
      if (!alunoPorCPF) {
        return [];
      }
      return alunoPorCPF.email === input.email ? [alunoPorCPF] : [];
    }

    if (input.CPF) {
      const aluno = await this.alunoRepository.findByCPF(input.CPF);
      return aluno ? [aluno] : [];
    }

    const alunoPorEmail = await this.alunoRepository.findByEmail(input.email!);
    return alunoPorEmail ? [alunoPorEmail] : [];
  }
}
