import { Aluno } from "../../domain/entities/Aluno.js";
import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";

export class InMemoryAlunoRepository implements AlunoRepository {
  private alunos: Aluno[] = [];

  async save(aluno: Aluno): Promise<void> {
    this.alunos.push(aluno);
    console.log(`[InMemory DB] Aluno ${aluno.name} salvo com sucesso`);
  }

  async findByName(name: string): Promise<Aluno[]> {
    return this.alunos.filter((a) =>
      a.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  async findByEmail(email: string): Promise<Aluno | null> {
    return this.alunos.find((a) => a.email === email) || null;
  }

  async findById(id: string): Promise<Aluno | null> {
    return this.alunos.find((a) => a.id === id) || null;
  }

  async findByCPF(CPF: string): Promise<Aluno | null> {
    return this.alunos.find((a) => a.CPF === CPF) || null;
  }

  async delete(id: string): Promise<void> {
    this.alunos = this.alunos.filter((a) => a.id !== id);
    console.log(`[InMemory DB] Aluno ${id} removido`);
  }
}