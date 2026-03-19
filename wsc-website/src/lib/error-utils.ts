import type { QueryError } from '@/types/database';

interface SupabaseError {
  message?: string;
  code?: string;
  status?: number;
  statusCode?: number;
}

/**
 * Classifies a Supabase error into a category for consistent UI handling.
 */
export function classifyError(error: SupabaseError | Error | null): QueryError | null {
  if (!error) return null;

  const msg = error.message?.toLowerCase() ?? '';
  const code = 'code' in error ? (error as SupabaseError).code ?? '' : '';
  const status = 'status' in error
    ? (error as SupabaseError).status ?? (error as SupabaseError).statusCode
    : undefined;

  if (status === 401 || code === 'PGRST301' || msg.includes('jwt expired')) {
    return {
      category: 'auth',
      message: 'Your session has expired. Please sign in again.',
      retryable: false,
    };
  }

  if (status === 403 || code === '42501' || msg.includes('permission denied')) {
    return {
      category: 'forbidden',
      message: 'You do not have permission to do this.',
      retryable: false,
    };
  }

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch') || status === 0) {
    return {
      category: 'network',
      message: 'Could not reach the server. Please check your connection and try again.',
      retryable: true,
    };
  }

  if (status === 503 || msg.includes('project is paused')) {
    return {
      category: 'paused',
      message: 'The database is currently paused. An admin needs to resume it from the Supabase dashboard.',
      retryable: true,
    };
  }

  if (code === '23505') {
    return {
      category: 'conflict',
      message: 'This item already exists.',
      retryable: false,
    };
  }

  if (status !== undefined && status >= 500) {
    return {
      category: 'server',
      message: 'Something went wrong on the server. Please try again.',
      retryable: true,
    };
  }

  const originalMsg = error.message?.trim() ?? '';
  const isShortUserMessage = originalMsg.length > 0 && originalMsg.length < 300 && !originalMsg.includes('\n');
  return {
    category: 'unknown',
    message: isShortUserMessage ? originalMsg : 'Something went wrong. Please try again.',
    retryable: !isShortUserMessage,
  };
}
