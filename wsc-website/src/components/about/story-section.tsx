'use client';

import { motion } from 'framer-motion';
import { revealVariant, delayedRevealVariant, viewportConfig } from '@/lib/motion';

const sectionGap = 'clamp(5rem, 10vw, 9rem)';

export default function StorySection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
      {/* Mission */}
      <div
        className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-0"
      >
        <motion.div
          className="md:w-[45%]"
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <h2
            className="font-display font-semibold italic text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-display)', lineHeight: 1.1 }}
          >
            Our Mission.
          </h2>
        </motion.div>

        <motion.div
          className="md:w-[50%]"
          variants={delayedRevealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p
            className="mb-6 font-body font-normal text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.75 }}
          >
            The Western Sales Club exists to bridge the gap between academic
            learning and real-world sales excellence. We equip students with the
            skills, confidence, and connections needed to thrive in competitive
            business environments.
          </p>
          <p
            className="font-body font-normal text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.75 }}
          >
            Through hands-on workshops, industry mentorship, and collaborative
            projects, we cultivate a community of driven individuals who are
            ready to make an impact from day one.
          </p>
        </motion.div>
      </div>

      {/* Vision — mirrored layout */}
      <div
        className="flex flex-col gap-8 md:flex-row-reverse md:items-start md:justify-between md:gap-0"
      >
        <motion.div
          className="md:w-[45%]"
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <h2
            className="font-display font-semibold italic text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-display)', lineHeight: 1.1 }}
          >
            Our Vision.
          </h2>
        </motion.div>

        <motion.div
          className="md:w-[50%]"
          variants={delayedRevealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p
            className="mb-6 font-body font-normal text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.75 }}
          >
            We envision a future where every Western student has access to
            world-class sales education and mentorship — regardless of their
            faculty or background.
          </p>
          <p
            className="font-body font-normal text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.75 }}
          >
            Our goal is to be the premier student-run sales organization in
            Canada, known for producing graduates who lead with empathy,
            communicate with clarity, and close with confidence.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
