import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Bento.css';

/* ── Data ─────────────────────────────────────────── */

const education = {
    school: 'Westmont College',
    degrees: 'B.S Computer Science & B.S Data Analytics',
    period: 'Aug 2022 – May 2026',
    location: 'Santa Barbara, CA'
};

const awards = [
    'Wheaton Innovation Lab',
    'Augustinian Scholar',
    'Bridge2Rwanda Scholar',
    'LeFrak-Friedberg Scholar',
    'Up-to-US Leadership'
];

const jobs = [
    {
        company: 'Day of AI',
        shortName: 'Day of AI',
        role: 'Software Engineering Intern',
        period: 'Jul – Aug 2025',
        location: 'Cambridge, MA',
        bullets: [
            'Built AI chatbot tutoring system for a nationwide AI literacy program in Rwanda.',
            'Facilitated learning for 80+ educators through interactive sessions.'
        ]
    },
    {
        company: 'CATLAB',
        shortName: 'CATLAB',
        role: 'Mobile Developer Intern',
        period: 'May – Aug 2024',
        location: 'Santa Barbara, CA',
        bullets: [
            'Built scalable faculty directory with virtualized lists, debounced search, and RBAC.',
            'Developed attendance dashboard with client-side time-series computation.',
            'Optimized data fetching with react-query and role-based access control.'
        ]
    },
    {
        company: 'Westmont College',
        shortName: 'Westmont',
        role: 'Academic Technology Technician',
        period: 'Aug 2022 – Present',
        location: 'Santa Barbara, CA',
        bullets: [
            'Supporting 1200+ users with AV technologies for teaching and events.',
            'Troubleshooting classroom infrastructure — hardware and software.'
        ]
    }
];

const projects = [
    {
        id: 1,
        title: 'Teachable Machine V3',
        date: 'Jul 2025',
        tech: ['PWA', 'TensorFlow.js', 'Workbox'],
        desc: 'Offline-first PWA reengineering Google\'s transfer learning tool for regions with unstable internet.',
        color: 'linear-gradient(135deg, #1f4037, #99f2c8)',
        fullDesc: 'Transformed Google\'s Teachable Machine V1 into a fully offline-capable PWA using Workbox service workers. Implemented temporal smoothing with a 10-frame confidence buffer for prediction stability on low-end devices.',
        links: { github: '#' }
    },
    {
        id: 2,
        title: 'Ganza Mwari Initiative',
        date: 'Dec 2021 – Present',
        tech: ['Social Impact', 'Leadership'],
        desc: 'Co-founded initiative combating teen dropouts due to pregnancy in Rwanda.',
        color: 'linear-gradient(135deg, #4b6cb7, #182848)',
        fullDesc: 'Partnered with local government and AEGIS Trust to provide vocational training and financial literacy for teen mothers. Inspired research into empathetic AI.',
        links: { external: '#' }
    },
    {
        id: 3,
        title: 'Catlab Faculty Directory',
        date: 'Summer 2024',
        tech: ['React', 'RBAC', 'React-Query'],
        desc: 'Scalable directory and attendance dashboard for Westmont College.',
        color: 'linear-gradient(135deg, #f093fb, #f5576c)',
        fullDesc: 'Modular component-driven architecture with virtualized list rendering, debounced search, and role-based access control.',
        links: { github: '#' }
    },
    {
        id: 4,
        title: 'ASYV Fundraiser',
        date: 'Jan 2025',
        tech: ['Speaking', 'Fundraising'],
        desc: 'Speaker at NYC Gala raising $650k+ for vulnerable youth in Rwanda.',
        color: 'linear-gradient(135deg, #f6d365, #fda085)',
        fullDesc: 'Shared personal and organizational stories at the Agahozo Shalom Youth Village annual gala, contributing to a $650,000 fundraising campaign.',
        links: {}
    },
    {
        id: 5,
        title: 'Estate Settlement App',
        date: 'Nov 2024',
        tech: ['Full Stack', 'Legal Tech'],
        desc: 'Guided workflow simplifying the legal process of estate settlement.',
        color: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        fullDesc: 'Team-built guided workflow using object-oriented principles to make complex legal processes accessible to non-experts.',
        links: { github: '#' }
    }
];

const books = [
    {
        title: 'Designing for the Digital Age',
        author: 'Kim Goodwin',
        status: 'reading',
        note: 'Reframing how I think about user research in resource-constrained contexts.'
    },
    {
        title: 'Weapons of Math Destruction',
        author: 'Cathy O\'Neil',
        status: 'completed',
        note: 'How algorithms reinforce inequality — directly relevant to empathetic AI.'
    },
    {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        status: 'completed',
        note: 'Foundational thinking on affordances and human-centered design.'
    }
];

const reflections = [
    {
        date: 'Feb 2026',
        title: 'On Building for Communities You Belong To',
        body: 'There\'s something different about building technology for a community you\'re part of. You carry the context — the language, the constraints, the unspoken needs. The challenge is not losing that intimacy at scale.'
    },
    {
        date: 'Jan 2026',
        title: 'Offline-First as an Equity Strategy',
        body: 'Working on Teachable Machine V3 taught me that "offline-first" isn\'t just a technical pattern — it\'s an access strategy. When connectivity is a privilege, the ability to work without it becomes a form of equity.'
    },
    {
        date: 'Dec 2025',
        title: 'What Ganza Mwari Taught Me About AI',
        body: 'Before I wrote a line of ML code, I sat in rooms with teen mothers learning to sew. That experience taught me what empathy looks like when it\'s not a feature but a foundation.'
    }
];

