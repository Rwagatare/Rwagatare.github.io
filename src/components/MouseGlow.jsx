import { useEffect, useRef } from 'react';

// Soft accent-tinted light that trails the cursor.
const MouseGlow = () => {
    const glowRef = useRef(null);

    useEffect(() => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const glow = glowRef.current;
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 3;
        let tx = x;
        let ty = y;
        let raf = 0;

        const place = () => {
            glow.style.transform = `translate3d(${x - 350}px, ${y - 350}px, 0)`;
        };

        const tick = () => {
            x += (tx - x) * 0.08;
            y += (ty - y) * 0.08;
            place();
            if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(tick);
            else raf = 0;
        };

        const onMove = (e) => {
            tx = e.clientX;
            ty = e.clientY;
            glow.style.opacity = '1';
            if (reduceMotion) {
                x = tx;
                y = ty;
                place();
            } else if (!raf) {
                raf = requestAnimationFrame(tick);
            }
        };

        place();
        window.addEventListener('mousemove', onMove);
        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 700,
                height: 700,
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--glow) 0%, transparent 65%)',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0,
                transition: 'opacity 600ms ease',
                willChange: 'transform',
            }}
        />
    );
};

export default MouseGlow;
