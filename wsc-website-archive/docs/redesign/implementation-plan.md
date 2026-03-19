# Western Sales Club — Implementation Plan

**Version**: 1.0 | **Phase**: Approach Planning
**Stack**: Next.js 15 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP · Lenis · Supabase

> **Scope**: Phased build order — exact files to create, dependencies, complexity ratings, and a file creation checklist. Read this first at every phase to know what to build and in what order.
>
> **Does not cover**: Visual/animation details (→ `design-spec.md`), DB/hook specs (→ `supabase-integration.md`), old component source (→ `component-inventory.md`).
>
> Each phase must be complete before the next begins unless noted otherwise.

---

## Phase Overview

| Phase | Name | Complexity | Depends On |
| ----- | ---- | ---------- | ---------- |
| **0** | Repo Setup | S | — |
| **A** | Scaffolding | M | 0 |
| **B** | Design System | M | A |
| **C** | Layout Shell | L | B |
| **D** | Landing Page | L | C |
| **E** | Inner Pages | L | C (can run in parallel per page) |
| **F** | Admin Port | S | A |
| **G** | Polish | M | D, E |
| **H** | Deploy | S | G |

> Admin (Phase F) is **deferred** — do not implement until explicitly requested.

---

## Phase 0 — Repo Setup & Initialization

**Goal**: Transform the current `wsc-website/` directory into a clean Next.js project root. Old Vite code is moved to `_reference/` (preserved for porting). All dependencies installed. Assets copied. Repo ready to begin Phase A.

> **Do NOT delete any old code before fully replacing it with TypeScript equivalents.** The `_reference/wsc-vite-app/` directory must remain intact throughout the entire build — every component you port should be read from there first.

### 0.1 — Initialize Next.js at Repo Root

From inside `wsc-website/`, run:

```bash
npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --no-git
```

When prompted for project name, enter `wsc-website`. The `--no-git` flag prevents a new git repo from being created (git is already initialized at the parent level).

This creates: `src/`, `public/`, `package.json`, `next.config.ts`, `tsconfig.json`, updated `.gitignore`, `README.md`.

**Complexity**: S

### 0.2 — Move Old Vite App to Reference Directory

```bash
mkdir _reference
mv wsc-vite-app _reference/wsc-vite-app
```

The `_reference/` directory is **read-only for the entire project**. Never modify anything inside it. All porting and archaeology reads from `_reference/wsc-vite-app/`. The planning docs in `docs/migration/` reference paths under `_reference/wsc-vite-app/`.

**Complexity**: S

### 0.3 — Copy Static Assets to Next.js Public Folder

```bash
cp _reference/wsc-vite-app/public/shark.avif public/
cp _reference/wsc-vite-app/public/UC-HILL.avif public/
cp _reference/wsc-vite-app/public/TORONTO.avif public/
cp _reference/wsc-vite-app/public/MIDDLESEX.avif public/
cp _reference/wsc-vite-app/public/NEWYORK.avif public/
cp _reference/wsc-vite-app/public/abt1.avif public/
cp _reference/wsc-vite-app/public/abt2.avif public/
cp _reference/wsc-vite-app/public/TSI.avif public/
cp _reference/wsc-vite-app/public/Instagram.svg public/
cp _reference/wsc-vite-app/public/Linkedin.svg public/
```

Also create `public/robots.txt` — see `design-spec.md` §11.

**Favicon**: `shark.avif` works in modern browsers but AVIF isn't universally supported as a favicon. Convert `shark.avif` to PNG (any online converter or `sharp` CLI), then save as `src/app/icon.png` (32×32) for Next.js to auto-serve as the favicon.

**OG image**: Create `src/app/og-image.png` (1200×630) — see `design-spec.md` §11 for spec.

**Complexity**: S

### 0.4 — Install Additional Dependencies

```bash
# Animation
npm install framer-motion gsap lenis

# Radix UI primitives
npm install @radix-ui/react-navigation-menu @radix-ui/react-dialog @radix-ui/react-tooltip

# Supabase
npm install @supabase/supabase-js

# Email
npm install @emailjs/browser

# Date utilities
npm install date-fns

# Font Awesome (preserved for admin compatibility when eventually ported)
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

# TypeScript types
npm install -D @types/node
```

