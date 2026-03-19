'use client';

import { motion } from 'framer-motion';
import Eyebrow from '@/components/ui/eyebrow';
import Button from '@/components/ui/button';
import { revealVariant, viewportConfig } from '@/lib/motion';
import type { Variants } from 'framer-motion';

const ctaButtonReveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

export default function CTASection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/MIDDLESEX.avif')" }}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.80)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[700px] text-center flex flex-col items-center">
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <Eyebrow>JOIN THE TEAM</Eyebrow>

          <h2
            className="mt-[var(--space-3)] font-display font-semibold text-[var(--color-text-primary)] leading-[1.1]"
            style={{ fontSize: 'var(--text-display)' }}
          >
            Ready to make your mark?
          </h2>

          <p
            className="mt-[var(--space-4)] max-w-[75ch] font-body font-normal text-[var(--color-text-muted)] leading-[1.7]"
            style={{ fontSize: 'var(--text-body-lg)' }}
          >
            Connect with industry leaders, work on real sales challenges, and
            build a career worth talking about.
          </p>
        </motion.div>

        <motion.div
          className="mt-[var(--space-8)]"
          variants={ctaButtonReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <Button href="/contact-us" className="w-full sm:w-auto">Get in touch</Button>
        </motion.div>
      </div>
    </section>
  );
}
