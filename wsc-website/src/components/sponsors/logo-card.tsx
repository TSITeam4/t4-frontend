'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Sponsor } from '@/types/database';
import { getPublicUrl } from '@/lib/supabase/storage';
import { easing } from '@/lib/motion';

interface LogoCardProps {
  sponsor: Sponsor;
}

export default function LogoCard({ sponsor }: LogoCardProps) {
  const [hovered, setHovered] = useState(false);
  const logoUrl = getPublicUrl('sponsor-logos', sponsor.logo_path ?? null);

  const content = (
    <div
      className="flex aspect-[3/2] flex-col items-center justify-center border border-[var(--color-border)] p-[var(--space-4)] sm:p-[var(--space-8)]"
      data-cursor={sponsor.link ? 'view' : 'hover'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((prev) => !prev)}
    >
      {logoUrl && (
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            opacity: hovered ? 1 : 0.55,
            filter: hovered ? 'grayscale(0)' : 'grayscale(0.4)',
            scale: hovered ? 1.06 : 1,
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3, ease: easing.easeOutQuart }}
        >
          <Image
            src={logoUrl}
            alt={`${sponsor.name} logo`}
            width={180}
            height={60}
            className="max-h-[60px] w-auto object-contain"
            unoptimized={false}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {hovered && (
          <motion.div
            key="sponsor-detail"
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.18, ease: easing.easeOutQuart } }}
            transition={{ duration: 0.25, ease: easing.easeOutQuart }}
          >
            <p className="font-body text-[length:var(--text-body)] font-medium text-[var(--color-text-primary)]">
              {sponsor.name}
            </p>
            {sponsor.description && (
              <p className="mt-1 font-body text-[length:var(--text-small)] text-[var(--color-text-muted)]">
                {sponsor.description}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (sponsor.link) {
    return (
      <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
