import { profile, stats } from '../data/profile';
import useTilt from '../hooks/useTilt';
import { GitHubIcon, LinkedInIcon, ArrowUpRight } from './Icons';
import './Hero.css';

const Hero = () => {
    const tilt = useTilt(3);

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
                            Software engineer building AI that works <span>where the network doesn&rsquo;t.</span>
                        </p>
                        <p className="hero-lede">
                            I ship production Python services and offline-first web apps. My code has reached
                            5,000+ teachers over WhatsApp and runs machine learning in Rwandan classrooms
                            with no connection at all.
                        </p>

                        <div className="hero-cta">
                            <a href="#work" className="btn btn-primary">See the work</a>
                            <a href={profile.resume} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">Résumé</a>
                            <span className="hero-social">
                                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
                                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
                            </span>
                        </div>
                    </div>

                    <figure className="hero-portrait">
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

                <ul className="hero-stats" aria-label="Impact at a glance">
                    {stats.map((s) => (
                        <li key={s.value + s.label}>
                            <a href={s.href} className="hero-stat surface spotlight" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                                <span className="hero-stat-value">{s.value}</span>
                                <span className="hero-stat-label">{s.label}</span>
                                <span className="hero-stat-go" aria-hidden="true">See it ›</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Hero;
