import { profile } from '../data/profile';
import useScrollReveal from '../hooks/useScrollReveal';
import Eyebrow from './Eyebrow';
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowUpRight } from './Icons';
import './Footer.css';

const siteLinks = [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#beyond', label: 'Beyond' },
    { href: '#top', label: 'Back to top' },
];

const Footer = () => {
    const revealRef = useScrollReveal();

    return (
        <footer id="contact" className="contact">
            <div className="container reveal" ref={revealRef}>
                <div className="ft-grid">
                    <div className="ft-cell ft-pitch">
                        <Eyebrow>Contact</Eyebrow>
                        <h2 className="contact-title">
                            Let&rsquo;s build something <span className="mark">people actually use.</span>
                        </h2>
                        <p className="contact-lead">
                            I&rsquo;m open to software engineering roles and collaborations, especially in AI
                            infrastructure, developer tools, and technology for low-connectivity places.
                        </p>
                        <div className="contact-cta">
                            <a href={`mailto:${profile.email}`} className="btn btn-primary">
                                <MailIcon size={18} /> {profile.email}
                            </a>
                            <a href={profile.links.linkedin} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon size={16} /> LinkedIn
                            </a>
                            <a href={profile.links.github} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                <GitHubIcon size={16} /> GitHub
                            </a>
                        </div>
                    </div>

                    <div className="ft-cell ft-motif">
                        <span className="ft-imigongo" aria-hidden="true" />
                        <span className="ft-status">
                            <span className="hero-now-dot" aria-hidden="true" />
                            Open to roles
                        </span>
                        <span className="ft-route">Kigali → Santa Barbara → Boston</span>
                    </div>

                    <nav className="ft-cell ft-links" aria-label="Footer">
                        {siteLinks.map((l) => (
                            <a key={l.href} href={l.href}>{l.label}</a>
                        ))}
                        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                            Résumé <ArrowUpRight size={11} />
                        </a>
                    </nav>

                    <div className="ft-cell ft-fine">
                        <span>© {new Date().getFullYear()} {profile.name}</span>
                        <span>Designed and built in React. <a href="https://github.com/Rwagatare/Rwagatare.github.io" target="_blank" rel="noopener noreferrer">View source</a></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
