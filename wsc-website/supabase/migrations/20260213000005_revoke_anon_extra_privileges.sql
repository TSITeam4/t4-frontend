-- ================================================================
-- 005_revoke_anon_extra_privileges.sql — Fix CHECK 6
-- ================================================================
-- Runs after 002. Revokes REFERENCES, TRIGGER, TRUNCATE from anon
-- on content tables so anon has only SELECT.
-- ================================================================

REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.events         FROM anon;
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.sponsors       FROM anon;
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.executives      FROM anon;
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.gallery_photos FROM anon;
