'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TimelineEvent from './timeline-event';
import type { Event } from '@/types/database';

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  events: Event[];
}

export default function Timeline({ events }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show the line at full height immediately
      gsap.set(lineRef.current, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.3,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [events]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-[1400px] px-[clamp(1.5rem,5vw,6rem)]">
      {/* Vertical center line — desktop: centered, mobile: left edge */}
      <div
        ref={lineRef}
        className="
          absolute top-0 bottom-0 origin-top
          left-4 md:left-1/2
          w-[1.5px] -translate-x-1/2
          bg-[var(--color-border-gold)]
          opacity-30
        "
      />

      {/* Event entries */}
      <div className="relative">
        {events.map((event, index) => (
          <TimelineEvent key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}
