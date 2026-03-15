import { useState, useEffect, useRef, useCallback } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import './Projects.css';

const projects = [
    {
        id: 6,
        title: 'Playlab WhatsApp Bridge',
        date: 'Jun 2025 – Present',
        tech: ['Python', 'FastAPI', 'WhatsApp API', 'Playlab AI'],
        desc: 'WhatsApp bridge connecting students in low-connectivity regions to AI tutoring bots.',
        fullDesc: 'A specialized educational bridge connecting Playlab.ai\'s steerable AI ecosystem with WhatsApp via Meta Cloud API and Twilio. Enables educators to deploy custom AI agents directly to student mobile devices in low-bandwidth regions. Built with FastAPI, supports configurable LLM providers (Playlab, Claude), per-user session management, and dual WhatsApp provider support for production and development workflows.',
        color: 'linear-gradient(135deg, #25D366, #128C7E)',
        images: [
            'linear-gradient(135deg, #25D366, #128C7E)',
            'linear-gradient(135deg, #075E54, #25D366)',
            'linear-gradient(135deg, #128C7E, #0a192f)'
        ],
        links: { github: 'https://github.com/Rwagatare/playlab-whatsapp-bridge' }
    },
    {
        id: 1,
        title: 'Teachable Machine V3',
        date: 'Jul 2025',
        tech: ['PWA', 'TensorFlow.js', 'Workbox'],
        desc: 'Reengineering Google\'s transfer learning tool into an offline-first PWA.',
        fullDesc: 'Transformed Google\'s Teachable Machine V1 into a fully functional offline-capable PWA using Workbox service workers with CacheFirst strategies. Critical for deploying AI literacy tools in regions with unstable internet. Implemented temporal smoothing with a 10-frame confidence buffer for prediction stability on low-end devices.',
        color: 'linear-gradient(135deg, #1f4037, #99f2c8)',
        images: [
            'linear-gradient(135deg, #1f4037, #99f2c8)',
            'linear-gradient(135deg, #0f2027, #203a43 50%, #2c5364)',
            'linear-gradient(135deg, #11998e, #38ef7d)'
        ],
        links: { github: '#' }
    },
    {
        id: 2,
        title: 'Ganza Mwari Initiative',
        date: 'Dec 2021 – Present',
        tech: ['Social Impact', 'Leadership', 'Vocational Training'],
        desc: 'Co-founded initiative combating teen dropouts due to pregnancy in Rwanda.',
        fullDesc: 'Ganza Mwari (Advanced Woman) began as a response to rising female teen dropouts post-COVID. Partnered with local government and AEGIS Trust to provide a rent-free workspace, vocational training, and financial literacy for teen mothers. This highlighted the need for scalable, culturally aware support systems — inspiring research into empathetic AI.',
        color: 'linear-gradient(135deg, #4b6cb7, #182848)',
        images: [
            'linear-gradient(135deg, #4b6cb7, #182848)',
            'linear-gradient(135deg, #2c3e50, #3498db)',
            'linear-gradient(135deg, #20002c, #cbb4d4)'
        ],
        links: { external: '#' }
    },
    {
        id: 3,
        title: 'Catlab Faculty Directory',
        date: 'Summer 2024',
        tech: ['React', 'RBAC', 'React-Query'],
        desc: 'Scalable directory and attendance dashboard for Westmont College.',
        fullDesc: 'Developed a scalable user/faculty directory using modular component-driven architecture. Key features included virtualized list rendering, debounced search, and Role-Based Access Control (RBAC). Also built a client-side computed attendance dashboard consuming normalized time-series data.',
        color: 'linear-gradient(135deg, #f093fb, #f5576c)',
        images: [
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #ff9a9e, #fecfef)',
            'linear-gradient(135deg, #fbc2eb, #a6c1ee)'
        ],
        links: { github: '#' }
    },
    {
        id: 4,
        title: 'ASYV Fundraiser',
        date: 'Jan 2025',
        tech: ['Public Speaking', 'Fundraising', 'Community'],
        desc: 'Speaker at NYC Gala raising $650k+ for vulnerable youth.',
        fullDesc: 'Served as a speaker at the Agahozo Shalom Youth Village annual fundraising gala in New York City. By sharing personal and organizational stories, helped advocate for vulnerable orphans in Rwanda, contributing to a campaign that raised nearly $650,000.',
        color: 'linear-gradient(135deg, #f6d365, #fda085)',
        images: [
            'linear-gradient(135deg, #f6d365, #fda085)',
            'linear-gradient(135deg, #e6b980, #eacda3)',
            'linear-gradient(135deg, #ffecd2, #fcb69f)'
        ],
        links: {}
    },
    {
        id: 5,
        title: 'Estate Settlement App',
        date: 'Nov 2024',
        tech: ['Full Stack', 'OOP', 'Legal Tech'],
        desc: 'Web app simplifying the complex legal process of estate settlement.',
        fullDesc: 'Collaborated with a team to build a guided workflow for settling estates. Used object-oriented principles to structure complex legal logic into a user-friendly multi-step form, making the process accessible to non-experts.',
        color: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        images: [
            'linear-gradient(135deg, #89f7fe, #66a6ff)',
            'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
            'linear-gradient(135deg, #4facfe, #00f2fe)'
        ],
        links: { github: '#' }
    }
];

