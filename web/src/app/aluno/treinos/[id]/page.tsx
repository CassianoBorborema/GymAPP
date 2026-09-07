"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { Exercise, Workout } from "@/lib/types";

export default function WorkoutDetailPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [w, e] = await Promise.all([
          api.getWorkout(params.id),
          api.listExercises(),
        ]);
        setWorkout(w);
        setExercises(e);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro");
      }
    })();
  }, [params.id]);

  function exerciseName(id: string) {
    return exercises.find((e) => e.id === id)?.name ?? "Exercício";
  }

  function videoUrl(id: string) {
    return exercises.find((e) => e.id === id)?.videoUrl;
  }

  return (
    <RequireAuth role="aluno">
      <AppShell variant="aluno">
        {error && <p className="text-rat">{error}</p>}
        {workout && (
          <>
            <h1 className="display text-5xl">{workout.title}</h1>
            {workout.description && (
              <p className="mt-2 text-black/65">{workout.description}</p>
            )}
            <p className="mt-1 text-black/55">
              Faça série por série. Anote a carga no caderno se precisar.
            </p>
            <ol className="mt-8 grid gap-3">
              {workout.items.map((item, i) => {
                const video = videoUrl(item.exerciseId);
                return (
                  <li
                    key={item.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <p className="text-xs font-bold tracking-widest text-rat">
                      EXERCÍCIO {i + 1}
                    </p>
                    <p className="text-xl font-bold">
                      {exerciseName(item.exerciseId)}
                    </p>
                    <p className="mt-1 text-black/70">
                      {item.sets}x{item.reps}
                      {item.restTime ? ` · ${item.restTime}s descanso` : ""}
                    </p>
                    {item.observations && (
                      <p className="mt-2 text-sm text-black/55">
                        {item.observations}
                      </p>
                    )}
                    {video && (
                      <a
                        className="mt-3 inline-block text-sm font-semibold text-rat"
                        href={video}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver execução
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </AppShell>
    </RequireAuth>
  );
}
