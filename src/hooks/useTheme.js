import { useCallback, useEffect, useState } from 'react';

// index.html sets data-theme before paint (stored choice, else system).
const current = () => document.documentElement.getAttribute('data-theme') || 'dark';

const useTheme = () => {
    const [theme, setTheme] = useState(current);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Follow the OS until the visitor picks a theme explicitly.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        const onChange = (e) => {
            let stored = null;
            try { stored = localStorage.getItem('theme'); } catch { /* storage blocked */ }
            if (!stored) setTheme(e.matches ? 'light' : 'dark');
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const toggle = useCallback(() => {
        setTheme((t) => {
            const next = t === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
            return next;
        });
    }, []);

    return { theme, toggle };
};

export default useTheme;
