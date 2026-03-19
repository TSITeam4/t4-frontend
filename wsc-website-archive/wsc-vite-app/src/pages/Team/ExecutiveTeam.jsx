import React, { useMemo } from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import PageTitle from '../../components/page-title/PageTitle';
import Profile from '../../components/profile/Profile';
import './ExecutiveTeam.css';
import { useSupabaseQuery } from '../../lib/hooks/useSupabaseQuery';
import AsyncStateWrapper from '../../components/shared/AsyncStateWrapper';

function ExecutiveTeam() {
    const { data: executives, loading, error, refetch } = useSupabaseQuery('executives');

    // Group executives by the "group" column
    const presidents = useMemo(
        () => executives.filter((e) => e.group === 'president'),
        [executives]
    );
    const vicePresidents = useMemo(
        () => executives.filter((e) => e.group === 'vice_president'),
        [executives]
    );
    const assistantVicePresidents = useMemo(
        () => executives.filter((e) => e.group === 'assistant_vice_president'),
        [executives]
    );

    return (
        <>
            <Nav />
            <PageTitle 
                title="Executive Team" 
                description="Meet the team behind the Western Sales Club. 
                Our executives are dedicated to providing students with the resources and opportunities they need to succeed in sales."
            />

            <AsyncStateWrapper
                loading={loading}
                error={error}
                data={executives}
                onRetry={refetch}
                emptyMessage="Executive team info coming soon!"
            >
                <div className="team-page-container">
                    {presidents.length > 0 && (
                        <>
                            <h3 className="team-section-title">Our Presidents</h3>
                            <hr className="team-section-divider" />
                            <div className="team-grid-presidents">
                                {presidents.map(exec => (
                                    <Profile
                                        key={exec.id}
                                        executive={exec}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {vicePresidents.length > 0 && (
                        <>
                            <h3 className="team-section-title">Vice Presidents</h3>
                            <hr className="team-section-divider" />
                            <div className="team-grid-vps">
                                {vicePresidents.map(vp => (
                                    <Profile
                                        key={vp.id}
                                        executive={vp}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {assistantVicePresidents.length > 0 && (
                        <>
                            <h3 className="team-section-title">Assistant Vice Presidents</h3>
                            <hr className="team-section-divider" />
                            <div className="team-grid-avps">
                                {assistantVicePresidents.map(avp => (
                                    <Profile
                                        key={avp.id}
                                        executive={avp}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </AsyncStateWrapper>
            
            <Footer />
        </>
    );
}

export default ExecutiveTeam;
