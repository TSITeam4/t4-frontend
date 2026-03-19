'use client';

import { motion, type Variants } from 'framer-motion';
import type { Executive } from '@/types/database';
import { viewportConfig } from '@/lib/motion';

/** Executive rows use 0.07s stagger per spec §8.3 */
const execContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};
import ExecutiveRow from './executive-row';

interface ExecutiveListProps {
  title: string;
  executives: Executive[];
}

export default function ExecutiveList({ title, executives }: ExecutiveListProps) {
  return (
    <div className="mb-[var(--space-12)]">
      {/* Group header */}
      <p className="font-mono text-[length:var(--text-mono)] font-normal uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
        {title}
      </p>
      <hr className="mb-[var(--space-8)] mt-[var(--space-2)] border-0 border-t border-t-[var(--color-border-gold)]" />

      {/* Staggered row container */}
      <motion.div
        variants={execContainerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {executives.map((executive) => (
          <ExecutiveRow key={executive.id} executive={executive} />
        ))}
      </motion.div>
    </div>
  );
}
