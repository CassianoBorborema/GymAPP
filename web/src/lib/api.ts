import { getSession } from "./auth";
import type {
  Aluno,
  Exercise,
  Instructor,
  Session,
  Workout,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Erro na API");
  }
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<Session>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signupInstructor: (body: { name: string; email: string; password: string }) =>
    request<Instructor>("/instructors", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listAlunos: () => request<Aluno[]>("/alunos"),
  getAluno: (id: string) => request<Aluno>(`/alunos/${id}`),
  createAluno: (body: {
    name: string;
    email: string;
    CPF: string;
    weight: number;
    password: string;
  }) =>
    request<Aluno>("/alunos", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateAluno: (id: string, body: Partial<Aluno>) =>
    request<Aluno>(`/alunos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteAluno: (id: string) =>
    request<void>(`/alunos/${id}`, { method: "DELETE" }),

  listExercises: (query?: { name?: string; muscleGroup?: string }) => {
    const params = new URLSearchParams();
    if (query?.name) params.set("name", query.name);
    if (query?.muscleGroup) params.set("muscleGroup", query.muscleGroup);
    const q = params.toString();
    return request<Exercise[]>(`/exercises${q ? `?${q}` : ""}`);
  },
  createExercise: (body: {
    name: string;
    muscleGroup: string;
    videoUrl?: string;
    description?: string;
  }) =>
    request<Exercise>("/exercises", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateExercise: (id: string, body: Partial<Exercise>) =>
    request<Exercise>(`/exercises/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteExercise: (id: string) =>
    request<void>(`/exercises/${id}`, { method: "DELETE" }),

  listWorkouts: (query?: { alunoId?: string; title?: string }) => {
    const params = new URLSearchParams();
    if (query?.alunoId) params.set("alunoId", query.alunoId);
    if (query?.title) params.set("title", query.title);
    const q = params.toString();
    return request<Workout[]>(`/workouts${q ? `?${q}` : ""}`);
  },
  getWorkout: (id: string) => request<Workout>(`/workouts/${id}`),
  createWorkout: (body: {
    title: string;
    alunoId: string;
    items: {
      exerciseId: string;
      sets: number;
      reps: number;
      restTime: number;
      observations?: string;
    }[];
  }) =>
    request<Workout>("/workouts", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteWorkout: (id: string) =>
    request<void>(`/workouts/${id}`, { method: "DELETE" }),
};
