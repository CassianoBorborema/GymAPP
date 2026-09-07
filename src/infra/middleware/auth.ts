import jwt from "jsonwebtoken";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const auth = (request.headers as any).authorization as string | undefined;
  if (!auth || !auth.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const token = auth.split(" ")[1] as string;
  try {
    const secret = process.env.JWT_SECRET ?? "dev-secret";
    const payload = jwt.verify(token, String(secret)) as any;
    // attach to request
    (request as any).user = { id: payload.sub, role: payload.role };
  } catch (err) {
    return reply.code(401).send({ error: "Invalid token" });
  }
}
