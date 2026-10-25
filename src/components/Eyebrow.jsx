import { useEffect, useRef } from 'react';

// Mono section label: the Imigongo diamond lands first, then the text types
// itself in letter by letter the first time it scrolls into view.
const Eyebrow = ({ children }) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-typed');
                    io.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <span className="eyebrow" ref={ref}>
            <span className="sr-only">{children}</span>
            <span className="eyebrow-type" aria-hidden="true">
                {[...children].map((c, i) => (
                    <span key={i} style={{ '--i': i }}>{c}</span>
                ))}
            </span>
        </span>
    );
};

export default Eyebrow;
