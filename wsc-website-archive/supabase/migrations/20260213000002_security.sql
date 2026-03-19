-- ================================================================
-- 002_security.sql — is_admin(), RLS policies, GRANT/REVOKE
-- ================================================================
-- Runs after 001_schema.sql. Sets up three layers: SQL grants,
-- RLS policies, and is_admin().
-- ================================================================

-- ════════════════════════════════════════════════════════════════
-- LAYER 1: is_admin()
-- ════════════════════════════════════════════════════════════════
-- SECURITY DEFINER; only way admins is read. No params, no user input;
-- keep SECURITY DEFINER and search_path. STABLE for per-request caching.

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

-- EXECUTE restricted to authenticated; anon revoked (004 grants anon for RLS eval).
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ════════════════════════════════════════════════════════════════
-- LAYER 2: SQL-LEVEL GRANT / REVOKE (hard ceiling)
-- ════════════════════════════════════════════════════════════════

-- admins: no API access.
REVOKE ALL ON public.admins FROM anon, authenticated;

-- Content tables: anon read-only here; 004 tightens anon to SELECT only.
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

-- ── admins: RLS ON, no policies ─────────────────────────────────
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- No policies; with REVOKE ALL the table is API-inaccessible. is_admin() is the only reader.

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
