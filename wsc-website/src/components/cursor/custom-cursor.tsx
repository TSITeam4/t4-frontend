'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '@/hooks/use-cursor';

const SPRING_CONFIG = { stiffness: 500, damping: 32, mass: 0.5 };

// State-driven style maps
const dotScale: Record<string, number> = {
  default: 1,
  hover: 0,
  view: 0,
  text: 1,
};

const ringSize: Record<string, number> = {
  default: 40,
  hover: 48,
  view: 64,
  text: 12,
};

export function CustomCursor() {
  const { cursorState } = useCursor();

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed position for the ring (spring lag)
  const ringX = useSpring(mouseX, SPRING_CONFIG);
  const ringY = useSpring(mouseY, SPRING_CONFIG);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const currentRingSize = ringSize[cursorState];

  return (
    <>
      {/* Dot — follows cursor exactly */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold, #D4A843)',
          pointerEvents: 'none',
          zIndex: 9999,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: dotScale[cursorState],
        }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Ring — follows with spring lag */}
      <motion.div
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: currentRingSize,
          height: currentRingSize,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          width: currentRingSize,
          height: currentRingSize,
          borderWidth: cursorState === 'hover' ? 2 : 1.5,
          borderColor:
            cursorState === 'hover'
              ? 'rgba(212, 168, 67, 1)'
              : 'rgba(212, 168, 67, 0.6)',
          backgroundColor:
            cursorState === 'view'
              ? 'rgba(212, 168, 67, 0.1)'
              : 'transparent',
        }}
        transition={{
          duration: cursorState === 'view' ? 0.3 : 0.25,
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        {/* VIEW label — only visible in 'view' state */}
        <motion.span
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--color-gold, #D4A843)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          animate={{
            opacity: cursorState === 'view' ? 1 : 0,
            scale: cursorState === 'view' ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          VIEW
        </motion.span>
      </motion.div>

      {/* Hide on touch devices */}
      <style jsx global>{`
        @media (pointer: coarse) {
          .custom-cursor-dot,
          .custom-cursor-ring {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
