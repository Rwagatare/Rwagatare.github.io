import { useCallback } from 'react';

const useTilt = (intensity = 8) => {
    const handleMouseMove = useCallback((e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease';

        // Inner glow follows cursor
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(244, 211, 94, 0.06), var(--color-bg-light) 60%)`;
    }, [intensity]);

    const handleMouseLeave = useCallback((e) => {
        const card = e.currentTarget;
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease, background 0.4s ease';
        card.style.background = '';
    }, []);

    return { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
};

export default useTilt;
