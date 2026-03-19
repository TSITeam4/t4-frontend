'use client';

import { useSupabaseQuery } from '@/lib/supabase/hooks/use-supabase-query';
import type { Sponsor } from '@/types/database';
import Eyebrow from '@/components/ui/eyebrow';
import LogoWall from '@/components/sponsors/logo-wall';
import { motion } from 'framer-motion';
import { revealVariant, containerVariant, viewportConfig } from '@/lib/motion';

export default function SponsorsPage() {
  const { data: sponsors, loading, error, refetch } = useSupabaseQuery<Sponsor>('sponsors');

  return (
    <main
      className="min-h-screen px-[clamp(1.5rem,5vw,6rem)] pt-[clamp(6rem,10vw,10rem)]"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <motion.div
        className="mb-[var(--space-16)]"
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <motion.div variants={revealVariant}>
          <Eyebrow>OUR PARTNERS</Eyebrow>
        </motion.div>
        <motion.h1
          variants={revealVariant}
          className="mt-[var(--space-3)] font-display text-[length:var(--text-display)] font-semibold leading-[1.1] text-[var(--color-text-primary)]"
        >
          The companies who believe in us.
        </motion.h1>
      </motion.div>

      <LogoWall sponsors={sponsors} loading={loading} error={error} onRetry={refetch} />
    </main>
  );
}
