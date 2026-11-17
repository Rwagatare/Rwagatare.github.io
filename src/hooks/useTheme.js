import { useCallback, useEffect, useState } from 'react';

// index.html sets data-theme before paint: the visitor's stored choice,
// otherwise dark (the site's default, regardless of the OS setting).
const current = () => document.documentElement.getAttribute('data-theme') || 'dark';

// Browser UI colour (mobile address bar) to match the page.
const BAR = { dark: '#0c0b0b', light: '#f5f4f1' };

const useTheme = () => {
    const [theme, setTheme] = useState(current);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR[theme]);
    }, [theme]);

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
