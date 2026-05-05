import { Aluno } from "../../domain/entities/Aluno";
import { AlunoRepository } from "../../domain/repositories/AlunoRepository";
import { CadastrarAlunoInput } from "../dto/AlunoDTO";

export class CadastrarAluno {
  constructor(private alunoRepository: AlunoRepository) {}

  async execute(input: CadastrarAlunoInput): Promise<void> {
    const emailExistente = await this.alunoRepository.findByEmail(input.email);

    if (emailExistente) {
      throw new Error("Este e-mail já está em uso.");
    }

    const cpfExistente = await this.alunoRepository.findByCPF(input.CPF);

    if (cpfExistente) {
      throw new Error("Este CPF já está cadastrado.");
    }

    const novoAluno = new Aluno(
      crypto.randomUUID(),
      input.name,
      input.email,
      input.weight,
      input.CPF,
      input.password,
    );

    await this.alunoRepository.save(novoAluno);
  }
}
