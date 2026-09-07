"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { Aluno, Workout } from "@/lib/types";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [w, a] = await Promise.all([api.listWorkouts(), api.listAlunos()]);
      setWorkouts(w);
      setAlunos(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao listar");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function alunoName(id: string) {
    return alunos.find((a) => a.id === id)?.name ?? id.slice(0, 8);
  }

  async function remove(id: string) {
    if (!confirm("Apagar este treino?")) return;
    await api.deleteWorkout(id);
    await load();
  }

  return (
    <RequireAuth role="instructor">
      <AppShell variant="instructor">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="display text-5xl">Treinos</h1>
            <p className="mt-1 text-black/55">Rotina personalizada por aluno.</p>
          </div>
          <Link
            href="/instrutor/treinos/novo"
            className="rounded-full bg-rat px-5 py-2.5 font-semibold text-white no-underline"
          >
            Novo treino
          </Link>
        </div>
        {error && <p className="mt-3 text-sm text-rat">{error}</p>}

        <div className="mt-8 grid gap-3">
          {workouts.map((w) => (
            <article key={w.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <div>
                <p className="font-bold">{w.title}</p>
                <p className="text-sm text-black/55">
                  {alunoName(w.alunoId)} · {w.items.length} exercício(s)
                </p>
              </div>
              <button type="button" className="text-sm text-rat" onClick={() => remove(w.id)}>
                Remover
              </button>
            </article>
          ))}
          {workouts.length === 0 && (
            <p className="rounded-2xl bg-white p-8 text-center text-black/45">
              Nenhum treino ainda. Crie o primeiro.
            </p>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