Reference: `docs/migration/assets-and-config.md` → "Keep" and "New Packages to Add" columns.

**Complexity**: S

### 0.5 — Create Environment Files

**`.env.local`** (not committed):
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

**`.env.example`** (committed):
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Reference: `docs/migration/assets-and-config.md` §Environment Variables.

**Complexity**: S

### 0.6 — Clear Default Boilerplate

- `src/app/page.tsx` — replace with minimal placeholder:
  ```tsx
  export default function Home() { return <main>Coming soon</main>; }
  ```
- `src/app/globals.css` — strip all default content; leave only `@import "tailwindcss";`. Full tokens are added in Phase B.
- `public/` — remove default Next.js SVGs (`next.svg`, `vercel.svg`) if present.
- Remove `src/assets/` if created (unused Vite artifact equivalent).

**Complexity**: S

---

**After Phase 0, the repo is:**
```
wsc-website/
├── src/app/
│   ├── globals.css     ← @import "tailwindcss" only
│   ├── layout.tsx      ← Next.js default skeleton
│   └── page.tsx        ← placeholder
├── public/             ← all AVIF + SVG assets copied in
├── _reference/
│   └── wsc-vite-app/   ← DO NOT MODIFY
├── supabase/           ← DO NOT TOUCH
├── docs/               ← planning docs
├── package.json        ← Next.js + all deps installed
├── next.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
└── CLAUDE.md
```

Phase A begins from this state.

---

## Phase A — Scaffolding

**Goal**: TypeScript and Next.js configs finalized. Tailwind v4 tokens bootstrapped. Supabase logic ported from JS to TS and placed in `src/lib/supabase/`.

> Project init and dependency installation were handled in Phase 0. Phase A covers configuration and library porting only.

### A.1 — Tailwind CSS v4 Setup

**File to modify**: `src/app/globals.css`

Tailwind v4 uses CSS-first configuration. Remove `tailwind.config.js` entirely. Add to `globals.css`:

```css
@import "tailwindcss";

@theme {
  /* All color, typography, and spacing tokens from design-spec.md Section 2, 3, 4 */
}
```

Reference: `docs/redesign/design-spec.md` §2 (Colors), §3 (Typography), §4 (Spacing) for all exact values.

**Complexity**: S

### A.2 — TypeScript Config

**File**: `tsconfig.json`

Ensure:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### A.3 — Next.js Config

**File**: `next.config.ts`

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',  // for Supabase storage CDN URLs
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

This enables Next.js `<Image>` with Supabase storage URLs. Reference: `docs/migration/supabase-integration.md` for the Supabase URL pattern.

**Complexity**: S

### A.4 — Supabase Client

**File**: `src/lib/supabase/client.ts`

Port from `_reference/wsc-vite-app/src/lib/supabaseClient.js`. Change:

- `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`
- Add TypeScript types

Reference: `docs/migration/supabase-integration.md` §Core Supabase Client.

**Complexity**: S

### A.5 — Supabase Storage Utils

**File**: `src/lib/supabase/storage.ts`

Port from `_reference/wsc-vite-app/src/lib/storageUtils.js`. Add TypeScript signatures. Logic unchanged.

Functions: `getPublicUrl(bucket, objectName)`, `uploadFile(bucket, file)`, `deleteFile(bucket, objectName)`

Reference: `docs/migration/supabase-integration.md` §Storage Buckets.

**Complexity**: S

### A.6 — Supabase Hooks

**Files**:

- `src/lib/supabase/hooks/use-supabase-query.ts`
- `src/lib/supabase/hooks/use-supabase-mutation.ts`

Port from `_reference/wsc-vite-app/src/lib/hooks/useSupabaseQuery.js` and `useSupabaseMutation.js`.

Add TypeScript generics: `useSupabaseQuery<T>(table, options)` returning `QueryResult<T>`.

**Critical**: Preserve `deleteContentItem` function exactly including the 3-retry logic and storage-first delete order. This is noted as intentional in `docs/migration/supabase-integration.md` §Critical Notes #5.

