import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/auth.js";
import { CreateAluno } from "../../app/usecases/CreateAluno.js";
import { DeleteAluno } from "../../app/usecases/DeleteAluno.js";
import { GetAluno } from "../../app/usecases/GetAluno.js";
import { UpdateAluno } from "../../app/usecases/UpdateAluno.js";
import { SearchAluno } from "../../app/usecases/SearchAluno.js";
import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import { toAlunoOutput } from "../../app/mappers/httpMappers.js";

export async function alunoRoutes(
  app: FastifyInstance,
  opts: {
    alunoRepository: AlunoRepository;
    workoutRepository: WorkoutRepository;
  },
) {
  const { alunoRepository, workoutRepository } = opts;
  const createAluno = new CreateAluno(alunoRepository);
  const getAluno = new GetAluno(alunoRepository);
  const updateAluno = new UpdateAluno(alunoRepository);
  const searchAluno = new SearchAluno(alunoRepository);
  const deleteAluno = new DeleteAluno(alunoRepository, workoutRepository);

  app.post("/alunos", { preHandler: verifyJWT }, async (request, reply) => {
    try {
      const user = (request as any).user;
      if (!user || user.role !== "instructor") {
        return reply.code(403).send({ error: "Forbidden" });
      }
      const body = request.body as any;
      const aluno = await createAluno.execute(body);
      return reply.code(201).send(toAlunoOutput(aluno));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get("/alunos/:id", { preHandler: verifyJWT }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const user = (request as any).user;
      if (!user || (user.id !== id && user.role !== "instructor")) {
        return reply.code(403).send({ error: "Forbidden" });
      }
      const aluno = await getAluno.execute({ id });
      return reply.send(toAlunoOutput(aluno));
    } catch (error: any) {
      return reply.code(404).send({ error: error.message });
    }
  });

  app.patch(
    "/alunos/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const body = request.body as any;
        const user = (request as any).user;
        if (!user || (user.id !== id && user.role !== "instructor")) {
          return reply.code(403).send({ error: "Forbidden" });
        }
        const updated = await updateAluno.execute({ id, ...body });
        return reply.send(toAlunoOutput(updated));
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    },
  );

  app.get("/alunos", { preHandler: verifyJWT }, async (request, reply) => {
    try {
      const user = (request as any).user;
      if (!user || user.role !== "instructor") {
        return reply.code(403).send({ error: "Forbidden" });
      }
      const query = request.query as { cpf?: string; CPF?: string; email?: string };
      const alunos = await searchAluno.execute({
        ...(query.CPF ?? query.cpf ? { CPF: query.CPF ?? query.cpf } : {}),
        ...(query.email ? { email: query.email } : {}),
      });
      return reply.send(alunos.map(toAlunoOutput));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.delete(
    "/alunos/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const user = (request as any).user;
        if (!user || user.role !== "instructor") {
          return reply.code(403).send({ error: "Forbidden" });
        }
        await deleteAluno.execute({ id });
        return reply.code(204).send();
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    },
  );
}
