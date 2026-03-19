# Phase 2 Prompt — Redesign Planning & Design Specification

Copy everything below the line into Claude Code.

---

## Context

Read these 4 migration docs before doing anything — they contain the full inventory of the current codebase:
- `docs/migration/supabase-integration.md` — every Supabase call, table schema, auth flow, TypeScript interfaces
- `docs/migration/component-inventory.md` — every component, its props, CSS, dependencies
- `docs/migration/routing-and-data-flow.md` — routing map, data flow, layout structure
- `docs/migration/assets-and-config.md` — static assets, config, dependencies, env vars

## Task

Create a comprehensive design specification and implementation plan at `docs/redesign/design-spec.md`. This document will be the single source of truth for building the new site. It must be detailed enough that any developer (or AI) can follow it to implement the entire redesign without ambiguity.

Also create `docs/redesign/implementation-plan.md` — an ordered, phased plan for building the site piece by piece.

## New Tech Stack

- **Framework**: Next.js 15 (App Router, `app/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme` in `globals.css`, NOT `tailwind.config.js`)
- **Animation**: Framer Motion (layout animations, component transitions, scroll-triggered reveals), GSAP + ScrollTrigger (hero text reveal, complex timeline animations, pinned sections), Lenis (smooth scrolling)
- **Components**: Radix UI primitives (Dialog, Tooltip, Navigation Menu, etc.), 21st.dev components where applicable
- **Backend**: Supabase (UNCHANGED — port existing hooks/utils to TypeScript, rename `VITE_` env vars to `NEXT_PUBLIC_`)
- **Contact Form**: EmailJS (UNCHANGED)
- **Deployment**: Vercel (replacing GitHub Pages)
- **Custom cursor**: Yes (morphing cursor that changes shape/size based on hover target)

## Design Direction

### Philosophy
- **Spacious and luxurious** — generous whitespace, full-width sections, content that breathes
- **Agency-meets-academic hybrid** — modern agency sophistication with professional/university credibility
- **Almost no cards or containers** — everything is free-flowing, open, no boxed-in content
- **Minimal text** — big, bold titles. Short, impactful copy. Let the design speak
- **Dark mode only** — `#0A0A0A`-range backgrounds, refined and elegant

### Color Palette (Refined)
Keep the gold + purple brand identity but make it more sophisticated:
- **Gold accent**: Refine from `#ffd95a` to something slightly less saturated and more elegant (suggest options like `#E8C547`, `#D4A843`, or similar warm golds)
- **Purple accent**: Keep `#4f2683` as the secondary accent but use it sparingly — subtle gradients, borders, hover states
- **Backgrounds**: Deep blacks/near-blacks (`#0A0A0A`, `#0F0F0F`, `#141414`) with subtle variation between sections
- **Text**: Off-white (`#F5F5F5` or `#EDEDED`) for body, pure white for headings
- **Muted text**: `#888888` to `#666666` range for secondary/caption text
- Define these as Tailwind CSS v4 theme tokens (CSS custom properties)

### Typography
- **Headings**: Editorial serif — suggest **Playfair Display** or **Cormorant Garamond** for large display headings. Big, bold, expressive.
- **Body text**: Clean sans-serif — **Inter** or **DM Sans** for readability
- **Scale**: Use a dramatic type scale. Hero headings should be very large (clamp-based, e.g., `clamp(3rem, 8vw, 8rem)`). Section titles should be large. Body text should be comfortable.
- Load fonts via `next/font` (Google Fonts or local)

### Buttons & CTAs
- **Primary style**: Outlined/ghost buttons — transparent fill with a refined border (gold or white), on hover the fill animates in (left-to-right wipe or fade)
- **Hover effect**: Background fills in with gold, text color inverts to dark
- **Sizing**: Generous padding, uppercase or small-caps letter-spacing for CTAs
- **No heavy drop shadows** — keep it flat and elegant

### Custom Cursor
- Morphing cursor that adapts to context:
  - **Default**: Small dot (~8px)
  - **Hovering links/buttons**: Grows larger (~40px), maybe becomes a ring or shows "Click" text
  - **Hovering images**: Grows + shows "View" or an expand icon
  - **Text areas**: Returns to default system cursor
- Use Framer Motion for the spring physics / follow behavior
- Only on desktop (hide on touch devices)

## Page-by-Page Design Specification

