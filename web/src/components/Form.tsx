export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export function inputClassName() {
  return "w-full rounded-xl border border-black/12 bg-white px-3 py-2.5 text-base outline-none focus:border-rat";
}

export function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-rat px-5 py-2.5 font-semibold text-white shadow-[0_8px_18px_rgba(225,29,46,0.28)] hover:bg-rat-dark disabled:opacity-50 ${props.className ?? ""}`}
    />
  );
}
