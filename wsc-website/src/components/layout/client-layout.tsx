'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CursorProvider } from '@/providers/cursor-provider';
import { LenisProvider } from '@/providers/lenis-provider';
import { CustomCursor } from '@/components/cursor/custom-cursor';
import Preloader from '@/components/layout/preloader';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <CursorProvider>
      <LenisProvider>
        <CustomCursor />

        <AnimatePresence mode="wait">
          {!preloaderComplete && (
            <Preloader
              key="preloader"
              onLoadComplete={() => setPreloaderComplete(true)}
            />
          )}
        </AnimatePresence>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[var(--color-bg-base)] focus:text-[var(--color-gold)] focus:outline-2 focus:outline-[var(--color-gold)] focus:outline-offset-[3px]"
        >
          Skip to content
        </a>

        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </LenisProvider>
    </CursorProvider>
  );
}
