import { Aluno } from "../../../domain/entities/Aluno.js";
import type { AlunoRepository } from "../../../domain/repositories/AlunoRepository.js";
import { prisma } from "./prisma.js"; // Importando a conexão que criamos

export class PrismaAlunoRepository implements AlunoRepository {
  async save(aluno: Aluno): Promise<void> {
    await prisma.aluno.create({
      data: {
        id: aluno.id,
        name: aluno.name,
        email: aluno.email,
        cpf: aluno.CPF, // No prisma está 'cpf', na sua entidade está 'CPF'
      },
    });
    console.log(`[Prisma DB] Aluno ${aluno.name} salvo no Postgres`);
  }

  async update(aluno: Aluno): Promise<void> {
    await prisma.aluno.update({
      where: { id: aluno.id },
      data: {
        name: aluno.name,
        email: aluno.email,
        cpf: aluno.CPF,
      },
    });
    console.log(`[Prisma DB] Aluno ${aluno.id} atualizado no Postgres`);
  }

  async findByName(name: string): Promise<Aluno[]> {
    const alunos = await prisma.aluno.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    // Convertendo a lista do Prisma em uma lista de Entidades Aluno
    return alunos.map(
      (a) => new Aluno(a.id, a.name, a.email, a.weight, a.cpf, a.password),
    );
  }

  async findByEmail(email: string): Promise<Aluno | null> {
    const a = await prisma.aluno.findUnique({ where: { email } });
    if (!a) return null;
    return new Aluno(a.id, a.name, a.email, a.weight, a.cpf, a.password);
  }

  async findById(id: string): Promise<Aluno | null> {
    const a = await prisma.aluno.findUnique({ where: { id } });
    if (!a) return null;
    return new Aluno(a.id, a.name, a.email, a.weight, a.cpf, a.password);
  }

  async findByCPF(CPF: string): Promise<Aluno | null> {
    const a = await prisma.aluno.findUnique({ where: { cpf: CPF } });
    if (!a) return null;
    return new Aluno(a.id, a.name, a.email, a.weight, a.cpf, a.password);
  }

  async delete(id: string): Promise<void> {
    await prisma.aluno.delete({ where: { id } });
    console.log(`[Prisma DB] Aluno ${id} removido do Postgres`);
  }
}
