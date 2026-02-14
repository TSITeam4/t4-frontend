-- ================================================================
-- 001_schema.sql — Table definitions for WSC Content Management
-- ================================================================
-- Creates: admins, events, sponsors, executives, gallery_photos.
-- Visibility columns default FALSE (safe-by-default).
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- ADMINS — allowlist keyed by user_id (UUID), NOT email
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admins (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,                            -- informational only, NOT used for auth checks
  added_at   TIMESTAMPTZ DEFAULT now(),
  note       TEXT                             -- e.g. "Club president 2025-26"
);

COMMENT ON TABLE  public.admins IS 'Admin allowlist. Keyed by auth.users UUID. Never exposed via API.';
COMMENT ON COLUMN public.admins.email IS 'Human-readable only — NOT used for authorization.';

-- ────────────────────────────────────────────────────────────────
-- EVENTS
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  date           DATE NOT NULL,
  time           TEXT,
  location       TEXT,
  description    TEXT,
  image_path     TEXT,                        -- storage object name, e.g. 'a1b2c3d4.webp'
  published      BOOLEAN DEFAULT false,       -- safe-by-default: new rows are hidden
  display_order  INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────────
-- SPONSORS
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sponsors (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  description    TEXT,
  logo_path      TEXT,                        -- storage object name, e.g. 'e5f6g7h8.png'
  link           TEXT,
  active         BOOLEAN DEFAULT false,       -- safe-by-default
  display_order  INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────────
-- EXECUTIVES — flat table, grouped by "group" column
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.executives (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  title           TEXT NOT NULL,
  "group"         TEXT NOT NULL CHECK ("group" IN ('president', 'vice_president', 'assistant_vice_president')),
  headshot_path   TEXT,                       -- storage object name, e.g. 'i9j0k1l2.avif'
  visible         BOOLEAN DEFAULT false,      -- safe-by-default
  display_order   INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────────
-- GALLERY PHOTOS
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path     TEXT NOT NULL,               -- storage object name, e.g. 'm3n4o5p6.jpg'
  alt            TEXT DEFAULT '',
  caption        TEXT,
  visible        BOOLEAN DEFAULT false,       -- safe-by-default
  display_order  INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at TRIGGER
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_executives_updated_at
  BEFORE UPDATE ON public.executives
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
