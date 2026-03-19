import React from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import Sponsor from '../../components/sponsor/Sponsor';
import './Sponsors.css';
import { useSupabaseQuery } from '../../lib/hooks/useSupabaseQuery';
import AsyncStateWrapper from '../../components/shared/AsyncStateWrapper';

function Sponsors() {
    const [scrollY, setScrollY] = React.useState(0);

    const { data: sponsors, loading, error, refetch } = useSupabaseQuery('sponsors');

    React.useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Hero Section */}
            <div className="sponsors-hero">
                <div className="contents relative z-10">
                    <Nav />
                </div>
                <div
                    className="sponsors-hero-background"
                    style={{ backgroundPositionY: `${scrollY * 0.3}px` }}
                ></div>
                <div className="sponsors-hero-content">
                    <div>
                        <h1 className="sponsors-hero-title">Our Partners</h1>
                        <p className="sponsors-hero-description">
                            Our partners empower us to deliver our events and fulfill our mission to
                            equip students with the social skillset they need to excel as professionals.
                            We are truly grateful for their support and collaborative efforts.
                        </p>
                    </div>
                </div>
            </div>

            <div className="sponsors-page-container">
                <AsyncStateWrapper
                    loading={loading}
                    error={error}
                    data={sponsors}
                    onRetry={refetch}
                    emptyMessage="No sponsors yet — check back soon!"
                >
                    {sponsors.filter(Boolean).map(sponsor => (
                        <Sponsor
                            key={sponsor.id}
                            sponsor={sponsor}
                        />
                    ))}
                </AsyncStateWrapper>
            </div>

            <Footer />
        </>
    );
}

export default Sponsors;
