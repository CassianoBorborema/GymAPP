import Fastify from "fastify";
import cors from "@fastify/cors";
import { alunoRoutes } from "./infra/controller/AlunoController.js";
import { instructorRoutes } from "./infra/controller/InstructorController.js";
import { exerciseRoutes } from "./infra/controller/ExerciseController.js";
import { workoutRoutes } from "./infra/controller/WorkoutController.js";

const app = Fastify({
  logger: true,
});

await app.register(cors, { origin: true });
await app.register(alunoRoutes);
await app.register(instructorRoutes);
await app.register(exerciseRoutes);
await app.register(workoutRoutes);

await app.listen({ port: 3000, host: "0.0.0.0" });
console.log("🚀 Servidor rodando em http://localhost:3000");
