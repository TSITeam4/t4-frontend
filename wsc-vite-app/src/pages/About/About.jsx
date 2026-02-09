import React, { useState, useCallback } from "react";
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import PageTitle from "../../components/PageTitle";
import LazyImage from '../../components/LazyImage';
import GallerySection from '../../components/GallerySection';
import './About.css';

const GALLERY_DEMO_STATE = 'success'; // FOR DEBUGGING: success, loading, error, empty

const MOCK_GALLERY_PHOTOS = [
  { id: '1', src: '/UC-HILL.avif',  alt: 'Club members at UC Hill',  caption: null },
  { id: '2', src: '/TORONTO.avif',  alt: 'Toronto networking trip',   caption: null },
  { id: '3', src: '/MIDDLESEX.avif', alt: 'Event at Middlesex College', caption: null },
];

function About() {
  /* ── Gallery state (will be replaced by a Supabase hook) ── */
  const [galleryPhotos]  = useState(GALLERY_DEMO_STATE === 'success' ? MOCK_GALLERY_PHOTOS : []);
  const [galleryLoading] = useState(GALLERY_DEMO_STATE === 'loading');
  const [galleryError]   = useState(GALLERY_DEMO_STATE === 'error' ? 'Failed to load gallery' : null);

  const handleGalleryRetry = useCallback(() => {
    // Will trigger a refetch once Supabase is wired
    console.log('Gallery retry requested');
  }, []);

  return (
    <>
      <Nav />
      <PageTitle
        title="About Us"
        description="Welcome to the Western Sales Club, where we equip students with the social skillset they need to excel as professionals."
      />
      <div className="about-container">
        <section className="about-section">
          <div className="content-flex">
            <LazyImage
              src="abt1.avif"
              alt="Our Mission"
              className="content-image"
            />
            <div className="content-text">
              <h3 className="section-title">Our Mission</h3>
              <p className="section-description">
                Our mission is to create an inclusive environment that equips members
                with the tools, network, and confidence to become influential sales
                professionals. By offering workshops, mentorship, and hands-on
                experiences, we help our members reach their fullest potential.
              </p>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        <section className="about-section">
          <div className="content-flex reverse">
            <div className="content-text">
              <h3 className="section-title">Our Vision</h3>
              <p className="section-description">
                We envision a future where our members lead with integrity, innovation,
                and empathy in sales. Through continuous learning, collaboration, and
                community engagement, we aim to shape a new generation of sales leaders
                who can adapt to a rapidly evolving marketplace.
              </p>
            </div>
            <LazyImage
              src="abt2.avif"
              alt="Our Vision"
              className="content-image"
            />
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── Photo Gallery ──────────────────────────────── */}
        <GallerySection
          photos={galleryPhotos}
          loading={galleryLoading}
          error={galleryError}
          onRetry={handleGalleryRetry}
        />

        {/* <hr className="section-divider" />

        <section className="about-section values-section">
          <div className="values-container">
            <h3 className="values-title">Values</h3>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-card-content">
                  <div className="value-card-icon">🤝</div>
                  <h4 className="value-card-title">Collaboration</h4>
                  <p className="value-card-description">
                    Communities are built with collaboration.
                  </p>
                </div>
              </div>

              <div className="value-card">
                <div className="value-card-content">
                  <div className="value-card-icon">👥</div>
                  <h4 className="value-card-title">Community</h4>
                  <p className="value-card-description">
                    WSC is dedicated to bringing people together.
                  </p>
                </div>
              </div>

              <div className="value-card">
                <div className="value-card-content">
                  <div className="value-card-icon">💡</div>
                  <h4 className="value-card-title">Innovation</h4>
                  <p className="value-card-description">
                    We encourage creativity and initiative in our members.
                  </p>
                </div>
              </div>

              <div className="value-card">
                <div className="value-card-content">
                  <div className="value-card-icon">🌟</div>
                  <h4 className="value-card-title">Inclusivity</h4>
                  <p className="value-card-description">
                    We're embracing the amazing diversity Western offers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" /> */}
      </div>
      <Footer />
    </>
  );
}

export default About;
