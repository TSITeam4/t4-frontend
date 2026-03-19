# Routing, Layout & Data Flow — Migration Documentation

> **Scope**: How the old Vite app is wired together — route map, data flow architecture, shared layout components (Nav/Footer/Preloader behavior), error handling context, protected admin route, and the Next.js migration map. Read at phases A, C, D, E, F.
>
> **Does not cover**: Component props/CSS details (→ `component-inventory.md`), DB schema (→ `supabase-integration.md`), new visual design (→ `design-spec.md`).

> Source: `_reference/wsc-vite-app/` (React Router 6 BrowserRouter SPA)
> Target: Next.js 15 App Router

---

## Entry Point

**File**: `wsc-vite-app/src/main.jsx`

Simple entry — renders `<App />` into `#root` with `React.StrictMode`.

---

## Full Route Map

**File**: `wsc-vite-app/src/App.jsx`

**Router type**: `BrowserRouter` from `react-router-dom@6`

| Path | Component | File | Data Source | Layout |
|------|-----------|------|-------------|--------|
| `/` | `Landing` | `pages/Landing/Landing.jsx` | `events` (props from App), `sponsors` (local hook) | Nav + Footer + Preloader |
| `/about` | `About` | `pages/About/About.jsx` | `gallery_photos` (local hook) | Nav + Footer |
| `/executive-team` | `ExecutiveTeam` | `pages/Team/ExecutiveTeam.jsx` | `executives` (local hook) | Nav + Footer + PageTitle |
| `/events` | `Events` | `pages/Events/Events.jsx` | `events` (props from App) | Nav + Footer |
| `/sponsors` | `Sponsors` | `pages/Sponsors/Sponsors.jsx` | `sponsors` (local hook) | Nav + Footer |
| `/contact-us` | `ContactUs` | `pages/Contact/Contact.jsx` | EmailJS form submission | Nav + Footer |
| `/terms-of-service` | `TermsOfService` | `pages/TermsOfService.jsx` | Static content | Footer only (no Nav) |
| `/privacy-policy` | `PrivacyPolicy` | `pages/PrivacyPolicy.jsx` | Static content | Footer only (no Nav) |
| `/admin` | `AdminDashboard` | `pages/Admin/AdminDashboard.jsx` | Protected by `AdminAuthProvider` | Sidebar only (no Nav/Footer) |

---

## Data Flow Architecture

### App-Level Data (Props Drilling)

`App.jsx` fetches `events` once at the root:

```javascript
// App.jsx lines 39-46
const { data: events, loading, error } = useSupabaseQuery('events', {
  orderBy: 'date',
  ascending: false,
});
```

Drilled as props to:
- `<Landing events={events} loading={loading} error={error} />`
- `<Events events={events} loading={loading} error={error} />`

**Reason**: Events appear on both pages; centralizing the fetch avoids duplicate requests and ensures consistent RLS filtering.

### Page-Level Data (Local Hooks)

All other pages fetch their own data independently:

| Page | Hook Call |
|------|-----------|
| `About.jsx:12` | `useSupabaseQuery('gallery_photos')` |
| `ExecutiveTeam.jsx:11` | `useSupabaseQuery('executives')` |
| `Sponsors.jsx:12` | `useSupabaseQuery('sponsors')` |
| `Landing.jsx:19` | `useSupabaseQuery('sponsors')` (for carousel) |

### Admin Data

`AdminSection.jsx` uses both hooks:
- `useSupabaseQuery(config.table, ...)` — read table rows
- `useSupabaseMutation()` — INSERT / UPDATE / DELETE

---

## Global Context

**Only one context exists**: `AdminAuthProvider`

**File**: `wsc-vite-app/src/contexts/AdminAuthProvider.jsx`

Provides `useAdminAuth()` → `{ signOut }`

**No global state management library** (no Redux, Zustand, Jotai, etc.)

---

## Shared Layout Components

### Nav

**File**: `wsc-vite-app/src/components/nav/Nav.jsx`

