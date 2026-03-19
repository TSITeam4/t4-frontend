-- ================================================================
-- 004_anon_readonly_content_tables.sql — Anon: read-only, no writes
-- ================================================================
-- Runs after 002. Unauthenticated users get VIEW only on content
-- tables; no insert/update/delete/truncate/references/trigger.
-- Revokes all from anon on these tables, then grants only SELECT.
-- admins: anon has no access (reinforced; 002 also revokes).
-- ================================================================

REVOKE ALL ON public.admins FROM anon;

-- Strip all privileges from anon on the four content tables
REVOKE ALL ON public.events         FROM anon;
REVOKE ALL ON public.sponsors       FROM anon;
REVOKE ALL ON public.executives     FROM anon;
REVOKE ALL ON public.gallery_photos FROM anon;

-- SELECT only for anon; RLS still filters by published/active/visible.
GRANT SELECT ON public.events         TO anon;
GRANT SELECT ON public.sponsors       TO anon;
GRANT SELECT ON public.executives     TO anon;
GRANT SELECT ON public.gallery_photos TO anon;

-- anon can execute is_admin() so RLS policy evaluation does not throw (returns false for anon).
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;