Also preserve `JSON.stringify(filters)` in the dependency array (prevents infinite re-renders).

**Complexity**: S

### A.7 — Types

**File**: `src/types/database.ts`

Copy TypeScript interfaces directly from `docs/migration/supabase-integration.md` §TypeScript Interfaces:
`Event`, `Sponsor`, `Executive`, `GalleryPhoto`, `QueryError`, `QueryResult<T>`

**Complexity**: S

### A.8 — Constants & Utilities

**Files**:

- `src/lib/constants.ts` — port `CONTENT_CONFIG` and `LIMITS` from `_reference/wsc-vite-app/src/lib/constants.js`
- `src/lib/error-utils.ts` — port `classifyError()` from `_reference/wsc-vite-app/src/lib/errorUtils.js`
- `src/lib/image-utils.ts` — port `validateImageDimensions()` from `_reference/wsc-vite-app/src/lib/imageUtils.js`

Reference: `docs/migration/supabase-integration.md` §Content Configuration and §Error Classification.

**Complexity**: S

### A.9 — Lenis Provider

**File**: `src/providers/lenis-provider.tsx`

```typescript
'use client'
// Initialize Lenis smooth scroll
// lenis.on('scroll', ScrollTrigger.update)  ← GSAP integration
// useEffect cleanup: lenis.destroy()
// Disable on pointer: coarse (touch) devices
```

**Complexity**: S

---

## Phase B — Design System

**Goal**: All shared visual primitives exist and are testable before any page is built.

### B.1 — Global CSS & Tokens

**File**: `src/app/globals.css`

Complete the `@theme` block started in A.1. Include:

- All color tokens (§2 of design-spec)
- All typography tokens (§3 of design-spec)
- All spacing tokens (§4 of design-spec)
- Base reset: `*, *::before, *::after { box-sizing: border-box }`
- Base body: `background: var(--color-bg-base); color: var(--color-text-secondary); font-family: var(--font-body)`
- Global focus styles: `:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 3px }`
- `prefers-reduced-motion` media query block (§5 of design-spec)
- Custom scrollbar styling (thin, `--color-bg-subtle` track, `--color-gold` thumb)
- Skip nav link styles

**Complexity**: S

### B.2 — Font Loading

**File**: `src/app/layout.tsx` (initial skeleton only — full layout in Phase C)

```typescript
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
});
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});
```

Apply all three `variable` classes to the `<html>` element.

Reference: `docs/redesign/design-spec.md` §3 Typography.

**Complexity**: S

### B.3 — Button Component

**File**: `src/components/ui/button.tsx`

Implements the primary button spec from `docs/redesign/design-spec.md` §7.3.

Props: `{ children, href?, onClick?, type?, className?, disabled? }`

If `href` provided: renders as `<Link>`. Otherwise: `<button>`.

The `::after` fill-on-hover uses a CSS-only approach (`scaleX` pseudo-element) — no JS needed.

**Complexity**: S

### B.4 — Custom Cursor

**File**: `src/components/cursor/custom-cursor.tsx`
**File**: `src/hooks/use-cursor.ts`
**File**: `src/providers/cursor-provider.tsx`

Three parts:

1. `use-cursor.ts`: Hook that exposes `setCursorState('default' | 'hover' | 'view' | 'text')`
2. `cursor-provider.tsx`: React context wrapping `CursorContext`
3. `custom-cursor.tsx`: The two `motion.div` layers (dot + ring), `useMotionValue`/`useSpring` for position tracking

Reference: `docs/redesign/design-spec.md` §6 Custom Cursor for full spec (state transitions, spring config, size values).

Apply `data-cursor="hover"` / `data-cursor="view"` attributes on interactive elements as a convention. The cursor component reads `document.querySelector('[data-cursor]')` via `mouseover` events.

**Complexity**: M

### B.5 — Section Eyebrow Label

**File**: `src/components/ui/eyebrow.tsx`

Tiny component: `<span>` with DM Mono styles, uppercase, gold, tracking `0.2em`. Props: `{ children, className? }`.

**Complexity**: S

