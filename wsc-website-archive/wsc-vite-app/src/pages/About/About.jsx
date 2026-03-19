import React from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import PageTitle from "../../components/page-title/PageTitle";
import GallerySection from '../../components/gallery/GallerySection';
import { useSupabaseQuery } from '../../lib/hooks/useSupabaseQuery';
import { getPublicUrl } from '../../lib/storageUtils';
import './About.css';

function About() {
  /* ── Gallery data from Supabase ── */
  const { data: rawPhotos, loading: galleryLoading, error: galleryError, refetch } = useSupabaseQuery('gallery_photos');

  // Transform DB rows into the shape GallerySection expects: { id, src, alt, caption }
  const galleryPhotos = React.useMemo(
    () =>
      rawPhotos
        .filter((p) => p && p.image_path)
        .map((p) => ({
          id: p.id,
          src: getPublicUrl('gallery', p.image_path),
          alt: p.alt || '',
          caption: p.caption || null,
        })),
    [rawPhotos]
  );

  return (
    <>
      <Nav />
      <PageTitle
        title="About Us"
        description="Welcome to the Western Sales Club, where we equip students with the social skillset they need to excel as professionals."
      />
      <div className="about-container">
        <section className="about-section about-section--cards">
          <div className="about-cards-grid">
            <article className="about-card about-card--mission">
              <h3 className="about-card__title">Our Mission</h3>
              <p className="about-card__text">
                Our mission is to create an inclusive environment that equips members
                with the tools, network, and confidence to become influential sales
                professionals. By offering workshops, mentorship, and hands-on
                experiences, we help our members reach their fullest potential.
              </p>
            </article>
            <article className="about-card about-card--vision">
              <h3 className="about-card__title">Our Vision</h3>
              <p className="about-card__text">
                We envision a future where our members lead with integrity, innovation,
                and empathy in sales. Through continuous learning, collaboration, and
                community engagement, we aim to shape a new generation of sales leaders
                who can adapt to a rapidly evolving marketplace.
              </p>
            </article>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── Photo Gallery ──────────────────────────────── */}
        <GallerySection
          photos={galleryPhotos}
          loading={galleryLoading}
          error={galleryError ? (galleryError.message || 'Failed to load gallery') : null}
          onRetry={refetch}
        />
      </div>
      <Footer />
    </>
  );
}

export default About;
