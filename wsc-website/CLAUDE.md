# CLAUDE.md — Western Sales Club Website

> This file is loaded into every Claude Code session for this project. Read it fully before touching any code.

---

## About the Project

**Western Sales Club (WSC)** is a student-run sales organization at Western University.

- **Website**: westernsalesclub.ca
- **Motto**: "Empowering sales excellence."
- **Affiliation**: A TSI (Tech for Social Impact) initiative
- **Public pages**: Home, About, Executive Team, Events, Partners (Sponsors), Contact
- **Protected page**: `/admin` — content management dashboard, Google OAuth only

---

## Repository Structure

The Next.js app IS the repo root. After Phase 0, the repo looks like:

```
wsc-website/                        ← Repo root AND Next.js project root
├── src/
│   ├── app/
│   │   ├── globals.css             ← Tailwind v4 @theme + all design tokens
│   │   ├── layout.tsx              ← Root layout: Nav, Footer, Lenis, Cursor, Preloader
│   │   ├── page.tsx                ← Landing page
│   │   ├── about/page.tsx
│   │   ├── executive-team/page.tsx
│   │   ├── events/page.tsx
│   │   ├── sponsors/page.tsx
│   │   ├── contact-us/page.tsx
│   │   ├── terms-of-service/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── admin/                  ← DEFERRED — do not touch
│   │   ├── icon.png                ← Favicon (shark.avif converted to PNG)
│   │   ├── og-image.png            ← Static OG image (1200×630)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                     ← button.tsx, eyebrow.tsx
│   │   ├── layout/                 ← nav.tsx, footer.tsx, preloader.tsx
│   │   ├── cursor/                 ← custom-cursor.tsx
│   │   ├── landing/
│   │   ├── about/
│   │   ├── team/
│   │   ├── events/
│   │   ├── sponsors/
│   │   ├── contact/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/               ← client.ts, storage.ts, hooks/
│   │   ├── motion.ts
│   │   ├── constants.ts
│   │   ├── error-utils.ts
│   │   └── image-utils.ts
│   ├── types/
│   │   └── database.ts
│   ├── providers/
│   │   ├── lenis-provider.tsx
│   │   └── cursor-provider.tsx
│   └── hooks/
│       └── use-cursor.ts
├── public/                         ← Next.js static assets
│   ├── shark.avif
│   ├── UC-HILL.avif
│   ├── TORONTO.avif
│   ├── MIDDLESEX.avif
│   ├── NEWYORK.avif
│   ├── abt1.avif, abt2.avif
│   ├── TSI.avif
│   ├── Instagram.svg, Linkedin.svg
│   └── robots.txt
├── _reference/                     ← OLD CODE — READ ONLY, DO NOT MODIFY
│   └── wsc-vite-app/               ← Original Vite SPA, preserved for porting reference
├── supabase/                       ← Supabase migrations/config — NEVER TOUCH
├── docs/
│   ├── migration/                  ← Codebase archaeology (references _reference/wsc-vite-app/)
│   └── redesign/                   ← Design spec + build plan
├── package.json                    ← Next.js project dependencies
├── next.config.ts
├── tsconfig.json
├── .env.local                      ← Not committed
├── .env.example
├── .gitignore
├── CLAUDE.md                       ← This file
└── README.md
```

> **Reference code**: The old Vite app lives at `_reference/wsc-vite-app/`. Never modify it. All migration docs reference paths relative to this location.

---

## Active Work: Complete Frontend Redesign

The project is mid-redesign. The old Vite app (`wsc-vite-app/`) is reference only; the new Next.js app (`app/`) is what gets built. **All implementation happens in `app/` only.**

---

## Doc Navigation — Which to Read at Each Phase

