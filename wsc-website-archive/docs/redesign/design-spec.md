# Western Sales Club — Design Specification
**Version**: 1.0 | **Phase**: Design Planning
**Stack**: Next.js 15 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP · Lenis

> **Scope**: Single source of truth for all visual and animation decisions. Read this at phases B, C, D, E, G. Contains: color tokens (§2), type scale (§3), spacing system (§4), motion standards (§5), cursor (§6), component specs (§7), page-by-page specs (§8), responsive summary (§9), accessibility requirements (§10).
>
> **Does not cover**: Build order (→ `implementation-plan.md`), DB schema (→ `supabase-integration.md`), old component source (→ `component-inventory.md`).

---

## 1. Design Philosophy

**Agency-meets-academic, dark luxury.** Everything is open, spacious, and intentional. No cards, no containers boxing in content. Typography does the heavy lifting. Motion feels earned, not decorative. The site should feel like a well-designed editorial publication for a serious, ambitious club — not a startup landing page.

Core principles:
- Whitespace is a design element, not wasted space
- Full-width elements/sections/components to utilize the full screen space
- Typography hierarchy over visual complexity
- Motion that guides attention, not competes for it
- Dark backgrounds as the canvas, gold as the accent
- "Traditional/elegant" — Corinthian column energy, not neon agency energy
- HIGHLY RESPONSIVE DESIGN; Must be presentable on ANY screen size.
- BIG titles, minimal supporting text.
- High-contrast colouring.

---

## 2. Color System

All colors defined as CSS custom properties in `app/globals.css` under `@theme`. Never hardcode hex values in components.

### Tokens

```css
@theme {
  /* Backgrounds */
  --color-bg-base:     #0A0A0A;   /* Primary page background */
  --color-bg-elevated: #0F0F0F;   /* Slightly raised surfaces */
  --color-bg-subtle:   #141414;   /* Section alternation, hover states */
  --color-bg-overlay:  #1A1A1A;   /* Modals, dropdowns */

  /* Brand */
  --color-gold:        #D4A843;   /* Primary accent — warm, sophisticated gold */
  --color-gold-muted:  #8A6D2A;   /* Subdued gold for borders, subtle accents */
  --color-gold-dim:    rgba(212, 168, 67, 0.15); /* Tinted backgrounds, glows */
  --color-purple:      #4F2683;   /* Secondary brand — used sparingly */
  --color-purple-dim:  rgba(79, 38, 131, 0.12);  /* Subtle purple tints */

  /* Text */
  --color-text-primary:   #FFFFFF;   /* Headings, high-emphasis content */
  --color-text-secondary: #F0EDEA;   /* Body text, general content */
  --color-text-muted:     #888888;   /* Captions, labels, secondary info */
  --color-text-subtle:    #555555;   /* Decorative, very low emphasis */

  /* Borders */
  --color-border:       rgba(255, 255, 255, 0.08);  /* Default dividers */
  --color-border-gold:  rgba(212, 168, 67, 0.25);   /* Gold-tinted borders */
  --color-border-hover: rgba(212, 168, 67, 0.60);   /* Gold borders on hover */
}
```

### Usage Rules
- **Gold** (`--color-gold`): Active nav links, section title underlines, button borders/hover fills, timeline nodes, stat numbers, key decorative accents. One or two uses per viewport at a time.
- **Purple** (`--color-purple`): Never as a primary fill. Use only as a gradient component (purple → transparent), a faint background tint, or in the admin dashboard.
- **Backgrounds**: Vary between `--color-bg-base` and `--color-bg-subtle` to create subtle section rhythm without hard dividers.

### Gold Rationale
`#D4A843` selected over `#ffd95a` (original) because:
- Lower saturation reads as refined and premium on dark backgrounds
- Passes WCAG AA contrast (4.6:1) against `#0A0A0A` at body text sizes
- Closer to antique gold / aged brass — appropriate for an academic-adjacent club

---

## 3. Typography

### Font Stack

Loaded via `next/font/google` in `app/layout.tsx`. Three typefaces form the system:

| Role | Font | Weights | Notes |
|------|------|---------|-------|
| **Display / Serif** | Cormorant Garamond | 400, 500, 600 (+ italic variants) | Hero titles, section headings, large numbers |
| **UI / Body** | DM Sans | 300, 400, 500 | Nav links, body copy, form labels, buttons |
| **Mono / Labels** | DM Mono | 400, 500 | Dates, eyebrow labels, stat labels, captions |

**Why this pairing**: Cormorant Garamond provides the high-fashion editorial elegance (similar in spirit to Instrument Serif but more classical and refined). DM Sans as body/UI is clean and highly legible without competing with the serif. DM Mono for labels creates the same typographic texture as the Syne/Instrument Serif/DM Mono combo the user referenced.

### Type Scale

Defined as CSS custom properties. Use `clamp()` for responsive fluid scaling.

