-- ================================================================
-- 004_revoke_anon_extra_privileges.sql — Fix CHECK 6
-- ================================================================
-- Run AFTER 002_security.sql. Revokes REFERENCES, TRIGGER, and
-- TRUNCATE from anon on content tables so anon has ONLY SELECT.
-- ================================================================

REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.events         FROM anon;
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.sponsors       FROM anon;
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.executives      FROM anon;
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.gallery_photos FROM anon;
