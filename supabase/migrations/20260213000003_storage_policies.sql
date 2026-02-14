-- ================================================================
-- 003_storage_policies.sql — Storage bucket creation + policies
-- ================================================================
-- Run AFTER 002_security.sql (requires is_admin() to exist).
--
-- Creates 4 public buckets with admin-only write policies.
-- Public buckets allow unauthenticated reads via CDN URLs.
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- CREATE BUCKETS (idempotent — INSERT … ON CONFLICT DO NOTHING)
-- ────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('headshots',     'headshots',     true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsor-logos', 'sponsor-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images',  'event-images',  true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery',       'gallery',       true) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- STORAGE POLICIES
-- 4 buckets × 4 policies = 16 policies total.
-- IMPORTANT: After creating these, verify each bucket_id literal
-- matches the section header. A mismatch silently breaks access.
-- ================================================================

-- ┌──────────────────────────────────────────────────────────────┐
-- │ BUCKET: headshots                                           │
-- │ Purpose: Executive headshot images                          │
-- │ ☐ Verify: all 4 policies below use bucket_id = 'headshots'  │
-- └──────────────────────────────────────────────────────────────┘
CREATE POLICY "headshots: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'headshots');

CREATE POLICY "headshots: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'headshots' AND public.is_admin());

CREATE POLICY "headshots: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'headshots' AND public.is_admin());

CREATE POLICY "headshots: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'headshots' AND public.is_admin());

-- ┌──────────────────────────────────────────────────────────────┐
-- │ BUCKET: sponsor-logos                                       │
-- │ Purpose: Sponsor logo images                                │
-- │ ☐ Verify: all 4 policies below use bucket_id = 'sponsor-logos' │
-- └──────────────────────────────────────────────────────────────┘
CREATE POLICY "sponsor-logos: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sponsor-logos');

CREATE POLICY "sponsor-logos: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sponsor-logos' AND public.is_admin());

CREATE POLICY "sponsor-logos: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'sponsor-logos' AND public.is_admin());

CREATE POLICY "sponsor-logos: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'sponsor-logos' AND public.is_admin());

-- ┌──────────────────────────────────────────────────────────────┐
-- │ BUCKET: event-images                                        │
-- │ Purpose: Event banner/promo images                          │
-- │ ☐ Verify: all 4 policies below use bucket_id = 'event-images' │
-- └──────────────────────────────────────────────────────────────┘
CREATE POLICY "event-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "event-images: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-images' AND public.is_admin());

CREATE POLICY "event-images: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'event-images' AND public.is_admin());

CREATE POLICY "event-images: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-images' AND public.is_admin());

-- ┌──────────────────────────────────────────────────────────────┐
-- │ BUCKET: gallery                                             │
-- │ Purpose: About page gallery photos                          │
-- │ ☐ Verify: all 4 policies below use bucket_id = 'gallery'    │
-- └──────────────────────────────────────────────────────────────┘
CREATE POLICY "gallery: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "gallery: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "gallery: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "gallery: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND public.is_admin());
