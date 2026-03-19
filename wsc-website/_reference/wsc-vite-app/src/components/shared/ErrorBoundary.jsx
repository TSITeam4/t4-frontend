import React from 'react';

/**
 * ErrorBoundary — catches RENDER-TIME React errors only.
 *
 * SCOPE: This catches errors thrown during render, lifecycle methods,
 * and constructors of child components. It does NOT catch:
 *   - Async errors (network, promises)
 *   - Event handler errors
 *   - Errors inside setTimeout/Promise callbacks
 *
 * Async failures are handled by useSupabaseQuery/useSupabaseMutation
 * hooks and the classifyError() utility.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--wsc-light)',
          }}
        >
          <h2 style={{ color: 'var(--wsc-gold)', marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            An unexpected error occurred. Please reload the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--wsc-purple)',
              color: 'var(--wsc-light)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
