import type { Aluno } from "../../domain/entities/Aluno.js";
import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { BuscarAlunoInput } from "../dto/AlunoDTO.js";

export class SearchAluno {
  constructor(private alunoRepository: AlunoRepository) {}

  async execute(input: BuscarAlunoInput): Promise<Aluno[]> {
    if (!input.CPF && !input.email) {
      return this.alunoRepository.findAll();
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
