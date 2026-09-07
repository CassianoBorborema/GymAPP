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

  const groupedWorkouts = alunos
    .map((aluno) => ({
      aluno,
      workouts: workouts.filter((workout) => workout.alunoId === aluno.id),
    }))
    .filter((group) => group.workouts.length > 0);

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
            <p className="mt-1 text-black/55">
              Rotina personalizada por aluno.
            </p>
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
          {groupedWorkouts.map(({ aluno, workouts: alunoWorkouts }) => (
            <details
              key={aluno.id}
              className="rounded-2xl bg-white p-4 shadow-sm"
              open
            >
              <summary className="cursor-pointer font-bold">
                {aluno.name}{" "}
                <span className="font-normal text-black/55">
                  ({aluno.email})
                </span>
              </summary>
              <div className="mt-3 grid gap-2 border-t border-black/8 pt-3">
                {alunoWorkouts.map((w) => (
                  <article
                    key={w.id}
                    className="flex items-center justify-between gap-4 rounded-xl bg-black/3 p-3"
                  >
                    <div>
                      <p className="font-bold">{w.title}</p>
                      {w.description && (
                        <p className="text-sm text-black/55">{w.description}</p>
                      )}
                      <p className="text-sm text-black/55">
                        {w.items.length} exercício(s)
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-rat"
                      onClick={() => remove(w.id)}
                    >
                      Remover
                    </button>
                  </article>
                ))}
              </div>
            </details>
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
