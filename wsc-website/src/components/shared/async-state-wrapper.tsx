'use client';

import type { ReactNode } from 'react';
import type { QueryError } from '@/types/database';

interface AsyncStateWrapperProps {
  loading: boolean;
  error: QueryError | null;
  data: unknown[];
  onRetry?: () => void;
  emptyMessage?: string;
  children: ReactNode;
}

export default function AsyncStateWrapper({
  loading,
  error,
  data,
  onRetry,
  emptyMessage = 'No items yet.',
  children,
}: AsyncStateWrapperProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-7 animate-spin rounded-full border-[1.5px] border-transparent border-t-[var(--color-gold)]" />
        <p className="mt-4 font-mono text-[length:var(--text-mono-sm)] tracking-wide text-[var(--color-text-muted)] opacity-60">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="mb-4 font-mono text-[length:var(--text-mono)] text-[var(--color-text-muted)]">
          {error.message}
        </p>
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="border border-[var(--color-border-gold)] bg-transparent px-6 py-2 font-body text-[0.8125rem] uppercase tracking-[0.1em] text-[var(--color-gold)] transition-colors duration-250 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-base)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-gold)]"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <p className="font-display text-[length:var(--text-display-sm)] italic text-[var(--color-text-subtle)]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
