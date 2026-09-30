import { useEffect, useRef, useState } from 'react';
import useTheme from '../hooks/useTheme';
import { profile } from '../data/profile';
import './Header.css';

const links = [
    { id: 'work', label: 'Work' },
    { id: 'experience', label: 'Experience' },
    { id: 'beyond', label: 'Beyond' },
    { id: 'contact', label: 'Contact' },
];

const SunIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
);

const MoonIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
);

const Header = () => {
    const { theme, toggle } = useTheme();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const listRef = useRef(null);
    const pillRef = useRef(null);
    const lockRef = useRef(null);

    // Scroll-spy: highlight the section occupying the middle of the viewport.
    // While an animated nav scroll is running, stay locked on its target.
    useEffect(() => {
        const ids = ['top', ...links.map((l) => l.id)];
        const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
        const io = new IntersectionObserver(
            (entries) => {
                if (lockRef.current) return;
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );
        sections.forEach((s) => io.observe(s));

        const onNavScroll = (e) => {
            const { id, phase } = e.detail;
            if (phase === 'start') {
                lockRef.current = id;
                setActive(id);
            } else if (lockRef.current === id) {
                lockRef.current = null;
            }
        };
        window.addEventListener('section-scroll', onNavScroll);
        return () => {
            io.disconnect();
            window.removeEventListener('section-scroll', onNavScroll);
        };
    }, []);

    // Glide the glass pill under the active link.
    useEffect(() => {
        const place = () => {
            const pill = pillRef.current;
            const link = listRef.current?.querySelector(`a[href="#${active}"]`);
            if (!pill) return;
            if (!link) {
                pill.style.opacity = '0';
                return;
            }
            pill.style.opacity = '1';
            pill.style.width = `${link.offsetWidth}px`;
            pill.style.transform = `translateX(${link.parentElement.offsetLeft}px)`;
        };
        place();
        window.addEventListener('resize', place);
        return () => window.removeEventListener('resize', place);
    }, [active]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const close = () => setOpen(false);
    const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
            <nav className="nav glass" aria-label="Primary">
                <a href="#top" className="nav-mark" aria-label="Back to top" onClick={close}>
                    <span className="nav-mark-dot" aria-hidden="true" />
                    LR
                </a>

                <ul className="nav-links" ref={listRef}>
                    <li className="nav-pill" ref={pillRef} aria-hidden="true" />
                    {links.map((l) => (
                        <li key={l.id}>
                            <a href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} aria-current={active === l.id ? 'true' : undefined}>
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions">
                    <button className="nav-icon" onClick={toggle} aria-label={themeLabel} title={themeLabel}>
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <a href={profile.resume} className="btn btn-primary btn-sm nav-resume" target="_blank" rel="noopener noreferrer">
                        Résumé
                    </a>
                    <button
                        className={`nav-icon nav-burger ${open ? 'is-open' : ''}`}
                        onClick={() => setOpen((o) => !o)}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        aria-controls="nav-sheet"
                    >
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            <div className={`nav-scrim ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
            <div id="nav-sheet" className={`nav-sheet glass ${open ? 'is-open' : ''}`} hidden={!open}>
                <ul>
                    {links.map((l) => (
                        <li key={l.id}>
                            <a href={`#${l.id}`} onClick={close}>{l.label}</a>
                        </li>
                    ))}
                </ul>
                <a href={profile.resume} className="btn btn-primary" target="_blank" rel="noopener noreferrer" onClick={close}>
                    Résumé
                </a>
            </div>
        </header>
    );
};

export default Header;
