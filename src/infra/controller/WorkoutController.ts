import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/auth.js";
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

  app.post("/workouts", { preHandler: verifyJWT }, async (request, reply) => {
    try {
      const user = (request as any).user;
      if (!user || user.role !== "instructor") {
        return reply.code(403).send({ error: "Forbidden" });
      }
      const body = request.body as any;
      const workout = await createWorkout.execute({
        ...body,
        instructorId: user.id,
      });
      return reply.code(201).send(toWorkoutOutput(workout));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get("/workouts/:id", { preHandler: verifyJWT }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const user = (request as any).user;
      const workout = await getWorkout.execute({ id });
      const canRead =
        user &&
        (user.role === "instructor"
          ? workout.instructorId === user.id
          : workout.alunoId === user.id);
      if (!canRead) {
        return reply.code(403).send({ error: "Forbidden" });
      }
      return reply.send(toWorkoutOutput(workout));
    } catch (error: any) {
      return reply.code(404).send({ error: error.message });
    }
  });

  app.get("/workouts", { preHandler: verifyJWT }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const query = request.query as {
        alunoId?: string;
        title?: string;
        instructorId?: string;
      };

      if (user?.role === "aluno") {
        const workouts = await listWorkout.execute({ alunoId: user.id });
        return reply.send(workouts.map(toWorkoutOutput));
      }

      if (!user || user.role !== "instructor") {
        return reply.code(403).send({ error: "Forbidden" });
      }

      if (query.title) {
        const workouts = await searchWorkoutByTitle.execute({
          title: query.title,
        });
        return reply.send(
          workouts
            .filter((w) => w.instructorId === user.id)
            .map(toWorkoutOutput),
        );
      }

      if (query.alunoId) {
        const workouts = await listWorkout.execute({ alunoId: query.alunoId });
        return reply.send(
          workouts
            .filter((w) => w.instructorId === user.id)
            .map(toWorkoutOutput),
        );
      }

      const workouts = await workoutRepository.findByInstructorId(user.id);
      return reply.send(workouts.map(toWorkoutOutput));
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.patch(
    "/workouts/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const user = (request as any).user;
        if (!user || user.role !== "instructor") {
          return reply.code(403).send({ error: "Forbidden" });
        }
        const existing = await getWorkout.execute({ id });
        if (existing.instructorId !== user.id) {
          return reply.code(403).send({ error: "Forbidden" });
        }
        const body = request.body as any;
        const updated = await updateWorkout.execute({ id, ...body });
        return reply.send(toWorkoutOutput(updated));
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    },
  );

  app.delete(
    "/workouts/:id",
    { preHandler: verifyJWT },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const user = (request as any).user;
        if (!user || user.role !== "instructor") {
          return reply.code(403).send({ error: "Forbidden" });
        }
        const existing = await getWorkout.execute({ id });
        if (existing.instructorId !== user.id) {
          return reply.code(403).send({ error: "Forbidden" });
        }
        await deleteWorkout.execute({ id });
        return reply.code(204).send();
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    },
  );
}
