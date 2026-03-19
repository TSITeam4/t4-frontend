'use client';

import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary — catches RENDER-TIME React errors only.
 *
 * Does NOT catch: async errors, event handler errors, or errors
 * inside setTimeout/Promise callbacks. Those are handled by
 * useSupabaseQuery/useSupabaseMutation and classifyError().
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--color-bg-base)] px-8 text-center">
          <h2 className="mb-4 font-display text-[length:var(--text-display-sm)] font-semibold text-[var(--color-gold)]">
            Something went wrong
          </h2>
          <p className="mb-6 font-body text-[length:var(--text-body)] text-[var(--color-text-muted)]">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="border border-[var(--color-border-gold)] bg-transparent px-9 py-3.5 font-body text-[0.8125rem] uppercase tracking-[0.1em] text-[var(--color-gold)] transition-colors duration-250 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-base)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-gold)]"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
