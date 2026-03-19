import React from "react";
import { Link } from "react-router-dom";
import LazyImage from "../lazy-image/LazyImage";
import { getPublicUrl } from "../../lib/storageUtils";

function Sponsor({ sponsor }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    // Build public URL from Supabase storage using the logo_path object name
    const logoUrl = getPublicUrl('sponsor-logos', sponsor?.logo_path);

    React.useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardStyles = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(var(--wsc-purple-rgb), 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)',
        border: '2px solid rgba(var(--wsc-purple-rgb), 0.3)',
        overflow: 'hidden',
        width: '90%',
        maxWidth: '70vw',
        margin: '1.25rem auto',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        boxShadow: isHovered
            ? '0 20px 40px rgba(var(--wsc-gold-rgb), 0.3), 0 0 60px rgba(79, 38, 131, 0.3)'
            : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        borderColor: isHovered ? 'var(--wsc-gold)' : 'rgba(79, 38, 131, 0.3)',
    };

    const logoBlockStyles = {
        background: isHovered
            ? 'linear-gradient(135deg, var(--wsc-dark) 0%, rgba(var(--wsc-gold-rgb), 0.02) 100%), cursor-pointer'
            : 'rgba(var(--wsc-purple-rgb), 0.05)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        minHeight: '200px',
        width: '100%',
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

    // Responsive logo height based on window width
    const getLogoHeight = () => {
        if (windowWidth < 640) return '120px';
        if (windowWidth < 768) return '140px';
        return '160px';
    };

    const logoStyles = {
        width: '100%',
        height: getLogoHeight(),
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        position: 'relative',
        zIndex: 1,
        filter: isHovered ? 'drop-shadow(0 0 20px rgba(218, 165, 32, 0.5))' : 'none',
        transition: 'all 0.4s ease',
    };

    const contentBlockStyles = {
        padding: '2rem 2rem',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
    };

    const titleStyles = {
        color: isHovered ? 'var(--wsc-gold)' : 'var(--wsc-light)',
        fontWeight: '600',
        fontSize: '1.75rem',
        marginBottom: '1rem',
        transition: 'all 0.3s ease',
        textShadow: isHovered ? '0 0 15px rgba(218, 165, 32, 0.4)' : 'none',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
    };

    const descriptionStyles = {
        color: 'rgba(var(--wsc-light-rgb), 0.8)',
        lineHeight: '1.6',
        fontSize: '1rem',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
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

    const mediaQueryStyles = windowWidth >= 768 ? {
        cardStyles: {
            ...cardStyles,
            flexDirection: 'row',
            width: '80%',
        },
        logoBlockStyles: {
            ...logoBlockStyles,
            width: '35%',
        },
        contentBlockStyles: {
            ...contentBlockStyles,
            width: '65%',
        },
        titleStyles: {
            ...titleStyles,
            textAlign: 'left',
        },
        descriptionStyles: {
            ...descriptionStyles,
            textAlign: 'left',
        },
    } : {};

    const finalCardStyles = windowWidth >= 768 ? mediaQueryStyles.cardStyles : cardStyles;
    const finalLogoBlockStyles = windowWidth >= 768 ? mediaQueryStyles.logoBlockStyles : logoBlockStyles;
    const finalContentBlockStyles = windowWidth >= 768 ? mediaQueryStyles.contentBlockStyles : contentBlockStyles;
    const finalTitleStyles = windowWidth >= 768 ? mediaQueryStyles.titleStyles : titleStyles;
    const finalDescriptionStyles = windowWidth >= 768 ? mediaQueryStyles.descriptionStyles : descriptionStyles;

    return (
        <div
            style={finalCardStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* LOGO BLOCK */}
            <div style={finalLogoBlockStyles}>
                <div style={glowStyles}></div>
                <Link to={sponsor?.link || '#'} target="_blank" rel="noopener noreferrer" style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <LazyImage
                        src={logoUrl || ''}
                        alt={sponsor?.name ?? 'Sponsor'}
                        style={logoStyles}
                    />
                </Link>
            </div>

            {/* CONTENT BLOCK */}
            <div style={finalContentBlockStyles}>
                <div style={shimmerStyles}></div>
                <h3 style={finalTitleStyles}>{sponsor?.name ?? 'Sponsor'}</h3>
                <p style={finalDescriptionStyles}>{sponsor?.description ?? ''}</p>
            </div>
        </div>
    );
}

export default Sponsor;
