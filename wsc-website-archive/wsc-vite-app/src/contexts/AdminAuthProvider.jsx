import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import FullPageLoader from '../components/shared/FullPageLoader';

/**
 * AdminAuthProvider — 3-phase gate for /admin routes.
 *
 * States:
 *   checking_auth  → verifying if a session exists
 *   checking_admin → session found, verifying is_admin() via RPC
 *   authorized     → admin confirmed, render children
 *   denied         → not admin / not logged in, show message
 *
 * Critical: during checking_auth and checking_admin, ONLY a neutral
 * spinner is rendered. No dashboard skeleton, no sidebar, no content hints.
 */

const AdminContext = createContext(null);

export function useAdminAuth() {
  return useContext(AdminContext);
}

export default function AdminAuthProvider({ children }) {
  const [state, setState] = useState('checking_auth');
  // 'checking_auth' | 'checking_admin' | 'authorized' | 'denied'

  const verifyAdmin = useCallback(async (session) => {
    if (!session) {
      setState('denied');
      return;
    }
    setState('checking_admin');

    try {
      const { data: isAdmin, error } = await supabase.rpc('is_admin');
      if (error || !isAdmin) {
        await supabase.auth.signOut();
        setState('denied');
      } else {
        setState('authorized');
      }
    } catch {
      await supabase.auth.signOut();
      setState('denied');
    }
  }, []);

  useEffect(() => {
    // 1. Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAdmin(session);
    });

    // 2. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyAdmin(session);
    });

    // 3. Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [verifyAdmin]);

  const signIn = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/admin' },
    });
    if (error) console.error('Sign-in error:', error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState('denied');
  }, []);

  // Loading phases → neutral spinner only
  if (state === 'checking_auth' || state === 'checking_admin') {
    return <FullPageLoader />;
  }

  // Denied → show login page
  if (state === 'denied') {
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
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'var(--wsc-gold)', marginBottom: '0.5rem', fontSize: '2rem' }}>
          Admin Portal
        </h1>
        <p style={{ marginBottom: '2rem', opacity: 0.7, maxWidth: '400px' }}>
          Sign in with the authorized Google account to access the admin dashboard.
        </p>
        <button
          onClick={signIn}
          style={{
            padding: '0.85rem 2.5rem',
            backgroundColor: 'var(--wsc-purple)',
            color: 'var(--wsc-light)',
            border: '2px solid var(--wsc-gold)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: "'Georgia', Times, serif",
            letterSpacing: '0.03em',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--wsc-gold)';
            e.target.style.color = 'var(--wsc-dark)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--wsc-purple)';
            e.target.style.color = 'var(--wsc-light)';
          }}
        >
          Sign in with Google
        </button>
        <a
          href="/"
          style={{
            marginTop: '1.5rem',
            color: 'var(--wsc-gold)',
            fontSize: '0.9rem',
            opacity: 0.8,
          }}
        >
          &larr; Back to site
        </a>
      </div>
    );
  }

  // Authorized → render dashboard
  return (
    <AdminContext.Provider value={{ signOut }}>
      {children}
    </AdminContext.Provider>
  );
}
