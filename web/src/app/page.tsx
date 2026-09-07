import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rat text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/logo.png"
          alt="Gym Rats"
          width={180}
          height={180}
          className="rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
          priority
        />
        <h1 className="display mt-8 text-7xl sm:text-8xl">GYM RATS</h1>
        <p className="mt-2 max-w-md text-lg text-white/90">
          Instrutor monta o treino. Aluno bate a carga. Sem enrolação.
        </p>
        <div className="mt-10 grid w-full max-w-lg gap-4 sm:grid-cols-2">
          <Link
            href="/login?role=instructor"
            className="rounded-2xl bg-white px-6 py-5 font-bold text-rat no-underline shadow-lg"
          >
            Sou instrutor
            <span className="mt-1 block text-sm font-normal text-black/55">
              Alunos, exercícios e treinos
            </span>
          </Link>
          <Link
            href="/login?role=aluno"
            className="rounded-2xl border-2 border-white/70 px-6 py-5 font-bold text-white no-underline"
          >
            Sou aluno
            <span className="mt-1 block text-sm font-normal text-white/80">
              Ver meus treinos
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
