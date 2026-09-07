"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { Workout } from "@/lib/types";

export default function StudentWorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listWorkouts()
      .then(setWorkouts)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, []);

  return (
    <RequireAuth role="aluno">
      <AppShell variant="aluno">
        <h1 className="display text-5xl">Meus treinos</h1>
        <p className="mt-1 text-black/55">Hora de treinar. Sem desculpa.</p>
        {error && <p className="mt-3 text-sm text-rat">{error}</p>}
        <div className="mt-8 grid gap-3">
          {workouts.map((w) => (
            <Link
              key={w.id}
              href={`/aluno/treinos/${w.id}`}
              className="rounded-2xl bg-white p-5 no-underline shadow-sm"
            >
              <p className="text-xl font-bold text-ink">{w.title}</p>
              <p className="text-sm text-black/55">{w.items.length} exercícios</p>
            </Link>
          ))}
          {workouts.length === 0 && (
            <p className="rounded-2xl bg-white p-8 text-center text-black/45">
              Seu instrutor ainda não montou um treino.
            </p>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
