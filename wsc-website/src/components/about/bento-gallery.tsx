'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariant, revealVariant, easing, viewportConfig } from '@/lib/motion';
import AsyncStateWrapper from '@/components/shared/async-state-wrapper';
import Eyebrow from '@/components/ui/eyebrow';
import type { QueryError } from '@/types/database';

interface GalleryItem {
  id: string;
  src: string | null;
  alt?: string;
  caption?: string;
}

interface BentoGalleryProps {
  photos: GalleryItem[];
  loading: boolean;
  error: QueryError | null;
  onRetry?: () => void;
}

/**
 * Bento grid cell pattern — maps index to grid-area sizing.
 * Desktop: irregular layout with some cells spanning 2 cols or 2 rows.
 * Mobile: uniform 2-column grid.
 */
const cellPatterns = [
  { gridColumn: 'span 2', gridRow: 'span 2' }, // Large
  { gridColumn: 'span 1', gridRow: 'span 2' }, // Tall
  { gridColumn: 'span 2', gridRow: 'span 1' }, // Wide
  { gridColumn: 'span 1', gridRow: 'span 1' }, // Square
  { gridColumn: 'span 1', gridRow: 'span 1' }, // Square
  { gridColumn: 'span 1', gridRow: 'span 1' }, // Square
];

function getCellStyle(index: number) {
  return cellPatterns[index % cellPatterns.length];
}

export default function BentoGallery({
  photos,
  loading,
  error,
  onRetry,
}: BentoGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPhoto = selectedId
    ? photos.find((p) => p.id === selectedId) ?? null
    : null;

  // Close lightbox on Escape key
  const closeLightbox = useCallback(() => setSelectedId(null), []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedId) closeLightbox();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, closeLightbox]);

  return (
    <div style={{ marginTop: 'clamp(5rem, 10vw, 9rem)' }}>
      <Eyebrow className="mb-6 block">GALLERY</Eyebrow>

      <AsyncStateWrapper
        loading={loading}
        error={error}
        data={photos}
        onRetry={onRetry}
        emptyMessage="No photos yet."
      >
        {/* Bento grid */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="bento-grid grid gap-2"
        >
          {photos.map((photo, i) => {
            if (!photo.src) return null;

            const cellStyle = getCellStyle(i);

            return (
              <motion.div
                key={photo.id}
                layoutId={`gallery-${photo.id}`}
                variants={revealVariant}
                data-cursor="view"
                onClick={() => setSelectedId(photo.id)}
                className="bento-cell group relative cursor-pointer overflow-hidden"
                style={cellStyle}
              >
                <motion.div
                  className="relative h-full w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: easing.easeOutQuart,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt || 'Gallery photo'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </motion.div>

                {/* Dark overlay on hover */}
                <div
                  className="pointer-events-none absolute inset-0 bg-[rgba(10,10,10,0.5)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
                />

                {/* Caption slide-up on hover */}
                {photo.caption && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-active:translate-y-0 group-active:opacity-100">
                    <p
                      className="font-mono text-[var(--color-text-secondary)]"
                      style={{ fontSize: 'var(--text-mono)' }}
                    >
                      {photo.caption}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lightbox overlay */}
        <AnimatePresence>
          {selectedPhoto && selectedPhoto.src && (
            <motion.div
              key="lightbox-overlay"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.22, ease: easing.easeOutQuart } }}
              transition={{ duration: 0.3, ease: easing.easeOutQuart }}
              onClick={() => setSelectedId(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-[rgba(10,10,10,0.92)]" />

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(null);
                }}
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-gold)]"
                aria-label="Close lightbox"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>

              {/* Expanded image */}
              <motion.div
                layoutId={`gallery-${selectedPhoto.id}`}
                className="relative z-10 h-[80vh] w-[90vw] max-w-[1200px]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt || 'Gallery photo'}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />

                {selectedPhoto.caption && (
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(10,10,10,0.8)] to-transparent p-6 pt-12 text-center font-mono text-[var(--color-text-secondary)]"
                    style={{ fontSize: 'var(--text-mono)' }}
                  >
                    {selectedPhoto.caption}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AsyncStateWrapper>

      {/* Responsive grid styles defined in globals.css */}
    </div>
  );
}
