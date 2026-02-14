import React from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import './Landing.css';
import Event from '../../components/event/Event';
import ContactForm from '../../components/contact-form/ContactForm';
import { Link } from "react-router-dom";
import { useSupabaseQuery } from '../../lib/hooks/useSupabaseQuery';
import { getPublicUrl } from '../../lib/storageUtils';

// About section stats (can be moved to backend/settings table later if needed)
const ABOUT_STATS = { members: 130, execs: 10, events: 8, partners: 8 };

function Landing({ events = [], loading, error }) {

    const previewEvents = events?.slice(0, 3) || [];

    // Fetch sponsors from Supabase for the carousel
    const { data: sponsors } = useSupabaseQuery('sponsors');

    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className="w-full left-0">

                {/** ========== HERO ================================================================================ */}
                <div className="hero-section">
                    <div className="contents relative z-10">
                        <Nav />
                    </div>

                    <div
                        className="hero-background"
                        style={{ backgroundPositionY: `${scrollY * 0.4}px` }}
                    ></div>

                    <div className="hero-content">
                        <div>
                            <h3 className="hero-welcome">Welcome to</h3>
                            <h1 className="hero-title">Western's Sales Community</h1>
                        </div>
                    </div>
                </div>

                {/* ========== ABOUT US ================================================================================ */}
                <section id="about">
                    <div className="container-custom">
                        <div className="about-header">
                            <p className="section-title">About Our Club</p>
                            <div className="divider"></div>
                        </div>

                        <div className="about-grid">
                            <div className="about-text-section">
                                <h2 className="about-subtitle">Who We Are</h2>
                                <p className="about-description">
                                    Western Sales Club is at the frontier of sales education at Western University.
                                    We're not just teaching sales, we're building effective communicators and personable leaders –
                                    giving you the confidence to succeed in any field.
                                </p>
                                <h3 className="about-subtitle">Our Mission</h3>
                                <p className="about-description">
                                    Western Sales Club envisions a future where sales education and representation
                                    is fully integrated into post-secondary learning, equipping students with practical
                                    communication skills, confidence, industry connections, and a supportive community to
                                    make a positive impact on personal/social lives and drive career success in any field.
                                </p>

                                <div className="about-button-wrapper">
                                    <Link to="/executive-team" style={{ all: 'unset' }}>
                                        <button>Meet our Team</button>
                                    </Link>
                                </div>


                            </div>
                            <div className="about-stats-card">
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <h4 className="stat-number">{ABOUT_STATS.members}+</h4>
                                        <p className="stat-label">Active Members</p>
                                    </div>
                                    <div className="stat-item">
                                        <h4 className="stat-number">{ABOUT_STATS.execs}</h4>
                                        <p className="stat-label">Committed Executives</p>
                                    </div>
                                    <div className="stat-item">
                                        <h4 className="stat-number">{ABOUT_STATS.events}+</h4>
                                        <p className="stat-label">Annual Events</p>
                                    </div>
                                    <div className="stat-item">
                                        <h4 className="stat-number">{ABOUT_STATS.partners}+</h4>
                                        <p className="stat-label">Dedicated Partners</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== LANDSCAPE IMAGE ================================================================================*/}
                <div className="landscape-section">
                    <div
                        className="landscape-background"
                        style={{ backgroundPositionY: `${scrollY * 0.57}px` }}
                    ></div>

                    <div className="landscape-content">
                        <h1 className="landscape-quote">"Empowering Sales Excellence"</h1>
                    </div>
                </div>

                {/* ========== WHAT WE DO ================================================================================ */}
                <div id="what-we-do" className="what-we-do-section">
                    <h2 className="section-title">What We Do</h2>
                    <div className="divider"></div>

                    <div className="features">
                        <div className="feature-card">
                            <div className="feature-card-inner">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="feature-text">
                                    <h3 className="feature-title">Guest Speaker Panels</h3>
                                    <p className="feature-description">
                                        Gain direct exposure to accomplished professionals across a variety of industries through our engaging speaker panels.
                                        Learn about their journeys, challenges, and the sales and communication skills that helped them succeed—offering you both
                                        inspiration and actionable advice.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-card-inner">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="feature-text">
                                    <h3 className="feature-title">Sales Competitions</h3>
                                    <p className="feature-description">
                                        Our sales competitions are a fun, energizing way to learn by doing.
                                        Whether you're brand new or experienced, you'll enjoy role-playing real-world scenarios,
                                        refining your pitch, and receiving feedback from judges—all while building confidence and making new connections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-card-inner">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="feature-text">
                                    <h3 className="feature-title">Sales Agency</h3>
                                    <p className="feature-description">
                                        The Western Sales Club Agency partners with actual organizations and businesses to provide students with the opportunity
                                        to apply their sales skills in meaningful, real-world projects. These experiences help develop students'
                                        problem-solving, communication, and strategic thinking in a professional setting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== SPONSORS CAROUSEL ================================================================================ */}
                <h2 className="section-title">Our Esteemed Sponsors</h2>
                <div className="divider"></div>
                <div className="sponsors-carousel">
                    <div className="marquee-track">
                        {sponsors.length > 0 ? (
                            [...Array(5)].map((_, index) => (
                                <div key={index} className="marquee-item">
                                    <div className="marquee-logos">
                                        {sponsors.filter(Boolean).map(sponsor => (
                                            <div key={sponsor.id} className="sponsor-logo">
                                                <img
                                                    src={getPublicUrl('sponsor-logos', sponsor.logo_path) || ''}
                                                    alt={sponsor.name ?? 'Sponsor'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="marquee-item" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                                <p>Sponsors loading...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="sponsors-spacer"></div>

                {/* ========== EVENTS PREVIEW ================================================================================ */}
                <section id="events" className="events-section">
                    <div className="container-custom">
                        <div className="events-header">
                            <h2 className="section-title">Our Events</h2>
                            <div className="divider"></div>
                            <p>
                                Join us for our upcoming events designed to help you develop your skills and expand your network.
                            </p>
                        </div>

                        <div className="events-content">
                            <div className="events-button-wrapper">
                                <Link to="/events" style={{ all: 'unset' }}>
                                    <button> View All Events </button>
                                </Link>
                            </div>

                            <div className="events-list">
                                {previewEvents.filter(Boolean).map((event) => {
                                    return <Event key={event.id} event={event} />;
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CONTACT US ================================================================================ */}
                <section id="contact" className="contact-section">
                    <div className="container-custom">
                        <div className="contact-header">
                            <h2 className="section-title">Get In Touch</h2>
                            <div className="divider"></div>
                            <p className="contact-description">
                                Interested in joining our club or partnering with us? We'd love to hear from you!
                            </p>
                        </div>

                        <ContactForm />
                    </div>
                </section>

                {/* ========== JOIN ================================================================================ */}
                <div className="join-section">
                    <div
                        className="join-background"
                        style={{ backgroundPositionY: `${scrollY * 0.69}px` }}
                    ></div>

                    <div className="join-content">
                        <h2 className="join-title">Begin your journey with us today.</h2>
                        <a href="https://westernusc.store/product/western-sales-club/" target="_blank" rel="noopener noreferrer">
                            <button className="join-button">Register with WSC</button>
                        </a>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Landing;
