'use client';

import Eyebrow from '@/components/ui/eyebrow';
import ContactForm from '@/components/contact/contact-form';
import { motion } from 'framer-motion';
import { revealVariant, containerVariant, viewportConfig } from '@/lib/motion';

export default function ContactPage() {
  return (
    <main
      className="min-h-screen px-[clamp(1.5rem,5vw,6rem)] pt-[clamp(6rem,10vw,10rem)] pb-[clamp(5rem,10vw,9rem)]"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div className="mx-auto max-w-[680px]">
        <motion.div
          className="mb-[var(--space-12)]"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div variants={revealVariant}>
            <Eyebrow>CONTACT</Eyebrow>
          </motion.div>
          <motion.h1
            variants={revealVariant}
            className="mt-[var(--space-3)] font-display text-[length:var(--text-display)] font-semibold leading-[1.1] text-[var(--color-text-primary)]"
          >
            Get in touch.
          </motion.h1>
          <motion.p
            variants={revealVariant}
            className="mt-[var(--space-3)] font-body text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]"
          >
            We&apos;d love to hear from you.
          </motion.p>
        </motion.div>

        <ContactForm />
      </div>
    </main>
  );
}