### B.6 — Shared: AsyncStateWrapper & ErrorBoundary

**Files**:

- `src/components/shared/async-state-wrapper.tsx`
- `src/components/shared/error-boundary.tsx`
- `src/components/shared/full-page-loader.tsx`

Port from `_reference/wsc-vite-app/src/components/shared/`. Update styles to match new design system (gold spinner, Cormorant empty state text, etc.).

Reference: `docs/migration/component-inventory.md` §AsyncStateWrapper, §ErrorBoundary, §FullPageLoader.

**Complexity**: S

### B.7 — Animation Variants & Utilities

**File**: `src/lib/motion.ts`

Export the standard animation variants and easing constants:

```typescript
export const easing = { ... }
export const revealVariant = { ... }
export const containerVariant = { ... }
// etc.
```

Reference: `docs/redesign/design-spec.md` §5 Motion.

This prevents the animation config from being copy-pasted into every component.

**Complexity**: S

---

## Phase C — Layout Shell

**Goal**: Nav, Footer, Preloader, and root layout are complete and working. Every page automatically has the correct frame.

### C.1 — Navigation

**File**: `src/components/layout/nav.tsx`

Full spec in `docs/redesign/design-spec.md` §7.1.

Key implementation notes:

- Use Radix UI `NavigationMenu` as the semantic wrapper, strip all Radix styles
- `useScrollY()` hook (or `useScroll` from Framer Motion) to drive the scroll-state CSS class
- Mobile drawer: Framer Motion `AnimatePresence` for entrance/exit, staggered link animations
- `usePathname()` from `next/navigation` for active link detection (replaces `useLocation()`)
- Mobile menu state: `useState<boolean>` local to Nav; body scroll lock via `document.body.style.overflow`

Reference: `docs/migration/routing-and-data-flow.md` §Nav for the existing implementation details and edge cases (scroll position preservation on mobile).

**Complexity**: M

### C.2 — Footer

**File**: `src/components/layout/footer.tsx`

Spec: `docs/redesign/design-spec.md` §7.5.

Simple component. Three-column flex layout on desktop, stacked on mobile. Dynamic year via `new Date().getFullYear()`.

**Complexity**: S

### C.3 — Preloader

**File**: `src/components/layout/preloader.tsx`

Spec: `docs/redesign/design-spec.md` §7.2.

Key notes:

- Same 4 images as current: `/shark.avif`, `/UC-HILL.avif`, `/TORONTO.avif`, `/MIDDLESEX.avif`
- Promise.all on Image load events OR 3s timeout (whichever first) to fire `onLoadComplete`
- Framer Motion `AnimatePresence` handles exit
- Parent must wrap `<Preloader>` in `AnimatePresence`

Reference: `docs/migration/component-inventory.md` §Preloader for original implementation.

**Complexity**: S

### C.4 — Root Layout

**File**: `src/app/layout.tsx`

```typescript
// Wraps all pages except /admin
// Structure:
// <html> (with font variables)
//   <body>
//     <CursorProvider>
//       <LenisProvider>
//         <CustomCursor />
//         <Preloader onLoadComplete={...} />
//         <AnimatePresence>          ← for preloader exit
//           <Nav />
//           {children}              ← main page content
//           <Footer />
//         </AnimatePresence>
//       </LenisProvider>
//     </CursorProvider>
//   </body>
// </html>
```

Notes:

- `<Preloader>` shown on initial load only — use `useState` + `useEffect` to track first load. After complete, remove from DOM via `AnimatePresence`.
- `<Nav>` and `<Footer>` are always present (Admin page overrides via its own `layout.tsx`)
- `<main id="main-content">` around `{children}` for skip-nav accessibility

**Complexity**: M

### C.5 — Not Found Page

**File**: `src/app/not-found.tsx`

Simple centered page: large Cormorant "404.", DM Sans body text, a button back to home.

**Complexity**: S

---

## Phase D — Landing Page

**Goal**: All 5 landing sections implemented, animated, and data-connected.

> Each section is a separate component file. `app/page.tsx` composes them.

### D.1 — Landing Page Container

**File**: `src/app/page.tsx`

