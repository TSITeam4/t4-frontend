/**
 * Application resource limits — enforced client-side before any Supabase call.
 * Prevents unbounded growth and keeps the project within free tier quotas.
 */
export const LIMITS = {
  // Per-file upload limits
  MAX_IMAGE_SIZE_MB: 2,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],

  // Per-table row limits (prevents unbounded growth)
  MAX_EVENTS: 50,
  MAX_SPONSORS: 20,
  MAX_EXECUTIVES: 30,
  MAX_GALLERY_PHOTOS: 40,

  // Total storage budget (soft limit checked before upload)
  MAX_TOTAL_STORAGE_MB: 500,
};

/**
 * Bucket → table/column mapping for consistent CRUD operations.
 */
export const CONTENT_CONFIG = {
  events: {
    table: 'events',
    visibilityColumn: 'published',
    displayName: 'Events',
    limit: LIMITS.MAX_EVENTS,
  },
  sponsors: {
    table: 'sponsors',
    bucket: 'sponsor-logos',
    pathColumn: 'logo_path',
    visibilityColumn: 'active',
    displayName: 'Sponsors',
    limit: LIMITS.MAX_SPONSORS,
  },
  executives: {
    table: 'executives',
    bucket: 'headshots',
    pathColumn: 'headshot_path',
    visibilityColumn: 'visible',
    displayName: 'Executives',
    limit: LIMITS.MAX_EXECUTIVES,
    orderable: false,
  },
  gallery_photos: {
    table: 'gallery_photos',
    bucket: 'gallery',
    pathColumn: 'image_path',
    visibilityColumn: 'visible',
    displayName: 'Gallery Photos',
    limit: LIMITS.MAX_GALLERY_PHOTOS,
  },
};
