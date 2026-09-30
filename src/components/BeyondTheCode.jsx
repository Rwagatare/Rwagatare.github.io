import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { community } from '../data/profile';
import { readings, years } from '../data/readings';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import './BeyondTheCode.css';

const STATUS = { reading: 'Reading', completed: 'Read', queued: 'Up next' };

// Deterministic tint for books without a cover image.
const hueFor = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

const Cover = ({ book }) => {
    const [failed, setFailed] = useState(false);
    if (book.cover && !failed) {
        return <img src={book.cover} alt="" loading="lazy" onError={() => setFailed(true)} />;
    }
    return (
        <span className="bk-typecover" style={{ '--h': hueFor(book.title) }}>
            <strong>{book.title}</strong>
            <em>{book.author}</em>
        </span>
    );
};

const Reader = ({ book, onClose }) => {
    const closeRef = useRef(null);

    useEffect(() => {
        const prev = document.activeElement;
        closeRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            prev?.focus?.();
        };
    }, [onClose]);

    const r = book.reflection;

    return createPortal(
        <div className="bk-scrim" onClick={onClose}>
            <div className="bk-sheet glass" role="dialog" aria-modal="true" aria-labelledby="bk-title" onClick={(e) => e.stopPropagation()}>
                <button ref={closeRef} className="bk-close" onClick={onClose} aria-label="Close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
                <div className="bk-sheet-head">
                    <div className="bk-sheet-cover"><Cover book={book} /></div>
                    <div>
                        <span className={`bk-status s-${book.status}`}>{STATUS[book.status]} · {book.year}</span>
                        <h3 id="bk-title">{book.title}</h3>
                        <p className="bk-author">{book.author}</p>
                        <p className="bk-summary">{r.summary}</p>
                        {book.link && (
                            <a className="link-more" href={book.link} target="_blank" rel="noopener noreferrer">Google Books</a>
                        )}
                    </div>
                </div>
                <div className="bk-body">
                    {r.body.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}
                </div>
                {r.takeaways && (
                    <div className="bk-takeaways">
                        <h4>Takeaways</h4>
                        <ul>{r.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

const Reading = () => {
    const [year, setYear] = useState(years[0]);
    const [open, setOpen] = useState(null);
    const shelf = readings.filter((b) => b.year === year);
    const close = () => setOpen(null);

    return (
        <div className="bk">
            <div className="bk-bar">
                <div className="segmented" role="tablist" aria-label="Year">
                    {years.map((y) => (
                        <button key={y} role="tab" aria-selected={y === year} onClick={() => setYear(y)}>{y}</button>
                    ))}
                </div>
                <span className="bk-count">{readings.filter((b) => b.status === 'completed').length} books finished since {years[years.length - 1]}</span>
            </div>

            <ul className="bk-shelf">
                {shelf.map((b) => {
                    const canOpen = Boolean(b.reflection);
                    return (
                        <li key={b.title}>
                            <button
                                type="button"
                                className="bk-book"
                                onClick={() => canOpen && setOpen(b)}
                                disabled={!canOpen}
                                aria-label={`${b.title} by ${b.author}${canOpen ? ', read my notes' : ''}`}
                            >
                                <span className="bk-cover"><Cover book={b} /></span>
                                <span className="bk-meta">
                                    <span className={`bk-status s-${b.status}`}>{STATUS[b.status]}</span>
                                    <strong>{b.title}</strong>
                                    <span>{b.author}</span>
                                    {canOpen && <span className="bk-open">Read my notes</span>}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {open && <Reader book={open} onClose={close} />}
        </div>
    );
};

const Community = () => {
    const tilt = useTilt(2);
    const { featured, highlight, roles } = community;

    return (
        <div className="cm">
            <article className="cm-feature surface spotlight" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                <span className="cm-kicker">{featured.role} · {featured.period}</span>
                <h3>{featured.title}</h3>
                <p className="cm-place">{featured.place}</p>
                <p className="cm-story">{featured.story}</p>
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

    return (
        <section id="beyond" className="section">
            <div className="container reveal" ref={revealRef}>
                <header className="section-head beyond-head">
                    <div>
                        <span className="eyebrow">Beyond the code</span>
                        <h2 className="section-title">
                            Why I build. <span className="muted">And what I&rsquo;m reading.</span>
                        </h2>
                    </div>
                    <div className="segmented" role="tablist" aria-label="Beyond the code">
                        {TABS.map((t) => (
                            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>
                        ))}
                    </div>
                </header>

                <div className="beyond-panel" key={tab}>
                    {tab === 'community' ? <Community /> : <Reading />}
                </div>
            </div>
        </section>
    );
};

export default BeyondTheCode;
