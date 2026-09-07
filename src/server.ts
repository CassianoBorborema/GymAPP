import Fastify from "fastify";
import cors from "@fastify/cors";
import { alunoRoutes } from "./infra/controller/AlunoController.js";
import { instructorRoutes } from "./infra/controller/InstructorController.js";
import { exerciseRoutes } from "./infra/controller/ExerciseController.js";
import { workoutRoutes } from "./infra/controller/WorkoutController.js";
import { authRoutes } from "./infra/controller/AuthController.js";
import { PrismaAlunoRepository } from "./infra/database/prisma/PrismaAlunoRepository.js";
import { PrismaExerciseRepository } from "./infra/database/prisma/PrismaExerciseRepository.js";
import { PrismaWorkoutRepository } from "./infra/database/prisma/PrismaWorkoutRepository.js";
import { PrismaInstructorRepository } from "./infra/database/prisma/PrismaInstructorRepository.js";

const app = Fastify({
  logger: true,
});

const alunoRepository = new PrismaAlunoRepository();
const workoutRepository = new PrismaWorkoutRepository();
const exerciseRepository = new PrismaExerciseRepository();
const instructorRepository = new PrismaInstructorRepository();

await app.register(cors, { origin: true });
await app.register(alunoRoutes, { alunoRepository, workoutRepository });
await app.register(instructorRoutes, { instructorRepository });
await app.register(exerciseRoutes, { exerciseRepository });
await app.register(workoutRoutes, { workoutRepository });
await app.register(authRoutes, { alunoRepository, instructorRepository });

app.get("/", async () => ({ status: "ok" }));

await app.listen({ port: 3000, host: "0.0.0.0" });
console.log("Server running on http://localhost:3000");