### Preloader
- Refined preloader on initial site load
- Club logo (shark.avif) centered, subtle pulse or scale animation
- Smooth reveal transition: preloader fades/lifts to reveal the hero beneath
- Keep it fast — tie to actual asset loading, not an artificial timer
- Use Framer Motion `AnimatePresence` for the exit transition

### Navigation (All Pages)
- **Desktop**: Minimal sticky header — logo on the left, horizontal text links on the right
  - On scroll: backdrop blur increases, nav height shrinks slightly, subtle border-bottom appears
  - Active link indicator: underline or subtle highlight
  - Links: About, Executive Team, Events, Partners, Contact
- **Mobile**: Same minimal header, but links collapse into a hamburger
  - Hamburger opens a full-height slide-in panel (right side) or overlay
  - Large link text, staggered Framer Motion entrance animation
- Use Radix UI `NavigationMenu` primitive as the base
- The nav should feel like it's part of the page, not a separate bar sitting on top

### Landing Page (`/`)
Trim from 8 sections to ~5-6 by merging overlapping content:

**Section 1 — Hero (100vh)**
- Giant display text: club name or a bold tagline
- GSAP SplitText-style character-by-character reveal animation on load (after preloader)
- Cinematic background: full-bleed image (UC-HILL.avif) with heavy overlay/desaturation/duotone treatment so text is readable
- Subtle parallax on the background image (moves slower than scroll)
- A single scroll indicator at the bottom (animated chevron or "Scroll" text)

**Section 2 — About + What We Do (merged)**
- Storytelling block: short, impactful text about what WSC is and does
- Could use a 2-column layout: large serif heading on the left, body text on the right
- Include 2-3 key stats or highlights (e.g., "50+ members", "Real-world agency work") — but NOT in cards. Use large standalone numbers with labels, spaced generously
- Scroll-triggered text reveal (Framer Motion or GSAP): words or lines animate in as user scrolls

**Section 3 — Events Preview**
- Show the next 2-3 upcoming events
- Minimal: large date, event title, one-line description
- "View all events" link at the bottom
- Staggered fade-in cascade on scroll

**Section 4 — Partners Marquee**
- Infinite horizontal scrolling marquee of sponsor logos (Framer Motion or CSS)
- Subtle, not distracting — logos slightly transparent, full opacity on hover
- "See all partners" link below

**Section 5 — CTA (Join / Contact merged)**
- Full-width section with a big, bold heading: "Ready to join?" or "Let's connect" etc.
- Brief text + outlined CTA button linking to contact page
- Cinematic background image (MIDDLESEX.avif) with dark overlay
- This replaces both the old Contact section and Join section on the landing page

### About Page (`/about`)
- **Storytelling scroll**: alternating full-width sections of text and imagery
- Mission section: large serif heading + body paragraph, scroll-triggered fade-in
- Vision section: same treatment, offset layout (text on opposite side)
- Gallery: full-width masonry or grid of photos from Supabase `gallery_photos` table
  - Images load from Supabase storage via `getPublicUrl('gallery', photo.image_path)`
  - Use Next.js `<Image>` component for optimization
  - Cinematic treatment: slight desaturation, subtle parallax or scale-on-scroll
  - No lightbox needed unless you think it adds value — keep it clean

### Executive Team Page (`/executive-team`)
- **Full-width list layout** — not cards
- Each executive is a full-width horizontal row:
  - Headshot on the left (circular or rounded square, good size ~120-160px)
  - Name (large, serif) and title (smaller, muted sans) on the right
  - Generous vertical spacing between rows
- Group by role: Presidents, Vice Presidents, Assistant Vice Presidents
  - Group labels as large, spaced-out section headers with gold accent underline
- **Framer Motion**: each row fades in + slides up slightly as user scrolls into view (staggered per row)
- **Hover effect**: subtle — row background lightens slightly, headshot scales up ~5%, or a gold accent appears
- Headshots from Supabase: `getPublicUrl('headshots', exec.headshot_path)`
- Use the full width of the screen — no max-width container constraining the rows

### Events Page (`/events`)
- **Vertical timeline** layout
- Central vertical line (thin, gold or muted)
- Events alternate left and right of the timeline
- Each event shows: large date (serif, prominent), title, time + location, brief description
- Scroll-animated: events fade/slide in as you scroll down the timeline (Framer Motion `whileInView`)
- Optional: dot/marker on the timeline line at each event's position
- Data from Supabase `events` table, ordered by `date DESC`

