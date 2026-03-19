# Supabase Integration Reference

**Project**: Western Sales Club Frontend (WSC Vite App)
**Source location**: `_reference/wsc-vite-app/`
**Supabase SDK**: `@supabase/supabase-js ^2.95.3`

> **Scope**: Every DB table schema, hook API, auth flow, storage bucket, TypeScript interfaces, and critical backend rules. Read at phases A (porting), D/E (data wiring), F (admin). This is the authoritative reference for anything touching Supabase.
>
> **Does not cover**: Build order (→ `implementation-plan.md`), component visuals (→ `design-spec.md`), routing/layout wiring (→ `routing-and-data-flow.md`).

---

## Environment Variables

| Variable | Purpose | Migration (Next.js) |
|----------|---------|---------------------|
| `VITE_SUPABASE_URL` | Supabase project URL | → `NEXT_PUBLIC_SUPABASE_URL` |
| `VITE_SUPABASE_ANON_KEY` | Anonymous (public) API key | → `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | → `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` |

> **Note:** If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing, a console error is logged but execution continues (safe degradation). All `VITE_` prefixes must be renamed to `NEXT_PUBLIC_` in the new project.

---

## Core Supabase Client

**File**: `wsc-vite-app/src/lib/supabaseClient.js`

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Singleton — import `supabase` from here everywhere.

---

## Database Tables

### `events`

**RLS**: Public SELECT filtered to `published = true`; admin full access.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `title` | text | Required |
| `date` | date/timestamp | Required; ordered DESC for display |
| `time` | text | Optional, e.g. `"6:00 PM"` |
| `location` | text | Optional |
| `description` | text | Optional |
| `published` | boolean | Visibility flag |
| `display_order` | integer | Sort order |

**Query locations**:
- `App.jsx` (line 43–46): `orderBy: 'date', ascending: false` → props-drilled to Landing + Events
- `Landing.jsx`: Receives via props, shows top 3
- `Events.jsx`: Receives via props, shows all

**Limit**: `MAX_EVENTS = 50` (`src/lib/constants.js`)

---

### `sponsors`

**RLS**: Public SELECT filtered to `active = true`; admin full access.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | text | Required |
| `description` | text | Optional |
| `link` | text | Sponsor website URL |
| `logo_path` | text | Storage object name (NOT a full URL) |
| `active` | boolean | Visibility flag — note: `active` not `visible` |
| `display_order` | integer | Sort order |

**Query locations**:
- `Sponsors.jsx` (line 12): `useSupabaseQuery('sponsors')`
- `Landing.jsx` (line 19): `useSupabaseQuery('sponsors')` for homepage carousel

**Storage bucket**: `sponsor-logos`

**Limit**: `MAX_SPONSORS = 20`

---

### `executives`

**RLS**: Public SELECT filtered to `visible = true`; admin full access.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | text | Required |
| `title` | text | Position, e.g. `"Co-President"` |
| `group` | text | `'president'` \| `'vice_president'` \| `'assistant_vice_president'` |
| `headshot_path` | text | Storage object name (NOT a full URL) |
| `visible` | boolean | Visibility flag |
| `display_order` | integer | Not used for reordering (orderable = false) |

**Query locations**:
- `ExecutiveTeam.jsx` (line 11): `useSupabaseQuery('executives')`
- Grouped client-side by `group` column using `useMemo`

**Storage bucket**: `headshots`

**Limit**: `MAX_EXECUTIVES = 30`

---

### `gallery_photos`

**RLS**: Public SELECT filtered to `visible = true`; admin full access.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `image_path` | text | Storage object name (NOT a full URL) |
| `alt` | text | Accessibility alt text |
| `caption` | text | Optional display caption |
| `visible` | boolean | Visibility flag |
| `display_order` | integer | Sort order |

**Query locations**:
- `About.jsx` (line 12): `useSupabaseQuery('gallery_photos')`
- `About.jsx` (lines 15–26): Transforms rows → `{ id, src, alt, caption }` with `getPublicUrl()` before passing to GallerySection

**Storage bucket**: `gallery`

**Limit**: `MAX_GALLERY_PHOTOS = 40`

---

## Storage Buckets

| Bucket | Purpose | DB Column | Max Dimensions |
|--------|---------|-----------|----------------|
| `headshots` | Executive portraits | `executives.headshot_path` | 3000×3000 px |
| `sponsor-logos` | Sponsor logos | `sponsors.logo_path` | 2500×2500 px |
| `gallery` | Event/about photos | `gallery_photos.image_path` | 1920×1080 px |

### URL Construction

**File**: `wsc-vite-app/src/lib/storageUtils.js`

```javascript
function getPublicUrl(bucket, objectName) {
  if (!objectName) return null;
  return supabase.storage.from(bucket).getPublicUrl(objectName).data.publicUrl;
}
```

> **Critical**: DB columns store **object names only** (e.g., `a1b2c3d4.jpg`), NOT full URLs. URLs are always constructed at runtime. Never hardcode storage URLs in the DB.

### File Upload

```javascript
export async function uploadFile(bucket, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const objectName = `${crypto.randomUUID()}.${ext}`; // original filename discarded
  const { error } = await supabase.storage.from(bucket).upload(objectName, file, {
    cacheControl: '3600',
    upsert: false,  // throws if collision (fail-safe)
  });
  if (error) throw error;
  return { objectName };
}
```

### File Deletion

```javascript
export async function deleteFile(bucket, objectName) {
  if (!objectName) return;
  const { error } = await supabase.storage.from(bucket).remove([objectName]);
  if (error) throw error;
}
```

### Client-Side Upload Validation (before upload)

- **Max file size**: 2 MB
- **Allowed types**: JPEG, PNG, WebP, AVIF
- **Dimension validation**: Per-table limits (see table above)
- **Total storage budget**: 500 MB soft limit

---

## Authentication & Admin Flow

**File**: `wsc-vite-app/src/contexts/AdminAuthProvider.jsx`

**Provider**: Google OAuth only (`supabase.auth.signInWithOAuth({ provider: 'google' })`)

**Redirect URI**: `window.location.origin + '/admin'`
> Required in Supabase Auth settings: `https://westernsalesclub.ca/admin` (prod) and `http://localhost:5173/admin` (dev)