- Used on all routes except `/admin`, `/terms-of-service`, `/privacy-policy`
- Desktop: horizontal link bar
- Mobile: hamburger → slide-in drawer with backdrop
- `useLocation()` for active link highlighting
- Prevents body scroll when mobile menu open (saves + restores `scrollY`)
- Auto-closes on route change

**Navigation items**:
- `/` (Home/Logo)
- `/about`
- `/executive-team`
- `/events`
- `/sponsors` (labeled "Partners")
- `/contact-us`

### Footer

**File**: `wsc-vite-app/src/components/footer/Footer.jsx`

- Used on all routes except `/admin`
- Three-column layout: brand info + social links | quick links | legal + TSI attribution
- Dynamic year: `new Date().getFullYear()`
- Links: Instagram, LinkedIn, Terms of Service, Privacy Policy, TSI website

### Preloader

**File**: `wsc-vite-app/src/components/preloader/Preloader.jsx`

- Mounted at App root level, fires once on initial load
- Preloads 4 critical images: `/shark.avif`, `/UC-HILL.avif`, `/TORONTO.avif`, `/MIDDLESEX.avif`
- Progress bar 0–100%
- `onLoadComplete()` callback → App fades in page content (800ms fade-out delay)

### ScrollToTop

**Defined inline in**: `wsc-vite-app/src/App.jsx` (lines 19–31)

```javascript
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
```

Renders nothing; resets scroll on every route change.

---

## Error Handling

### ErrorBoundary (Class Component)

**File**: `wsc-vite-app/src/components/shared/ErrorBoundary.jsx`

- Wraps entire app at `App.jsx:49`
- Catches render-time errors only (NOT async, event handlers, promises, setTimeout)
- Fallback: error message + "Reload Page" button (`window.location.reload()`)

### AsyncStateWrapper (Function Component)

**File**: `wsc-vite-app/src/components/shared/AsyncStateWrapper.jsx`

Renders loading spinner → error + retry → empty message → children, in that priority order. Used by `ExecutiveTeam`, `About` (GallerySection), `Events`, `Sponsors`, `AdminSection`.

> Props, state details, and visual spec: `docs/migration/component-inventory.md` §AsyncStateWrapper.

### FullPageLoader

**File**: `wsc-vite-app/src/components/shared/FullPageLoader.jsx`

- Full-screen neutral spinner
- Used exclusively by `AdminAuthProvider` during auth verification phases
- Shows no dashboard content hints (security: prevents timing-based admin status detection)

---

## Protected Route: Admin

**File**: `wsc-vite-app/src/contexts/AdminAuthProvider.jsx`

```
/admin route
  └── AdminAuthProvider
        ├── checking_auth  → FullPageLoader
        ├── checking_admin → FullPageLoader
        ├── denied         → Login screen ("Sign in with Google")
        └── authorized     → AdminDashboard + AdminContext.Provider({ signOut })
```

Auth flow:
1. `supabase.auth.getSession()` — check for existing session
2. If session: call `supabase.rpc('is_admin')`
3. If `is_admin()` returns false or errors: `supabase.auth.signOut()` → `denied`
4. `supabase.auth.onAuthStateChange()` re-verifies on every auth event

---

## Admin Dashboard Structure

**File**: `wsc-vite-app/src/pages/Admin/AdminDashboard.jsx`

**Tabs** (state: `activeTab`):
```javascript
const TABS = [
  { key: 'events',        label: 'Events' },
  { key: 'sponsors',      label: 'Sponsors' },
  { key: 'executives',    label: 'Executives' },
  { key: 'gallery_photos',label: 'Gallery' },
];
```

**Layout**: Two-pane
- Left: Sidebar (tab nav + sign out + back link)
- Right: `<AdminSection configKey={activeTab} config={CONTENT_CONFIG[activeTab]} />`

### Admin CRUD Flow

**CREATE**: "+ Add" → modal → validate image dims → upload file → insert row (with limit check)

**READ**: `useSupabaseQuery(table)` — admin sees all rows (RLS `FOR ALL` policy)

**UPDATE (edit)**: "Edit" → modal pre-populated → validate → delete old file → upload new → update row

