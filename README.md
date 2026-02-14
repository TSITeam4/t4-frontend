# Western Sales Club — Website

Official site for [Western Sales Club](https://westernsalesclub.ca): React frontend and Supabase backend (content, auth, storage).

## Structure

| Path | Role |
|------|------|
| **wsc-vite-app/** | React + Vite app (Landing, About, Team, Events, Sponsors, Contact, Admin) |
| **supabase/** | Backend: Postgres schema, RLS, storage buckets, migrations |

## Quick start

**Prerequisites:** Node 18+, [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local backend).

1. **Install and run the app**
   ```bash
   cd wsc-vite-app
   npm install
   npm run dev
   ```
   App runs at `http://localhost:5173`.

2. **Environment**
   - In `wsc-vite-app/.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for your Supabase project.

3. **Backend**
   - Use an existing Supabase project or run locally: `supabase start` from the repo root. See [supabase/README.md](supabase/README.md) for schema, security, and migrations.

## Scripts (from `wsc-vite-app/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and deploy (e.g. gh-pages) |

## Tech Stack

- **Frontend:** React 19, Vite 6, React Router, Tailwind CSS, Supabase client
- **Backend:** Supabase (Postgres, Auth, Storage, RLS). Details in [supabase/README.md](supabase/README.md).
