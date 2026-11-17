import { lazy, Suspense, useState } from 'react';
import { community } from '../data/profile';
import useScrollReveal from '../hooks/useScrollReveal';
import Eyebrow from './Eyebrow';
import GanzaPhotos from './GanzaPhotos';
import useTilt from '../hooks/useTilt';
import './BeyondTheCode.css';

// Book notes load only when the Reading tab is opened.
const Reading = lazy(() => import('./Reading'));

const Community = () => {
    const tilt = useTilt(1);
    const { featured, highlight, roles } = community;

    return (
        <div className="cm">
            <article className="cm-feature surface spotlight" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                <span className="cm-kicker">{featured.role} · {featured.period}</span>
                <h3>{featured.title}</h3>
                <p className="cm-place">{featured.place}</p>
                <p className="cm-story">{featured.story}</p>
                {featured.photos && <GanzaPhotos photos={featured.photos} variant="mini" />}
            </article>

            <article className="cm-stat surface spotlight" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                <span className="cm-kicker">{highlight.role} · {highlight.period}</span>
                <strong>{highlight.value}</strong>
                <p>{highlight.label}</p>
            </article>

            <ul className="cm-roles surface">
                {roles.map((r) => (
                    <li key={r.org}>
                        <span className="cm-role">{r.role}</span>
                        <span className="cm-org">{r.org}</span>
                        <span className="cm-period">{r.period}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TABS = [
    { id: 'community', label: 'Community' },
    { id: 'reading', label: 'Reading' },
];

const BeyondTheCode = () => {
    const revealRef = useScrollReveal();
    const [tab, setTab] = useState('community');
    // Reading loads on first open, then stays mounted so tab switches are instant.
    const [readingLoaded, setReadingLoaded] = useState(false);
    const pick = (id) => {
        setTab(id);
        if (id === 'reading') setReadingLoaded(true);
    };

    return (
        <section id="beyond" className="section">
            <div className="container reveal" ref={revealRef}>
                <header className="section-head beyond-head">
                    <div>
                        <Eyebrow>Beyond the code</Eyebrow>
                        <h2 className="section-title">
                            Why I build, <span className="mark">and what I&rsquo;m reading.</span>
                        </h2>
                    </div>
                    <div className="segmented" role="tablist" aria-label="Beyond the code">
                        {TABS.map((t) => (
                            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => pick(t.id)}>{t.label}</button>
                        ))}
                    </div>
                </header>

                {/* Community stays in the flow and sets the size; Reading is laid
                    exactly over it, so switching tabs never moves the layout. */}
                <div className="beyond-panel">
                    <div className={`beyond-pane ${tab === 'community' ? 'is-active' : ''}`} inert={tab !== 'community'}>
                        <Community />
                    </div>
                    {readingLoaded && (
                        <div className={`beyond-pane beyond-pane-over ${tab === 'reading' ? 'is-active' : ''}`} inert={tab !== 'reading'}>
                            <Suspense fallback={null}>
                                <Reading />
                            </Suspense>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BeyondTheCode;