| Phase | Primary Docs | Secondary Docs |
| ----- | ------------ | -------------- |
| **0 — Repo Setup** | `implementation-plan.md` §0 | `assets-and-config.md` |
| **A — Scaffolding** | `implementation-plan.md` §A | `supabase-integration.md`, `assets-and-config.md` |
| **B — Design System** | `design-spec.md` §2–6, `implementation-plan.md` §B | — |
| **C — Layout Shell** | `design-spec.md` §7.1–7.2, §7.5, `implementation-plan.md` §C | `routing-and-data-flow.md`, `component-inventory.md` |
| **D — Landing Page** | `design-spec.md` §8.1, `implementation-plan.md` §D | `supabase-integration.md`, `routing-and-data-flow.md` |
| **E — Inner Pages** | `design-spec.md` §8.2–8.7, `implementation-plan.md` §E | `supabase-integration.md`, `component-inventory.md` |
| **F — Admin (deferred)** | `routing-and-data-flow.md` §Admin Dashboard, `supabase-integration.md` §Auth | `component-inventory.md` §AdminDashboard |
| **G — Polish** | `design-spec.md` §5, §9, §10, §11, `implementation-plan.md` §G | — |
| **H — Deploy** | `implementation-plan.md` §H | `assets-and-config.md` §Deployment, `design-spec.md` §11 |

**Full doc summaries:**

| Doc | Scope |
| --- | ----- |
| `docs/redesign/design-spec.md` | Complete visual + animation spec — colors, typography, spacing, every component, every page, accessibility |
| `docs/redesign/implementation-plan.md` | Phased build plan — exact files, order, complexity, file creation checklist |
| `docs/migration/supabase-integration.md` | Every DB table, column, hook API, auth flow, storage patterns, TypeScript interfaces, critical rules |
| `docs/migration/component-inventory.md` | Every old component's props, CSS vars, animation patterns — source of truth for porting |
| `docs/migration/routing-and-data-flow.md` | Route map, data flow architecture, layout wiring, Next.js migration map, integration gotchas |
| `docs/migration/assets-and-config.md` | Static assets, env vars, dependency audit, build config, deployment setup |

---

## New Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 15 (App Router, `app/` directory) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` in `globals.css` — **no `tailwind.config.js`**) |
| Animation | Framer Motion + GSAP + ScrollTrigger + Lenis |
| Primitives | Radix UI (NavigationMenu, Dialog, Tooltip) |
| Backend | Supabase — **UNCHANGED**, JS→TS port + env var rename only |
| Contact | EmailJS — **UNCHANGED**, same service/template IDs |
| Deployment | Vercel (replacing GitHub Pages) |

---

## Design Principles

Full spec: `docs/redesign/design-spec.md`

- **Dark luxury, agency-meets-academic** — editorial publication energy, not startup landing page
- **No cards or containers** — everything is free-flowing, open, full-width
- **Motion is earned** — every animation must be purposeful, not decorative
- **Minimal text** — big bold titles, short impactful copy, let the design speak
- **Highly responsive** — must be presentable on any screen size

Color tokens, type scale, spacing system, animation standards, and all per-component/per-page specs are in `design-spec.md`. Key quick-reference values are in the Quick Reference table at the bottom of this file.

---

## Supabase — Critical Rules

Full spec: `docs/migration/supabase-integration.md`

### Active Storage Buckets (3 total)

| Bucket | Purpose | DB Column |
| ------ | ------- | --------- |
| `headshots` | Executive portraits | `executives.headshot_path` |
| `sponsor-logos` | Sponsor logos | `sponsors.logo_path` |
| `gallery` | Gallery photos | `gallery_photos.image_path` |

> **`event-images` bucket is unused and marked for deletion** via the Supabase dashboard. Do not reference it anywhere in the new app.

### Tables

| Table | Visibility column |
| ----- | ----------------- |
| `events` | `published` |
| `sponsors` | `active` |
| `executives` | `visible` |
| `gallery_photos` | `visible` |

### Rules — do NOT break these

1. **Never touch `supabase/`** — migrations, RLS, and security policies are production
2. **Object names only in DB, never full URLs** — always call `getPublicUrl(bucket, objectName)` at runtime
3. **`deleteContentItem` is storage-first** — delete storage file before DB row; 3-retry on DB delete. Intentional. Do not change the order.
4. **All Supabase queries are client-side** — mark components `'use client'`. Do not move to Server Components.
5. **`is_admin()` RPC is sacred** — the only admin check. Never replace with JWT claims or localStorage.
6. **RLS stays enabled** — do not disable or bypass
7. **Anon key only in frontend** — never put the service role key in client-facing code