const volunteering = [
    { role: 'Co-founder', org: 'Ganza Mwari', date: 'Dec 2021 – Present' },
    { role: 'Fundraiser/Speaker', org: 'ASYV', date: 'Jan 2025 – Present' },
    { role: 'Co-president', org: 'GISA', date: '2023 – 2024' },
    { role: 'Co-founder', org: 'African Students Union', date: '2023 – 2024' },
    { role: 'Co-founder', org: 'ASYV CTP Club', date: '2017 – 2018' },
];

/* ── Component ────────────────────────────────────── */

const Bento = () => {
    const revealRef = useScrollReveal();
    const [activeJob, setActiveJob] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeReadingTab, setActiveReadingTab] = useState('books');

    const openProject = (p) => {
        setSelectedProject(p);
        document.body.style.overflow = 'hidden';
    };
    const closeProject = () => {
        setSelectedProject(null);
        document.body.style.overflow = '';
    };

    return (
        <section id="experience" className="bento-section container">
            <div className="bento-grid reveal" ref={revealRef}>

                {/* ── Education ── */}
                <div className="card bento-edu reveal-child">
                    <span className="label">// education</span>
                    <h3 className="edu-school">{education.school}</h3>
                    <p className="edu-degree">{education.degrees}</p>
                    <p className="edu-meta">{education.period}</p>
                    <div className="edu-awards">
                        {awards.map((a, i) => (
                            <span key={i} className="award-chip">{a}</span>
                        ))}
                    </div>
                </div>

                {/* ── Currently Reading ── */}
                <div className="card bento-reading reveal-child">
                    <span className="label">// reading & writing</span>
                    <div className="reading-tabs">
                        <button
                            className={`rtab ${activeReadingTab === 'books' ? 'active' : ''}`}
                            onClick={() => setActiveReadingTab('books')}
                        >Books</button>
                        <button
                            className={`rtab ${activeReadingTab === 'reflections' ? 'active' : ''}`}
                            onClick={() => setActiveReadingTab('reflections')}
                        >Reflections</button>
                    </div>

                    {activeReadingTab === 'books' ? (
                        <div className="books-list">
                            {books.map((b, i) => (
                                <div key={i} className="book-item">
                                    <div className="book-header">
                                        <span className={`book-dot ${b.status}`} />
                                        <strong className="book-name">{b.title}</strong>
                                    </div>
                                    <span className="book-author">{b.author}</span>
                                    <p className="book-note">{b.note}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="reflections-list">
                            {reflections.map((r, i) => (
                                <div key={i} className="reflection-item">
                                    <span className="ref-date">{r.date}</span>
                                    <strong className="ref-title">{r.title}</strong>
                                    <p className="ref-body">{r.body}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Experience ── */}
                <div className="card bento-exp reveal-child">
                    <span className="label">// experience</span>
                    <div className="exp-layout">
                        <div className="exp-tabs">
                            {jobs.map((job, i) => (
                                <button
                                    key={i}
                                    className={`exp-tab ${activeJob === i ? 'active' : ''}`}
                                    onClick={() => setActiveJob(i)}
                                >
                                    {job.shortName}
                                </button>
                            ))}
                        </div>
                        <div className="exp-content">
                            <h4 className="exp-role">
                                {jobs[activeJob].role}
                                <span className="exp-company"> @ {jobs[activeJob].company}</span>
                            </h4>
                            <p className="exp-period">{jobs[activeJob].period} · {jobs[activeJob].location}</p>
                            <ul className="exp-bullets">
                                {jobs[activeJob].bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── Volunteering ── */}
                <div className="card bento-vol reveal-child">
                    <span className="label">// leadership</span>
                    <div className="vol-list">
                        {volunteering.map((v, i) => (
                            <div key={i} className="vol-row">
                                <span className="vol-role">{v.role}</span>
                                <span className="vol-org">{v.org}</span>
                                <span className="vol-date">{v.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Projects ── */}
                {projects.map((p) => (
                    <div
                        key={p.id}
                        className="card bento-project reveal-child"
                        onClick={() => openProject(p)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openProject(p)}
                    >
                        <div className="proj-color" style={{ background: p.color }} />
                        <div className="proj-body">
                            <div className="proj-head">
                                <h4 className="proj-title">{p.title}</h4>
                                <span className="proj-date">{p.date}</span>
                            </div>
                            <p className="proj-desc">{p.desc}</p>
                            <div className="proj-tags">
                                {p.tech.map((t, i) => <span key={i}>{t}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Project Modal ── */}
            {selectedProject && (
                <div className="modal-overlay" onClick={closeProject}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <button className="modal-x" onClick={closeProject}>&times;</button>
                        <div className="modal-color" style={{ background: selectedProject.color }} />
                        <div className="modal-body">
                            <h2>{selectedProject.title}</h2>
                            <p className="modal-date">{selectedProject.date}</p>
                            <div className="modal-tags">
                                {selectedProject.tech.map((t, i) => <span key={i}>{t}</span>)}
                            </div>
                            <p className="modal-desc">{selectedProject.fullDesc}</p>
                            <div className="modal-links">
                                {selectedProject.links.github && (
                                    <a href={selectedProject.links.github} className="modal-link">GitHub</a>
                                )}
                                {selectedProject.links.external && (
                                    <a href={selectedProject.links.external} className="modal-link">View Project</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Bento;
