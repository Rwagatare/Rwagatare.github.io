import { useEffect, useRef } from 'react';

const MouseGlow = () => {
    const glowRef = useRef(null);

    useEffect(() => {
        const glow = glowRef.current;
        let x = 0, y = 0;
        let targetX = 0, targetY = 0;
        let animId;

        const handleMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        };

        const handleTouch = (e) => {
            if (e.touches.length > 0) {
                targetX = e.touches[0].clientX;
                targetY = e.touches[0].clientY;
            }
        };

        const animate = () => {
            x += (targetX - x) * 0.08;
            y += (targetY - y) * 0.08;
            glow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
            animId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleTouch, { passive: true });
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleTouch);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(244, 211, 94, 0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
                willChange: 'transform',
            }}
        />
    );
};

export default MouseGlow;
