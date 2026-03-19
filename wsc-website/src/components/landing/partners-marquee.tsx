'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Sponsor } from '@/types/database';
import Eyebrow from '@/components/ui/eyebrow';
import { getPublicUrl } from '@/lib/supabase/storage';

interface PartnersMarqueeProps {
  sponsors: Sponsor[];
  loading: boolean;
}

export default function PartnersMarquee({ sponsors, loading }: PartnersMarqueeProps) {
  const [paused, setPaused] = useState(false);

  // Graceful empty state — render nothing if loading or no sponsors
  if (loading || sponsors.length === 0) return null;

  return (
    <section
      className="bg-[var(--color-bg-elevated)] py-[clamp(5rem,10vw,9rem)]"
      aria-label="Our partners"
    >
      {/* Eyebrow */}
      <div className="mb-[var(--space-8)] text-center">
        <Eyebrow>OUR PARTNERS</Eyebrow>
      </div>

      {/* Marquee band — overflow-x-clip prevents page-level horizontal scroll */}
      <div
        className="marquee-wrapper overflow-x-clip overflow-y-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => setPaused((prev) => !prev)}
      >
        <div
          className={`marquee-track flex w-max items-center gap-[clamp(2.5rem,6vw,5rem)] ${paused ? '[animation-play-state:paused]' : ''}`}
        >
          {/* Two copies for seamless loop */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-[clamp(2.5rem,6vw,5rem)]"
            >
              {sponsors.map((sponsor) => {
                const logoUrl = getPublicUrl('sponsor-logos', sponsor.logo_path ?? null);
                if (!logoUrl) return null;

                return (
                  <Image
                    key={`${copy}-${sponsor.id}`}
                    src={logoUrl}
                    alt={sponsor.name}
                    width={160}
                    height={64}
                    data-cursor="hover"
                    className="h-[clamp(2.5rem,4vw,4rem)] w-auto object-contain opacity-45 grayscale-[0.5] transition-all duration-300 hover:scale-[1.08] hover:opacity-100 hover:grayscale-0 active:scale-[1.08] active:opacity-100 active:grayscale-0"
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* See all partners link */}
      <div className="mt-[var(--space-8)] text-center">
        <Link
          href="/sponsors"
          className="inline-flex min-h-[2.75rem] items-center font-mono text-[length:var(--text-mono)] text-[var(--color-gold)] transition-opacity duration-250 hover:underline hover:underline-offset-4 active:underline active:underline-offset-4"
          data-cursor="hover"
        >
          See all partners &rarr;
        </Link>
      </div>

      {/* Marquee keyframes defined in globals.css */}
    </section>
  );
}