### Partners/Sponsors Page (`/sponsors`)
- **Logo wall** — clean grid of sponsor logos
- Logos at comfortable size, evenly spaced grid (3-4 columns desktop, 2 mobile)
- Default: logos at ~60% opacity, grayscale or slightly desaturated
- **Hover**: full color, full opacity, smooth scale up
- Hovering a logo reveals the sponsor name and description below/beside it (Framer Motion `AnimatePresence`)
- If sponsor has a `link`, clicking goes to their website (new tab)
- Logos from Supabase: `getPublicUrl('sponsor-logos', sponsor.logo_path)`

### Contact Page (`/contact-us`)
- **Minimal centered layout**
- Large serif heading: "Get in Touch" or similar
- Clean, spacious form below (full-width inputs, generous padding)
- Fields: Name, Email, Organization Type, Subject, Message (same as current)
- Input animations: labels float up on focus, subtle gold border on focus
- Submit button: outlined style with hover fill
- Social links (Instagram, LinkedIn) below the form — simple icon row
- EmailJS integration preserved exactly (same service/template IDs)
- On success/error: subtle toast or inline message, not a jarring alert

### Terms of Service / Privacy Policy
- Simple, clean typography pages
- No special design treatment needed — just good readable typography with proper heading hierarchy
- Keep the same content, just style it with the new type system

### Admin Dashboard (`/admin`)
- **Do NOT redesign the admin dashboard in this phase** — it's functional, internal-only, and a separate concern
- Port it to TypeScript and make it work within Next.js App Router
- Wrap it in an auth layout (`app/admin/layout.tsx`) that handles the `AdminAuthProvider` logic
- Keep all CRUD operations, form configs, and visibility toggles exactly as they are
- This is a preserve-and-port task, not a redesign

### Footer
- **Minimal single row**
- Logo/club name on the left
- Key navigation links in the center
- Social icons (Instagram, LinkedIn) on the right
- Very bottom: copyright + "A TSI initiative" or similar small text
- Subtle top border (gold accent or muted gray)
- Comfortable padding, but not a huge multi-column footer

## Scroll & Animation Specification

### Lenis Smooth Scroll
- Initialize Lenis globally (in the root layout or a provider)
- Smooth scrolling with natural deceleration
- Must integrate with GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`)
- Disable on mobile if performance is poor (test this)

### GSAP Usage
- **Hero text reveal**: SplitText (or manual character splitting) with staggered timeline
- **ScrollTrigger**: for scroll-based parallax on background images
- Use `gsap.context()` for cleanup in React components (important for Next.js)
- Keep GSAP usage to complex animations that Framer Motion can't do efficiently

### Framer Motion Usage
- **Component transitions**: `AnimatePresence` for page transitions (via Next.js layout transitions)
- **Scroll reveals**: `whileInView` with `viewport={{ once: true }}` for most scroll-triggered animations
- **Hover/tap effects**: `whileHover`, `whileTap` on interactive elements
- **Staggered animations**: `staggerChildren` in parent variants for lists and grids
- **Cursor**: `motion.div` with spring-based `x`/`y` tracking for the custom cursor
- **Preloader exit**: `AnimatePresence` for smooth exit animation

### Page/Section Transitions
- Sections should feel like they "reveal" as you scroll — the new section content slides up over the previous one, with the section's inner content fading in slightly behind the covering motion
- Use a combination of GSAP ScrollTrigger pinning and Framer Motion for element animations within each section
- Between pages: Framer Motion `AnimatePresence` wrapping the page content in the root layout, with a smooth fade + slide transition

## Implementation Guidelines

### Supabase — Tread Lightly
- Port ALL Supabase code from the migration docs EXACTLY — change the syntax from JS to TS but do NOT change the logic
- Use the TypeScript interfaces already drafted in `supabase-integration.md`
- Place Supabase utilities in `src/lib/supabase/` (client.ts, storage.ts, hooks/)
- Keep `useSupabaseQuery` and `useSupabaseMutation` hooks — they work well. Just add types.
- The `deleteContentItem` function's storage-first delete logic is intentional and must be preserved
- Rename env vars: `VITE_*` → `NEXT_PUBLIC_*`
- All Supabase queries happen client-side (`"use client"` components) — don't try to move them to Server Components yet

### File Structure
```
app/
├── layout.tsx              # Root layout: Nav, Footer, Lenis provider, cursor
├── page.tsx                # Landing page
├── about/page.tsx
├── executive-team/page.tsx
├── events/page.tsx
├── sponsors/page.tsx
├── contact-us/page.tsx
├── terms-of-service/page.tsx
├── privacy-policy/page.tsx
├── admin/
│   ├── layout.tsx          # Auth guard (AdminAuthProvider)
│   └── page.tsx            # Admin dashboard
├── globals.css             # Tailwind v4 @theme, CSS custom properties, base styles
└── not-found.tsx           # 404 page

