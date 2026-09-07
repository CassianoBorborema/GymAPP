import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/auth.js";
import { CreateInstructor } from "../../app/usecases/CreateInstructor.js";
import { GetInstructor } from "../../app/usecases/GetInstructor.js";
import { UpdateInstructor } from "../../app/usecases/UpdateInstructor.js";
import { DeleteInstructor } from "../../app/usecases/DeleteInstructor.js";
import type { InstructorRepository } from "../../domain/repositories/InstructorRepository.js";
import { toInstructorOutput } from "../../app/mappers/httpMappers.js";

export async function instructorRoutes(
  app: FastifyInstance,
  opts: { instructorRepository: InstructorRepository },
) {
  const { instructorRepository } = opts;
  const createInstructor = new CreateInstructor(instructorRepository);
  const getInstructor = new GetInstructor(instructorRepository);
  const updateInstructor = new UpdateInstructor(instructorRepository);
  const deleteInstructor = new DeleteInstructor(instructorRepository);

  app.post("/instructors", async (request, reply) => {
    try {
      const body = request.body as any;
      const instructor = await createInstructor.execute(body);
      return reply.code(201).send(toInstructorOutput(instructor));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get(
    "/instructors/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const user = (request as any).user;
        if (!user || (user.id !== id && user.role !== "instructor")) {
          return reply.code(403).send({ error: "Forbidden" });
        }
        const instructor = await getInstructor.execute({ id });
        return reply.send(toInstructorOutput(instructor));
      } catch (error: any) {
        return reply.code(404).send({ error: error.message });
      }
    },
  );

  app.patch(
    "/instructors/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const body = request.body as any;
        const user = (request as any).user;
        if (!user || user.id !== id || user.role !== "instructor") {
          return reply.code(403).send({ error: "Forbidden" });
        }
        const updated = await updateInstructor.execute({ id, ...body });
        return reply.send(toInstructorOutput(updated));
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    },
  );

  app.delete(
    "/instructors/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const user = (request as any).user;
        if (!user || user.id !== id || user.role !== "instructor") {
          return reply.code(403).send({ error: "Forbidden" });
        }
        await deleteInstructor.execute({ id });
        return reply.code(204).send();
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    },
  );
}
