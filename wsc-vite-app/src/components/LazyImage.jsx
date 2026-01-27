import React, { useState, useEffect } from 'react';
import './LazyImage.css';

function LazyImage({ src, alt, className = '', style = {}, placeholderColor = 'var(--wsc-dark)' }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = React.useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading slightly before image enters viewport
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    // Extract object-fit from style if provided, otherwise default to 'cover'
    const { objectFit = 'cover', ...containerStyle } = style;
    const imageStyle = { objectFit };

    return (
        <div
            ref={imgRef}
            className={`lazy-image-container ${className}`}
            style={containerStyle}
        >
            <div
                className={`lazy-image-placeholder ${isLoaded ? 'loaded' : ''}`}
                style={{ backgroundColor: placeholderColor }}
            >
            </div>

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
                    style={imageStyle}
                    onLoad={handleImageLoad}
                    loading="lazy"
                />
            )}
        </div>
    );
}

export default LazyImage;
