interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <span
      className={`font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-[var(--color-gold)] ${className}`.trim()}
    >
      {children}
    </span>
  );
}
