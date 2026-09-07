# GymApp - Gestão de Treinos

API REST (Fastify + Prisma + Postgres) para instrutores montarem treinos e alunos visualizarem os próprios treinos.

## Como rodar

1. Copie o `.env`:

```bash
cp .env.example .env
```

2. Ajuste `DATABASE_URL` e `JWT_SECRET`.

3. Instale, migre e suba:

```bash
npm install
npm run db:migrate
npm run dev
```

API em `http://localhost:3000`. Health check: `GET /health`.

## Front (Gym Rats)

```bash
cd web
npm install
npm run dev
```

Abre em `http://localhost:3001`. A API precisa estar rodando na 3000.

## Auth

- `POST /instructors` — cadastro público de instrutor
- `POST /login` — `{ "email", "password" }` → `{ token, id, role, name }`
- Nas rotas protegidas: header `Authorization: Bearer <token>`

`role` é `"instructor"` ou `"aluno"`.

## Endpoints

### Instrutor (JWT instructor)

- `POST /alunos`, `GET /alunos`, `GET /alunos/:id`, `PATCH /alunos/:id`, `DELETE /alunos/:id`
- `POST /exercises`, `PATCH /exercises/:id`, `DELETE /exercises/:id`
- `POST /workouts`, `GET /workouts`, `PATCH /workouts/:id`, `DELETE /workouts/:id`

### Aluno (JWT aluno)

- `GET /alunos/:id` (só o próprio)
- `GET /workouts` (lista os treinos do aluno autenticado)
- `GET /workouts/:id` (só se o treino for dele)

### Públicos

- `GET /exercises` e `GET /exercises/:id` (catálogo)
- `POST /instructors`
- `POST /login`

## Bodies úteis

Cadastro de aluno:

```json
{ "name": "João", "email": "joao@test.com", "CPF": "12345678901", "weight": 80, "password": "1234" }
```

Exercício:

```json
{ "name": "Supino reto", "muscleGroup": "Peito", "videoUrl": "https://youtube.com/..." }
```

`muscleGroup`: `Peito` | `Costas` | `Pernas` | `Ombros` | `Braços`

Treino:

```json
{
  "title": "Treino A",
  "alunoId": "<uuid>",
  "items": [{ "exerciseId": "<uuid>", "sets": 3, "reps": 12, "restTime": 60 }]
}
```

`instructorId` vem do token JWT, não precisa ir no body.
