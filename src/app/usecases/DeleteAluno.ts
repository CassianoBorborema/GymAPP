import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import type { AlunoIdInput } from "../dto/AlunoDTO.js";

export class DeleteAluno {
  constructor(
    private alunoRepository: AlunoRepository,
    private workoutRepository: WorkoutRepository
  ) {}

  async execute(input: AlunoIdInput): Promise<void> {
    const alunoExists = await this.alunoRepository.findById(input.id);
    if (!alunoExists) {
      throw new Error("Aluno não encontrado para deleção.");
    }

    const treinos = await this.workoutRepository.findByAlunoId(input.id);
    for (const treino of treinos) {
      await this.workoutRepository.delete(treino.id);
    }

    await this.alunoRepository.delete(input.id);
  }
}