# Western Sales Club — Frontend

React + Vite frontend for [Western Sales Club](https://westernsalesclub.ca). Content is loaded from Supabase; the app is static-friendly and deploys to gh-pages.

## Run locally

**Prerequisites:** Node 18+

```bash
npm install
npm run dev
```

Dev server: **http://localhost:5173**

### Environment

Create `.env` in this directory with your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The backend lives in the repo at `../supabase/`. See the [root README](../README.md) and [Supabase README](../supabase/README.md) for full setup.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and deploy (e.g. gh-pages) |

## Source layout

| Path | Contents |
|------|----------|
| `src/pages/` | Route-level views: Landing, About, Team, Events, Sponsors, Contact, Admin, Terms, Privacy |
| `src/components/` | Reusable UI: nav, footer, contact form, sponsor card, profile, gallery, lazy-image, preloader |
| `src/contexts/` | `AdminAuthProvider` (Supabase auth for admin) |
| `src/lib/` | Supabase client, hooks (`useSupabaseQuery`, `useSupabaseMutation`), storage helpers, constants |
| `src/components/shared/` | ErrorBoundary, AsyncStateWrapper, FullPageLoader |

Public content (events, sponsors, executives, gallery) is read from Supabase; visibility is controlled by RLS and `published` / `active` / `visible` flags. Admin edits go through the same client with authenticated sessions.

## Stack

- **React 19** + **Vite 6** (SWC)
- **React Router 6** — client-side routing
- **Tailwind CSS** — styling
- **Supabase JS** — data and auth
- **EmailJS** — contact form
- **date-fns**, **react-big-calendar** — events/calendar
