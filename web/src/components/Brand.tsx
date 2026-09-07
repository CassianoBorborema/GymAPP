import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 text-inherit no-underline">
      <Image
        src="/logo.png"
        alt="Gym Rats"
        width={compact ? 44 : 64}
        height={compact ? 44 : 64}
        className="rounded-xl shadow-[0_8px_20px_rgba(225,29,46,0.35)]"
      />
      <div>
        <p className="display m-0 text-3xl leading-none text-rat">GYM RATS</p>
        {!compact && (
          <p className="m-0 text-xs tracking-[0.18em] uppercase text-black/50">
            treina pesado
          </p>
        )}
      </div>
    </Link>
  );
}
