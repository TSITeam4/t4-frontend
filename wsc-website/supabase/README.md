# Western Sales Club Content Management System

## Overview

The __Supabase__ backend powers the **Western Sales Club (WSC) website** as a small, secure **content management system**. It provides:

- **Database** — Events, sponsors, executive team, and gallery content, with visibility controls so only approved items appear on the public site.
- **Authentication** — Google OAuth for admin sign-in; the public site does not require login.
- **Admin model** — Access to edit content is controlled by an **allowlist**. Only authenticated users may manipulate the content stored in the database.
- **Storage** — Public buckets for headshots, sponsor logos, event images, and gallery photos. Files are referenced by object name in the DB; URLs are built at runtime.

The frontend is treated as **untrusted**. All enforcement (who can read what, who can write) happens **server-side** in Supabase via **SQL grants**, **Row Level Security (RLS)**, and the **hardened `is_admin()`** function. No sensitive keys or admin logic live in the client.

---

## Database Structure

### Tables

| Table | Purpose | Visibility column |
|------|---------|--------------------|
| **events** | Upcoming and past club events | `published` (boolean) |
| **sponsors** | Sponsor entries | `active` (boolean) |
| **executives** | Executive team members | `visible` (boolean) |
| **gallery_photos** | About-page gallery | `visible` (boolean) |

- **Visibility columns** default to `false` (safe-by-default)
  - New or draft rows are hidden from the public until an admin flips the flag.
- **Asset columns** (`image_path`, `logo_path`, `headshot_path`) store only the **storage object name** (e.g. `a1b2c3d4.webp`), not full URLs
  - Public URLs are built with `getPublicUrl(bucket, name)` at runtime.
- **Triggers** keep `updated_at` in sync on `events`, `sponsors`, and `executives`.

### Storage buckets

Four **public** buckets (readable by anyone via CDN URL):

- **headshots** — Executive headshots  
- **sponsor-logos** — Sponsor logos  
- **event-images** — Event banner/promo images  
- **gallery** — About-page gallery photos  

Write access to each bucket is restricted by storage RLS to admins only (see Security).

### Migrations

Migrations in `supabase/migrations/` are applied in order:

1. `20260213000001_schema.sql` — Table definitions  
2. `20260213000002_security.sql` — `is_admin()`, RLS, GRANT/REVOKE  
3. `20260213000003_storage_policies.sql` — Buckets and storage policies  
4. `20260213000004_anon_readonly_content_tables.sql` — Anon read-only lock  
5. `20260213000005_revoke_anon_extra_privileges.sql` — Strip anon of REFERENCES/TRIGGER/TRUNCATE  

---

## Security

Security is designed in **three layers**. Even if one layer is misconfigured, the others limit damage. The frontend never receives the service role key; only the anon key is used, and it is constrained by these layers.

### Principles

- **Server-side enforcement** — Grants and RLS define what each role can do. The client cannot bypass them.
- **Least privilege** — Anonymous users can only read rows that are explicitly visible (`published` / `active` / `visible`). They have no INSERT/UPDATE/DELETE on __ANY__ table. Authenticated users can write only if they pass the the OAuth-backed authentication portal.
- **Admin isolation** — The allowlist is never readable via the API. Admin status is checked only inside the database via the `is_admin()` function, which returns a boolean.
- **No admin data in the client** — Admin status is not stored in localStorage or cookies. The app calls `is_admin()` RPC and reacts to the boolean; it never receives admin rows or enumerates admins.

### Layer 1: SQL GRANT / REVOKE

| Role | Allowlist Permissions | Content Tables |
|------|----------|----------------------------------------------------------------|
| **anon** | REVOKE ALL | SELECT only (no INSERT/UPDATE/DELETE; no REFERENCES/TRIGGER/TRUNCATE) |
| **authenticated** | REVOKE ALL | SELECT, INSERT, UPDATE, DELETE |

So at the SQL level, unauthenticated clients cannot write anything. Authenticated clients can issue writes to content tables, but those writes are then filtered by RLS (Layer 2).

### Layer 2: Row Level Security (RLS)

- **Content tables** — RLS is enabled. Each has:
  - A **public SELECT** policy filtered by the visibility column (`published`, `active`, or `visible`).
  - An **admin FOR ALL** policy gated by `public.is_admin()` (both `USING` and `WITH CHECK`).
- **Allowlist** – Enforces RLS with **no policies**. Combined with REVOKE ALL, the list is not accessible via the API at all. Admin status can only be checked using `is_admin()`.

