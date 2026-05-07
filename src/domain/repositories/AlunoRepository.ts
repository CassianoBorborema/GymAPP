import { Aluno } from "../entities/Aluno.js";

export interface AlunoRepository {
  save(aluno: Aluno): Promise<void>;

  findByName(name: string): Promise<Aluno[]>;

  findByEmail(email: string): Promise<Aluno | null>;

  findById(id: string): Promise<Aluno | null>;

  findByCPF(CPF: string): Promise<Aluno | null>;

  delete(id: string): Promise<void>; 
}
