"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "./Brand";
import { clearSession, getSession } from "@/lib/auth";
import { useEffect, useState } from "react";

const instructorLinks = [
  { href: "/instrutor/alunos", label: "Alunos" },
  { href: "/instrutor/exercicios", label: "Exercícios" },
  { href: "/instrutor/treinos", label: "Treinos" },
];

export function AppShell({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "instructor" | "aluno";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getSession()?.name ?? "");
  }, []);

  function logout() {
    clearSession();
    router.replace("/");
  }

  const links =
    variant === "instructor"
      ? instructorLinks
      : [{ href: "/aluno/treinos", label: "Meus treinos" }];

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-black/8 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Brand compact />
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold no-underline ${
                    active
                      ? "bg-rat text-white"
                      : "text-ink/70 hover:bg-black/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-black/60 sm:inline">{name}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-black/15 px-3 py-1.5 text-sm font-semibold"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
