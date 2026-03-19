'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/** Split a string into individually-wrapped <span> elements for GSAP character animation */
function CharacterSplit({
  text,
  className,
  charClassName,
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={charClassName}
          style={{
            display: 'inline-block',
            clipPath: 'inset(0 0 100% 0)',
            transform: 'translateY(60px)',
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  // Scroll progress for fading out scroll indicator
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  // Mount flag — hero entrance starts after a fixed delay (~1.5s) to approximate preloader completion
  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP entrance timeline
  useEffect(() => {
    if (!mounted) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion: instant reveal with simple opacity
        gsap.set(
          [
            eyebrowRef.current,
            line2Ref.current?.querySelectorAll('.hero-char'),
            line3Ref.current?.querySelectorAll('.hero-char'),
            subTextRef.current,
            scrollIndicatorRef.current,
          ].flat(),
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }
        );
        return;
      }

      const tl = gsap.timeline({ delay: 1.5 });

      // t=0: Eyebrow fades in
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        0
      );

      // t=0.2: "Western's Sales" character reveal
      const line2Chars = line2Ref.current?.querySelectorAll('.hero-char');
      if (line2Chars?.length) {
        tl.to(
          line2Chars,
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.03,
          },
          0.2
        );
      }

      // t=0.5: "Community." character reveal
      const line3Chars = line3Ref.current?.querySelectorAll('.hero-char');
      if (line3Chars?.length) {
        tl.to(
          line3Chars,
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.03,
          },
          0.5
        );
      }

      // t=1.2: Sub-text fades in
      tl.fromTo(
        subTextRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        1.2
      );

      // t=1.5: Scroll indicator fades in
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power3.out' },
        1.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  // GSAP ScrollTrigger parallax on the background image
  useEffect(() => {
    if (!bgRef.current || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh flex items-center overflow-hidden"
    >
      {/* Background image layer with desaturation */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[10%] -bottom-[10%]"
        style={{ filter: 'saturate(0.7)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/UC-HILL.avif')",
            backgroundPosition: 'center 30%',
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.75) 60%, #0A0A0A 100%)',
        }}
      />

      {/* Text content */}
      <div
        className="relative z-10"
        style={{ paddingLeft: 'clamp(2rem, 8vw, 10rem)', paddingRight: 'clamp(1rem, 4vw, 4rem)' }}
      >
        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          className="block font-mono text-[length:var(--text-mono)] uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-[var(--space-3)]"
          style={{ opacity: 0 }}
        >
          WELCOME TO
        </span>

        {/* Line 2: "Western's Sales" */}
        <div ref={line2Ref}>
          <CharacterSplit
            text="Western's Sales"
            className="block font-display text-[length:var(--text-hero)] font-semibold text-[var(--color-text-primary)] leading-[1.0]"
            charClassName="hero-char"
          />
        </div>

        {/* Line 3: "Community." — italic, gold */}
        <div ref={line3Ref}>
          <CharacterSplit
            text="Community."
            className="block font-display text-[length:var(--text-hero)] font-semibold italic text-[var(--color-gold)] leading-[1.0]"
            charClassName="hero-char"
          />
        </div>

        {/* Sub-text */}
        <p
          ref={subTextRef}
          className="max-w-[75ch] font-body text-[length:var(--text-body-lg)] font-light text-[var(--color-text-muted)] tracking-[0.04em] mt-[var(--space-6)]"
          style={{ opacity: 0 }}
        >
          Empowering sales excellence.
        </p>
      </div>

      {/* Scroll indicator — bottom center */}
      {/* Outer: Framer Motion controls scroll-based fade. Inner: GSAP controls entrance. */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <div
          ref={scrollIndicatorRef}
          className="flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="font-mono text-[length:var(--text-mono-sm)] text-[var(--color-text-subtle)] uppercase tracking-[0.2em]">
            Scroll
          </span>

          {/* Animated chevron */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="animate-scroll-bounce"
            aria-hidden="true"
          >
            <path
              d="M3 6L8 11L13 6"
              stroke="var(--color-text-subtle)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