```typescript
'use client'  // needed for Supabase hooks
// useSupabaseQuery('events', { orderBy: 'date', ascending: false })
// useSupabaseQuery('sponsors')
// Renders: <Hero />, <AboutSection />, <EventsPreview />, <PartnersMarquee />, <CTASection />
```

Note: Events and sponsors fetched here (top level of Landing) and passed as props to child sections. This mirrors the existing architecture in `docs/migration/routing-and-data-flow.md` §Data Flow.

**Complexity**: S

### D.2 — Hero Section

**File**: `src/components/landing/hero.tsx`

Spec: `docs/redesign/design-spec.md` §8.1 Section 1.

Key implementation:

- GSAP `useGSAP()` hook for the character reveal timeline — fires after `preloaderComplete` prop becomes true
- Manual character split: `"Western's Sales".split('')` → wrap each in `<span>` with clip-path CSS var
- Background parallax: GSAP ScrollTrigger on the image `div`
- Scroll indicator: simple `motion.div` with y-animation + `useScroll` to fade it out
- Lenis integration: ScrollTrigger must be updated via `lenis.on('scroll', ScrollTrigger.update)`

Props: `{ preloaderComplete: boolean }` (passed from `app/page.tsx`)

**Complexity**: L

### D.3 — About + Stats Section

**File**: `src/components/landing/about-section.tsx`

Spec: `docs/redesign/design-spec.md` §8.1 Section 2.

Two-column layout with scroll-triggered reveal. Stats are hardcoded in this component (not from Supabase). Use Framer Motion `whileInView` with `containerVariant` / `revealVariant` from `src/lib/motion.ts`.

**Complexity**: M

### D.4 — Events Preview Section

**File**: `src/components/landing/events-preview.tsx`

Spec: `docs/redesign/design-spec.md` §8.1 Section 3.

Props: `{ events: Event[], loading: boolean, error: QueryError | null }`

Shows top 3 events. Format date with `date-fns` (`format(date, 'MMM dd')`). Each row is a `motion.div` with staggered reveal. Hover: gold left border slides in.

Reference `docs/migration/supabase-integration.md` §events for column names.

**Complexity**: M

### D.5 — Partners Marquee

**File**: `src/components/landing/partners-marquee.tsx`

Spec: `docs/redesign/design-spec.md` §8.1 Section 4.

Props: `{ sponsors: Sponsor[], loading: boolean }`

Two copies of the logo list side-by-side for seamless loop. CSS `animation: marquee 60s linear infinite`. Pause on hover. Each logo: Next.js `<Image>`, `data-cursor="hover"`. Default grayscale + opacity, hover full color.

Reference: `docs/migration/component-inventory.md` §Landing Page for the existing `.marquee-track` implementation.

**Complexity**: M

### D.6 — CTA Section

**File**: `src/components/landing/cta-section.tsx`

Spec: `docs/redesign/design-spec.md` §8.1 Section 5.

Static section with background image (MIDDLESEX.avif), heading, sub-text, primary Button linking to `/contact-us`. Framer Motion scroll reveal.

**Complexity**: S

---

## Phase E — Inner Pages

**Goal**: All public-facing inner pages implemented. These are independent and can be built in parallel.

### E.1 — About Page

**Files**:

- `src/app/about/page.tsx`
- `src/components/about/story-section.tsx`
- `src/components/about/bento-gallery.tsx`

`**page.tsx`**: `'use client'`, fetches `gallery_photos` via `useSupabaseQuery('gallery_photos')`. Renders StorySection + BentoGallery.

`**story-section.tsx**`: Two alternating text sections (Mission, Vision). Static copy. Framer Motion scroll reveals, offset timing.

`**bento-gallery.tsx**`:

- Interactive bento grid (irregular CSS Grid — some cells `grid-column: span 2`, etc.)
- Each cell: Next.js `<Image>` with `object-fit: cover`, fills cell
- Hover: scale `1.05`, dark overlay fade, caption slide-up (Framer `whileHover`)
- Click: Framer Motion `layoutId` lightbox expand. A shared layout animation expands the clicked image to full-screen with an overlay. Close button top-right. `AnimatePresence` for enter/exit.
- Mobile: 2-col uniform grid
- Data: transform gallery rows to `{ id, src: getPublicUrl('gallery', photo.image_path), alt, caption }`

