// src/ParticlesBackground.tsx
import React, { useEffect } from 'react';
import './ParticlesBackground.css';

const ParticlesBackground: React.FC = () => {
    useEffect(() => {
        if (window.particlesJS) {
            window.particlesJS.load('particles-js', '/particles.json', () => {
                console.log('Particles.js loaded - callback');
            });
        } else {
            console.error('particlesJS is not defined');
        }
    }, []);

    return <div id="particles-js" className="particles-container"></div>;
};

export default ParticlesBackground;