### Environment Variables

```bash
# app/.env.local  (not committed)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Renamed from `VITE_*` to `NEXT_PUBLIC_*`. Always keep `app/.env.example` committed.

---

## Skills & Tools Reference

These Claude Code skills are available for this project. Use them at the phases and contexts noted.

### Primary Build Skills

| Skill | When to invoke | Purpose |
| ----- | -------------- | ------- |
| `/frontend-design` | Building or significantly modifying any UI component or page | Generates production-grade, high-quality UI with real design intent — avoids generic AI aesthetics. Use for every major component: Hero, Nav, Timeline, BentoGallery, LogoWall, ExecutiveRow, ContactForm, etc. |
| `/responsive` | After any component is built; mandatory during Phase G | Enforces responsive design — breakpoints, mobile layouts, fluid typography, touch targets. Auto-activates for layout, nav, grid, image, and scroll work. |
| `/animate` | After structure/layout is complete on a page (Phase D, E) | Adds purposeful micro-interactions, hover states, scroll reveals, and transitions. Use after components are structurally correct. |
| `/motion` | Anytime working with Framer Motion or GSAP directly | Expert Framer Motion skill — spring physics, AnimatePresence, scroll animations, gestures, SVG morphing, drag. Use for cursor, preloader exit, timeline reveal, bento gallery lightbox. |

### Audit & Review Skills

| Skill | When to invoke | Purpose |
| ----- | -------------- | ------- |
| `/audit` | After Phase E is complete, before Polish | Comprehensive audit — accessibility, performance, theming, responsive design. Generates severity-rated report. Run once as the gate into Phase G. |
| `/design-motion-principles` | After Phases D + E are complete | Expert motion design audit based on Emil Kowalski, Jakub Krehel, and Jhey Tompkins techniques. Evaluates all animations holistically. Run before `/polish`. |
| `/critique` | After a page is visually complete | UX critique — visual hierarchy, information architecture, emotional resonance. Use page-by-page to catch design issues before Polish. |

### Refinement Skills

| Skill | When to invoke | Purpose |
| ----- | -------------- | ------- |
| `/polish` | Phase G — the final pass | Alignment, spacing, consistency, typographic detail. The "last 10%" that separates good from great. |
| `/normalize` | After Phase B (Design System) is built | Ensures all components correctly use design tokens and are visually consistent with each other. |
| `/colorize` | If any section feels flat or too monochromatic | Adds strategic color. Use if landing sections feel visually indistinct from each other. |
| `/clarify` | Before Phase H (Deploy) | Improves button labels, form errors, empty states, nav labels, and all microcopy. |
| `/harden` | Phase G | Error handling, text overflow, edge cases — empty Supabase responses, network failures, very long exec names, missing images. |
| `/optimize` | Phase G | Bundle size, image loading strategy, render performance, Lenis/GSAP perf. Target Lighthouse 90+. |
| `/adapt` | Phase G | Cross-device/platform consistency — iOS Safari, Firefox, small screens, wide screens. |
| `/extract` | After Phase E, if repeated patterns emerge | Consolidates duplicate patterns into reusable components and design tokens. |

### Recommended Invocation Sequence

```
Phase B:  /frontend-design → /normalize
Phase C:  /frontend-design → /responsive
Phase D:  /frontend-design → /animate → /motion → /responsive
Phase E:  /frontend-design (per page) → /animate → /responsive
Phase G:  /audit → /design-motion-principles → /critique → /polish → /harden → /optimize → /clarify → /adapt
```

---

## What Is and Isn't In Scope

### In scope

- All public pages: Landing, About, Executive Team, Events, Partners, Contact, Terms, Privacy Policy
- Root layout: Nav, Footer, Preloader, Custom Cursor, Lenis
- Design system: tokens, typography, button, animations

### Out of scope (deferred)

- **Admin dashboard (`/admin`)** — do NOT redesign or port. Phase F explicitly deferred.
- **`supabase/` directory** — never modify
- **`_reference/wsc-vite-app/`** — never modify (read-only reference for porting)
- **`event-images` storage bucket** — unused, to be deleted in Supabase dashboard (not our task)

---

## New App File Structure

The full structure is shown in the Repository Structure section above. Component-level detail:

```
src/
├── app/
│   ├── layout.tsx              # Root: Nav, Footer, Lenis, Cursor, Preloader
│   ├── globals.css             # Tailwind v4 @theme + all design tokens
│   ├── page.tsx                # Landing
│   ├── about/page.tsx
│   ├── executive-team/page.tsx
│   ├── events/page.tsx
│   ├── sponsors/page.tsx
│   ├── contact-us/page.tsx
│   ├── terms-of-service/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── admin/                  # DEFERRED — do not touch
│   ├── icon.png                # Favicon
│   ├── og-image.png            # OG image
│   └── not-found.tsx
├── components/
│   ├── ui/                     # button.tsx, eyebrow.tsx
│   ├── layout/                 # nav.tsx, footer.tsx, preloader.tsx
│   ├── cursor/                 # custom-cursor.tsx
│   ├── landing/                # hero.tsx, about-section.tsx, events-preview.tsx,
│   │                           # partners-marquee.tsx, cta-section.tsx
│   ├── about/                  # story-section.tsx, bento-gallery.tsx
│   ├── team/                   # executive-list.tsx, executive-row.tsx
│   ├── events/                 # timeline.tsx, timeline-event.tsx
│   ├── sponsors/               # logo-wall.tsx, logo-card.tsx
│   ├── contact/                # contact-form.tsx
│   └── shared/                 # async-state-wrapper.tsx, error-boundary.tsx, full-page-loader.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── storage.ts
│   │   └── hooks/
│   │       ├── use-supabase-query.ts
│   │       └── use-supabase-mutation.ts
│   ├── motion.ts               # Shared animation variants + easing constants
│   ├── constants.ts            # CONTENT_CONFIG, LIMITS
│   ├── error-utils.ts          # classifyError()
│   └── image-utils.ts          # validateImageDimensions()
├── types/
│   └── database.ts             # Event, Sponsor, Executive, GalleryPhoto interfaces
├── providers/
│   ├── lenis-provider.tsx
│   └── cursor-provider.tsx
└── hooks/
    └── use-cursor.ts
