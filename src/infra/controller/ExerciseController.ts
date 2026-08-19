import type { FastifyInstance } from "fastify";
import { CreateExercise } from "../../app/usecases/CreateExercise.js";
import { UpdateExercise } from "../../app/usecases/UpdateExercise.js";
import { GetExercise } from "../../app/usecases/GetExercise.js";
import { SearchExercise } from "../../app/usecases/SearchExercise.js";
import { DeleteExercise } from "../../app/usecases/DeleteExercise.js";
import type { ExerciseRepository } from "../../domain/repositories/ExerciseRepository.js";

export async function exerciseRoutes(
  app: FastifyInstance,
  opts: { exerciseRepository: ExerciseRepository },
) {
  const { exerciseRepository } = opts;

  const createExercise = new CreateExercise(exerciseRepository);
  const updateExercise = new UpdateExercise(exerciseRepository);
  const getExercise = new GetExercise(exerciseRepository);
  const searchExercise = new SearchExercise(exerciseRepository);
  const deleteExercise = new DeleteExercise(exerciseRepository);

  app.post("/exercises", async (request, reply) => {
    try {
      const body = request.body as any;
      const exercise = await createExercise.execute(body);
      return reply.code(201).send(exercise);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get("/exercises/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const exercise = await getExercise.execute({ id });
      return reply.send(exercise);
    } catch (error: any) {
      return reply.code(404).send({ error: error.message });
    }
  });

  app.get("/exercises", async (request, reply) => {
    try {
      const query = request.query as { name?: string; muscleGroup?: any };
      const exercises = await searchExercise.execute(query);
      return reply.send(exercises);
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

  app.delete("/exercises/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await deleteExercise.execute({ id });
      return reply.code(204).send();
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });
}
