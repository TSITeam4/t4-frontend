-- ================================================================
-- 005_anon_readonly_content_tables.sql — Anon: read-only, no writes
-- ================================================================
-- Run AFTER 002_security.sql (and after 004 if you use it).
--
-- INTENT: Average (unauthenticated) users must be able to VIEW only
-- the content of events, sponsors, executives, gallery_photos. They
-- must have NO insert, update, delete, truncate, references, trigger,
-- or any other privilege. This migration enforces that by revoking
-- everything from anon on these tables, then granting only SELECT.
--
-- Admins: anon must have no access at all (reinforced here even though 002 does it).
-- ================================================================

REVOKE ALL ON public.admins FROM anon;

-- Strip all privileges from anon on the four content tables
REVOKE ALL ON public.events         FROM anon;
REVOKE ALL ON public.sponsors       FROM anon;
REVOKE ALL ON public.executives     FROM anon;
REVOKE ALL ON public.gallery_photos FROM anon;

-- Grant only SELECT so anon can read (RLS still filters by published/active/visible)
GRANT SELECT ON public.events         TO anon;
GRANT SELECT ON public.sponsors       TO anon;
GRANT SELECT ON public.executives     TO anon;
GRANT SELECT ON public.gallery_photos TO anon;
