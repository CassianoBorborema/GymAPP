import type { FastifyInstance } from "fastify";
import { CreateExercise } from "../../app/usecases/CreateExercise.js";
import { UpdateExercise } from "../../app/usecases/UpdateExercise.js";
import { InMemoryExerciseRepository } from "../database/InMemory/InMemoryExerciseRepository.js";

export async function exerciseRoutes(app: FastifyInstance) {
  const exerciseRepository = new InMemoryExerciseRepository();
  const createExercise = new CreateExercise(exerciseRepository);
  const updateExercise = new UpdateExercise(exerciseRepository);

  app.post("/exercises", async (request, reply) => {
    try {
      const body = request.body as any;
      const exercise = await createExercise.execute(body);
      return reply.code(201).send(exercise);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.patch("/exercises/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = await updateExercise.execute({ id, ...body });
      return reply.send(updated);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });
}