```css
@theme {
  /* Display (Cormorant Garamond) */
  --text-hero:        clamp(3.5rem, 9vw, 8.5rem);  /* Hero section title */
  --text-display:     clamp(2.5rem, 5.5vw, 5rem);   /* Section headings */
  --text-display-sm:  clamp(1.75rem, 3.5vw, 3rem);  /* Sub-section headings */

  /* UI / Body (DM Sans) */
  --text-heading:     clamp(1.25rem, 2.5vw, 1.75rem); /* Component headings */
  --text-body-lg:     1.125rem;                        /* Lead paragraph, emphasized body */
  --text-body:        1rem;                            /* Standard body */
  --text-small:       0.875rem;                        /* Captions, footnotes */

  /* Mono (DM Mono) */
  --text-mono-sm:     0.75rem;    /* Inline labels, status tags */
  --text-mono:        0.875rem;   /* Date strings, eyebrow text */
  --text-mono-lg:     1rem;       /* Timeline dates, large labels */

  /* Font families (CSS variables for Tailwind v4 theme) */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'DM Mono', 'Courier New', monospace;
}
```

### Usage Rules

- **Section eyebrow labels** (e.g., "ABOUT US", "OUR PARTNERS"): DM Mono, `--text-mono`, uppercase, letter-spacing `0.2em`, `--color-gold`
- **Hero title lines**: See hero spec below — specific treatment per line
- **Body copy**: DM Sans 400, `--text-body-lg` or `--text-body`, `--color-text-secondary`, line-height 1.7
- **Section headings**: Cormorant Garamond 600, `--text-display`, `--color-text-primary`
- **Stat numbers** (e.g., "50+"): Cormorant Garamond 600, `--text-display`, `--color-gold`
- **Nav links**: DM Sans 500, `--text-small`, uppercase, letter-spacing `0.08em`
- **Buttons**: DM Sans 500, `0.8125rem`, uppercase, letter-spacing `0.1em`

### Line Height Defaults
- Display serif: `1.0` to `1.1` (tight for large headlines)
- Body: `1.7`
- Mono labels: `1.4`

---

## 4. Spacing System

Base unit: `0.5rem` (8px). All spacing derived from multiples.

```css
@theme {
  --space-1:  0.5rem;    /*  8px */
  --space-2:  1rem;      /* 16px */
  --space-3:  1.5rem;    /* 24px */
  --space-4:  2rem;      /* 32px */
  --space-6:  3rem;      /* 48px */
  --space-8:  4rem;      /* 64px */
  --space-12: 6rem;      /* 96px */
  --space-16: 8rem;      /* 128px */
  --space-20: 10rem;     /* 160px */
  --space-24: 12rem;     /* 192px */
}
```

**Section vertical padding**: `clamp(5rem, 10vw, 9rem)` top and bottom. This is the single most important rule for maintaining the "spacious" feel.

**Max content width**: `1400px` for wide layouts. `900px` for text-heavy sections (about, contact). Centered with `margin: 0 auto`.

**Horizontal page padding**: `clamp(1.5rem, 5vw, 6rem)` on each side.

---

## 5. Motion & Animation Standards

### Philosophy
Motion serves two purposes: guiding attention and creating a sense of quality. Every animation must be purposeful. Default to doing less rather than more.

### Easing Presets

```javascript
// Use these named easings consistently across all Framer Motion and GSAP work

export const easing = {
  // Primary scroll reveal — smooth, organic entrance
  easeOutExpo: [0.16, 1, 0.3, 1],

  // Button hover, small interactions — quick, responsive
  easeOutQuart: [0.25, 1, 0.5, 1],

  // Preloader exit, major transitions — cinematic
  easeInOutQuart: [0.76, 0, 0.24, 1],

  // Cursor spring (Framer Motion spring config)
  cursorSpring: { stiffness: 500, damping: 32, mass: 0.5 },

  // Stagger children default
  staggerDefault: 0.08,   // seconds between children

  // Stagger for nav mobile links (slower, more theatrical)
  staggerNav: 0.05,
}
```

### Scroll Reveal Standard (Framer Motion)

Applied to any element that enters the viewport. This is the default for most section content:

```javascript
// Standard scroll reveal variant
const revealVariant = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  },
}
// Viewport config: { once: true, margin: "-80px" }
```

**Staggered list reveals** (event rows, team rows, nav items):
```javascript
const containerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
// Each child uses revealVariant
```

### GSAP Usage

GSAP is used **only** for:
1. Hero text character-by-character reveal (clip-path animation after preloader)
2. Background parallax on scroll (hero, events hero, about hero if any)
3. Timeline line draw-in animation (SVG stroke or height reveal)

All GSAP instances must use `gsap.context()` for React cleanup:
```javascript
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, containerRef);
  return () => ctx.revert();
}, []);
```

Must integrate with Lenis: `lenis.on('scroll', ScrollTrigger.update)`.

### Hero Text Reveal (GSAP)

Triggered after preloader exits:
- Split text into individual characters using a simple manual split (no GSAP SplitText plugin — not free)
- Each character: `clipPath: 'inset(0 0 100% 0)'` → `'inset(0 0 0% 0)'` + `y: 60` → `y: 0`
- Duration per character: `0.7s`, ease: `power3.out`
- Stagger: `0.035s` per character, but reset between words (stagger groups)
- Total timeline duration: ~1.8s
- "Welcome to" line (DM Mono eyebrow): fades in as a whole block first, `0.4s`, then the serif lines start
- Delay from preloader exit: `0.3s`

