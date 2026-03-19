export const LIMITS = {
  MAX_IMAGE_SIZE_MB: 2,
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
  MAX_HEADSHOT_DIMENSION: 3000,
  MAX_LOGO_DIMENSION: 2500,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],

  MAX_EVENTS: 50,
  MAX_SPONSORS: 20,
  MAX_EXECUTIVES: 30,
  MAX_GALLERY_PHOTOS: 40,

  MAX_TOTAL_STORAGE_MB: 500,
} as const;

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
} as const;