Reference: `docs/migration/supabase-integration.md` §gallery_photos, `docs/migration/component-inventory.md` §GallerySection (original implementation to replace).

**Complexity**: L (bento grid + lightbox), M (story section)

### E.2 — Executive Team Page

**Files**:

- `src/app/executive-team/page.tsx`
- `src/components/team/executive-list.tsx`
- `src/components/team/executive-row.tsx`

`**page.tsx`**: `'use client'`, fetches `executives` via `useSupabaseQuery('executives')`. Groups by `group` column using `useMemo`. Renders three `<ExecutiveList>` blocks (Presidents, VPs, AVPs).

`**executive-list.tsx**`: Renders a group header (DM Mono label + gold rule) + list of `<ExecutiveRow>` components wrapped in `motion.div` container for stagger.

`**executive-row.tsx**`: Spec: `docs/redesign/design-spec.md` §8.3. Headshot via `getPublicUrl('headshots', exec.headshot_path)`, renders as Next.js `<Image>`. Hover: row bg tint, headshot gold border, name → gold. `data-cursor="hover"`.

Reference: `docs/migration/supabase-integration.md` §executives (column names, group values), `docs/migration/component-inventory.md` §Profile (original headshot component).

**Complexity**: M

### E.3 — Events Page

**Files**:

- `src/app/events/page.tsx`
- `src/components/events/timeline.tsx`
- `src/components/events/timeline-event.tsx`

`**page.tsx`**: `'use client'`, fetches `events` via `useSupabaseQuery('events', { orderBy: 'date', ascending: false })`. Renders `<Timeline>`.

`**timeline.tsx**`: Outer wrapper. Contains the vertical center line (a `div` that GSAP ScrollTrigger reveals — `scaleY: 0 → 1` from top). Maps events to `<TimelineEvent>` with index for stagger.

`**timeline-event.tsx**`: Full spec in `docs/redesign/design-spec.md` §8.4. Three-column flex: left (location + description), center (node + date), right (title). Framer Motion `whileInView` — left column from left, right column from right, node spring scale-in. Use `<time dateTime={event.date}>` for accessibility.

Reference: `docs/migration/supabase-integration.md` §events, `docs/migration/component-inventory.md` §Event (original card to replace).

**Complexity**: L (timeline line animation + alternating columns + scroll reveal)

### E.4 — Partners/Sponsors Page

**Files**:

- `src/app/sponsors/page.tsx`
- `src/components/sponsors/logo-wall.tsx`
- `src/components/sponsors/logo-card.tsx`

`**page.tsx`**: `'use client'`, fetches `sponsors`. Renders page title + `<LogoWall>`.

`**logo-wall.tsx**`: CSS Grid with responsive column count. `AsyncStateWrapper` for loading/error/empty states.

`**logo-card.tsx**`: Spec: `docs/redesign/design-spec.md` §8.5. `whileHover` for reveal of sponsor name/description. Wrapped in `<a>` if `sponsor.link` exists. `data-cursor="view"` if has link. Logo via `getPublicUrl('sponsor-logos', sponsor.logo_path)`, Next.js `<Image>`.

Reference: `docs/migration/supabase-integration.md` §sponsors, `docs/migration/component-inventory.md` §Sponsor.

**Complexity**: M

### E.5 — Contact Page

**Files**:

- `src/app/contact-us/page.tsx`
- `src/components/contact/contact-form.tsx`

`**page.tsx`**: Thin wrapper, renders page title block + `<ContactForm>`.

`**contact-form.tsx**`: Full spec in `docs/redesign/design-spec.md` §8.6. Port logic exactly from `_reference/wsc-vite-app/src/components/contact-form/ContactForm.jsx` — same field names, same EmailJS service/template IDs, same validation logic. Only styling and animation change. Floating label pattern is a CSS-only animation (transform + font-size on `:focus` or `:not(:placeholder-shown)`).

