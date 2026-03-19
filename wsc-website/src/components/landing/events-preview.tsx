'use client';

import { motion, type Variants } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';

import type { Event, QueryError } from '@/types/database';
import Eyebrow from '@/components/ui/eyebrow';
import AsyncStateWrapper from '@/components/shared/async-state-wrapper';
import { revealVariant, viewportConfig } from '@/lib/motion';

/** Events preview uses 0.1s stagger per spec §8.1 */
const eventsContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

interface EventsPreviewProps {
  events: Event[];
  loading: boolean;
  error: QueryError | null;
}

export default function EventsPreview({ events, loading, error }: EventsPreviewProps) {
  const top3 = events.slice(0, 3);

  return (
    <section
      className="px-[clamp(1.5rem,5vw,6rem)] py-[clamp(5rem,10vw,9rem)]"
      aria-label="Upcoming events"
    >
      <div className="mx-auto max-w-[1400px]">
        <AsyncStateWrapper
          loading={loading}
          error={error}
          data={top3}
          emptyMessage="No upcoming events."
        >
          <motion.div
            variants={eventsContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Eyebrow */}
            <motion.div variants={revealVariant}>
              <Eyebrow>UPCOMING EVENTS</Eyebrow>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={revealVariant}
              className="mt-[var(--space-3)] font-display text-[length:var(--text-display)] font-semibold leading-[1.1] text-[var(--color-text-primary)]"
            >
              What&rsquo;s happening.
            </motion.h2>

            {/* Event rows */}
            <div className="mt-[var(--space-8)] border-t border-[var(--color-border)]">
              {top3.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>

            {/* View all link */}
            <motion.div variants={revealVariant} className="mt-[var(--space-6)] text-right">
              <Link
                href="/events"
                className="inline-flex min-h-[2.75rem] items-center font-mono text-[length:var(--text-mono)] text-[var(--color-gold)] transition-opacity duration-250 hover:underline hover:underline-offset-4 active:underline active:underline-offset-4"
                data-cursor="hover"
              >
                View all events &rarr;
              </Link>
            </motion.div>
          </motion.div>
        </AsyncStateWrapper>
      </div>
    </section>
  );
}

function EventRow({ event }: { event: Event }) {
  const dateObj = new Date(event.date);
  const formattedDate = format(dateObj, 'MMM dd').toUpperCase();

  return (
    <motion.div
      variants={revealVariant}
      data-cursor="hover"
      className="group relative flex items-center justify-between border-b border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-6)] transition-colors duration-250 hover:bg-[var(--color-bg-subtle)] active:bg-[var(--color-bg-subtle)] max-md:flex-col max-md:items-start max-md:gap-2 max-md:py-[var(--space-4)]"
    >
      {/* Gold left border — slides in on hover */}
      <span
        className="absolute inset-y-0 left-0 w-[3px] origin-left scale-x-0 bg-[var(--color-gold)] transition-transform duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100 group-active:scale-x-100"
        aria-hidden="true"
      />

      {/* Date */}
      <time
        dateTime={event.date}
        className="shrink-0 font-mono text-[length:var(--text-mono-lg)] font-medium text-[var(--color-gold)] max-md:text-[length:var(--text-mono)]"
      >
        {formattedDate}
      </time>

      {/* Title */}
      <span className="font-display text-[length:var(--text-display-sm)] font-semibold leading-[1.1] text-[var(--color-text-primary)] max-md:text-[clamp(1.25rem,3vw,1.75rem)]">
        {event.title}
      </span>

      {/* Location */}
      <span className="shrink-0 font-body text-[length:var(--text-small)] text-[var(--color-text-muted)]">
        {event.location ?? ''}
      </span>
    </motion.div>
  );
}
