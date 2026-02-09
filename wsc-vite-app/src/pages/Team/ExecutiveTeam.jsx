import React from "react";
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import PageTitle from '../../components/page-title/PageTitle';
import Profile from '../../components/profile/Profile';
import './ExecutiveTeam.css';
import teamData from '../../../data/TeamData.json';

function ExecutiveTeam() {
    const presidents = teamData.executives.find(exec => exec.presidents)?.presidents || [];
    const vicePresidents = teamData.executives.find(exec => exec.vice_presidents)?.vice_presidents || [];
    const assistantVicePresidents = teamData.executives.find(exec => exec.assistant_vice_presidents)?.assistant_vice_presidents || [];

    return (
        <>
            <Nav />
            <PageTitle 
                title="Executive Team" 
                description="Meet the team behind the Western Sales Club. 
                Our executives are dedicated to providing students with the resources and opportunities they need to succeed in sales."
            />

            <div className="team-page-container">
                <h3 className="team-section-title">Our Presidents</h3>
                <hr className="team-section-divider" />
                <div className="team-grid-presidents">
                    {presidents.map(president => (
                        <Profile
                            key={president.id}
                            headshotFileName={president.headshotFileName}
                            name={president.name}
                            title={president.title}
                        />
                    ))}
                </div>

                <h3 className="team-section-title">Vice Presidents</h3>
                <hr className="team-section-divider" />
                <div className="team-grid-vps">
                    {vicePresidents.map(vp => (
                        <Profile
                            key={vp.id}
                            headshotFileName={vp.headshotFileName}
                            name={vp.name}
                            title={vp.title}
                        />
                    ))}
                </div>

                <h3 className="team-section-title">Assistant Vice Presidents</h3>
                <hr className="team-section-divider" />
                <div className="team-grid-avps">
                    {assistantVicePresidents.map(avp => (
                        <Profile
                            key={avp.id}
                            headshotFileName={avp.headshotFileName}
                            name={avp.name}
                            title={avp.title}
                        />
                    ))}
                </div>
            </div>
            
            <Footer />
        </>
    );
}

export default ExecutiveTeam;