Reference: `docs/migration/component-inventory.md` §ContactForm (field names, EmailJS IDs, validation rules — critical to preserve exactly).

**Complexity**: M

### E.6 — Static Pages

**Files**:

- `src/app/terms-of-service/page.tsx`
- `src/app/privacy-policy/page.tsx`

Copy content from `_reference/wsc-vite-app/src/pages/TermsOfService.jsx` and `PrivacyPolicy.jsx`. Apply new typography styles. No functionality — purely static markup.

**Complexity**: S

---

## Phase F — Admin Port

**Status**: DEFERRED. Do not implement in this redesign cycle.

When the time comes:

- `src/app/admin/layout.tsx` — auth guard (port of `AdminAuthProvider.jsx`)
- `src/app/admin/page.tsx` — dashboard shell
- `src/providers/admin-auth-provider.tsx` — Google OAuth logic
- Port all admin components to TypeScript
- Reference `docs/migration/routing-and-data-flow.md` §Admin Dashboard Structure and §Protected Routes for complete spec

---

## Phase G — Polish

**Goal**: Responsive QA, accessibility, performance, reduced motion, final animation tuning.

### G.1 — Responsive QA Pass

For every page and component, verify at:

- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad portrait)
- 1024px (iPad landscape)
- 1440px (desktop)
- 1920px (wide desktop)

Common issues to check:

- Hero text doesn't overflow on narrow screens
- Timeline collapses correctly on mobile
- Nav mobile drawer doesn't exceed viewport
- Images don't distort in bento grid
- Footer wraps cleanly on small screens
- All `clamp()` values feel right at all sizes

### G.2 — Performance Optimization

- All `<Image>` components have explicit `width` and `height` or `fill` + sized container
- Lazy loading for below-fold images (Next.js `<Image>` default)
- GSAP `gsap.context()` cleanup in all components using GSAP
- No unused CSS (Tailwind v4 purges automatically)
- `loading="lazy"` on non-critical images
- Run Lighthouse — target 90+ Performance

### G.3 — Accessibility Pass

- Tab through every page, verify focus order is logical
- Screen reader test on Nav, Contact Form, Timeline
- Verify all `aria-`* attributes from `docs/redesign/design-spec.md` §10 are in place
- Test with `prefers-reduced-motion: reduce` — no animations should be jarring or distracting

### G.4 — Reduced Motion

- Implement global `useReducedMotion()` check in `src/lib/motion.ts`
- Export a `useAnimationConfig()` hook that returns either full config or reduced config
- GSAP animations: wrap in `if (!prefersReducedMotion)` checks

### G.5 — Final Animation Tuning

- Walk through the site on real devices
- Ensure Lenis feels natural (adjust lerp if needed, typically `0.1`)
- Verify GSAP hero reveal timing feels cinematic (not rushed)
- Check Framer Motion spring values on cursor feel snappy but not jittery
- Confirm all `whileInView` triggers fire at the right scroll depth (adjust `margin` if elements pop in too early/late)

---

## Phase H — Deploy

**Goal**: Live on Vercel with the production Supabase config and custom domain.

### H.1 — Vercel Project Setup

1. Push the Next.js project to GitHub (new repo or new branch)
2. Connect to Vercel via `vercel.com` → import project
3. Framework: Next.js (auto-detected)
4. Root directory: `wsc-website/` (Next.js IS the repo root — no monorepo subdirectory)

### H.2 — Environment Variables

In Vercel dashboard → Project → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
```

Set for Production, Preview, and Development environments.

### H.3 — Supabase OAuth Redirect URI Update

In Supabase Dashboard → Authentication → URL Configuration, add Vercel URLs:

- `https://[your-vercel-url].vercel.app/admin`
- `https://westernsalesclub.ca/admin`

### H.4 — Domain Transfer

In Vercel → Project → Domains, add `westernsalesclub.ca`.

Update DNS at your registrar:

- Add Vercel's provided A record / CNAME
- Remove the GitHub Pages `CNAME` record

### H.5 — GitHub Pages Cleanup

Once DNS resolves and Vercel is live:

