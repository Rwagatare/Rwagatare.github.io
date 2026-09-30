import { experience, education, skills } from '../data/profile';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import { ArrowUpRight } from './Icons';
import './Experience.css';

const Experience = () => {
    const revealRef = useScrollReveal();
    const tilt = useTilt(2);

    return (
        <section id="experience" className="section">
            <div className="container reveal" ref={revealRef}>
                <header className="section-head">
                    <span className="eyebrow">Experience</span>
                    <h2 className="section-title">
                        Production systems, <span className="mark">real users, small teams.</span>
                    </h2>
                </header>

                <ol className="xp-list">
                    {experience.map((job) => (
                        <li key={job.org} className="xp-item reveal-child">
                            <div className="xp-when">
                                <span className="xp-period">{job.period}</span>
                                <span className="xp-place">{job.place}</span>
                            </div>
                            <div className="xp-body">
                                <h3 className="xp-role">{job.role}</h3>
                                <p className="xp-org">
                                    {job.href ? (
                                        <a href={job.href} target="_blank" rel="noopener noreferrer">
                                            {job.org} <ArrowUpRight size={11} />
                                        </a>
                                    ) : job.org}
                                    <span className="xp-summary"> — {job.summary}</span>
                                </p>
                                <ul className="xp-points">
                                    {job.points.map((p) => <li key={p}>{p}</li>)}
                                </ul>
                                <div className="xp-foot">
                                    <div className="xp-tags">
                                        {job.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                                    </div>
                                    {job.see && (
                                        <div className="xp-see">
                                            {job.see.map((s) => (
                                                <a key={s.href + s.label} href={s.href} className="link-more">{s.label}</a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="xp-bento">
                    <article className="xp-tile xp-edu surface spotlight reveal-child" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                        <span className="xp-tile-kicker">Education</span>
                        <h3>{education.school}</h3>
                        <p className="xp-edu-degree">{education.degree}</p>
                        <p className="xp-edu-meta">{education.period} · {education.place}</p>
                        <div className="xp-edu-course">
                            {education.coursework.map((c) => <span key={c} className="chip">{c}</span>)}
                        </div>
                        <div className="xp-honors">
                            {education.honors.map((h) => (
                                <span key={h}>{h}</span>
                            ))}
                        </div>
                    </article>

                    <article className="xp-tile xp-skills surface spotlight reveal-child" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                        <span className="xp-tile-kicker">Toolbox</span>
                        <dl>
                            {skills.map((s) => (
                                <div key={s.group}>
                                    <dt>{s.group}</dt>
                                    <dd>{s.items.join(' · ')}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default Experience;
