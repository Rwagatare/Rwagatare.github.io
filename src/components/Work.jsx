import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import { GitHubIcon, ArrowUpRight } from './Icons';
import WhatsAppDemo from './demos/WhatsAppDemo';
import BrowserDemo from './demos/BrowserDemo';
import PhoneGallery from './demos/PhoneGallery';
import { BridgePreview, BrowserPreview, PhonesPreview, RivetPreview } from './demos/Previews';
import './Work.css';

const projects = [
    {
        id: 'bridge',
        kicker: 'In production · Ghana & Rwanda',
        title: 'Playlab WhatsApp Bridge',
        teaser: 'AI tutors on the one app every teacher already has.',
        cta: 'Message the bot',
        pitch: 'AI tutors on the one app every teacher already has. The phone below runs the real command set, and the trace shows what the server does with each message.',
        impact: [['5,000+', 'teachers reached'], ['79+', 'tests in CI']],
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'Alembic', 'Meta Cloud API', 'Docker'],
        notes: [
            'The webhook returns 200 at once and processes in a background task, so Meta never retries or double-sends.',
            'Phone numbers are salted and SHA-256 hashed before anything touches the database.',
            'A 3-second debounce collapses bursts of messages into one LLM call. Commands skip it.',
            'Swap WhatsApp provider (Meta ↔ Twilio) or model (Playlab ↔ Claude) with one env var.',
        ],
        links: [{ label: 'Source', href: 'https://github.com/Rwagatare/playlab-whatsapp-bridge', icon: 'gh' }],
        Preview: BridgePreview,
        Demo: WhatsAppDemo,
    },
    {
        id: 'teachable',
        kicker: 'Deployed · 150+ teachers in Rwanda',
        title: 'Teachable Machine v3',
        teaser: 'Train a model on your webcam, entirely in your browser. Works offline.',
        cta: 'Train a model',
        pitch: 'Google’s Teachable Machine, rebuilt to keep working when the internet doesn’t. Open the Live tab to train a model on your webcam. It all runs in your browser, and no frame leaves your device.',
        impact: [['Offline', 'installable PWA'], ['0', 'servers for inference']],
        stack: ['TensorFlow.js', 'MobileNet', 'Workbox', 'PWA', 'JavaScript'],
        notes: [
            'A Workbox service worker precaches the app and model (CacheFirst), so classrooms can train with no connection.',
            'Predictions stay steady on low-end Android phones thanks to a 10-frame smoothing buffer and a 65% confidence gate.',
            'Keyboard navigation, visible focus, high contrast, and light/dark themes.',
        ],
        links: [
            { label: 'Open live app', href: 'https://rwagatare.github.io/teachable-machine-v3/', icon: 'out' },
            { label: 'Source', href: 'https://github.com/Rwagatare/teachable-machine-v3', icon: 'gh' },
        ],
        Preview: () => <BrowserPreview src="/projects/teachable-machine/training.jpg" />,
        Demo: () => (
            <BrowserDemo
                url="https://rwagatare.github.io/teachable-machine-v3/"
                allow="camera; microphone; fullscreen"
                shots={[
                    { label: 'Training', src: '/projects/teachable-machine/training.jpg', alt: 'Teachable Machine v3 training a Green class from the webcam, with 100% confidence and the matching emoji output' },
                    { label: 'Dark', src: '/projects/teachable-machine/training-dark.jpg', alt: 'Teachable Machine v3 in dark mode' },
                    { label: 'Welcome', src: '/projects/teachable-machine/landing.jpg', alt: 'Teachable Machine v3 landing screen with a narrated tutorial button' },
                ]}
            />
        ),
    },
    {
        id: 'mirrorme',
        kicker: 'Open source · Local-first',
        title: 'MirrorMe',
        teaser: 'A planner whose AI never leaves your laptop. $0 forever.',
        cta: 'Tour the app',
        pitch: 'A planner whose AI never leaves your laptop. It costs $0, needs no API keys, and your life stays in a SQLite file you own.',
        impact: [['$0', 'forever'], ['100%', 'on-device AI']],
        stack: ['Python', 'FastAPI', 'SQLite', 'ChromaDB', 'Ollama', 'React'],
        notes: [
            'A local Llama 3.2 model reads your tasks, goals and habits through ChromaDB retrieval.',
            'The assistant emits structured action tags, which the backend turns into real tasks on your Path.',
            'Works offline and installs as a PWA on your phone over your home network.',
        ],
        links: [{ label: 'Source', href: 'https://github.com/Rwagatare/MirrorMe', icon: 'gh' }],
        Preview: () => <PhonesPreview back="/projects/mirrorme/mirror.jpg" front="/projects/mirrorme/path.jpg" />,
        Demo: () => (
            <PhoneGallery
                note="Demo data. The real app runs entirely on your own machine."
                shots={[
                    { label: 'Path', src: '/projects/mirrorme/path.jpg', alt: 'MirrorMe Path view: a vertical trail of today’s tasks with star ratings', caption: 'Your day as a trail: finish one task to unlock the next.' },
                    { label: 'Planner', src: '/projects/mirrorme/planner.jpg', alt: 'MirrorMe weekly planner board', caption: 'A 7-day board that syncs into the Path automatically.' },
                    { label: 'Goals', src: '/projects/mirrorme/goals.jpg', alt: 'MirrorMe goals tree with progress per goal', caption: 'Each goal is a branch that grows as milestones land.' },
                    { label: 'Mirror', src: '/projects/mirrorme/mirror.jpg', alt: 'MirrorMe Mirror view with a heatmap of daily ratings', caption: 'Patterns from your real history, not vanity metrics.' },
                    { label: 'AI', src: '/projects/mirrorme/ai.jpg', alt: 'MirrorMe on-device AI assistant answering a planning question', caption: 'A local LLM that knows your context and takes actions.' },
                ]}
            />
        ),
    },
    {
        id: 'rivetfields',
        kicker: 'Now building · Co-founder',
        title: 'Rivetfields',
        teaser: 'RL environments, frontier-distilled benchmarks, and private inference in your own cloud.',
        cta: 'rivetfields.com',
        href: 'https://rivetfields.com',
        Preview: RivetPreview,
    },
];

