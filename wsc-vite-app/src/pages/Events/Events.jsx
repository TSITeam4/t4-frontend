import React from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import './Events.css';
import Event from '../../components/event/Event';
import AsyncStateWrapper from '../../components/shared/AsyncStateWrapper';

function Events({ events = [], loading = false, error = null }) {
    const [scrollY, setScrollY] = React.useState(0);
    
    React.useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Hero Section */}
            <div className="events-hero">
                <div className="contents relative z-10">
                    <Nav/>
                </div>
                <div
                    className="events-hero-background"
                    style={{ backgroundPositionY: `${scrollY * 0.3}px` }}
                ></div>
                <div className="events-hero-content">
                    <div>
                        <h1 className="events-hero-title">Our Events</h1>
                        <p className="events-hero-description">
                            Follow our upcoming workshops, seminars, and networking events designed to help you
                            develop your sales skills and connect with industry professionals.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="events-page-container">
                <AsyncStateWrapper
                    loading={loading}
                    error={error}
                    data={events}
                    emptyMessage="No upcoming events — check back soon!"
                >
                    {events.filter(Boolean).map((event) => (
                        <Event key={event.id} event={event} />
                    ))}
                </AsyncStateWrapper>
            </div>

            <Footer />
        </>
    );
}

export default Events;