- Disable GitHub Pages in the old repo's settings
- The `_reference/wsc-vite-app/` directory can remain as-is — it was never part of the deployed site. Only the Vite build artifacts (`deploy.js`, `404.html`) are obsolete.

**Complexity**: S

---

## Dependency Graph

```
A (Scaffolding)
└── B (Design System)
    ├── C (Layout Shell)
    │   ├── D (Landing Page) ──────── G (Polish)
    │   │   ├── D.2 Hero                └── H (Deploy)
    │   │   ├── D.3 About Section
    │   │   ├── D.4 Events Preview
    │   │   ├── D.5 Partners Marquee
    │   │   └── D.6 CTA
    │   └── E (Inner Pages) ──────────┘
    │       ├── E.1 About
    │       ├── E.2 Executive Team
    │       ├── E.3 Events
    │       ├── E.4 Partners
    │       ├── E.5 Contact
    │       └── E.6 Static Pages
    └── [F Admin — DEFERRED]
```

---

## File Creation Checklist

### Phase 0

- `npx create-next-app@latest .` ← run from inside `wsc-website/`
- `_reference/wsc-vite-app/` ← move from `wsc-vite-app/`
- `public/` ← all AVIF + SVG assets copied from `_reference/wsc-vite-app/public/`
- `src/app/icon.png` ← favicon (shark.avif converted to 32×32 PNG)
- `src/app/apple-icon.png` ← 180×180 PNG
- `src/app/og-image.png` ← OG image (1200×630, see design-spec.md §11)
- `public/robots.txt` ← see design-spec.md §11
- `src/app/sitemap.ts` ← see design-spec.md §11
- `.env.local` (not committed)
- `.env.example`

### Phase A

- `src/app/globals.css` (Tailwind v4 import, no tokens yet — tokens in Phase B)
- `next.config.ts` (updated with Supabase image domain)
- `tsconfig.json` (strict mode, @/* alias verified)
- `src/lib/supabase/client.ts`
- `src/lib/supabase/storage.ts`
- `src/lib/supabase/hooks/use-supabase-query.ts`
- `src/lib/supabase/hooks/use-supabase-mutation.ts`
- `src/types/database.ts`
- `src/lib/constants.ts`
- `src/lib/error-utils.ts`
- `src/lib/image-utils.ts`
- `src/providers/lenis-provider.tsx`

### Phase B

- `src/app/globals.css` (complete)
- `src/lib/motion.ts`
- `src/components/ui/button.tsx`
- `src/components/ui/eyebrow.tsx`
- `src/components/cursor/custom-cursor.tsx`
- `src/hooks/use-cursor.ts`
- `src/providers/cursor-provider.tsx`
- `src/components/shared/async-state-wrapper.tsx`
- `src/components/shared/error-boundary.tsx`
- `src/components/shared/full-page-loader.tsx`

### Phase C

- `src/components/layout/nav.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/preloader.tsx`
- `src/app/layout.tsx`
- `src/app/not-found.tsx`

### Phase D

- `src/app/page.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/about-section.tsx`
- `src/components/landing/events-preview.tsx`
- `src/components/landing/partners-marquee.tsx`
- `src/components/landing/cta-section.tsx`

### Phase E

- `src/app/about/page.tsx`
- `src/components/about/story-section.tsx`
- `src/components/about/bento-gallery.tsx`
- `src/app/executive-team/page.tsx`
- `src/components/team/executive-list.tsx`
- `src/components/team/executive-row.tsx`
- `src/app/events/page.tsx`
- `src/components/events/timeline.tsx`
- `src/components/events/timeline-event.tsx`
- `src/app/sponsors/page.tsx`
- `src/components/sponsors/logo-wall.tsx`
- `src/components/sponsors/logo-card.tsx`
- `src/app/contact-us/page.tsx`
- `src/components/contact/contact-form.tsx`
- `src/app/terms-of-service/page.tsx`
- `src/app/privacy-policy/page.tsx`

### Phase G

- Responsive QA
- Lighthouse run
- Accessibility audit
- Reduced motion testing
- Animation tuning

### Phase H

- Vercel deployment
- Env vars set
- OAuth redirects updated
- Domain transferred
- GitHub Pages disabled