### Preloader Exit Animation (Framer Motion AnimatePresence)

```javascript
exit: {
  y: '-100vh',
  opacity: 0,
  transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
}
```

The hero content should begin its entrance animation as the preloader exits (overlapping by ~0.3s).

### Reduced Motion

All animations must respect `prefers-reduced-motion`. Apply this globally:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
In Framer Motion, check `useReducedMotion()` and reduce to opacity-only fades with duration ≤ 0.2s when true.

---

## 6. Custom Cursor

**Desktop only.** Hidden on touch devices via `@media (pointer: coarse) { display: none }`.

### Anatomy
Two layered elements:
1. **Dot** (`8px × 8px`): Follows cursor exactly (no lag). Solid `--color-gold`. Border-radius 50%.
2. **Ring** (`40px × 40px`): Follows with spring lag (`cursorSpring` config). Border `1.5px solid rgba(212, 168, 67, 0.6)`. Border-radius 50%. Transparent fill by default.

### State Transitions

| Context | Dot | Ring | Transition |
|---------|-----|------|-----------|
| Default | 8px, gold, visible | 40px, transparent border | — |
| Hovering link/button | Scale to 0 (hidden) | Scale to 48px, gold border thicker, opacity 1 | 0.25s easeOutQuart |
| Hovering image/gallery | Scale to 0 | Scale to 64px, gold fill at 10%, "VIEW" text appears centered in ring | 0.3s easeOutQuart |
| Over text content | Dot visible (system cursor underneath) | Ring scale to 12px (nearly hidden) | 0.2s |
| Clicking | Ring pulses: scale 0.85 → 1.0 | Instant snap | Spring |

### Implementation Notes
- Use `motion.div` for both layers, tracking `mouseX`/`mouseY` with `useMotionValue` + `useSpring`
- Store cursor state in a React context (`CursorContext`) so any component can change cursor state via `useCursor()` hook
- The "VIEW" label inside the ring should be DM Mono, `0.625rem`, uppercase, letter-spacing `0.15em`
- Mixing `pointer-events: none` on cursor elements so they don't interfere with actual clicks

---

## 7. Component Specifications

### 7.1 Navigation

**Desktop layout**:
- Fixed positioning, full width
- Default: `background: transparent`, no border
- Scrolled (> 50px): `background: rgba(10, 10, 10, 0.85)`, `backdrop-filter: blur(20px)`, `border-bottom: 1px solid var(--color-border)`
- Height: `72px` default → `60px` scrolled (Framer Motion layout animation, `duration: 0.3s`)
- Left: Shark logo (28px × 28px) + "Western Sales Club" in DM Sans 500, `--text-small`, tracking `0.04em`. Logo + wordmark as one linked unit → `/`
- Right: Nav links — "About", "Executive Team", "Events", "Partners", "Contact" — DM Sans 500, `0.8125rem`, uppercase, tracking `0.08em`, `--color-text-muted` default, `--color-text-primary` on hover, `0.25s` transition
- Active link: gold underline `2px`, `width: 0 → 100%` animates in on mount with `0.4s` delay, `[0.16, 1, 0.3, 1]` easing

**Mobile layout** (< 768px):
- Same fixed header, logo + hamburger only
- Hamburger: three horizontal lines → X, each line `1.4rem × 1.5px`, animated transform, `0.3s`
- Drawer: slides in from right, `min(85vw, 380px)` wide, `100vh` tall, `background: rgba(10, 10, 10, 0.97)`, `backdrop-filter: blur(30px)`
- Links: Cormorant Garamond 500, `clamp(2.2rem, 6vw, 3.2rem)`, one per line, stagger `0.05s`
- A horizontal gold line `1px` separates links from a small social link row at the bottom of the drawer
- Backdrop: `rgba(0,0,0,0.4)` behind the drawer, click to close

**Radix UI NavigationMenu**: Use as the accessibility primitive. Swap out default styles entirely.

---

### 7.2 Preloader

- Full-screen, `z-index: 9999`, background `--color-bg-base`
- Center: `shark.avif` logo, `80px × 80px`
- Subtle pulse: `scale: 1 → 1.06 → 1`, `opacity: 0.8 → 1 → 0.8`, duration `1.8s`, `ease: easeInOut`, `repeat: Infinity`
- No progress bar in the new design — the preloader exits when the 4 critical images finish loading (same logic as current: `shark.avif`, `UC-HILL.avif`, `TORONTO.avif`, `MIDDLESEX.avif`) or after a 3s timeout, whichever comes first
- Exit: Framer Motion `AnimatePresence`, `y: '-100vh'`, `opacity: 0`, `duration: 0.85s`, `ease: [0.76, 0, 0.24, 1]`
- After exit: GSAP hero text reveal begins (`0.3s` delay)

---

### 7.3 Primary Button

