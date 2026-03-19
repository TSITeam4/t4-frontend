'use client';

import { useSupabaseQuery } from '@/lib/supabase/hooks/use-supabase-query';
import AsyncStateWrapper from '@/components/shared/async-state-wrapper';
import Eyebrow from '@/components/ui/eyebrow';
import Timeline from '@/components/events/timeline';
import type { Event } from '@/types/database';

export default function EventsPage() {
  const { data: events, loading, error, refetch } = useSupabaseQuery<Event>(
    'events',
    { orderBy: 'date', ascending: false }
  );

  return (
    <main className="min-h-screen bg-[var(--color-bg-base)] pt-[clamp(6rem,10vw,10rem)] pb-[clamp(5rem,10vw,9rem)]">
      {/* Page title block */}
      <div className="mx-auto max-w-[1400px] px-[clamp(1.5rem,5vw,6rem)] mb-[var(--space-16)]">
        <Eyebrow>EVENTS</Eyebrow>
        <h1 className="mt-[var(--space-3)] font-display text-[length:var(--text-display)] font-semibold leading-[1.1] text-[var(--color-text-primary)]">
          What&apos;s on.
        </h1>
      </div>

      {/* Timeline */}
      <AsyncStateWrapper
        loading={loading}
        error={error}
        data={events}
        onRetry={refetch}
        emptyMessage="No events scheduled yet."
      >
        <Timeline events={events} />
      </AsyncStateWrapper>
    </main>
  );
}
