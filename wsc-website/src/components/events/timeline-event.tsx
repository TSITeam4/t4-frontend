'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { easing } from '@/lib/motion';
import type { Event } from '@/types/database';

interface TimelineEventProps {
  event: Event;
  index: number;
}

const viewportConfig = { once: true, margin: '-100px' as const };

export default function TimelineEvent({ event, index }: TimelineEventProps) {
  const parsedDate = parseISO(event.date);
  const formattedDate = format(parsedDate, 'MMM dd, yyyy').toUpperCase();

  return (
    <div className="relative py-[var(--space-8)] md:py-[var(--space-12)]">
      {/* ---- Mobile layout (< 768px): single column to the right of left-edge line ---- */}
      <div className="block md:hidden pl-12">
        {/* Node — positioned on the line */}
        <motion.div
          className="absolute left-4 top-[var(--space-8)] -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: easing.easeOutExpo }}
          viewport={viewportConfig}
        >
          <div className="size-3 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-bg-base)]" />
        </motion.div>

        {/* Content stacked */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: easing.easeOutExpo }}
          viewport={viewportConfig}
        >
          {/* Date */}
          <time
            dateTime={event.date}
            className="mb-2 block font-mono text-[length:var(--text-mono)] font-medium text-[var(--color-gold)]"
          >
            {formattedDate}
          </time>

          {/* Title */}
          <h3 className="mb-3 font-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold leading-[1.1] text-[var(--color-text-primary)]">
            {event.title}
          </h3>

          {/* Location */}
          {event.location && (
            <p className="mb-2 font-mono text-[length:var(--text-mono)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              {event.location}
            </p>
          )}

          {/* Description */}
          {event.description && (
            <p className="max-w-[480px] font-body text-[length:var(--text-body)] leading-[1.7] text-[var(--color-text-secondary)]">
              {event.description}
            </p>
          )}
        </motion.div>
      </div>

      {/* ---- Desktop layout (>= 768px): three-column flanking center line ---- */}
      <div className="hidden md:flex items-start">
        {/* Left column — Location + Description (45%) */}
        <motion.div
          className="flex w-[45%] justify-end pr-[var(--space-8)]"
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: easing.easeOutExpo }}
          viewport={viewportConfig}
        >
          <div className="max-w-[480px] text-right">
            {event.location && (
              <p className="mb-2 font-mono text-[length:var(--text-mono)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                {event.location}
              </p>
            )}
            {event.description && (
              <p className="font-body text-[length:var(--text-body)] leading-[1.7] text-[var(--color-text-secondary)]">
                {event.description}
              </p>
            )}
          </div>
        </motion.div>

        {/* Center — Node + Date (10%) */}
        <motion.div
          className="flex w-[10%] flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: easing.easeOutExpo }}
          viewport={viewportConfig}
        >
          <div className="size-3 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-bg-base)]" />
          <time
            dateTime={event.date}
            className="whitespace-nowrap font-mono text-[length:var(--text-mono)] font-medium text-[var(--color-gold)]"
          >
            {formattedDate}
          </time>
        </motion.div>

        {/* Right column — Event title (45%) */}
        <motion.div
          className="w-[45%] pl-[var(--space-8)]"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: easing.easeOutExpo, delay: 0.1 }}
          viewport={viewportConfig}
        >
          <h3 className="font-display text-[length:var(--text-display)] font-semibold leading-[1.1] text-[var(--color-text-primary)]">
            {event.title}
          </h3>
        </motion.div>
      </div>
    </div>
  );
}
