import type { FastifyInstance } from "fastify";
import { CreateInstructor } from "../../app/usecases/CreateInstructor.js";
import { GetInstructor } from "../../app/usecases/GetInstructor.js";
import { UpdateInstructor } from "../../app/usecases/UpdateInstructor.js";
import { InMemoryInstructorRepository } from "../database/InMemory/InMemoryInstructorRepository.js";

export async function instructorRoutes(app: FastifyInstance) {
  const instructorRepository = new InMemoryInstructorRepository();
  const createInstructor = new CreateInstructor(instructorRepository);
  const getInstructor = new GetInstructor(instructorRepository);
  const updateInstructor = new UpdateInstructor(instructorRepository);

  app.post("/instructors", async (request, reply) => {
    try {
      const body = request.body as any;
      const instructor = await createInstructor.execute(body);
      return reply.code(201).send(instructor);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get("/instructors/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const instructor = await getInstructor.execute({ id });
      return reply.send(instructor);
    } catch (error: any) {
      return reply.code(404).send({ error: error.message });
    }
  });

  app.patch("/instructors/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = await updateInstructor.execute({ id, ...body });
      return reply.send(updated);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });
}
