import type { FastifyInstance } from "fastify";
import { Login } from "../../app/usecases/Login.js";
import type { AlunoRepository } from "../../domain/repositories/AlunoRepository.js";
import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";

export async function authRoutes(
  app: FastifyInstance,
  opts: {
    alunoRepository: AlunoRepository;
    instructorRepository: InstructorRepository;
  },
) {
  const { alunoRepository, instructorRepository } = opts;
  const login = new Login(alunoRepository, instructorRepository);

  app.post("/login", async (request, reply) => {
    try {
      const body = request.body as { email: string; password: string };
      const result = await login.execute(body);
      return reply.send(result);
    } catch (error: any) {
      return reply.code(401).send({ error: error.message });
    }
  });
}