### 3-Phase Gate

| Phase | State | UI |
|-------|-------|-----|
| Check session | `checking_auth` | `FullPageLoader` (neutral spinner — no hints) |
| Verify admin via RPC | `checking_admin` | `FullPageLoader` |
| Verified | `authorized` | Render AdminDashboard |
| Denied / no session | `denied` | Google login button |

### Auth Flow Code

```javascript
// Phase 1: Check session on mount
supabase.auth.getSession().then(({ data: { session } }) => {
  verifyAdmin(session);
});

// Phase 2: Watch for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  verifyAdmin(session);
});

// Phase 3: Verify admin role via RPC
const { data: isAdmin, error } = await supabase.rpc('is_admin');
if (error || !isAdmin) {
  await supabase.auth.signOut();
  setState('denied');
} else {
  setState('authorized');
}
```

> **Critical**: `is_admin()` RPC must be defined in Supabase backend. Returns `true` if authenticated user is an admin. Failure or false triggers immediate sign-out.

### Context

```javascript
export function useAdminAuth() {
  return useContext(AdminContext); // returns { signOut }
}
```

---

## Hook Reference

### `useSupabaseQuery(table, options)`

**File**: `wsc-vite-app/src/lib/hooks/useSupabaseQuery.js`

```typescript
useSupabaseQuery(
  table: string,
  options?: {
    select?: string;       // default: '*'
    orderBy?: string;      // default: 'display_order'
    ascending?: boolean;   // default: true
    filters?: Array<{ column: string, operator: string, value: any }>;
    enabled?: boolean;     // default: true
  }
) => { data: Array, loading: boolean, error: QueryError | null, refetch: () => void }
```

**Example**:
```javascript
const { data: events, loading, error, refetch } = useSupabaseQuery('events', {
  orderBy: 'date',
  ascending: false,
});
```

> **Implementation detail**: Uses `JSON.stringify(filters)` in dependency array to prevent infinite re-renders.

---

### `useSupabaseMutation()`

**File**: `wsc-vite-app/src/lib/hooks/useSupabaseMutation.js`

```typescript
useSupabaseMutation() => {
  mutate: (fn: () => Promise<void>) => Promise<void>,
  loading: boolean,
  error: QueryError | null,
  reset: () => void
}
```

**Usage**:
```javascript
const { mutate, loading, error } = useSupabaseMutation();
await mutate(async () => {
  const { error: err } = await supabase.from('sponsors').insert(payload);
  if (err) throw err;
});
```

---

### `deleteContentItem(table, row, bucketName, pathColumn)`

**File**: `wsc-vite-app/src/lib/hooks/useSupabaseMutation.js`

Storage-first, DB-second delete pattern:
1. Delete storage file
2. If storage delete fails → throw immediately
3. Delete DB row (retry up to 3× with 1s delay)
4. If final DB delete fails → throw with message: `"Image was deleted but the record could not be removed: {dbErr.message}"`

**Rationale**: Orphaned DB rows are recoverable; orphaned storage files are not.

---

## Error Classification

**File**: `wsc-vite-app/src/lib/errorUtils.js`

```typescript
interface QueryError {
  category: 'auth' | 'forbidden' | 'network' | 'paused' | 'conflict' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}
```

| Category | Condition | Retryable |
|----------|-----------|-----------|
| `auth` | 401, JWT expired | No |
| `forbidden` | 403, RLS denied | No |
| `network` | Connection failure | Yes |
| `paused` | 503, project paused | Yes |
| `conflict` | 23505, unique violation | No |
| `server` | 5xx | Yes |
| `unknown` | Fallback | Depends |

`AsyncStateWrapper` uses `error.retryable` to conditionally show a "Try Again" button.

---

## Content Configuration

**File**: `wsc-vite-app/src/lib/constants.js`

