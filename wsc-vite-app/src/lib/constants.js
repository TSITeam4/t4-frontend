/**
 * Application resource limits — enforced client-side before any Supabase call.
 * Prevents unbounded growth and keeps the project within free tier quotas.
 */
export const LIMITS = {
  // Per-file upload limits (images must be within these dimensions; no resizing)
  MAX_IMAGE_SIZE_MB: 2,
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
  /** Headshots can be larger square images (e.g. 2500×2500). */
  MAX_HEADSHOT_DIMENSION: 3000,
  /** Sponsor logos: max 2500×2500. */
  MAX_LOGO_DIMENSION: 2500,
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