src/
├── components/
│   ├── ui/                 # Radix UI wrapped primitives, 21st.dev components
│   ├── layout/             # Nav, Footer, Preloader
│   ├── landing/            # Hero, AboutSection, EventsPreview, PartnersMarquee, CTA
│   ├── about/              # StorySection, Gallery
│   ├── team/               # ExecutiveList, ExecutiveRow
│   ├── events/             # Timeline, TimelineEvent
│   ├── sponsors/           # LogoWall, LogoCard
│   ├── contact/            # ContactForm
│   ├── cursor/             # CustomCursor
│   └── shared/             # AsyncStateWrapper, ErrorBoundary, etc.
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Supabase client singleton
│   │   ├── storage.ts      # getPublicUrl, uploadFile, deleteFile
│   │   └── hooks/
│   │       ├── use-supabase-query.ts
│   │       └── use-supabase-mutation.ts
│   ├── constants.ts        # CONTENT_CONFIG, limits
│   ├── error-utils.ts      # classifyError()
│   └── utils.ts            # General utilities
├── types/
│   └── database.ts         # Event, Sponsor, Executive, GalleryPhoto, QueryError interfaces
├── providers/
│   ├── lenis-provider.tsx  # Lenis smooth scroll initialization
│   └── admin-auth-provider.tsx
└── hooks/
    └── use-cursor.ts       # Custom cursor state management
```

### What to Put in the Design Spec Document
The `docs/redesign/design-spec.md` should contain:
1. Complete color token definitions (exact hex values for the refined palette)
2. Typography scale with exact font choices, weights, and sizes
3. Spacing system
4. Component-level specifications for every UI element
5. Animation timing/easing standards (what cubic-bezier or spring configs to use consistently)
6. Responsive behavior for every section (mobile vs desktop layout differences)
7. Accessibility requirements (focus states, aria labels, keyboard navigation, reduced motion)

### What to Put in the Implementation Plan
The `docs/redesign/implementation-plan.md` should contain:
1. **Phase A — Scaffolding**: Next.js project setup, Tailwind v4 config, font loading, TypeScript config, Supabase port, env var migration
2. **Phase B — Design System**: Color tokens, typography, button component, cursor component, Lenis setup
3. **Phase C — Layout Shell**: Root layout with Nav + Footer + Preloader, page transition wrapper
4. **Phase D — Landing Page**: Hero through CTA, section by section
5. **Phase E — Inner Pages**: About, Executive Team, Events, Partners, Contact (in that order)
6. **Phase F — Admin Port**: Direct port of admin dashboard to TypeScript/Next.js
7. **Phase G — Polish**: Responsive QA, performance optimization, accessibility pass, final animation tuning
8. **Phase H — Deploy**: Vercel setup, env vars, domain transfer from GitHub Pages

Each phase should list:
- Exact files to create
- Which migration doc to reference for each file
- Dependencies on previous phases
- Estimated complexity (S/M/L)

## Reference Sites for Inspiration
Look at these types of sites for the aesthetic we're going for (agency-meets-academic, editorial, spacious):
- Lusion.co (interactive, cinematic)
- Basement.studio (dark, bold typography, agency)
- Locomotive.ca (smooth scroll, editorial layouts)
- Awwwards.com winners in the "Agency" category

Do NOT just copy these — understand the principles: generous space, intentional motion, editorial typography, dark luxury.

## Rules
- Do NOT write any implementation code — this is planning only
- Do NOT modify any existing source files
- Output two files: `docs/redesign/design-spec.md` and `docs/redesign/implementation-plan.md`
- Be extremely specific — vague specs lead to vague implementations
- Reference the migration docs by name when noting what to preserve
- For every animation, specify: trigger, duration, easing, direction, and whether it replays or fires once