```javascript
const CONTENT_CONFIG = {
  events:        { table: 'events',        visibilityColumn: 'published', displayName: 'Events',    limit: 50, orderable: true  },
  sponsors:      { table: 'sponsors',      visibilityColumn: 'active',    displayName: 'Sponsors',  limit: 20, orderable: true, bucket: 'sponsor-logos', pathColumn: 'logo_path' },
  executives:    { table: 'executives',    visibilityColumn: 'visible',   displayName: 'Executives',limit: 30, orderable: false, bucket: 'headshots',     pathColumn: 'headshot_path' },
  gallery_photos:{ table: 'gallery_photos',visibilityColumn: 'visible',   displayName: 'Gallery',   limit: 40, orderable: true, bucket: 'gallery',       pathColumn: 'image_path' },
};
```

> Note: `executives` has `orderable: false` — no `display_order` reordering in admin UI; grouped by `group` column instead.

---

## TypeScript Interfaces

```typescript
interface Event {
  id: string;
  title: string;
  date: string;          // ISO 8601
  time?: string;         // e.g. "6:00 PM"
  location?: string;
  description?: string;
  published: boolean;
  display_order: number;
}

interface Sponsor {
  id: string;
  name: string;
  description?: string;
  link?: string;
  logo_path?: string;    // Storage object name, NOT full URL
  active: boolean;
  display_order: number;
}

interface Executive {
  id: string;
  name: string;
  title: string;
  group: 'president' | 'vice_president' | 'assistant_vice_president';
  headshot_path?: string; // Storage object name, NOT full URL
  visible: boolean;
  display_order: number;
}

interface GalleryPhoto {
  id: string;
  image_path?: string;   // Storage object name, NOT full URL
  alt?: string;
  caption?: string;
  visible: boolean;
  display_order: number;
}

interface QueryError {
  category: 'auth' | 'forbidden' | 'network' | 'paused' | 'conflict' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}

interface QueryResult<T> {
  data: T[];
  loading: boolean;
  error: QueryError | null;
  refetch: () => Promise<void>;
}
```

---

## File Manifest

| File | Purpose |
|------|---------|
| `src/lib/supabaseClient.js` | Supabase client singleton |
| `src/lib/storageUtils.js` | `getPublicUrl`, `uploadFile`, `deleteFile` |
| `src/lib/hooks/useSupabaseQuery.js` | SELECT hook |
| `src/lib/hooks/useSupabaseMutation.js` | Mutation hook + `deleteContentItem` |
| `src/lib/errorUtils.js` | `classifyError()` |
| `src/lib/constants.js` | `CONTENT_CONFIG`, `LIMITS` |
| `src/contexts/AdminAuthProvider.jsx` | OAuth gate + `useAdminAuth` context |
| `src/App.jsx` | Root-level events fetch (props drilled to Landing + Events) |
| `src/pages/Landing/Landing.jsx` | Fetches sponsors; receives events as props |
| `src/pages/About/About.jsx` | Fetches `gallery_photos`, transforms to `{ src, alt, caption }` |
| `src/pages/Team/ExecutiveTeam.jsx` | Fetches executives, groups by `group` column |
| `src/pages/Sponsors/Sponsors.jsx` | Fetches sponsors |
| `src/pages/Admin/AdminSection.jsx` | Generic CRUD for all 4 tables |
| `src/components/profile/Profile.jsx` | Calls `getPublicUrl('headshots', ...)` |
| `src/components/sponsor/Sponsor.jsx` | Calls `getPublicUrl('sponsor-logos', ...)` |

---

## Critical Notes

1. **RLS is mandatory** — without it, unpublished content is exposed to public users. Verify policies exist before launch.
2. **Visibility columns differ per table**: `events.published`, `sponsors.active`, `executives.visible`, `gallery_photos.visible`.
3. **Never store full URLs in DB** — always object names; construct URLs via `getPublicUrl()` at runtime.
4. **`is_admin()` RPC** is the sole server-side admin check. Never rely on frontend state.
5. **Events are the only top-level fetch** (App.jsx) — all others fetch at page level.
6. **Contact form uses EmailJS, not Supabase** — 200 email/month limit. Service ID: `service_qwpe0fl`, Template ID: `template_lt8anmn`.
7. **Image dimension validation is client-side** — consider adding server-side enforcement.
8. **OAuth redirect URIs** must be registered in Supabase Auth settings for both dev and prod.

---

## Migration Checklist

- [ ] Rename all `VITE_` env vars to `NEXT_PUBLIC_` in new project
- [ ] Update `supabaseClient.ts` to use `process.env.NEXT_PUBLIC_*`
- [ ] Verify RLS policies for all 4 tables
- [ ] Verify storage bucket permissions (public read, authenticated write)
- [ ] Confirm `is_admin()` RPC is defined and working
- [ ] Register OAuth redirect URIs in Supabase Auth settings
- [ ] Port `useSupabaseQuery` → React Query or `use()` + Server Components pattern
- [ ] Port `useSupabaseMutation` → Server Actions or React Query mutations
- [ ] Keep `deleteContentItem` storage-first delete logic intact
- [ ] Keep all TypeScript interfaces above as `src/types/database.ts`
