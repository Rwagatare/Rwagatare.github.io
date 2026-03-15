import { useEffect, useRef } from 'react';

const useScrollReveal = (options = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        // Stagger children if they have .reveal-child class
                        const children = entry.target.querySelectorAll('.reveal-child');
                        children.forEach((child, i) => {
                            child.style.transitionDelay = `${i * 0.08}s`;
                            child.classList.add('revealed');
                        });
                    }
                });
            },
            { threshold: options.threshold || 0.1 }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [options.threshold]);

    return ref;
};

export default useScrollReveal;