```
Transparent fill
Border: 1px solid var(--color-border-gold)
Text: var(--color-gold), DM Sans 500, 0.8125rem, uppercase, tracking 0.1em
Padding: 0.875rem 2.25rem
Border-radius: 0 (sharp corners — more elegant)

Hover state:
  ::after pseudo-element: absolute inset-0, background var(--color-gold)
  scaleX: 0 (transform-origin: left) → scaleX: 1
  transition: 0.35s [0.25, 1, 0.5, 1]
  text color: #0A0A0A (inverts over gold fill)
  text z-index: above the ::after layer

Active (tap): scale: 0.97, 0.1s
```

No drop shadows. No border-radius. The sharp corner reads as confident and architectural.

---

### 7.4 Section Eyebrow Labels

Small text that appears above a section heading to categorize it.

```
Font: DM Mono 400
Size: var(--text-mono), uppercase, letter-spacing: 0.2em
Color: var(--color-gold)
Optional: a short horizontal gold line before or after the text
         e.g.:  ————  ABOUT US
```

Used on: About section on landing, Events preview, Partners marquee, CTA section.

---

### 7.5 Footer

Single-row footer. No multi-column. Clean, minimal.

```
Border-top: 1px solid var(--color-border-gold)  ← subtle gold tint
Padding: clamp(2rem, 4vw, 3.5rem) vertical

Three columns (flexbox, space-between):
  Left:   Shark logo (20px) + "Western Sales Club" in DM Sans 400, small
  Center: Nav links — About · Executive Team · Events · Partners · Contact
          DM Sans 400, var(--text-small), color var(--color-text-muted)
          Separator: · in --color-text-subtle
  Right:  Instagram + LinkedIn icon (inline SVG, 18px, --color-text-muted)
          hover → --color-gold, 0.25s

Below center (or below all, full width):
  "© 2026 Western Sales Club · A TSI Initiative"
  DM Mono, var(--text-mono-sm), --color-text-subtle, text-center
  margin-top: var(--space-3)
```

**Mobile** (< 640px): Stack vertically, center-aligned. Links wrap. Social row centered.

---

### 7.6 Async State Wrapper (Ported)

Port `AsyncStateWrapper.jsx` → `async-state-wrapper.tsx`. Visual style updated:
- Loading spinner: 28px, `border: 1.5px solid transparent`, `border-top-color: var(--color-gold)`, rotate `1s` linear infinite
- Error state: DM Mono small, `--color-text-muted`, with a retry button (ghost style)
- Empty state: Cormorant Garamond italic, `--text-display-sm`, `--color-text-subtle`, centered

---

## 8. Page-by-Page Specification

### 8.1 Landing Page (`/`)

Five sections. The page as a whole should feel like an editorial piece that reveals as you read.

---

#### Section 1 — Hero

**Dimensions**: `100svh` minimum. Full bleed.

**Background**:
- `UC-HILL.avif` as `background-image`, `background-size: cover`, `background-position: center 30%`
- Overlay: `background: linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.75) 60%, #0A0A0A 100%)`
- Optional subtle desaturation: `filter: saturate(0.7)` on the image layer only
- Parallax: GSAP ScrollTrigger, background moves at `0.4×` scroll speed (moves up slower than user scrolls)

**Text composition** (vertical center-left alignment, `padding-left: clamp(2rem, 8vw, 10rem)`):

```
Line 1 — Eyebrow label:
  "WELCOME TO"
  DM Mono 400, var(--text-mono), uppercase, letter-spacing 0.25em
  color: var(--color-text-muted)
  Margin-bottom: var(--space-3)

Line 2 — Hero title, word 1:
  "Western's Sales"
  Cormorant Garamond 600, var(--text-hero)
  color: var(--color-text-primary)
  line-height: 1.0

Line 3 — Hero title, word 2 (final line):
  "Community."
  Cormorant Garamond 600 italic, var(--text-hero)
  color: var(--color-gold)
  line-height: 1.0
```

> The contrast between the upright "Western's Sales" and italic "Community." in gold creates focal emphasis. The period is intentional — it grounds the statement.

**Sub-text** (appears below after hero title, delay `1.2s` from page load):
```
"Empowering sales excellence."
DM Sans 300, var(--text-body-lg)
color: var(--color-text-muted)
letter-spacing: 0.04em
margin-top: var(--space-6)
```

**Scroll indicator** (bottom center, absolute):
```
"Scroll" — DM Mono 400, var(--text-mono-sm), --color-text-subtle, tracking 0.2em
Below: animated chevron SVG (↓), bounce animation: translateY 0 → 8px → 0, 1.5s ease-in-out infinite
Fade out on scroll: opacity goes to 0 when scrollY > 80px
```

**Entrance animation sequence** (GSAP, after preloader exits):
1. `t=0`: Eyebrow label fades in as one block (`opacity: 0 → 1`, `y: 20 → 0`, `0.5s`)
2. `t=0.2`: "Western's Sales" — characters reveal via `clipPath: inset(0 0 100% 0) → inset(0 0 0% 0)` + `y: 60 → 0`. Stagger `0.03s` per character.
3. `t=0.5` (overlapping): "Community." — same character reveal, stagger `0.03s`
4. `t=1.2`: Sub-text fades in (`opacity: 0 → 1`, `y: 16 → 0`, `0.5s`)
5. `t=1.5`: Scroll indicator fades in

