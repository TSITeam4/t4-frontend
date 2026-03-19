'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getPublicUrl } from '@/lib/supabase/storage';
import { easing } from '@/lib/motion';
import type { Executive } from '@/types/database';

interface ExecutiveRowProps {
  executive: Executive;
}

const rowVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easing.easeOutExpo },
  },
};

export default function ExecutiveRow({ executive }: ExecutiveRowProps) {
  const headshotUrl = getPublicUrl('headshots', executive.headshot_path);

  return (
    <motion.div
      variants={rowVariant}
      data-cursor="hover"
      className="group flex w-full items-center gap-[var(--space-6)] border-b border-[var(--color-border)] py-[var(--space-6)] transition-colors duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[rgba(212,168,67,0.04)] active:bg-[rgba(212,168,67,0.04)] max-md:py-[var(--space-4)]"
    >
      {/* Headshot */}
      <div className="size-[120px] shrink-0 max-md:size-[80px]">
        {headshotUrl ? (
          <Image
            src={headshotUrl}
            alt={executive.name}
            width={120}
            height={120}
            className="size-full rounded-full border-2 border-transparent object-cover transition-[border-color] duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:border-[var(--color-gold)] group-active:border-[var(--color-gold)]"
          />
        ) : (
          <div className="size-full rounded-full border-2 border-transparent bg-[var(--color-bg-subtle)] transition-[border-color] duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:border-[var(--color-gold)] group-active:border-[var(--color-gold)]" />
        )}
      </div>

      {/* Name + Title */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-[length:var(--text-display-sm)] font-semibold leading-[1.1] text-[var(--color-text-primary)] transition-colors duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:text-[var(--color-gold)] group-active:text-[var(--color-gold)] max-md:text-[clamp(1.25rem,3vw,1.75rem)]">
          {executive.name}
        </h3>
        <p className="mt-1 font-body text-[length:var(--text-body)] text-[var(--color-text-muted)] max-md:text-[length:var(--text-small)]">
          {executive.title}
        </p>
      </div>
    </motion.div>
  );
}
