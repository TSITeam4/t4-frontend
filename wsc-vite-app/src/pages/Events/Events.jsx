import React from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import './Events.css';
import Event from '../../components/event/Event';

function Events({ events }) {
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
                { events.length === 0 ? (
                    <div className="events-empty-message">
                        <p>No upcoming events...</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <Event key={event.id} event={event} />
                    ))
                )}
            </div>

            <Footer />
        </>
    );
}

export default Events;