---

#### Section 2 — About + What We Do

**Layout**: Two-column on desktop, stacked on mobile.

```
Left column (40% width, desktop):
  Eyebrow: "ABOUT US"
  Section heading: Cormorant Garamond 600, var(--text-display)
  e.g. "Built for ambition, driven by purpose."
  Body: 2–3 sentences about WSC. DM Sans 400, var(--text-body-lg), --color-text-secondary
  CTA link: "Learn more about us →" ghost style, links to /about

Right column (55% width, desktop), slightly offset down (+40px):
  Three stats, each as standalone vertical element:
    Number: Cormorant Garamond 600, clamp(3rem, 5vw, 4.5rem), --color-gold
    Label:  DM Mono 400, var(--text-mono), uppercase, tracking 0.15em, --color-text-muted
  Generous vertical spacing between stats (var(--space-8))
  Suggested stats: "50+ Members", "Real Projects", "Annual Events" (or use actual data)
```

**Scroll animation**: Left column and right column use `whileInView` with `revealVariant`. Right column has `delay: 0.15s` relative to left.

**Mobile**: Stacked. Heading + body first, then stats row (horizontal flex, 3 across).

**Background**: `--color-bg-subtle` to distinguish from the hero section below.

---

#### Section 3 — Events Preview

**Layout**: Minimal, full-width. No cards.

```
Eyebrow: "UPCOMING EVENTS"
Section heading: Cormorant Garamond 600, var(--text-display)
  e.g. "What's happening."
```

Show top 3 upcoming events (from Supabase `events` table, `date DESC`, but filter to `date >= today` for "upcoming"). If fewer than 3 upcoming, show the 3 most recent regardless.

**Each event row** (full width, no border, no card):
```
Horizontal flex, space-between:

Left:
  Date string: DM Mono 500, var(--text-mono-lg), --color-gold
  Format: "MAR 18" (uppercase, no year unless different year)

Center:
  Event title: Cormorant Garamond 600, var(--text-display-sm), --color-text-primary

Right:
  Location: DM Sans 400, var(--text-small), --color-text-muted
```

Rows separated by `1px solid var(--color-border)`. Top border above first row.

**Hover effect on row**: Background transitions to `--color-bg-subtle`, gold left border (`3px solid var(--color-gold)`) slides in from left (scaleX 0 → 1, transform-origin left), `0.25s`.

**Scroll animation**: Rows stagger in with `containerVariant` / `revealVariant`. `staggerChildren: 0.1s`.

**Below the rows**: "View all events →" link, right-aligned. DM Mono 400, `--text-mono`, `--color-gold`, hover underline.

---

#### Section 4 — Partners Marquee

**Layout**: Full-width band. Dark background (`--color-bg-elevated`). No container width cap.

```
Eyebrow above the band: "OUR PARTNERS" — centered, above the scroll band
```

**Marquee band**:
- Continuous horizontal scroll, two copies of the logo list side by side
- Speed: `60s` CSS animation or Framer Motion `x: 0 → -50%`, `repeat: Infinity`, `ease: linear`
- Logos: `height: clamp(2.5rem, 4vw, 4rem)`, `width: auto`, `object-fit: contain`
- Default: `opacity: 0.45`, `filter: grayscale(0.5)`
- Hover on individual logo: `opacity: 1`, `filter: grayscale(0)`, `transform: scale(1.08)`, `0.3s`
- Pause marquee animation on hover (CSS `animation-play-state: paused` via JS class toggle)

**Below the band**: "See all partners →" link, centered. Same DM Mono style as Events section link.

**Logo data**: From Supabase `sponsors` table, `getPublicUrl('sponsor-logos', sponsor.logo_path)`. Use Next.js `<Image>` with `unoptimized={false}`.

---

#### Section 5 — CTA (Join + Contact merged)

**Layout**: Full-viewport-width section. Cinematic.

```
Background: MIDDLESEX.avif, full bleed
  Overlay: rgba(10, 10, 10, 0.80) (heavier than hero — this is more intimate)
  No parallax on this section (keep it simple)

Content: Centered, max-width 700px

Eyebrow: "JOIN THE TEAM"
Heading: Cormorant Garamond 600, var(--text-display), color --color-text-primary
  e.g. "Ready to make your mark?"

Sub-text: DM Sans 400, var(--text-body-lg), --color-text-muted
  1–2 sentences. e.g. "Connect with industry leaders, work on real sales challenges, and build a career worth talking about."

CTA button: Primary button component, "Get in touch", links to /contact-us
  Margin-top: var(--space-8)
```

**Scroll animation**: Heading and sub-text use `revealVariant`. Button has `delay: 0.2s`.

---

### 8.2 About Page (`/about`)

**No hero image section.** Starts with a page title block and flows into storytelling.

**Page title block**:
```
DM Mono eyebrow: "ABOUT WSC"
Heading: Cormorant Garamond 600, var(--text-display)
  e.g. "Who we are."
margin-bottom: var(--space-16)
```

