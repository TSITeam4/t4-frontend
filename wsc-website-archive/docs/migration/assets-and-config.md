# Assets, Config & Build — Migration Documentation

> **Scope**: Everything needed for project setup — static assets (images, SVGs, file sizes), env vars (old Vite names → new NEXT_PUBLIC_ names), full dependency audit (keep/remove/upgrade), Vite config, Tailwind config, deployment setup. Read at phase A (scaffolding) and phase H (deploy).
>
> **Does not cover**: DB/hook specs (→ `supabase-integration.md`), visual design (→ `design-spec.md`), build order (→ `implementation-plan.md`).

> Source: `_reference/wsc-vite-app/` (Vite + React SPA on GitHub Pages)
> Target: Next.js 15 App Router + Tailwind CSS v4

---

## Static Assets (`wsc-vite-app/public/`)

### Images (AVIF format)
| File | Size | Usage |
|------|------|-------|
| `/public/shark.avif` | 13 KB | Favicon / brand logo |
| `/public/abt1.avif` | 356 KB | About page image |
| `/public/abt2.avif` | 1.5 MB | About page image |
| `/public/TSI.avif` | 118 KB | TSI location image |
| `/public/TORONTO.avif` | 2.9 MB | Toronto location image |
| `/public/NEWYORK.avif` | 1.3 MB | New York location image |
| `/public/MIDDLESEX.avif` | 1.2 MB | Middlesex location image |
| `/public/UC-HILL.avif` | 340 KB | UC Hill location image |

### Social Media Icons (SVG)
| File | Size | Details |
|------|------|---------|
| `/public/Instagram.svg` | 1.1 KB | Font Awesome 6.7.2, white fill `#ffffff` |
| `/public/Linkedin.svg` | 670 B | Font Awesome 6.7.2, white fill `#ffffff` |

### Configuration / Deployment Files
| File | Contents |
|------|---------|
| `/public/CNAME` | `westernsalesclub.ca` (GitHub Pages custom domain) |
| `/public/404.html` | SPA redirect script — converts deep links to query params for React Router |

> **Migration note:** `CNAME` and the `404.html` SPA redirect trick are GitHub Pages-specific and will not be needed in a Next.js deployment (Vercel handles routing natively).

---

## Source Assets (`wsc-vite-app/src/assets/`)

| File | Notes |
|------|-------|
| `/src/assets/react.svg` | Unused Vite template artifact — safe to delete |

---

