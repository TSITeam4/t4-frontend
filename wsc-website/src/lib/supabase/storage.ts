import { supabase } from './client';

/**
 * Build a public CDN URL for a storage object.
 * DB columns store root-level object names (e.g. 'a1b2c3d4.jpg'),
 * NOT full URLs. This function constructs the full public URL at runtime.
 */
export function getPublicUrl(bucket: string, objectName: string | null | undefined): string | null {
  if (!objectName) return null;
  return supabase.storage.from(bucket).getPublicUrl(objectName).data.publicUrl;
}

/**
 * Upload a file to a Supabase storage bucket with a UUID-based name.
 * Original filename is discarded (prevents collisions and encoding issues).
 */
export async function uploadFile(bucket: string, file: File): Promise<{ objectName: string }> {
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
 */
export async function deleteFile(bucket: string, objectName: string | null | undefined): Promise<void> {
  if (!objectName) return;
  const { error } = await supabase.storage.from(bucket).remove([objectName]);
  if (error) throw error;
}