**Mission section** (scroll-triggered):
```
Two-column, desktop:
  Left (45%): Large serif heading — "Our Mission."
              Cormorant Garamond 600 italic, var(--text-display)
              --color-text-primary
  Right (50%): Body paragraphs, DM Sans 400, var(--text-body-lg)
               --color-text-secondary, line-height 1.75
```

**Vision section** (mirrored — text on right, heading on left):
```
Same layout but columns are swapped. Adds visual rhythm.
```

**Gallery section**:
- Eyebrow: "GALLERY"
- **Interactive Bento Grid** layout (inspired by the 21st.dev reference)
- CSS Grid with irregular cell sizes (some `colspan: 2`, some taller, some wider)
- Suggested grid pattern (6 images, desktop):
  ```
  [ Large (2×2) ] [ Tall (1×2) ]
  [ Wide (2×1) ] [ Square (1×1) ]
  ```
  Adapt based on actual photo count from Supabase.
- Each cell: Next.js `<Image>` with `object-fit: cover`, fills entire cell
- **Hover interaction**: Image scales to `1.05`, a dark overlay fades in at `rgba(10,10,10,0.5)`, caption text slides up from bottom (Framer Motion `y: 20 → 0`, `opacity: 0 → 1`)
- Caption: DM Mono `--text-mono`, `--color-text-secondary` on overlay
- **Click interaction**: Framer Motion `layoutId` — clicked image expands to a lightbox overlay (full-screen or near-full, with close button). This adds value given bento grid layout.
- Gap: `0.5rem` between cells
- Mobile: 2-column equal grid (no irregular sizing)

**Data**: `getPublicUrl('gallery', photo.image_path)` for each photo from `gallery_photos` table.

---

### 8.3 Executive Team Page (`/executive-team`)

**Full-width list layout. No cards. No grid.**

**Page title block**: Same as About — eyebrow + heading.

**Grouped sections** (Presidents → Vice Presidents → Assistant VPs):

Group header:
```
DM Mono 400, var(--text-mono), uppercase, tracking 0.2em, --color-text-subtle
Followed by: full-width horizontal rule, 1px, --color-border-gold
margin-bottom: var(--space-8)
```

**Each executive row** (full screen width, within `padding: 0 clamp(2rem, 8vw, 10rem)`):

```
Horizontal flex, align-items: center
Padding: var(--space-6) 0
Border-bottom: 1px solid var(--color-border)
Cursor: default (not pointer — no click interaction needed)

Left (fixed width ~160-200px):
  Headshot: circular, 120px diameter, object-fit: cover
  border: 2px solid transparent (→ var(--color-gold) on row hover)
  transition: 0.3s

Center (flex-grow):
  Name: Cormorant Garamond 600, var(--text-display-sm), --color-text-primary
  Title: DM Sans 400, var(--text-body), --color-text-muted
  margin-left: var(--space-6)

Right (optional — can hold a decorative gold dash "—" or nothing):
  Keep it sparse.
```

**Hover effect on row**:
- Row background: `rgba(212, 168, 67, 0.04)` (barely perceptible warm tint)
- Headshot border becomes gold
- Name color shifts to `--color-gold`
- All transitions `0.25s easeOutQuart`

**Scroll animation**: Framer Motion `whileInView`, staggered per row, `staggerChildren: 0.07s`. Each row: `{ opacity: 0, x: -20 } → { opacity: 1, x: 0 }` (slides in from left, more interesting than pure vertical for a list).

**Headshot data**: `getPublicUrl('headshots', exec.headshot_path)`.

**Mobile** (< 768px): Same row layout but headshot shrinks to `80px`, name font reduces. Still full-width rows.

---

### 8.4 Events Page (`/events`)

**Vertical timeline layout.**

**Page title block**: Eyebrow + heading — "What's on."

**Timeline structure**:
```
Center column: a 1.5px vertical line, --color-border-gold (30% opacity at rest)
  The line "draws in" as user scrolls: GSAP ScrollTrigger, height: 0 → 100%, triggered on scroll progress
  This creates the effect of the timeline revealing as you scroll down

Each event block (full-width, two columns flanking the center line):
  ┌─────────────────┬───┬──────────────────────┐
  │ LEFT COLUMN     │ ● │ RIGHT COLUMN          │
  │ Location/sub    │   │ Event title (BIG)     │
  │ Description     │   │                       │
  └─────────────────┴───┴──────────────────────┘

Center node (●):
  Circle, 12px diameter, border: 2px solid --color-gold, background: --color-bg-base
  Date string above/below the node: DM Mono 500, var(--text-mono), --color-gold

Left column (45% of total width, padding-right: var(--space-8)):
  Location: DM Mono 400, var(--text-mono), --color-text-muted, uppercase, tracking 0.1em
  Description: DM Sans 400, var(--text-body), --color-text-secondary, line-height 1.7
  max-width: 480px

Right column (45% of total width, padding-left: var(--space-8)):
  Event title: Cormorant Garamond 600, var(--text-display), --color-text-primary, line-height 1.1
```

**Event ordering**: `date DESC` (newest at top).

