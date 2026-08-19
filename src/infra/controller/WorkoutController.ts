import type { FastifyInstance } from "fastify";
import { CreateWorkout } from "../../app/usecases/CreateWorkout.js";
import { DeleteWorkout } from "../../app/usecases/DeleteWorkout.js";
import { GetWorkout } from "../../app/usecases/GetWorkout.js";
import { ListWorkout } from "../../app/usecases/ListWorkout.js";
import { SearchWorkoutByTitle } from "../../app/usecases/SearchWorkoutByTitle.js";
import { UpdateWorkout } from "../../app/usecases/UpdateWorkout.js";
import type { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";
import { toWorkoutOutput } from "../../app/mappers/httpMappers.js";

export async function workoutRoutes(
  app: FastifyInstance,
  opts: { workoutRepository: WorkoutRepository },
) {
  const { workoutRepository } = opts;
  const createWorkout = new CreateWorkout(workoutRepository);
  const getWorkout = new GetWorkout(workoutRepository);
  const listWorkout = new ListWorkout(workoutRepository);
  const updateWorkout = new UpdateWorkout(workoutRepository);
  const deleteWorkout = new DeleteWorkout(workoutRepository);
  const searchWorkoutByTitle = new SearchWorkoutByTitle(workoutRepository);

  app.post("/workouts", async (request, reply) => {
    try {
      const body = request.body as any;
      const workout = await createWorkout.execute(body);
      return reply.code(201).send(toWorkoutOutput(workout));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get("/workouts/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const workout = await getWorkout.execute({ id });
      return reply.send(workout ? toWorkoutOutput(workout) : null);
    } catch (error: any) {
      return reply.code(404).send({ error: error.message });
    }
  });

  app.get("/workouts", async (request, reply) => {
    try {
      const query = request.query as { alunoId?: string; title?: string };
      if (query.title) {
        const workouts = await searchWorkoutByTitle.execute({
          title: query.title,
        });
        return reply.send(workouts.map(toWorkoutOutput));
      } else if (query.alunoId) {
        const workouts = await listWorkout.execute({ alunoId: query.alunoId });
        return reply.send(workouts.map(toWorkoutOutput));
      } else {
        return reply.code(400).send({ error: "alunoId or title required" });
      }
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.patch("/workouts/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = await updateWorkout.execute({ id, ...body });
      return reply.send(toWorkoutOutput(updated));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.delete("/workouts/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await deleteWorkout.execute({ id });
      return reply.code(204).send();
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });
}
