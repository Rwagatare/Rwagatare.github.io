import { profile } from '../data/profile';
import { GitHubIcon, LinkedInIcon, ArrowUpRight } from './Icons';
import './Hero.css';

const Hero = () => {
    return (
        <section id="top" className="hero">
            <div className="container">
                <div className="hero-grid">
                    <div className="hero-copy">
                        <a className="hero-now" href={profile.now.href} target="_blank" rel="noopener noreferrer">
                            <span className="hero-now-dot" aria-hidden="true" />
                            <span className="hero-now-label">Now</span>
                            {profile.now.label}
                            <ArrowUpRight size={12} />
                        </a>

                        <h1 className="hero-name">{profile.name}</h1>
                        <p className="hero-statement">
                            I build AI <span className="mark">people actually use.</span>
                        </p>
                        <p className="hero-lede">
                            Teachers on WhatsApp. Classrooms in Rwanda. Now, agents at Rivetfields.
                        </p>

                        <div className="hero-cta">
                            <span className="hero-try">
                                <a href="#project-bridge" className="btn btn-primary">Message the bot</a>
                                <a href="#project-teachable" className="btn btn-primary">Train a model</a>
                                <a href="#project-mirrorme" className="btn btn-primary">Tour MirrorMe</a>
                            </span>
                            <span className="hero-social">
                                <a href={profile.resume} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">Résumé</a>
                                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
                                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
                            </span>
                        </div>
                    </div>

                    <figure className="hero-portrait">
                        <span className="hero-imigongo" aria-hidden="true" />
                        <img src={profile.photo} alt="Portrait of Livingstone Rwagatare" width="360" height="360" />
                        <figcaption className="glass">
                            <span>Kigali</span>
                            <span aria-hidden="true">→</span>
                            <span>Santa Barbara</span>
                            <span aria-hidden="true">→</span>
                            <span>Boston</span>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
};

export default Hero;