**Scroll animation** (Framer Motion `whileInView`):
- Left column: `{ opacity: 0, x: -32 } → { opacity: 1, x: 0 }`, `duration: 0.6s`
- Right column: `{ opacity: 0, x: 32 } → { opacity: 1, x: 0 }`, `duration: 0.6s`, `delay: 0.1s`
- Node: `{ opacity: 0, scale: 0 } → { opacity: 1, scale: 1 }`, `duration: 0.4s`, spring
- `viewport: { once: true, margin: "-100px" }`

**Empty state**: If no events, display a centered Cormorant italic message: *"No events scheduled yet."*

**Mobile** (< 768px):
- Timeline line stays but shifts to left edge
- All content (title, date, location, description) stacks in a single column to the right of the line
- Node on the left, content on the right

---

### 8.5 Partners/Sponsors Page (`/sponsors`)

**Logo wall layout. Clean, airy.**

**Page title block**: Eyebrow "OUR PARTNERS" + heading "The companies who believe in us."

**Grid**:
```
Desktop: 4-column grid
Tablet:  3-column grid
Mobile:  2-column grid

Each cell:
  padding: var(--space-8)
  aspect-ratio: 3/2
  display: flex, align-items: center, justify-content: center
  border: 1px solid var(--color-border) (subtle grid lines)

Logo image:
  max-height: 60px, width: auto, object-fit: contain
  Default: opacity: 0.55, filter: grayscale(0.4)
  Hover: opacity: 1, filter: grayscale(0), scale: 1.06, 0.3s easeOutQuart
```

**Hover reveal** (Framer Motion AnimatePresence):
On hover, below the logo in the same cell (or as a floating card), animate in:
```
Sponsor name: DM Sans 500, var(--text-body), --color-text-primary
Description: DM Sans 400, var(--text-small), --color-text-muted
Animate: opacity 0→1, y 8→0, duration 0.25s
```

If sponsor has a `link`: entire cell is wrapped in `<a target="_blank">`. Cursor state → "VIEW".

**Data**: `getPublicUrl('sponsor-logos', sponsor.logo_path)` per sponsor.

---

### 8.6 Contact Page (`/contact-us`)

**Minimal, centered. Max-width `680px`, `margin: 0 auto`.**

**Page title**:
```
Eyebrow: "CONTACT"
Heading: "Get in touch."
  Cormorant Garamond 600, var(--text-display)
Sub: "We'd love to hear from you."
  DM Sans 400, var(--text-body-lg), --color-text-muted
Margin-bottom: var(--space-12)
```

**Form fields**:
Same 5 fields as current: Name, Email, Organization Type, Subject, Message.

Field styling:
```
Full-width inputs
Background: transparent
Border: none
Border-bottom: 1px solid var(--color-border)  ← underline style only
Padding: 1rem 0

On focus:
  border-bottom-color: var(--color-gold)
  transition: 0.25s

Label: DM Mono 400, var(--text-mono), --color-text-muted
  Floating label pattern: on focus or when value exists, label animates up and shrinks
  Default position: inside the field (like placeholder)
  Focused/filled position: above the field, y: -24px, scale: 0.85

Message textarea: min-height 140px, resize: vertical
Character counter: DM Mono, --text-mono-sm, --color-text-subtle, right-aligned below textarea
```

**Submit button**: Primary button component. Full-width on mobile.

**Success/Error states**: Framer Motion AnimatePresence. Inline banner above the submit button:
```
Success: --color-gold tint background, checkmark icon + "Message sent. We'll be in touch."
Error:   red-tinted background, "Something went wrong. Please try again."
DM Sans 400, var(--text-body), disappears after 5s
animate: { opacity: 0, y: -12 } → { opacity: 1, y: 0 }, 0.3s
```

**Social row** (below form):
```
Border-top: 1px solid var(--color-border)
margin-top: var(--space-8), padding-top: var(--space-6)
Inline SVG icons: Instagram (20px), LinkedIn (20px)
  --color-text-muted → --color-gold on hover, 0.25s
  DM Mono label next to each icon, --text-mono, --color-text-muted
```

**EmailJS integration**: Preserved exactly — `service_qwpe0fl`, `template_lt8anmn`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`. See `component-inventory.md` for original logic.

---

### 8.7 Terms of Service / Privacy Policy

Clean typography pages. No special design treatment.

```
max-width: 720px, margin: 0 auto
padding-top: clamp(6rem, 10vw, 10rem)  ← account for fixed nav

h1: Cormorant Garamond 600, var(--text-display), margin-bottom: var(--space-6)
    Gold underline rule below (same as section style)
h2: DM Sans 600, var(--text-heading), margin-top: var(--space-8)
p:  DM Sans 400, var(--text-body-lg), --color-text-secondary, line-height 1.75
ul: Same as p, padding-left: var(--space-4)
a:  --color-gold, hover underline

