-- ================================================================
-- 002_security.sql — is_admin(), RLS policies, GRANT/REVOKE
-- ================================================================
-- Run AFTER 001_schema.sql. This file sets up all three security
-- layers: SQL grants, RLS policies, and the hardened is_admin()
-- function.
-- ================================================================

-- ════════════════════════════════════════════════════════════════
-- LAYER 1: HARDENED is_admin() FUNCTION
-- ════════════════════════════════════════════════════════════════
-- SECURITY DEFINER — runs with postgres (owner) privileges.
-- This is the ONLY way the admins table is ever queried.
-- Direct access is fully revoked from all API roles.
--
-- ⚠ IMPORTANT for future maintainers:
--   - Do NOT add parameters to this function.
--   - Do NOT pass user-provided input into it.
--   - Do NOT change it to SECURITY INVOKER.
--   - The STABLE marker tells Postgres the result won't change
--     within a single transaction, enabling safe caching per-request.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public           -- pin search_path to prevent hijack
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
$$;

ALTER FUNCTION public.is_admin() OWNER TO postgres;

-- Only authenticated users can call is_admin().
-- anon has no reason to check admin status.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ════════════════════════════════════════════════════════════════
-- LAYER 2: SQL-LEVEL GRANT / REVOKE (hard ceiling)
-- ════════════════════════════════════════════════════════════════

-- admins table: completely invisible to the frontend.
REVOKE ALL ON public.admins FROM anon, authenticated;

-- Content tables: anon = read-only (view only; no insert/update/delete).
-- See 005_anon_readonly_content_tables.sql for the locked-down anon layer.
GRANT SELECT ON public.events         TO anon;
GRANT SELECT ON public.sponsors       TO anon;
GRANT SELECT ON public.executives     TO anon;
GRANT SELECT ON public.gallery_photos TO anon;

REVOKE INSERT, UPDATE, DELETE ON public.events         FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.sponsors       FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.executives     FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.gallery_photos FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.events         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sponsors       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.executives     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;


-- ════════════════════════════════════════════════════════════════
-- LAYER 3: ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════

-- ── admins: RLS ON, ZERO policies ──────────────────────────────
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- No policies! Combined with REVOKE ALL, this table is completely
-- inaccessible from the API. is_admin() SECURITY DEFINER is the
-- sole reader.

-- ── events ─────────────────────────────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT
  USING (published = true);

CREATE POLICY "Admin full access to events"
  ON public.events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── sponsors ───────────────────────────────────────────────────
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active sponsors"
  ON public.sponsors FOR SELECT
  USING (active = true);

CREATE POLICY "Admin full access to sponsors"
  ON public.sponsors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── executives ─────────────────────────────────────────────────
ALTER TABLE public.executives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible executives"
  ON public.executives FOR SELECT
  USING (visible = true);

CREATE POLICY "Admin full access to executives"
  ON public.executives FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── gallery_photos ─────────────────────────────────────────────
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible gallery photos"
  ON public.gallery_photos FOR SELECT
  USING (visible = true);

CREATE POLICY "Admin full access to gallery photos"
  ON public.gallery_photos FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
