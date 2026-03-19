import React from 'react';

/**
 * Neutral full-page spinner shown during auth verification.
 * Intentionally shows NO admin UI hints — just a centered spinner.
 */
function FullPageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--wsc-dark)',
        color: 'var(--wsc-light)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255, 217, 90, 0.3)',
          borderTopColor: 'var(--wsc-gold)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.9rem' }}>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default FullPageLoader;
