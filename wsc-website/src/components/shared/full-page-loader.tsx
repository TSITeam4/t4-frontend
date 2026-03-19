'use client';

export default function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-base)]">
      <div className="size-12 animate-spin rounded-full border-[1.5px] border-transparent border-t-[var(--color-gold)]" />
      <p className="mt-4 font-mono text-[length:var(--text-mono-sm)] tracking-wide text-[var(--color-text-muted)] opacity-60">
        Loading...
      </p>
    </div>
  );
}
