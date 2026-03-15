import useScrollReveal from '../hooks/useScrollReveal';
import './About.css';

const About = () => {
    const revealRef = useScrollReveal();

    const skills = [
        'Python', 'Java', 'C++', 'JavaScript', 'Ruby', 'SQL',
        'TensorFlow', 'React', 'React Native', 'Ruby on Rails',
        'Git', 'HTML/CSS', 'Big Data', 'Information Retrieval'
    ];

    return (
        <section id="about" className="about-section container">
            <div className="about-grid reveal" ref={revealRef}>
                <div className="about-text">
                    <h2 className="label"><span className="accent">//</span> About</h2>
                    <p className="about-lead">
                        I dream of a future where technology begins and ends with us.
                    </p>
                    <p>
                        My journey didn't start with code — it started in a small room in Rwamagana, Rwanda.
                        Through the <strong>Ganza Mwari Initiative</strong>, I saw how human-led interventions
                        struggle to scale. This sparked my driving question:
                        <em> Could AI designed with cultural awareness extend the support we try to provide?</em>
                    </p>
                    <p>
                        Today I bridge high-performance engineering and social impact — building
                        <strong> offline-first AI</strong> at MIT Media Lab and scalable
                        <strong> data infrastructure</strong> at CATLAB.
                    </p>
                    <div className="skill-cloud">
                        {skills.map((s, i) => (
                            <span key={i} className="skill-tag reveal-child">{s}</span>
                        ))}
                    </div>
                </div>
                <div className="about-image">
                    <div className="image-frame">
                        <span>LR</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
