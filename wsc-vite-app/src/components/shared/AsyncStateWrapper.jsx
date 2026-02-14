import React from 'react';

/**
 * AsyncStateWrapper — renders the correct UI for loading / error / empty / success states.
 *
 * Props:
 *   loading      : boolean
 *   error        : { category, message, retryable } | null  (from classifyError)
 *   data         : Array | any
 *   onRetry      : () => void
 *   emptyMessage : string (default: 'No items yet.')
 *   children     : ReactNode (rendered when data is present)
 */
function AsyncStateWrapper({
  loading,
  error,
  data,
  onRetry,
  emptyMessage = 'No items yet.',
  children,
}) {
  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--wsc-light)' }}>
        <div
          style={{
            display: 'inline-block',
            width: 32,
            height: 32,
            border: '3px solid rgba(255, 217, 90, 0.3)',
            borderTopColor: 'var(--wsc-gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ marginTop: '1rem', opacity: 0.6 }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--wsc-light)' }}>
        <p style={{ marginBottom: '1rem', color: '#f87171' }}>{error.message}</p>
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'var(--wsc-purple)',
              color: 'var(--wsc-light)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;
  if (isEmpty) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--wsc-light)', opacity: 0.7 }}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Success state — render children
  return children;
}

export default AsyncStateWrapper;
