'use client';

import { useState, useCallback } from 'react';
import { supabase } from '../client';
import { classifyError } from '@/lib/error-utils';
import { deleteFile } from '../storage';
import type { QueryError } from '@/types/database';

interface MutationResult {
  mutate: <T>(mutationFn: () => Promise<T>) => Promise<T>;
  loading: boolean;
  error: QueryError | null;
  reset: () => void;
}

/**
 * Generic hook for Supabase mutations (INSERT, UPDATE, DELETE) with
 * error classification and loading state.
 */
export function useSupabaseMutation(): MutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<QueryError | null>(null);

  const reset = useCallback(() => setError(null), []);

  const mutate = useCallback(async <T>(mutationFn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn();
      return result;
    } catch (err) {
      const classified = classifyError(err as Error);
      setError(classified);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, reset };
}

/**
 * Storage-first delete: delete file then row, with retry and recovery.
 * If storage delete succeeds but DB delete fails, the row still exists
 * with a stale path (recoverable). If DB delete happened first and
 * storage failed, you'd have an unrecoverable orphan.
 */
export async function deleteContentItem(
  table: string,
  row: Record<string, unknown>,
  bucketName: string,
  pathColumn: string
): Promise<void> {
  // Step 1: Delete storage file if it exists
  const filePath = row[pathColumn] as string | null | undefined;
  if (filePath) {
    try {
      await deleteFile(bucketName, filePath);
    } catch (storageErr) {
      throw new Error(`Failed to delete image: ${(storageErr as Error).message}`);
    }
  }

  // Step 2: Delete DB row (retry up to 3x if storage already deleted)
  let dbErr: { message: string } | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await supabase.from(table).delete().eq('id', row.id as string);
    if (!error) return;
    dbErr = error;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(
    `Image was deleted but the record could not be removed: ${dbErr?.message}`
  );
}
