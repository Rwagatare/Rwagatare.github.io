import './Hero.css';

const Hero = () => {
    return (
        <section className="hero container">
            <div className="hero-content">
                <p className="hero-comment">// hi, my name is</p>
                <h1 className="hero-name">Livingstone Rwagatare.</h1>
                <h2 className="hero-tagline text-shimmer">
                    Embedding Empathy into Algorithms<span className="cursor">|</span>
                </h2>
                <p className="hero-desc">
                    I build scalable, human-centered technology to solve global challenges —
                    from offline-first AI at <span className="highlight">MIT Media Lab</span> to
                    data infrastructure that serves communities at scale.
                </p>
                <div className="hero-cta">
                    <a href="mailto:lrwagatare@westmont.edu" className="btn-primary">
                        Get In Touch
                    </a>
                    <a href="/resume.pdf" className="btn-outline" target="_blank" rel="noopener noreferrer">
                        Resume
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
