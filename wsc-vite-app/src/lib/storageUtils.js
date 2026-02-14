import { supabase } from './supabaseClient';

/**
 * Build a public CDN URL for a storage object.
 * DB columns store root-level object names (e.g. 'a1b2c3d4.jpg'),
 * NOT full URLs. This function constructs the full public URL at runtime.
 *
 * @param {string} bucket     - Bucket name (e.g., 'gallery', 'headshots')
 * @param {string} objectName - Root-level filename (e.g., 'a1b2c3d4.jpg')
 * @returns {string|null} Full public URL, or null if objectName is falsy
 */
export function getPublicUrl(bucket, objectName) {
  if (!objectName) return null;
  return supabase.storage.from(bucket).getPublicUrl(objectName).data.publicUrl;
}

/**
 * Upload a file to a Supabase storage bucket with a UUID-based name.
 * Original filename is discarded (prevents collisions and encoding issues).
 *
 * @param {string} bucket - Bucket name
 * @param {File}   file   - File object from input
 * @returns {Promise<{ objectName: string }>} The uploaded object name
 */
export async function uploadFile(bucket, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const objectName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(objectName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;
  return { objectName };
}

/**
 * Delete a file from a Supabase storage bucket.
 *
 * @param {string} bucket     - Bucket name
 * @param {string} objectName - Root-level filename to delete
 */
export async function deleteFile(bucket, objectName) {
  if (!objectName) return;
  const { error } = await supabase.storage.from(bucket).remove([objectName]);
  if (error) throw error;
}
