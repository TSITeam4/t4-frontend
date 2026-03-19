'use client';

import type { Sponsor, QueryError } from '@/types/database';
import AsyncStateWrapper from '@/components/shared/async-state-wrapper';
import LogoCard from '@/components/sponsors/logo-card';
import { motion } from 'framer-motion';
import { containerVariant, revealVariant, viewportConfig } from '@/lib/motion';

interface LogoWallProps {
  sponsors: Sponsor[];
  loading: boolean;
  error: QueryError | null;
  onRetry?: () => void;
}

export default function LogoWall({ sponsors, loading, error, onRetry }: LogoWallProps) {
  return (
    <AsyncStateWrapper
      loading={loading}
      error={error}
      data={sponsors}
      onRetry={onRetry}
      emptyMessage="No partners yet."
    >
      <motion.div
        className="grid grid-cols-2 gap-0 pb-[clamp(5rem,10vw,9rem)] md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {sponsors.map((sponsor) => (
          <motion.div key={sponsor.id} variants={revealVariant}>
            <LogoCard sponsor={sponsor} />
          </motion.div>
        ))}
      </motion.div>
    </AsyncStateWrapper>
  );
}
