import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import Typewriter from './Typewriter';
import './Experience.css';

const jobs = [
    {
        company: 'Day of AI',
        shortName: 'Day of AI',
        role: 'Software Engineering Intern',
        period: 'Jul – Aug 2025',
        location: 'Cambridge, MA',
        bullets: [
            'Spearheaded the development and launch of three AI chatbots  tutoring systems for a nationwide Day of AI\'s AI literacy program in Rwanda.',
            'Reengineered Google transfer learning tool (teachable machine v1) into fully functional offline-capable Progressive Web Application (PWA) using Workbox service workers with CacheFirst strategies allowing reliable use in regions with limited internet access. I improved mobileNet image classification prediction stability on low-powered Android devices using temporal smoothing with a 10-frame confidence buffer and a 65% confidence threshold.',
            'Developed RESTful API middleware bridging Playlab.ai educational LLM platform with Meta WhatsApp Cloud API using Python/FastAPI, enabling curriculum-grounded AI tutoring for students in low-bandwidth regions. Implemented webhook-based architecture with Redis session caching and PostgreSQL persistence to handle asynchronous message routing between educators custom AI agents and student conversations.'
        ]
    },
    {
        company: 'CATLAB',
        shortName: 'CATLAB',
        role: 'Summer Intern (Mobile Developer)',
        period: 'May – Aug 2024',
        location: 'Santa Barbara, CA',
        bullets: [
            'Developed a scalable user/faculty directory using component driven architecture with virtualized list rendering, debounced search queries, and a clean API abstraction layer.',
            'Built an attendance dashboard that consumes normalized time-series data via a dedicated API layer and performs client-side computation of attendance matrix.',
            'Optimized data fetching using Role-Based access control (RBAC) leveraging react-query.'
        ]
    },
    {
        company: 'Westmont College',
        shortName: 'Westmont',
        role: 'Academic Technology Technician',
        period: 'Aug 2022 – Present',
        location: 'Santa Barbara, CA',
        bullets: [
            'Supports diverse user populations (1200+ students and faculty) for effective utilization of AV technologies for teaching, learning, and event context.',
            'Troubleshoots and maintains classroom technology infrastructure, diagnosing hardware and software issues to ensure smooth user experience.'
        ]
    }
];

const Experience = () => {
    const revealRef = useScrollReveal();
    const tilt = useTilt(4);
    const [active, setActive] = useState(0);
    const job = jobs[active];

    return (
        <section id="experience" className="section-wrap container">
            <div className="reveal" ref={revealRef}>
                <h2 className="label"><span className="accent">//</span> Experience</h2>
                <Typewriter text="Every role taught me that the best technology is built with people, not just for them." />
                <div className="card exp-card" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                    <div className="vtab-layout">
                        <div className="vtab-sidebar">
                            {jobs.map((j, i) => (
                                <button
                                    key={i}
                                    className={`vtab-btn ${active === i ? 'active' : ''}`}
                                    onClick={() => setActive(i)}
                                >
                                    {j.shortName}
                                </button>
                            ))}
                        </div>
                        <div className="vtab-content">
                            <h3 className="exp-role">
                                {job.role} <span className="exp-at">@ {job.company}</span>
                            </h3>
                            <p className="exp-period">{job.period} · {job.location}</p>
                            <ul className="exp-bullets">
                                {job.bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
