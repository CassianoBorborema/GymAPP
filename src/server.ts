//Importando Repositórios Infra
import {InMemoryAlunoRepository} from "./infra/repositories/InMemoryAlunoRepository.js";
import {InMemoryInstructorRepository} from "./infra/repositories/InMemoryInstructorRepository.js";
import {InMemoryExerciseRepository} from "./infra/repositories/InMemoryExerciseRepository.js";
import {InMemoryWorkoutRepository} from "./infra/repositories/InMemoryWorkoutRepository.js";

//Importando Use Cases
import {CreateAluno} from "./app/usecases/CreateAluno.js";
import {GetAluno} from "./app/usecases/GetAluno.js";
import {UpdateAluno} from "./app/usecases/UpdateAluno.js";
import {SearchAluno} from "./app/usecases/SearchAluno.js";
import {CreateInstructor} from "./app/usecases/CreateInstructor.js";
import {GetInstructor} from "./app/usecases/GetInstructor.js";
import {UpdateInstructor} from "./app/usecases/UpdateInstructor.js";
import {CreateExercise} from "./app/usecases/CreateExercise.js";
import {UpdateExercise} from "./app/usecases/UpdateExercise.js";
import {CreateWorkout} from "./app/usecases/CreateWorkout.js";
import {GetWorkout} from "./app/usecases/GetWorkout.js";
import {ListWorkout} from "./app/usecases/ListWorkout.js";
import {UpdateWorkout} from "./app/usecases/UpdateWorkout.js";
import {DeleteWorkout} from "./app/usecases/DeleteWorkout.js";
import {SearchWorkoutByTitle} from "./app/usecases/SearchWorkoutByTitle.js";

// Fastify
import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

await app.register(cors, { origin: true });

//Instanciando Repositórios
const alunoRepository = new InMemoryAlunoRepository();
const instructorRepository = new InMemoryInstructorRepository();
const exerciseRepository = new InMemoryExerciseRepository();
const workoutRepository = new InMemoryWorkoutRepository();

//Instanciando Use Cases
const createAluno = new CreateAluno(alunoRepository);
const getAluno = new GetAluno(alunoRepository);
const updateAluno = new UpdateAluno(alunoRepository);
const searchAluno = new SearchAluno(alunoRepository);

const createInstructor = new CreateInstructor(instructorRepository);
const getInstructor = new GetInstructor(instructorRepository);
const updateInstructor = new UpdateInstructor(instructorRepository);

const createExercise = new CreateExercise(exerciseRepository);
const updateExercise = new UpdateExercise(exerciseRepository);

const createWorkout = new CreateWorkout(workoutRepository);
const getWorkout = new GetWorkout(workoutRepository);
const listWorkout = new ListWorkout(workoutRepository);
const updateWorkout = new UpdateWorkout(workoutRepository);
const deleteWorkout = new DeleteWorkout(workoutRepository);
const searchWorkoutByTitle = new SearchWorkoutByTitle(workoutRepository);

// Rotas Aluno
app.post("/alunos", async (request, reply) => {
  try {
    const body = request.body as any;
    const aluno = await createAluno.execute(body);
    return reply.code(201).send(aluno);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
});

app.get("/alunos/:id", async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const aluno = await getAluno.execute({ id });
    return reply.send(aluno);
  } catch (error: any) {
    return reply.code(404).send({ error: error.message });
  }
});

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

app.get("/alunos", async (request, reply) => {
  try {
    const query = request.query as { cpf?: string; email?: string };
    const alunos = await searchAluno.execute(query);
    return reply.send(alunos);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
});

// Rotas Instructor
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

// Rotas Exercise
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

// Rotas Workout
app.post("/workouts", async (request, reply) => {
  try {
    const body = request.body as any;
    const workout = await createWorkout.execute(body);
    return reply.code(201).send(workout);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
});

app.get("/workouts/:id", async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const workout = await getWorkout.execute({ id });
    return reply.send(workout);
  } catch (error: any) {
    return reply.code(404).send({ error: error.message });
  }
});

app.get("/workouts", async (request, reply) => {
  try {
    const query = request.query as { alunoId?: string; title?: string };
    if (query.title) {
      const workouts = await searchWorkoutByTitle.execute({ title: query.title });
      return reply.send(workouts);
    } else if (query.alunoId) {
      const workouts = await listWorkout.execute({ alunoId: query.alunoId });
      return reply.send(workouts);
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
    return reply.send(updated);
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

// Iniciar servidor
await app.listen({ port: 3000, host: "0.0.0.0" });
console.log("🚀 Servidor rodando em http://localhost:3000");