```

---

## Implementation Order

See `docs/redesign/implementation-plan.md` for full detail per file.

```
A Scaffolding → B Design System → C Layout Shell → D Landing Page → E Inner Pages → G Polish → H Deploy
```

Phase E pages are independent (can be parallelized). Phase F (Admin) is deferred.

---

## Quick Reference

| Question | Answer |
| -------- | ------ |
| New app directory? | `wsc-website/` (Next.js IS the repo root) |
| Design spec? | `docs/redesign/design-spec.md` |
| Build plan? | `docs/redesign/implementation-plan.md` |
| Gold color? | `#D4A843` via `var(--color-gold)` |
| Display font? | Cormorant Garamond |
| Body font? | DM Sans |
| Label/date font? | DM Mono |
| Motto location? | Hero subtitle only — `"Empowering sales excellence."` |
| Page transitions? | None — section-level only, concentrated on Landing |
| Admin in scope? | No — explicitly deferred |
| Reference code location? | `_reference/wsc-vite-app/` — read only, never modify |
| Modify `supabase/`? | Never |
| Active storage buckets? | `headshots`, `sponsor-logos`, `gallery` (3 only) |
| `event-images` bucket? | Unused — delete from Supabase dashboard, don't reference in code |
| EmailJS service ID? | `service_qwpe0fl` |
| EmailJS template ID? | `template_lt8anmn` |
| Static assets source? | `wsc-vite-app/public/` → copy to `app/public/` (see `assets-and-config.md`) |
