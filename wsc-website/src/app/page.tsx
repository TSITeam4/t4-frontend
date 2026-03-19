'use client';

import { useSupabaseQuery } from '@/lib/supabase/hooks/use-supabase-query';
import type { Event, Sponsor } from '@/types/database';
import Hero from '@/components/landing/hero';
import AboutSection from '@/components/landing/about-section';
import EventsPreview from '@/components/landing/events-preview';
import PartnersMarquee from '@/components/landing/partners-marquee';
import CTASection from '@/components/landing/cta-section';

export default function LandingPage() {
  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
  } = useSupabaseQuery<Event>('events', {
    orderBy: 'date',
    ascending: false,
  });

  const {
    data: sponsors,
    loading: sponsorsLoading,
  } = useSupabaseQuery<Sponsor>('sponsors');

  return (
    <>
      <Hero />
      <AboutSection />
      <EventsPreview events={events} loading={eventsLoading} error={eventsError} />
      <PartnersMarquee sponsors={sponsors} loading={sponsorsLoading} />
      <CTASection />
    </>
  );
}
