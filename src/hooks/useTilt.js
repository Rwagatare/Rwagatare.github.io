import { useCallback } from 'react';

const canTilt = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Subtle 3D tilt + a cursor spotlight. Pair the element with the
// `.spotlight` class — this hook only feeds it --mx / --my.
const useTilt = (intensity = 4) => {
    const onMouseMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        if (!canTilt()) return;
        const rx = ((y - rect.height / 2) / (rect.height / 2)) * -intensity;
        const ry = ((x - rect.width / 2) / (rect.width / 2)) * intensity;
        el.style.transition = 'transform 120ms ease-out';
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    }, [intensity]);

    const onMouseLeave = useCallback((e) => {
        const el = e.currentTarget;
        el.style.transition = 'transform 500ms var(--spring)';
        el.style.transform = '';
    }, []);

    return { onMouseMove, onMouseLeave };
};

export default useTilt;
