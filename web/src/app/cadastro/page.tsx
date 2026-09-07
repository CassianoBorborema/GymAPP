"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Button, Field, inputClassName } from "@/components/Form";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signupInstructor({ name, email, password });
      const session = await api.login(email, password);
      setSession(session);
      router.replace("/instrutor/alunos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <Brand />
        <h1 className="display mt-6 text-4xl">Cadastro do instrutor</h1>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <Field label="Nome">
            <input
              className={inputClassName()}
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="E-mail">
            <input
              className={inputClassName()}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Senha (mín. 4)">
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
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-black/60">
          Já tem conta?{" "}
          <Link href="/login?role=instructor" className="font-semibold text-rat">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