**UPDATE (visibility toggle)**: Checkbox click → optimistic UI update → Supabase update → refetch

**DELETE**: "Delete" → confirm modal → `deleteContentItem()` (storage-first, 3-retry DB delete)

**REORDER**: Up/Down arrows → swap `display_order` values between adjacent rows (only if `orderable: true`)

---

## Data Flow Diagram

```
main.jsx
  └── App.jsx (BrowserRouter)
        ├── Preloader (one-time, preloads 4 images)
        ├── ErrorBoundary (render-time errors)
        ├── ScrollToTop (resets scroll on route change)
        ├── useSupabaseQuery('events') → events, loading, error
        │
        └── Routes
              ├── /                → Landing (events + loading + error as props)
              │                         └── useSupabaseQuery('sponsors') [local]
              │
              ├── /about           → About
              │                         └── useSupabaseQuery('gallery_photos') [local]
              │
              ├── /executive-team  → ExecutiveTeam
              │                         └── useSupabaseQuery('executives') [local]
              │
              ├── /events          → Events (events + loading + error as props)
              │
              ├── /sponsors        → Sponsors
              │                         └── useSupabaseQuery('sponsors') [local]
              │
              ├── /contact-us      → Contact → ContactForm (EmailJS)
              │
              ├── /terms-of-service → TermsOfService (static)
              │
              ├── /privacy-policy  → PrivacyPolicy (static)
              │
              └── /admin           → AdminAuthProvider (3-phase gate)
                                         └── AdminDashboard
                                               ├── Sidebar (tabs)
                                               └── AdminSection (CRUD)
                                                     ├── useSupabaseQuery
                                                     └── useSupabaseMutation
```

---

## Next.js App Router Migration Map

| React Router | Next.js App Router |
|-------------|-------------------|
| `BrowserRouter` + `Routes` + `Route` | File-system routing in `app/` |
| `/` → `Landing` | `app/page.tsx` |
| `/about` → `About` | `app/about/page.tsx` |
| `/executive-team` → `ExecutiveTeam` | `app/executive-team/page.tsx` |
| `/events` → `Events` | `app/events/page.tsx` |
| `/sponsors` → `Sponsors` | `app/sponsors/page.tsx` |
| `/contact-us` → `Contact` | `app/contact-us/page.tsx` |
| `/terms-of-service` | `app/terms-of-service/page.tsx` |
| `/privacy-policy` | `app/privacy-policy/page.tsx` |
| `/admin` + `AdminAuthProvider` | `app/admin/layout.tsx` (auth guard) + `app/admin/page.tsx` |
| `Nav` + `Footer` in each route | `app/layout.tsx` (root layout) |
| `ScrollToTop` | Not needed — Next.js handles scroll restoration |
| Props-drilled events fetch | Server Component fetch or `useQuery` in shared provider |

---

## Key Non-Obvious Patterns

1. **Events fetched at App root** — only data fetched at top level; everything else is page-local. In Next.js, consider a Server Component fetch or React Query with a shared QueryClient.

2. **Mobile menu scroll prevention** — Nav saves `window.scrollY`, applies `position: fixed` + `top: -scrollY` to body, restores on close. Prevents layout shift on iOS Safari.

3. **Admin never shows UI hints during auth** — `FullPageLoader` is intentionally neutral. Do not render admin sidebar/skeleton during verification phases.

4. **Parallax is scroll-based** — Landing, Events, Sponsors all track `scrollY` via `useEffect` + `addEventListener('scroll')`. In Next.js with Lenis, this will need to hook into Lenis's scroll events instead of native scroll.

5. **Three scroll management levels**:
   - Global: `ScrollToTop` resets on route change
   - Page: Hero sections use `scrollY * 0.3–0.69` for parallax
   - Local: Nav preserves scroll position when opening mobile menu

6. **No Suspense boundaries** — Loading states handled by `AsyncStateWrapper` and `Preloader`, not React Suspense. In Next.js migration, consider adding `loading.tsx` files alongside `page.tsx`.
