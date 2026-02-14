-- ================================================================
-- 003_storage_policies.sql — Storage bucket creation + policies
-- ================================================================
-- Runs after 002 (is_admin() must exist). Four public buckets,
-- admin-only write; public read via CDN.
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- CREATE BUCKETS (idempotent: ON CONFLICT DO NOTHING)
-- ────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('headshots',     'headshots',     true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsor-logos', 'sponsor-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images',  'event-images',  true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery',       'gallery',       true) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- STORAGE POLICIES (4 buckets × 4 policies). bucket_id in each
-- policy must match the section; mismatch breaks access.
-- ================================================================

-- ┌──────────────────────────────────────────────────────────────┐
-- │ BUCKET: headshots (executive headshots)                      │
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
-- │ BUCKET: sponsor-logos                                        │
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
-- │ BUCKET: event-images (banner/promo)                          │
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
-- │ BUCKET: gallery (about page)                                │
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
