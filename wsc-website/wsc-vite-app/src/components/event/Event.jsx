import React from 'react';

function Event({ event }) {
    // Safety check for event prop
    if (!event) {
        return null;
    }

    const eventDate = new Date(event.date);
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
    const day = eventDate.getDate();
    const year = eventDate.getFullYear();
    const time = event.time || eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const [isHovered, setIsHovered] = React.useState(false);

    const cardStyles = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(79, 38, 131, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)',
        border: '2px solid rgba(79, 38, 131, 0.3)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '80rem',
        margin: '0 auto',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        boxShadow: isHovered
            ? '0 20px 40px rgba(218, 165, 32, 0.3), 0 0 60px rgba(79, 38, 131, 0.3)'
            : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        borderColor: isHovered ? 'var(--wsc-gold)' : 'rgba(79, 38, 131, 0.3)',
    };

    const dateBlockStyles = {
        background: isHovered
            ? 'linear-gradient(135deg, var(--wsc-purple) 0%, var(--wsc-gold) 100%)'
            : 'var(--wsc-purple)',
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
    };

    const glowStyles = {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(218, 165, 32, 0.3) 0%, transparent 70%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
    };

    const dateMonthStyles = {
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        position: 'relative',
        zIndex: 1,
    };

    const dateYearStyles = {
        fontSize: '1rem',
        fontWeight: '500',
        position: 'relative',
        zIndex: 1,
        textShadow: isHovered ? '0 0 20px rgba(218, 165, 32, 0.5)' : 'none',
        transition: 'text-shadow 0.3s ease',
    };

    const dateTimeStyles = {
        fontSize: '0.875rem',
        marginTop: '0.5rem',
        opacity: 0.9,
        position: 'relative',
        zIndex: 1,
    };

    const contentBlockStyles = {
        padding: '1.5rem 2rem',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
    };

    const titleStyles = {
        padding: '0.25rem 0',
        color: isHovered ? 'var(--wsc-gold)' : 'var(--wsc-light)',
        fontWeight: '600',
        fontSize: '1.5rem',
        marginBottom: '0.75rem',
        transition: 'all 0.3s ease',
        textShadow: isHovered ? '0 0 15px rgba(218, 165, 32, 0.4)' : 'none',
        position: 'relative',
        zIndex: 1,
    };

    const locationStyles = {
        color: '#d1d5db',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.75rem',
        gap: '0.5rem',
        position: 'relative',
        zIndex: 1,
    };

    const iconStyles = {
        width: '1rem',
        height: '1rem',
        color: 'var(--wsc-gold)',
        filter: isHovered ? 'drop-shadow(0 0 4px var(--wsc-gold))' : 'none',
        transition: 'filter 0.3s ease',
    };

    const descriptionStyles = {
        color: 'rgba(var(--wsc-light-rgb), 0.8)',
        lineHeight: '1.6',
        position: 'relative',
        fontSize: '1rem',
        zIndex: 1,
    };

    const shimmerStyles = {
        position: 'absolute',
        top: 0,
        left: isHovered ? '100%' : '-100%',
        width: '50%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.2), transparent)',
        transition: 'left 0.6s ease',
        pointerEvents: 'none',
    };

    const mediaQueryStyles = window.innerWidth >= 768 ? {
        cardStyles: {
            ...cardStyles,
            flexDirection: 'row',
        },
        dateBlockStyles: {
            ...dateBlockStyles,
            width: '25%',
        },
        contentBlockStyles: {
            ...contentBlockStyles,
            width: '75%',
        },
    } : {};

    const finalCardStyles = window.innerWidth >= 768 ? mediaQueryStyles.cardStyles : cardStyles;
    const finalDateBlockStyles = window.innerWidth >= 768 ? mediaQueryStyles.dateBlockStyles : dateBlockStyles;
    const finalContentBlockStyles = window.innerWidth >= 768 ? mediaQueryStyles.contentBlockStyles : contentBlockStyles;

    return (
        <div
            style={finalCardStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* DATE BLOCK */}
            <div style={finalDateBlockStyles}>
                <div style={glowStyles}></div>
                <div style={dateMonthStyles}>{month} {day}</div>
                <div style={dateYearStyles}>{year}</div>
                <div style={dateTimeStyles}>{time}</div>
            </div>

            {/* CONTENT BLOCK */}
            <div style={finalContentBlockStyles}>
                <div style={shimmerStyles}></div>
                <h3 style={titleStyles}>{event.title}</h3>
                <p style={locationStyles}>
                    <svg style={iconStyles} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {event.location}
                </p>
                <p style={descriptionStyles}>{event.description}</p>
            </div>
        </div>
    );
}

export default Event;