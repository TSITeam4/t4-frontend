'use client';

import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const baseStyles = [
  'relative',
  'inline-flex',
  'items-center',
  'justify-center',
  'overflow-hidden',
  'border',
  'border-[var(--color-border-gold)]',
  'bg-transparent',
  'min-h-[2.75rem]',
  'px-[2.25rem]',
  'py-[0.875rem]',
  'font-body',
  'text-[0.8125rem]',
  'font-medium',
  'uppercase',
  'tracking-[0.1em]',
  'text-[var(--color-gold)]',
  'rounded-none',
  'cursor-pointer',
  'transition-colors',
  'duration-350',
  'hover:text-[#0A0A0A]',
  'active:text-[#0A0A0A]',
  'active:scale-[0.97]',
  'active:transition-transform',
  'active:duration-100',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
  'focus-visible:outline-2',
  'focus-visible:outline-[var(--color-gold)]',
  'focus-visible:outline-offset-[3px]',
].join(' ');

export default function Button({
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-[var(--color-gold)] transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100 group-active:scale-x-100"
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  const classes = `group ${baseStyles} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} data-cursor="hover">
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      data-cursor="hover"
    >
      {inner}
    </button>
  );
}
