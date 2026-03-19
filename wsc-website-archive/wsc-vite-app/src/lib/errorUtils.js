/**
 * Classifies a Supabase error into a category for consistent UI handling.
 * Returns { category, message, retryable }
 *
 * Categories:
 *   auth      - session expired / JWT invalid
 *   forbidden - RLS or GRANT denied
 *   network   - fetch/connection failure
 *   paused    - Supabase project paused (503)
 *   conflict  - unique constraint violation
 *   server    - generic 5xx
 *   unknown   - fallback
 */
export function classifyError(error) {
  if (!error) return null;

  const msg = error.message?.toLowerCase() ?? '';
  const code = error.code ?? '';
  const status = error.status ?? error.statusCode;

  // Auth / session expired
  if (status === 401 || code === 'PGRST301' || msg.includes('jwt expired')) {
    return {
      category: 'auth',
      message: 'Your session has expired. Please sign in again.',
      retryable: false,
    };
  }

  // Permission denied (RLS or GRANT)
  if (status === 403 || code === '42501' || msg.includes('permission denied')) {
    return {
      category: 'forbidden',
      message: 'You do not have permission to do this.',
      retryable: false,
    };
  }

  // Network / connection errors
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch') || status === 0) {
    return {
      category: 'network',
      message: 'Could not reach the server. Please check your connection and try again.',
      retryable: true,
    };
  }

  // Supabase project paused (specific 503 or known patterns)
  if (status === 503 || msg.includes('project is paused')) {
    return {
      category: 'paused',
      message: 'The database is currently paused. An admin needs to resume it from the Supabase dashboard.',
      retryable: true,
    };
  }

  // Row-level constraint violations
  if (code === '23505') {
    return {
      category: 'conflict',
      message: 'This item already exists.',
      retryable: false,
    };
  }

  // Generic server errors
  if (status >= 500) {
    return {
      category: 'server',
      message: 'Something went wrong on the server. Please try again.',
      retryable: true,
    };
  }

  // Fallback: preserve user-facing messages (e.g. validation errors we threw)
  const originalMsg = error.message?.trim() ?? '';
  const isShortUserMessage = originalMsg.length > 0 && originalMsg.length < 300 && !originalMsg.includes('\n');
  return {
    category: 'unknown',
    message: isShortUserMessage ? originalMsg : 'Something went wrong. Please try again.',
    retryable: !isShortUserMessage,
  };
}
