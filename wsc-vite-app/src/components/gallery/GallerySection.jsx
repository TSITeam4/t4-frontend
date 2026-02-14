import React from 'react';
import LazyImage from '../lazy-image/LazyImage';

/**
 * GallerySection — responsive photo grid with loading / empty / error states.
 *
 * Props
 * -----
 * photos   : Array<{ id, src, alt, caption? }>
 * loading  : boolean
 * error    : string | null
 * onRetry  : () => void
 */
function GallerySection({ photos = [], loading = false, error = null, onRetry }) {
  /* ── Loading skeleton ──────────────────────────────────── */
  if (loading) {
    return (
      <section className="about-section gallery-section">
        <h3 className="gallery-title">Our Events</h3>
        <div className="gallery-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gallery-skeleton" aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  /* ── Error state ───────────────────────────────────────── */
  if (error) {
    return (
      <section className="about-section gallery-section">
        <h3 className="gallery-title">Gallery</h3>
        <div className="gallery-state-message">
          <p className="gallery-error-text">Couldn't load photos right now.</p>
          {onRetry && (
            <button className="gallery-retry-btn" onClick={onRetry} type="button">
              Try Again
            </button>
          )}
        </div>
      </section>
    );
  }

  /* ── Empty state ───────────────────────────────────────── */
  if (!photos || photos.length === 0) {
    return (
      <section className="about-section gallery-section">
        <h3 className="gallery-title">Gallery</h3>
        <div className="gallery-state-message">
          <p className="gallery-empty-text">No photos yet — check back soon!</p>
        </div>
      </section>
    );
  }

  /* ── Success: render photo grid ────────────────────────── */
  return (
    <section className="about-section gallery-section">
      <h3 className="gallery-title">Gallery</h3>
      <div className="gallery-grid">
        {photos
          .filter((p) => p && p.src)
          .map((photo) => (
            <figure key={photo.id} className="gallery-item">
              <LazyImage
                src={photo.src}
                alt={photo.alt || ''}
                className="gallery-image"
              />
              {photo.caption && (
                <figcaption className="gallery-caption">{photo.caption}</figcaption>
              )}
            </figure>
          ))}
      </div>
    </section>
  );
}

export default GallerySection;