Anonymous users see only visible rows; authenticated users see the same, and can change rows only if they are admins.

### Layer 3: Application guards

- **AdminAuthProvider** implements a 3-phase flow: LOADING → AUTHORIZED or DENIED. No admin UI is shown until the app has called `is_admin()` and received a result.
- Non-admin Google accounts are signed out when they hit the admin area, so the UI does not suggest privileges that the backend would deny anyway.

These guards are defense-in-depth only; Layers 1 and 2 remain the enforcement.

### The `is_admin()` RPC

Admin checks are centralized in a single function:

- **Exposed as RPC** so the frontend can call it (e.g. from `AdminAuthProvider`). Only **authenticated** users can execute it; `anon` cannot.
- **Returns only a boolean** — whether the caller is in `admins`. No rows, column values, or error details. No parameters (parameters could be used to probe the admins table).
- **Implemented securely:**
  - `SECURITY DEFINER` — runs with the function owner’s privileges so it can read `public.admins` even though the role has no table grants.
  - `SET search_path = public` — avoids schema injection.
  - Explicit `public.admins` and `auth.uid()` — stable, exact comparison by UUID.
  - Owned by `postgres`; `REVOKE EXECUTE FROM PUBLIC, anon`; `GRANT EXECUTE TO authenticated`.

Restricting who can call `is_admin()` (e.g. only admins) would break the flow: non-admins call it to learn they are not admin and get signed out. Design: “any authenticated user can call it; they only learn a boolean about themselves.”

### Storage

- Buckets are **public read** so the site can show images via CDN URLs without signed URLs.
- **Write (INSERT/UPDATE/DELETE)** on `storage.objects` is gated by policies that require `bucket_id = '<name>'` and `public.is_admin()`.
- Object names in the DB are opaque (e.g. UUID-based). Avoid storing original filenames or user identifiers in object paths. Deleted files may linger in CDN caches briefly; that is accepted for this use case.

### Rules (do not break)

- Service role key stays out of frontend code and frontend-visible env.
- RLS stays enabled on all tables.
- No INSERT/UPDATE/DELETE for `anon` on content tables.
- `is_admin()`: no parameters, boolean only; keep SECURITY DEFINER and search_path unless reviewed.
- Admin status is not stored in localStorage or cookies.
- New tables: enable RLS and follow the "Adding a new table" steps below.

### Adding a new table

1. Create the table with a visibility column (e.g. `published BOOLEAN DEFAULT false`).
2. `ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;`
3. Add a public SELECT policy filtered by the visibility column.
4. Add an admin FOR ALL policy using `public.is_admin()` (USING and WITH CHECK).
5. `GRANT SELECT` to `anon`; `GRANT SELECT, INSERT, UPDATE, DELETE` to `authenticated`.
6. `REVOKE INSERT, UPDATE, DELETE` (and REFERENCES, TRIGGER, TRUNCATE if needed) from `anon`.
7. If the table has a `*_path` column for storage, add it to `supabase/scripts/cleanup-orphans.sql`.
8. Run `supabase/scripts/verify-security.sql`; all checks must pass.
9. Update the verify script’s table lists (CHECK 1, 3, 7) to include the new table.

### Admin management

Admins are identified by **user_id** (UUID from `auth.users`), not email. Email in `admins` is for display only.

**Adding or replacing an admin:**

1. Person signs in once with Google (so `auth.users` row exists).
2. Dashboard → Authentication → Users: copy their UUID.
3. SQL Editor (service role):

```sql
-- Remove old admin (if applicable)
DELETE FROM public.admins WHERE user_id = '<old-uuid>';

-- Add new admin
INSERT INTO public.admins (user_id, email, note)
VALUES ('<new-uuid>', 'their-email@example.com', 'e.g. Club president 2026-27');
```

See `supabase/scripts/seed-admin.sql` for a documented process.

### Verification and maintenance

- **After schema or policy changes:** run `supabase/scripts/verify-security.sql`; all checks must pass.
- **Orphaned storage:** run `supabase/scripts/cleanup-orphans.sql` in dry-run first; review before deletes.
- **Periodically:** confirm RLS enabled on all tables, `.env` not in git, Realtime off if unused.

### Operational notes

- **ErrorBoundary** in the app catches render-time errors only. Supabase/async errors are handled in data hooks and `classifyError()`, not by the boundary.
- **Transferring project:** Dashboard → Settings → General → Transfer project.
- **Rotating the anon key:** Dashboard → Settings → API → Regenerate anon key; update `VITE_SUPABASE_ANON_KEY` and redeploy.
