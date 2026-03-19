'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Eyebrow from '@/components/ui/eyebrow';
import { revealVariant, delayedRevealVariant, viewportConfig } from '@/lib/motion';

const stats = [
  { number: '50+', label: 'Members' },
  { number: '10+', label: 'Annual Events' },
  { number: '5+', label: 'Industry Partners' },
] as const;

export default function AboutSection() {
  return (
    <section
      className="bg-[var(--color-bg-subtle)]"
      style={{ padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)' }}
    >
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
        {/* Left column — text */}
        <motion.div
          className="w-full md:w-[40%]"
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <Eyebrow>ABOUT US</Eyebrow>

          <h2
            className="mt-[var(--space-3)] font-display font-semibold text-[var(--color-text-primary)] leading-[1.1]"
            style={{ fontSize: 'var(--text-display)' }}
          >
            Built for ambition, driven by purpose.
          </h2>

          <p
            className="mt-[var(--space-4)] max-w-[75ch] font-body font-normal text-[var(--color-text-secondary)] leading-[1.7]"
            style={{ fontSize: 'var(--text-body-lg)' }}
          >
            Western Sales Club is a student-run organization at Western
            University dedicated to empowering the next generation of sales
            professionals. Through real-world projects, mentorship, and
            industry events, we bridge the gap between classroom knowledge and
            career success.
          </p>

          <Link
            href="/about"
            className="mt-[var(--space-6)] inline-flex min-h-[2.75rem] items-center font-mono text-[var(--color-gold)] hover:underline active:underline transition-colors duration-250"
            data-cursor="hover"
            style={{ fontSize: 'var(--text-mono)' }}
          >
            Learn more about us &rarr;
          </Link>
        </motion.div>

        {/* Right column — stats */}
        <motion.div
          className="w-full md:w-[55%] md:translate-y-[40px] flex flex-row flex-wrap md:flex-col justify-between md:justify-start gap-4 md:gap-[var(--space-8)]"
          variants={delayedRevealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-[5rem] flex-1 text-center md:text-left">
              <span
                className="block font-display font-semibold text-[var(--color-gold)]"
                style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1 }}
              >
                {stat.number}
              </span>
              <span
                className="block mt-1 font-mono font-normal uppercase tracking-[0.15em] text-[var(--color-text-muted)]"
                style={{ fontSize: 'var(--text-mono)' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
