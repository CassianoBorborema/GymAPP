"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Button, Field, inputClassName } from "@/components/Form";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";
import type { Role } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const roleHint = (params.get("role") as Role | null) ?? null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (roleHint === "instructor") return "Entrar como instrutor";
    if (roleHint === "aluno") return "Entrar como aluno";
    return "Entrar";
  }, [roleHint]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await api.login(email, password);
      if (roleHint && session.role !== roleHint) {
        throw new Error(
          roleHint === "instructor"
            ? "Essa conta não é de instrutor."
            : "Essa conta não é de aluno.",
        );
      }
      setSession(session);
      router.replace(
        session.role === "instructor" ? "/instrutor/alunos" : "/aluno/treinos",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <Brand />
        <h1 className="display mt-6 text-4xl">{title}</h1>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <Field label="E-mail">
            <input
              className={inputClassName()}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Senha">
            <input
              className={inputClassName()}
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          {error && <p className="text-sm font-medium text-rat">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        {roleHint !== "aluno" && (
          <p className="mt-5 text-center text-sm text-black/60">
            Novo instrutor?{" "}
            <Link href="/cadastro" className="font-semibold text-rat">
              Criar conta
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
