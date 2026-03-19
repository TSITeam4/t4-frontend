'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseQuery } from '@/lib/supabase/hooks/use-supabase-query';
import { getPublicUrl } from '@/lib/supabase/storage';
import { revealVariant, viewportConfig } from '@/lib/motion';
import Eyebrow from '@/components/ui/eyebrow';
import StorySection from '@/components/about/story-section';
import BentoGallery from '@/components/about/bento-gallery';
import type { GalleryPhoto } from '@/types/database';

export default function AboutPage() {
  const {
    data: photos,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<GalleryPhoto>('gallery_photos');

  const galleryItems = useMemo(
    () =>
      photos.map((photo) => ({
        id: photo.id,
        src: getPublicUrl('gallery', photo.image_path),
        alt: photo.alt,
        caption: photo.caption,
      })),
    [photos]
  );

  return (
    <section
      style={{
        paddingTop: 'clamp(6rem, 10vw, 10rem)',
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
        paddingLeft: 'clamp(1.5rem, 5vw, 6rem)',
        paddingRight: 'clamp(1.5rem, 5vw, 6rem)',
      }}
    >
      {/* Page title block */}
      <motion.div
        variants={revealVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        style={{ marginBottom: 'var(--space-16)' }}
      >
        <Eyebrow className="mb-4 block">ABOUT WSC</Eyebrow>
        <h1
          className="font-display font-semibold text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-display)',
            lineHeight: 1.1,
          }}
        >
          Who we are.
        </h1>
      </motion.div>

      <StorySection />

      <BentoGallery
        photos={galleryItems}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </section>
  );
}
