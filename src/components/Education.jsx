import useScrollReveal from '../hooks/useScrollReveal';
import './Education.css';

const awards = [
    'Wheaton Innovation Lab',
    'Augustinian Scholar',
    'Bridge2Rwanda Scholar',
    'LeFrak-Friedberg Scholar',
    'Up-to-US Leadership'
];

const leadership = [
    { role: 'Co-founder', org: 'Ganza Mwari (Advanced Women)', period: 'Dec 2021 – Present' },
    { role: 'Fundraiser / Speaker', org: 'Agahozo Shalom Youth Village', period: 'Jan 2025 – Present' },
    { role: 'Co-president', org: 'Global & International Students Assoc.', period: '2023 – 2024' },
    { role: 'Co-founder & Co-president', org: 'African Students Union', period: '2023 – 2024' },
    { role: 'Co-founder', org: 'ASYV Critical Thinking for Peace', period: '2017 – 2018' },
];

const Education = () => {
    const revealRef = useScrollReveal();

    return (
        <section id="education" className="section-wrap container">
            <div className="reveal" ref={revealRef}>
                <h2 className="label"><span className="accent">//</span> Education & Leadership</h2>
                <div className="edu-layout">
                    {/* Education Card */}
                    <div className="card edu-card">
                        <h3 className="edu-school">Westmont College</h3>
                        <p className="edu-degree">B.S Computer Science & B.S Data Analytics</p>
                        <p className="edu-meta">Aug 2022 – May 2026 · Santa Barbara, CA</p>
                        <div className="edu-awards">
                            {awards.map((a, i) => (
                                <span key={i} className="edu-chip">{a}</span>
                            ))}
                        </div>
                    </div>

                    {/* Leadership Card */}
                    <div className="card edu-leadership-card">
                        <h4 className="edu-lead-title">Leadership & Volunteering</h4>
                        <div className="edu-lead-list">
                            {leadership.map((l, i) => (
                                <div key={i} className="edu-lead-item reveal-child">
                                    <div className="edu-lead-row">
                                        <span className="edu-lead-role">{l.role}</span>
                                        <span className="edu-lead-period">{l.period}</span>
                                    </div>
                                    <span className="edu-lead-org">{l.org}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
