import { Instructor } from "../../../domain/entities/Instructor.js";
import type { InstructorRepository } from "../../../domain/repositories/InstructorRepository.js";
import { prisma } from "./prisma.js";

type InstructorRow = {
  id: string;
  name: string;
  email: string;
  password: string;
};

function toDomain(row: InstructorRow): Instructor {
  return new Instructor(row.id, row.name, row.email, row.password);
}

export class PrismaInstructorRepository implements InstructorRepository {
  async save(instructor: Instructor): Promise<void> {
    await prisma.instructor.create({
      data: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        password: instructor.getPassword(),
      },
    });
  }

  async update(instructor: Instructor): Promise<void> {
    await prisma.instructor.update({
      where: { id: instructor.id },
      data: {
        name: instructor.name,
        email: instructor.email,
        password: instructor.getPassword(),
      },
    });
  }

  async findById(id: string): Promise<Instructor | null> {
    const row = await prisma.instructor.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    const row = await prisma.instructor.findUnique({ where: { email } });
    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<Instructor[]> {
    const rows = await prisma.instructor.findMany();
    return rows.map(toDomain);
  }

  async delete(id: string): Promise<void> {
    await prisma.instructor.delete({ where: { id } });
  }
}
