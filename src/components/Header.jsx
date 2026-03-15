import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Beyond', href: '#beyond' },
        { name: 'Contact', href: '#contact' },
    ];

    const close = () => setMenuOpen(false);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
                <a href="#" className="logo">LR</a>

                <nav className="nav desktop-nav">
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a href={link.href}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                    <a href="/resume.pdf" className="resume-btn" target="_blank" rel="noopener noreferrer">
                        Resume
                    </a>
                </nav>

                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>

                <div className={`mobile-overlay ${menuOpen ? 'visible' : ''}`} onClick={close} />

                <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a href={link.href} onClick={close}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                    <a href="/resume.pdf" className="resume-btn" target="_blank" rel="noopener noreferrer">
                        Resume
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
