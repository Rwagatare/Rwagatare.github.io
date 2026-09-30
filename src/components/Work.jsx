import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import { GitHubIcon, ArrowUpRight } from './Icons';
import WhatsAppDemo from './demos/WhatsAppDemo';
import BrowserDemo from './demos/BrowserDemo';
import PhoneGallery from './demos/PhoneGallery';
import DirectoryDemo from './demos/DirectoryDemo';
import HeatmapDemo from './demos/HeatmapDemo';
import './Work.css';

const projects = [
    {
        id: 'work-bridge',
        kicker: 'In production · Ghana & Rwanda national AI-literacy program',
        title: 'Playlab WhatsApp Bridge',
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
        Demo: WhatsAppDemo,
    },
    {
        id: 'work-teachable',
        kicker: 'Deployed · 150+ teachers in Rwanda',
        title: 'Teachable Machine v3',
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
        id: 'work-mirrorme',
        kicker: 'Open source · Local-first',
        title: 'MirrorMe',
        pitch: 'A planner whose AI never leaves your laptop. It costs $0, needs no API keys, and your life stays in a SQLite file you own.',
        impact: [['$0', 'forever'], ['100%', 'on-device AI']],
        stack: ['Python', 'FastAPI', 'SQLite', 'ChromaDB', 'Ollama', 'React'],
        notes: [
            'A local Llama 3.2 model reads your tasks, goals and habits through ChromaDB retrieval.',
            'The assistant emits structured action tags, which the backend turns into real tasks on your Path.',
            'Works offline and installs as a PWA on your phone over your home network.',
        ],
        links: [{ label: 'Source', href: 'https://github.com/Rwagatare/MirrorMe', icon: 'gh' }],
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
        id: 'work-catlab',
        kicker: 'In production · Westmont College',
        title: 'Campus directory & attendance',
        pitch: 'The production app is internal to Westmont, so here is its core technique rebuilt from scratch: search 10,000 people instantly. Switch the optimizations off and watch the cost climb.',
        impact: [['1,580+', 'campus users'], ['Daily', 'faculty & student use']],
        stack: ['React', 'TypeScript', 'Node.js', 'RBAC', 'Time-series'],
        notes: [
            'Windowed rendering keeps about 20 rows in the DOM, however long the list gets.',
            'A debounced query runs one search per pause in typing, not one per keystroke.',
            'The attendance dashboard adds role-based access and tiered auth over time-series data.',
        ],
        links: [],
        Demo: DirectoryDemo,
    },
    {
        id: 'work-youtube',
        kicker: 'Data analysis · Information Retrieval, Westmont',
        title: 'Six years of my YouTube history',
        pitch: 'My own 30,924 videos from a Google Takeout export, cleaned with pandas. Hover any hour to see when I actually watch.',
        impact: [['30,924', 'videos analyzed'], ['2017–23', 'time span']],
        stack: ['Python', 'pandas', 'seaborn', 'Jupyter'],
        notes: [
            'Ads and incomplete rows are filtered out, and timestamps are split into hour, weekday, month and year.',
            'Tokenized titles show what I watch: music, Shorts, and a lot of Rwanda.',
        ],
        links: [{ label: 'Notebook', href: 'https://github.com/Rwagatare/IR_from_real_world_data', icon: 'gh' }],
        Demo: HeatmapDemo,
    },
];

const LinkIcon = ({ kind }) => (kind === 'gh' ? <GitHubIcon size={15} /> : <ArrowUpRight size={13} />);

const Project = ({ p }) => {
    const revealRef = useScrollReveal({ threshold: 0.05 });
    const { Demo } = p;

    return (
        <article id={p.id} className="work-item reveal" ref={revealRef}>
            <header className="work-head">
                <div className="work-intro">
                    <span className="work-kicker">{p.kicker}</span>
                    <h3 className="work-title">{p.title}</h3>
                    <p className="work-pitch">{p.pitch}</p>
                    {p.links.length > 0 && (
                        <div className="work-links">
                            {p.links.map((l) => (
                                <a key={l.href} href={l.href} className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                                    <LinkIcon kind={l.icon} /> {l.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <dl className="work-impact">
                    {p.impact.map(([v, k]) => (
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
                    {p.notes.map((n) => <li key={n}>{n}</li>)}
                </ul>
                <div className="work-stack">
                    {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
            </div>
        </article>
    );
};

const Work = () => {
    const headRef = useScrollReveal();
    const tilt = useTilt(2);

    return (
        <section id="work" className="section work">
            <div className="container">
                <header className="section-head reveal" ref={headRef}>
                    <span className="eyebrow">Selected work</span>
                    <h2 className="section-title">
                        Don&rsquo;t take my word for it. <span className="muted">Try it.</span>
                    </h2>
                    <p className="section-lead">
                        Every project below is either live or rebuilt here so you can use it. Send the
                        WhatsApp bot a message, train a model on your webcam, or search ten thousand people.
                    </p>
                </header>

                <div className="work-list">
                    {projects.map((p) => <Project key={p.id} p={p} />)}
                </div>

                <a
                    href="https://rivetfields.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-now surface spotlight"
                    onMouseMove={tilt.onMouseMove}
                    onMouseLeave={tilt.onMouseLeave}
                >
                    <span className="work-now-mark" aria-hidden="true">
                        <svg viewBox="0 0 32 40" width="22" height="28"><path d="M4 4h16a8 8 0 0 1 8 8v4H16a4 4 0 0 0-4 4v16H4z" fill="currentColor" /><path d="M16 20h12v16H16z" fill="currentColor" opacity=".45" /></svg>
                    </span>
                    <span className="work-now-copy">
                        <span className="work-kicker">Now building</span>
                        <strong>Rivetfields: the last flight simulator for agentic AI.</strong>
                        <span>RL environments, benchmark data distilled from frontier models, and private inference in your own cloud.</span>
                    </span>
                    <span className="work-now-go">rivetfields.com <ArrowUpRight size={12} /></span>
                </a>
            </div>
        </section>
    );
};

export default Work;
