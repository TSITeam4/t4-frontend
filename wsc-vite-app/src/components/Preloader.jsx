import React, { useEffect, useState } from 'react';
import './Preloader.css';

const CRITICAL_IMAGES = [
    '/shark.avif',
    '/UC-HILL.avif',
    '/TORONTO.avif',
    '/MIDDLESEX.avif'
];

const Preloader = ({ onLoadComplete }) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let imagesLoaded = 0;
        const totalImages = CRITICAL_IMAGES.length;

        const updateProgress = () => {
            imagesLoaded++;
            const currentProgress = Math.round((imagesLoaded / totalImages) * 100);
            setProgress(currentProgress);

            if (imagesLoaded === totalImages) {
                // Add a small delay for smoothness even if images load instantly
                setTimeout(() => {
                    setLoading(false);
                    if (onLoadComplete) {
                        setTimeout(onLoadComplete, 800); // Wait for fade-out animation
                    }
                }, 800);
            }
        };

        CRITICAL_IMAGES.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = updateProgress;
            img.onerror = updateProgress; // Proceed even if an image fails
        });
    }, [onLoadComplete]);

    return (
        <div className={`preloader ${!loading ? 'fade-out' : ''}`}>
            <div className="preloader-content">
                <img
                    src="/shark.avif"
                    alt="Western Sales Club"
                    className="preloader-logo"
                />
                <div className="loading-bar-container">
                    <div
                        className="loading-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
