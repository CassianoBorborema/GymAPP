"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button, Field, inputClassName } from "@/components/Form";
import { api } from "@/lib/api";
import { MUSCLE_GROUPS, type Exercise, type MuscleGroup } from "@/lib/types";

export default function ExercisesPage() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    muscleGroup: "Peito" as MuscleGroup,
    videoUrl: "",
    description: "",
  });

  async function load() {
    try {
      setItems(await api.listExercises());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao listar");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.createExercise({
        name: form.name,
        muscleGroup: form.muscleGroup,
        videoUrl: form.videoUrl || undefined,
        description: form.description || undefined,
      });
      setForm({ name: "", muscleGroup: "Peito", videoUrl: "", description: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar");
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover exercício?")) return;
    await api.deleteExercise(id);
    await load();
  }

  return (
    <RequireAuth role="instructor">
      <AppShell variant="instructor">
        <h1 className="display text-5xl">Exercícios</h1>
        <p className="mt-1 text-black/55">Catálogo para montar os treinos. Vídeo é opcional.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">
          <Field label="Nome">
            <input className={inputClassName()} required minLength={3} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Grupo muscular">
            <select className={inputClassName()} value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value as MuscleGroup })}>
              {MUSCLE_GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="URL do vídeo (opcional)">
            <input className={inputClassName()} type="url" placeholder="https://" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          </Field>
          <Field label="Descrição">
            <input className={inputClassName()} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Button type="submit">Adicionar exercício</Button>
          </div>
        </form>
        {error && <p className="mt-3 text-sm text-rat">{error}</p>}

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map((ex) => (
            <li key={ex.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{ex.name}</p>
                  <p className="text-sm text-rat">{ex.muscleGroup}</p>
                  {ex.videoUrl && (
                    <a href={ex.videoUrl} className="text-sm" target="_blank" rel="noreferrer">
                      Ver vídeo
                    </a>
                  )}
                </div>
                <button type="button" className="text-sm text-rat" onClick={() => remove(ex.id)}>
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </AppShell>
    </RequireAuth>
  );
}