const openable = projects.filter((p) => !p.href);
const MORPH = 'project-morph';

const projectFromHash = () => {
    const m = window.location.hash.match(/^#project-([\w-]+)$/);
    return (m && openable.find((p) => p.id === m[1])) || null;
};

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Run a DOM update inside a view transition when the browser supports it.
const transition = (update) => {
    if (!document.startViewTransition || reduceMotion()) {
        update();
        return;
    }
    document.startViewTransition(() => flushSync(update));
};

const LinkIcon = ({ kind }) => (kind === 'gh' ? <GitHubIcon size={15} /> : <ArrowUpRight size={13} />);

/* ── Expanded project ─────────────────────────────── */

const Sheet = ({ project, onClose, onStep }) => {
    const closeRef = useRef(null);
    const scrollRef = useRef(null);
    const { Demo } = project;
    const index = openable.indexOf(project);
    const prev = openable[(index - 1 + openable.length) % openable.length];
    const next = openable[(index + 1) % openable.length];

    useEffect(() => {
        const opener = document.activeElement;
        closeRef.current?.focus({ preventScroll: true });
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
            opener?.focus?.({ preventScroll: true });
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [project]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            const typing = e.target instanceof Element && e.target.closest('input, textarea, [contenteditable]');
            if (typing) return;
            if (e.key === 'ArrowRight') onStep(1);
            if (e.key === 'ArrowLeft') onStep(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, onStep]);

    return createPortal(
        <div className="sheet-scrim" onClick={onClose}>
            <div
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sheet-title"
                onClick={(e) => e.stopPropagation()}
                style={{ viewTransitionName: MORPH }}
            >
                <div className="sheet-bar glass">
                    <span className="sheet-crumb">
                        <span className="sheet-dots" aria-hidden="true">
                            {openable.map((p) => <i key={p.id} className={p === project ? 'on' : ''} />)}
                        </span>
                        {project.title}
                    </span>
                    <span className="sheet-actions">
                        <button className="sheet-btn" onClick={() => onStep(-1)} aria-label={`Previous: ${prev.title}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button className="sheet-btn" onClick={() => onStep(1)} aria-label={`Next: ${next.title}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                        <button ref={closeRef} className="sheet-btn sheet-close" onClick={onClose} aria-label="Close project">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                    </span>
                </div>

                <div className="sheet-scroll" ref={scrollRef}>
                    <div className="sheet-inner" key={project.id}>
                        <header className="work-head">
                            <div className="work-intro">
                                <span className="work-kicker">{project.kicker}</span>
                                <h3 id="sheet-title" className="work-title">{project.title}</h3>
                                <p className="work-pitch">{project.pitch}</p>
                                <div className="work-links">
                                    {project.links.map((l) => (
                                        <a key={l.href} href={l.href} className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                                            <LinkIcon kind={l.icon} /> {l.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <dl className="work-impact">
                                {project.impact.map(([v, k]) => (
                                    <div key={k}>
                                        <dt>{k}</dt>
                                        <dd>{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </header>

                        <div className="work-stage surface">
                            <Demo />
                        </div>

                        <div className="work-foot">
                            <ul className="work-notes">
                                {project.notes.map((n) => <li key={n}>{n}</li>)}
                            </ul>
                            <div className="work-stack">
                                {project.stack.map((s) => <span key={s} className="chip">{s}</span>)}
                            </div>
                        </div>

                        <button className="sheet-next surface" onClick={() => onStep(1)}>
                            <span className="work-kicker">Next project</span>
                            <strong>{next.title}</strong>
                            <span>{next.teaser}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

/* ── Gallery card ─────────────────────────────────── */

const Card = ({ project, onOpen, hidden }) => {
    const tilt = useTilt(3);
    const { Preview } = project;
    const body = (
        <>
            <span className="gal-visual"><Preview /></span>
            <span className="gal-copy">
                <span className="work-kicker">{project.kicker}</span>
                <strong className="gal-title">{project.title}</strong>
                <span className="gal-teaser">{project.teaser}</span>
                <span className={`gal-cta ${project.href ? 'is-link' : ''}`}>
                    {project.cta}
                    {project.href ? <ArrowUpRight size={12} /> : <span aria-hidden="true">›</span>}
                </span>
            </span>
        </>
    );

    const shared = {
        className: 'gal-card surface spotlight',
        onMouseMove: tilt.onMouseMove,
        onMouseLeave: tilt.onMouseLeave,
        'data-project': project.id,
        style: hidden ? { visibility: 'hidden' } : undefined,
    };

    return project.href ? (
        <a {...shared} href={project.href} target="_blank" rel="noopener noreferrer">{body}</a>
    ) : (
        <button type="button" {...shared} onClick={(e) => onOpen(project, e.currentTarget)} aria-haspopup="dialog">{body}</button>
    );
};

/* ── Section ──────────────────────────────────────── */

const Work = () => {
    const headRef = useScrollReveal();
    const trackRef = useRef(null);
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(projectFromHash);

    // Focus effect: scale/fade slides by distance from the track's center.
    useEffect(() => {
        const track = trackRef.current;
        let raf = 0;
        const update = () => {
            raf = 0;
            const mid = track.scrollLeft + track.clientWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            [...track.children].forEach((slide, i) => {
                const center = slide.offsetLeft + slide.offsetWidth / 2;
                const dist = Math.abs(center - mid);
                const f = Math.max(0, 1 - dist / (slide.offsetWidth * 1.1));
                slide.style.setProperty('--focus', f.toFixed(3));
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            });
            setActive(best);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            track.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const cardEl = (id) => trackRef.current?.querySelector(`[data-project="${id}"]`);

    const goTo = useCallback((i) => {
        const track = trackRef.current;
        const slide = track.children[Math.max(0, Math.min(projects.length - 1, i))];
        track.scrollTo({
            left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
            behavior: reduceMotion() ? 'auto' : 'smooth',
        });
    }, []);

    const openProject = useCallback((project, el = cardEl(project.id)) => {
        history.replaceState(null, '', `#project-${project.id}`);
        if (el) el.style.viewTransitionName = MORPH;
        transition(() => {
            if (el) el.style.viewTransitionName = '';
            setOpen(project);
        });
    }, []);

    const close = useCallback(() => {
        const id = open?.id;
        history.replaceState(null, '', '#work');
        const el = cardEl(id);
        transition(() => {
            setOpen(null);
            if (el) el.style.viewTransitionName = MORPH;
        });
        // Clear the name once the morph has had time to finish.
        setTimeout(() => {
            if (el) el.style.viewTransitionName = '';
        }, 700);
        const i = projects.findIndex((p) => p.id === id);
        if (i >= 0) goTo(i);
    }, [open, goTo]);

    const step = useCallback((dir) => {
        const i = openable.indexOf(open);
        const next = openable[(i + dir + openable.length) % openable.length];
        history.replaceState(null, '', `#project-${next.id}`);
        setOpen(next);
    }, [open]);

    // Deep links: #project-<id> (hero stats, experience links, graph nodes).
    useEffect(() => {
        const initial = projectFromHash();
        if (initial) {
            document.getElementById('work')?.scrollIntoView({ behavior: 'auto' });
            goTo(projects.indexOf(initial));
        }
        const fromHash = () => {
            const project = projectFromHash();
            if (!project) return;
            document.getElementById('work')?.scrollIntoView({ behavior: 'auto' });
            goTo(projects.indexOf(project));
            setOpen(project);
        };
        window.addEventListener('hashchange', fromHash);
        return () => window.removeEventListener('hashchange', fromHash);
    }, [goTo]);

    return (
        <section id="work" className="section work">
            <div className="container">
                <header className="section-head work-top reveal" ref={headRef}>
                    <div>
                        <span className="eyebrow">Selected work</span>
                        <h2 className="section-title">
                            Don&rsquo;t take my word for it. <span className="muted">Try it.</span>
                        </h2>
                        <p className="section-lead">
                            Open a project to use it: message the WhatsApp bot, train a model on your
                            webcam, or tour an app that runs its AI entirely on-device.
                        </p>
                    </div>
                    <div className="gal-arrows">
                        <button className="gal-arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button className="gal-arrow" onClick={() => goTo(active + 1)} disabled={active === projects.length - 1} aria-label="Next project">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </header>
            </div>

            <ul className="gal-track" ref={trackRef} aria-label="Projects">
                {projects.map((p) => (
                    <li key={p.id} className="gal-slide">
                        <Card project={p} onOpen={openProject} hidden={open?.id === p.id} />
                    </li>
                ))}
            </ul>

            <div className="gal-dots" role="tablist" aria-label="Choose a project">
                {projects.map((p, i) => (
                    <button key={p.id} role="tab" aria-selected={i === active} aria-label={p.title} onClick={() => goTo(i)} />
                ))}
            </div>

            {open && <Sheet project={open} onClose={close} onStep={step} />}
        </section>
    );
};

export default Work;