const Projects = () => {
    const revealRef = useScrollReveal();
    const tilt = useTilt(6);
    const [selected, setSelected] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null);

    const open = (p) => {
        setSelected(p);
        setActiveSlide(0);
        document.body.style.overflow = 'hidden';
    };

    const close = useCallback(() => {
        setSelected(null);
        document.body.style.overflow = '';
    }, []);

    const goToSlide = (i) => {
        setActiveSlide(i);
        if (carouselRef.current) {
            const w = carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo({ left: i * w, behavior: 'smooth' });
        }
    };

    const prevSlide = () => {
        if (selected) goToSlide(Math.max(0, activeSlide - 1));
    };

    const nextSlide = () => {
        if (selected) goToSlide(Math.min(selected.images.length - 1, activeSlide + 1));
    };

    useEffect(() => {
        if (!selected) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });

    return (
        <section id="projects" className="section-wrap container">
            <div className="reveal" ref={revealRef}>
                <h2 className="label"><span className="accent">//</span> Projects & Initiatives</h2>
                <div className="proj-grid">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="proj-card card reveal-child"
                            onClick={() => open(p)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && open(p)}
                            onMouseMove={tilt.onMouseMove}
                            onMouseLeave={tilt.onMouseLeave}
                        >
                            <div className="proj-cover" style={{ background: p.color }}>
                                <span className="proj-hover-text">View Details</span>
                            </div>
                            <div className="proj-info">
                                <div className="proj-head">
                                    <h4>{p.title}</h4>
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
            </div>

            {/* Modal */}
            {selected && (
                <div className="proj-overlay" onClick={close}>
                    <div className="proj-modal" onClick={e => e.stopPropagation()}>
                        <button className="proj-modal-close" onClick={close}>&times;</button>

                        {/* Carousel */}
                        <div className="proj-carousel" ref={carouselRef}>
                            {selected.images.map((img, i) => (
                                <div key={i} className="proj-slide" style={{ background: img }} />
                            ))}
                        </div>

                        {/* Arrows */}
                        {selected.images.length > 1 && (
                            <>
                                <button
                                    className={`carousel-arrow arrow-left ${activeSlide === 0 ? 'disabled' : ''}`}
                                    onClick={prevSlide}
                                    aria-label="Previous slide"
                                >&#8249;</button>
                                <button
                                    className={`carousel-arrow arrow-right ${activeSlide === selected.images.length - 1 ? 'disabled' : ''}`}
                                    onClick={nextSlide}
                                    aria-label="Next slide"
                                >&#8250;</button>
                                <div className="carousel-dots">
                                    {selected.images.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`carousel-dot ${i === activeSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="proj-modal-body">
                            <h2>{selected.title}</h2>
                            <p className="proj-modal-date">{selected.date}</p>
                            <div className="proj-modal-tags">
                                {selected.tech.map((t, i) => <span key={i}>{t}</span>)}
                            </div>
                            <p className="proj-modal-desc">{selected.fullDesc}</p>
                            <div className="proj-modal-links">
                                {selected.links.github && <a href={selected.links.github} className="btn-outline">GitHub</a>}
                                {selected.links.external && <a href={selected.links.external} className="btn-outline">View Project</a>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Projects;