## Tailwind Configuration (`wsc-vite-app/tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#ffd95a',
        purple: '#F9C726',  // ⚠️ Named "purple" but is actually yellow/gold — naming mismatch
      },
      fontFamily: {
        georgia: ['Georgia', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Custom Theme Summary
| Token | Value | Notes |
|-------|-------|-------|
| `gold` | `#ffd95a` | Brand gold |
| `purple` | `#F9C726` | **Misleading name** — is actually a yellow-gold, not purple |
| `font-georgia` | `['Georgia', 'serif']` | Used for serif headers |
| `font-inter` | `['Inter', 'sans-serif']` | Default sans-serif body font |
| Breakpoints | Tailwind defaults | No custom breakpoints defined |
| Plugins | None | |

> **Migration note (Tailwind v4):** Tailwind v4 moves config to CSS `@theme` blocks instead of `tailwind.config.js`. These tokens need to be migrated to CSS variables in your `globals.css`.

---

## Vite Configuration (`wsc-vite-app/vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

- **Plugin:** `@vitejs/plugin-react-swc` (SWC-based fast refresh)
- **Base path:** `/` (root domain)
- **No path aliases** (e.g., no `@/` → `src/` shortcut)
- **No custom middleware or resolve rules**

> **Migration note:** Entire Vite config is replaced by Next.js. Path aliases should be added in `tsconfig.json` (`"@/*": ["./src/*"]`) for the new project.

---

## PostCSS Configuration (`wsc-vite-app/postcss.config.js`)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## HTML Entry Point (`wsc-vite-app/index.html`)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/shark.avif" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Western Sales Club</title>
    <!-- SPA redirect script (rafgraph/spa-github-pages) -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- Favicon: `/shark.avif`
- No external font CDN imports (Inter is loaded via CSS or system font)
- SPA redirect script for GitHub Pages deep link support

---

## Environment Variables

**Files present:**
- `wsc-vite-app/.env`
- `wsc-vite-app/.env.production`

> Both are in `.gitignore` — not committed to source control.

**Variables (names only):**
```bash
# EmailJS
VITE_EMAILJS_PUBLIC_KEY=

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Migration note:** In Next.js, `VITE_` prefix becomes `NEXT_PUBLIC_` for browser-exposed vars. Update all references:
> - `VITE_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
> - `VITE_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> - `VITE_EMAILJS_PUBLIC_KEY` → `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

---

## Deployment Setup

**Deployment script** (`wsc-vite-app/deploy.js`): Copies `404.html` into `dist/` before `gh-pages` publish.

**Deploy command:**
```bash
npm run build && node deploy.js && gh-pages -d dist
```

**GitHub Pages flow for SPA deep links:**
1. User hits `westernsalesclub.ca/some/deep/path`
2. GitHub Pages 404 → `/404.html`
3. `404.html` converts path to query param, reloads
4. `index.html` script decodes query param, restores URL
5. React Router handles reconstructed route

> **Migration note:** This entire mechanism is replaced by Next.js App Router + Vercel deployment.

---

## Package.json — Full Dependency Audit

### Production Dependencies

| Package | Version | Migration Action |
|---------|---------|-----------------|
| `@emailjs/browser` | `^4.4.1` | **KEEP** — contact form |
| `@fortawesome/free-brands-svg-icons` | `^6.7.2` | **KEEP** |
| `@fortawesome/free-regular-svg-icons` | `^6.7.2` | **KEEP** |
| `@fortawesome/free-solid-svg-icons` | `^6.7.2` | **KEEP** |
| `@fortawesome/react-fontawesome` | `^0.2.2` | **KEEP** |
| `@supabase/supabase-js` | `^2.95.3` | **KEEP** — core backend |
| `date-fns` | `^4.1.0` | **KEEP** — calendar/date logic |
| `gh-pages` | `^6.3.0` | **REMOVE** — replaced by Vercel/CI |
| `postcss` | `^8.5.3` | **KEEP** |
| `react` | `^19.0.0` | **REMOVE** — bundled with Next.js |
| `react-big-calendar` | `^1.18.0` | **EVALUATE** — may replace with shadcn/calendar |
| `react-calendar` | `^5.1.0` | **EVALUATE** — may replace with shadcn/calendar |
| `react-dom` | `^19.0.0` | **REMOVE** — bundled with Next.js |
| `react-router-dom` | `^6.30.0` | **REMOVE** — replaced by Next.js App Router |
| `supabase` | `^2.76.6` | **KEEP** — CLI |

### DevDependencies

| Package | Version | Migration Action |
|---------|---------|-----------------|
| `@eslint/js` | `^9.21.0` | **KEEP** |
| `@types/react` | `^19.0.10` | **KEEP** |
| `@types/react-dom` | `^19.0.4` | **KEEP** |
| `@vitejs/plugin-react-swc` | `^3.8.0` | **REMOVE** — Next.js uses SWC natively |
| `autoprefixer` | `^10.4.21` | **KEEP** |
| `eslint` | `^9.21.0` | **KEEP** |
| `eslint-plugin-react-hooks` | `^5.1.0` | **KEEP** |
| `eslint-plugin-react-refresh` | `^0.4.19` | **REMOVE** — Vite-specific |
| `globals` | `^15.15.0` | **KEEP** |
| `tailwindcss` | `^3.4.17` | **UPGRADE** → v4 |
| `vite` | `^6.2.0` | **REMOVE** — replaced by Next.js |

### New Packages to Add

```bash
next@latest
framer-motion@^11
gsap@^3.12
lenis@^1
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-navigation-menu
@radix-ui/react-tooltip
# ... other Radix primitives as needed
```

---

## ESLint Configuration (`wsc-vite-app/eslint.config.js`)

```javascript
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn'],
    },
  },
]
```

> **Migration note:** Replace with Next.js ESLint config (`eslint-config-next`) and add TypeScript parser for `.ts`/`.tsx` files.

---

## Notable Flags

- **`purple` color token is actually yellow/gold** (`#F9C726`) — rename during migration to avoid confusion
- **No path aliases** in Vite config — add `@/*` alias in new project from the start
- **AVIF images are large** (TORONTO.avif = 2.9 MB) — consider using Next.js `<Image>` with automatic optimization
- **`.env` files** appear to be git-ignored correctly; verify before migrating repo
- **No TypeScript** in current project (`.jsx` files, not `.tsx`) — full migration to TypeScript required
