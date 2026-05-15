import type { FastifyInstance } from "fastify";
// Importe seus Use Cases e o Repositório aqui
import { CreateAluno } from "../../app/usecases/CreateAluno.js";
import { GetAluno } from "../../app/usecases/GetAluno.js";
import { UpdateAluno } from "../../app/usecases/UpdateAluno.js";
import { SearchAluno } from "../../app/usecases/SearchAluno.js";
import { InMemoryAlunoRepository } from "../database/InMemory/InMemoryAlunoRepository.js";

export async function alunoRoutes(app: FastifyInstance) {
  // Instanciamos o que o Aluno precisa aqui dentro
  const alunoRepository = new InMemoryAlunoRepository();
  const createAluno = new CreateAluno(alunoRepository);
  const getAluno = new GetAluno(alunoRepository);
  const updateAluno = new UpdateAluno(alunoRepository);
  const searchAluno = new SearchAluno(alunoRepository);

  // --- Rota POST ---
  app.post("/alunos", async (request, reply) => {
    try {
      const body = request.body as any;
      const aluno = await createAluno.execute(body);
      return reply.code(201).send(aluno);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  // --- Rota GET (ID) ---
  app.get("/alunos/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const aluno = await getAluno.execute({ id });
      return reply.send(aluno);
    } catch (error: any) {
      return reply.code(404).send({ error: error.message });
    }
  });

  // --- Rota PATCH ---
  app.patch("/alunos/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = await updateAluno.execute({ id, ...body });
      return reply.send(updated);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  // --- Rota GET (Busca) ---
  app.get("/alunos", async (request, reply) => {
    try {
      const query = request.query as { cpf?: string; email?: string };
      const alunos = await searchAluno.execute(query);
      return reply.send(alunos);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });
}
