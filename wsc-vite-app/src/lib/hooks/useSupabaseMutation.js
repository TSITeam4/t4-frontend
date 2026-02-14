import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { classifyError } from '../errorUtils';
import { deleteFile } from '../storageUtils';

/**
 * Generic hook for Supabase mutations (INSERT, UPDATE, DELETE) with
 * error classification and loading state.
 *
 * @returns {{ mutate, loading, error, reset }}
 */
export function useSupabaseMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => setError(null), []);

  /**
   * Execute a mutation function with automatic error handling.
   * @param {Function} mutationFn - Async function performing the mutation
   * @returns {Promise<*>} The result of the mutation function
   */
  const mutate = useCallback(async (mutationFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn();
      return result;
    } catch (err) {
      const classified = classifyError(err);
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
 *
 * @param {string} table      - Table name (e.g., 'events')
 * @param {object} row        - Full row object with id + path columns
 * @param {string} bucketName - Storage bucket name
 * @param {string} pathColumn - Column name holding the object path (e.g., 'image_path')
 */
export async function deleteContentItem(table, row, bucketName, pathColumn) {
  // Step 1: Delete storage file if it exists
  const filePath = row[pathColumn];
  if (filePath) {
    try {
      await deleteFile(bucketName, filePath);
    } catch (storageErr) {
      throw new Error(`Failed to delete image: ${storageErr.message}`);
    }
  }

  // Step 2: Delete DB row (retry up to 3x if storage already deleted)
  let dbErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await supabase.from(table).delete().eq('id', row.id);
    if (!error) return; // success
    dbErr = error;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(
    `Image was deleted but the record could not be removed: ${dbErr.message}`
  );
}
