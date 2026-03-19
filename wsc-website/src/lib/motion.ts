import type { Variants } from "framer-motion";

type CubicBezier = [number, number, number, number];

export const easing = {
  /** Primary scroll reveal — smooth, organic entrance */
  easeOutExpo: [0.16, 1, 0.3, 1] as CubicBezier,

  /** Button hover, small interactions — quick, responsive */
  easeOutQuart: [0.25, 1, 0.5, 1] as CubicBezier,

  /** Preloader exit, major transitions — cinematic */
  easeInOutQuart: [0.76, 0, 0.24, 1] as CubicBezier,

  /** Cursor spring (Framer Motion spring config) */
  cursorSpring: { stiffness: 500, damping: 32, mass: 0.5 },

  /** Stagger children default (seconds between children) */
  staggerDefault: 0.08,

  /** Stagger for nav mobile links (faster, more theatrical) */
  staggerNav: 0.05,
} as const;

/** Standard scroll reveal variant — applied to any element entering the viewport */
export const revealVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easing.easeOutExpo },
  },
};

/** Delayed reveal — same as revealVariant but with a slight delay for offset timing */
export const delayedRevealVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easing.easeOutExpo, delay: 0.15 },
  },
};

/** Exit variant — exits are ~75% of entrance duration */
export const exitVariant = {
  opacity: 0,
  y: -20,
  transition: { duration: 0.48, ease: easing.easeOutQuart },
};

/** Staggered container variant — parent wraps children that each use revealVariant */
export const containerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: easing.staggerDefault,
      delayChildren: 0.1,
    },
  },
};

/** Viewport config for whileInView — trigger once, with negative margin */
export const viewportConfig = {
  once: true,
  margin: "-80px" as const,
};
