"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button, Field, inputClassName } from "@/components/Form";
import { api } from "@/lib/api";
import type { Aluno, Exercise } from "@/lib/types";

type DraftItem = {
  exerciseId: string;
  sets: string;
  reps: string;
  restTime: string;
};

export default function NewWorkoutPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [title, setTitle] = useState("Treino A");
  const [description, setDescription] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [items, setItems] = useState<DraftItem[]>([
    { exerciseId: "", sets: "3", reps: "12", restTime: "60" },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const [a, e] = await Promise.all([api.listAlunos(), api.listExercises()]);
      setAlunos(a);
      setExercises(e);
      if (a[0]) setAlunoId(a[0].id);
      if (e[0]) {
        setItems((prev) =>
          prev.map((item, i) =>
            i === 0 ? { ...item, exerciseId: e[0]!.id } : item,
          ),
        );
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        exerciseId: exercises[0]?.id ?? "",
        sets: "3",
        reps: "12",
        restTime: "60",
      },
    ]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.createWorkout({
        title,
        description: description || undefined,
        alunoId,
        items: items.map((item) => ({
          exerciseId: item.exerciseId,
          sets: Number(item.sets),
          reps: Number(item.reps),
          restTime: item.restTime,
        })),
      });
      router.replace("/instrutor/treinos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar treino");
    }
  }

  return (
    <RequireAuth role="instructor">
      <AppShell variant="instructor">
        <h1 className="display text-5xl">Novo treino</h1>
        <form onSubmit={onSubmit} className="mt-6 grid max-w-3xl gap-4">
          <Field label="Título">
            <input
              className={inputClassName()}
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Descrição (opcional)">
            <textarea
              className={inputClassName()}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Aluno">
            <select
              className={inputClassName()}
              required
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
            >
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-3">
            <p className="font-semibold">Exercícios</p>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-2xl bg-white p-4 sm:grid-cols-4"
              >
                <select
                  className={inputClassName()}
                  value={item.exerciseId}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, exerciseId: e.target.value };
                    setItems(next);
                  }}
                >
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
                <input
                  className={inputClassName()}
                  type="number"
                  min={1}
                  value={item.sets}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, sets: e.target.value };
                    setItems(next);
                  }}
                  placeholder="Séries"
                />
                <input
                  className={inputClassName()}
                  type="number"
                  min={1}
                  value={item.reps}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, reps: e.target.value };
                    setItems(next);
                  }}
                  placeholder="Reps"
                />
                <input
                  className={inputClassName()}
                  type="text"
                  value={item.restTime}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, restTime: e.target.value };
                    setItems(next);
                  }}
                  placeholder="Descanso (s)"
                />
              </div>
            ))}
            <button
              type="button"
              className="justify-self-start text-sm font-semibold text-rat"
              onClick={addItem}
            >
              + exercício
            </button>
          </div>

          {error && <p className="text-sm text-rat">{error}</p>}
          <Button type="submit">Salvar treino</Button>
        </form>
      </AppShell>
    </RequireAuth>
  );
}