Last updated line: DM Mono, --text-mono-sm, --color-text-muted
```

---

### 8.8 Admin Dashboard (`/admin`)

**OUT OF SCOPE for this redesign.** See `routing-and-data-flow.md` for the existing implementation. Port to TypeScript and Next.js App Router only. No visual changes.

Auth guard goes in `app/admin/layout.tsx` as a wrapper that replicates `AdminAuthProvider` logic.

---

## 9. Responsive Behavior Summary

| Breakpoint | Behavior |
|-----------|---------|
| `< 640px` (mobile) | Single column everything. Nav collapses. Timeline single column. Footer stacks. |
| `640px–768px` (phablet) | Gallery 2-col. Team rows condense. Footer stacks. |
| `768px–1024px` (tablet) | Two-column layouts kick in. Sponsors 3-col. Timeline full width. |
| `> 1024px` (desktop) | Full layouts. Custom cursor active. |

Custom cursor is hidden on `pointer: coarse` devices (touch). Lenis smooth scroll is disabled on `pointer: coarse` devices (use native scroll instead — prevents scroll jank on iOS).

---

## 10. Accessibility Requirements

- All interactive elements have `:focus-visible` styles: `outline: 2px solid var(--color-gold)`, `outline-offset: 3px`
- Remove default `:focus` outline, keep `:focus-visible` only
- All images: meaningful `alt` text. Decorative images: `alt=""`
- Nav: `<nav aria-label="Main navigation">`. Mobile drawer: `aria-expanded`, `aria-controls`
- Custom cursor: Never replaces system cursor — the system cursor remains under the custom layers (`pointer-events: none` on cursor elements)
- Color contrast: All text meets WCAG AA. `--color-text-secondary` (#F0EDEA) on `--color-bg-base` (#0A0A0A) = 18.6:1 ✓. `--color-gold` (#D4A843) on `--color-bg-base` = 4.6:1 ✓ (passes AA for large text)
- `prefers-reduced-motion`: All animations fall back to simple opacity fades ≤ 0.2s
- Form inputs: explicit `<label>` elements associated with inputs via `htmlFor`/`id`. Not placeholder-only.
- Skip nav link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` in root layout
- Timeline `<time>` element for dates with `dateTime` attribute
- `aria-live="polite"` on contact form status messages

---

## 11. SEO & Metadata

### Implementation

Uses the Next.js Metadata API — `export const metadata: Metadata` in each `page.tsx` and a base config in `app/layout.tsx`. No third-party SEO library needed.

### Root Metadata (`src/app/layout.tsx`)

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://westernsalesclub.ca'),
  title: {
    default: 'Western Sales Club',
    template: '%s | Western Sales Club',
  },
  description: "Western University's premier student-run sales organization. Real-world experience, industry mentorship, and a community built on ambition.",
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://westernsalesclub.ca',
    siteName: 'Western Sales Club',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Western Sales Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Per-Page Metadata

Each `page.tsx` exports its own `metadata` object — Next.js merges it with the root config via the title template.

| Page | Title segment | Description |
|------|---------------|-------------|
| `/` (Landing) | *(use root default — no template applied)* | *(use root description)* |
| `/about` | `About` | `Learn about Western Sales Club's mission, vision, and the story behind Western University's premier sales organization.` |
| `/executive-team` | `Executive Team` | `Meet the students leading Western Sales Club — our presidents, vice presidents, and assistant VPs.` |
| `/events` | `Events` | `Upcoming and past Western Sales Club events — workshops, competitions, networking nights, and more.` |
| `/sponsors` | `Partners` | `The companies and organizations that support Western Sales Club and our student community.` |
| `/contact-us` | `Contact Us` | `Get in touch with Western Sales Club. We'd love to hear from you.` |
| `/terms-of-service` | `Terms of Service` | *(no custom description needed)* |
| `/privacy-policy` | `Privacy Policy` | *(no custom description needed)* |

### OG Image

**File**: `src/app/og-image.png` (1200×630 px)

Design spec:
- Background: `#0A0A0A`
- Shark logo: centered-left, ~100px
- "Western Sales Club": Cormorant Garamond 600, ~64px, `#FFFFFF`
- "Empowering sales excellence.": DM Sans 300, ~24px, `#888888`
- A horizontal gold line (`#D4A843`) as a decorative accent
- No text clipping at edges — 80px safe zone on all sides

This is a static PNG for now. Next.js `ImageResponse` (dynamic OG generation) is out of scope for this phase.

### Favicon

Next.js 15 App Router reads icon files directly from `src/app/`:

| File | Size | Usage |
|------|------|-------|
| `src/app/icon.png` | 32×32 | Browser tab favicon (primary) |
| `src/app/apple-icon.png` | 180×180 | iOS home screen |

Convert `shark.avif` → PNG using any converter (`sharp` CLI, Squoosh, etc.). The original `shark.avif` stays in `public/` for use as the preloader logo.

### `robots.txt`

**File**: `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://westernsalesclub.ca/sitemap.xml
```

### Sitemap

**File**: `src/app/sitemap.ts`

```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://westernsalesclub.ca',                   lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://westernsalesclub.ca/about',             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://westernsalesclub.ca/executive-team',    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://westernsalesclub.ca/events',            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://westernsalesclub.ca/sponsors',          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://westernsalesclub.ca/contact-us',        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
  ];
}
```

> `/admin`, `/terms-of-service`, and `/privacy-policy` are intentionally excluded from the sitemap.
