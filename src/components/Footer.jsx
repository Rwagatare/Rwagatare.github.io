import { profile } from '../data/profile';
import useScrollReveal from '../hooks/useScrollReveal';
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons';
import './Footer.css';

const Footer = () => {
    const revealRef = useScrollReveal();

    return (
        <footer id="contact" className="contact">
            <div className="container reveal" ref={revealRef}>
                <span className="eyebrow">Contact</span>
                <h2 className="contact-title">
                    Let&rsquo;s build something <span>people actually use.</span>
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

                <div className="contact-foot">
                    <span>© {new Date().getFullYear()} {profile.name}</span>
                    <span>Designed and built in React. <a href="https://github.com/Rwagatare/Rwagatare.github.io" target="_blank" rel="noopener noreferrer">View source</a></span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
