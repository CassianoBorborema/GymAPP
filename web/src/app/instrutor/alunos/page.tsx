"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button, Field, inputClassName } from "@/components/Form";
import { api } from "@/lib/api";
import type { Aluno } from "@/lib/types";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    CPF: "",
    weight: "70",
    password: "1234",
  });

  async function load() {
    try {
      setAlunos(await api.listAlunos());
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
      await api.createAluno({
        ...form,
        weight: Number(form.weight),
      });
      setForm({ name: "", email: "", CPF: "", weight: "70", password: "1234" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar");
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover este aluno e os treinos dele?")) return;
    await api.deleteAluno(id);
    await load();
  }

  const visibleAlunos = alunos.filter((aluno) => {
    const term = search.trim().toLowerCase();
    return !term || `${aluno.name} ${aluno.email}`.toLowerCase().includes(term);
  });

  return (
    <RequireAuth role="instructor">
      <AppShell variant="instructor">
        <h1 className="display text-5xl">Alunos</h1>
        <p className="mt-1 text-black/55">
          Cadastre o rato. Depois monte o treino.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-6"
        >
          <Field label="Nome">
            <input
              className={inputClassName()}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="E-mail">
            <input
              className={inputClassName()}
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="CPF">
            <input
              className={inputClassName()}
              required
              value={form.CPF}
              onChange={(e) => setForm({ ...form, CPF: e.target.value })}
            />
          </Field>
          <Field label="Peso (kg)">
            <input
              className={inputClassName()}
              type="number"
              min={1}
              required
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </Field>
          <Field label="Senha inicial">
            <input
              className={inputClassName()}
              required
              minLength={4}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Adicionar
            </Button>
          </div>
        </form>
        {error && <p className="mt-3 text-sm text-rat">{error}</p>}

        <div className="mt-8">
          <label className="text-sm font-semibold" htmlFor="aluno-search">
            Buscar aluno
          </label>
          <input
            id="aluno-search"
            className={`${inputClassName()} mt-1 max-w-xl`}
            type="search"
            placeholder="Nome ou e-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/4 text-black/60">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Peso</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {visibleAlunos.map((aluno) => (
                <tr key={aluno.id} className="border-t border-black/6">
                  <td className="px-4 py-3 font-semibold">{aluno.name}</td>
                  <td className="px-4 py-3">{aluno.email}</td>
                  <td className="px-4 py-3">{aluno.weight} kg</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="text-rat"
                      onClick={() => remove(aluno.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {visibleAlunos.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-black/45"
                  >
                    Nenhum aluno ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
