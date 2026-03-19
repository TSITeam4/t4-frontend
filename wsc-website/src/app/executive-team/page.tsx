'use client';

import { useMemo } from 'react';
import { useSupabaseQuery } from '@/lib/supabase/hooks/use-supabase-query';
import type { Executive } from '@/types/database';
import AsyncStateWrapper from '@/components/shared/async-state-wrapper';
import Eyebrow from '@/components/ui/eyebrow';
import ExecutiveList from '@/components/team/executive-list';

export default function ExecutiveTeamPage() {
  const {
    data: executives,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<Executive>('executives');

  const presidents = useMemo(
    () => executives.filter((e) => e.group === 'president'),
    [executives]
  );

  const vicePresidents = useMemo(
    () => executives.filter((e) => e.group === 'vice_president'),
    [executives]
  );

  const assistantVicePresidents = useMemo(
    () => executives.filter((e) => e.group === 'assistant_vice_president'),
    [executives]
  );

  return (
    <section
      className="min-h-screen px-[clamp(1.5rem,5vw,6rem)] pb-[clamp(5rem,10vw,9rem)]"
      style={{ paddingTop: 'clamp(6rem, 10vw, 10rem)' }}
    >
      <div className="mb-[var(--space-16)]">
        <Eyebrow className="mb-[var(--space-3)] block">OUR TEAM</Eyebrow>
        <h1 className="font-display text-[length:var(--text-display)] font-semibold leading-[1.1] text-[var(--color-text-primary)]">
          Meet the team.
        </h1>
      </div>

      <AsyncStateWrapper
        loading={loading}
        error={error}
        data={executives}
        onRetry={refetch}
        emptyMessage="No team members yet."
      >
        {presidents.length > 0 && (
          <ExecutiveList title="Presidents" executives={presidents} />
        )}
        {vicePresidents.length > 0 && (
          <ExecutiveList title="Vice Presidents" executives={vicePresidents} />
        )}
        {assistantVicePresidents.length > 0 && (
          <ExecutiveList
            title="Assistant Vice Presidents"
            executives={assistantVicePresidents}
          />
        )}
      </AsyncStateWrapper>
    </section>
  );
}
