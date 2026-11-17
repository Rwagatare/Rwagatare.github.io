import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { readings } from '../data/readings';

// The Reading tab, split out so the book notes (~40 KB) only load
// when someone opens the tab. Styles stay in BeyondTheCode.css.

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

// How fast the shelf drifts, in pixels per second.
const DRIFT_PXS = 95;

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Book = ({ book, onOpen, copy }) => {
    const canOpen = Boolean(book.reflection);
    return (
        // The second copy only exists to make the loop seamless; keep it out of tab order and screen readers.
        <li inert={copy} aria-hidden={copy || undefined}>
            <button
                type="button"
                className="bk-book"
                onClick={() => canOpen && onOpen(book)}
                disabled={!canOpen}
                aria-label={`${book.title} by ${book.author}${canOpen ? ', read my notes' : ''}`}
            >
                <span className="bk-bay"><span className="bk-cover"><Cover book={book} /></span></span>
                <span className="bk-meta">
                    <span className={`bk-status s-${book.status}`}>{STATUS[book.status]} · {book.year}</span>
                    <strong>{book.title}</strong>
                    <span>{book.author}</span>
                    {canOpen && <span className="bk-open">Read my notes</span>}
                </span>
            </button>
        </li>
    );
};

// The Reading tab, built like the footer: a label cell joined to a shelf
// cell. Every book stands on one shelf line, newest first, and the shelf
// drifts sideways in a loop. It pauses on hover, focus, touch, off-screen,
// a hidden tab, an open note or reduced motion, and it can be dragged.
const Reading = () => {
    const [open, setOpen] = useState(null);
    const close = () => setOpen(null);

    const trackRef = useRef(null);
    const pos = useRef(0);
    const holdTimer = useRef(0);
    const [still] = useState(() => reduceMotion());
    const [hovering, setHovering] = useState(false);
    const [focused, setFocused] = useState(false);
    const [held, setHeld] = useState(false);
    const [inView, setInView] = useState(false);
    const [tabHidden, setTabHidden] = useState(false);
    const running = inView && !open && !hovering && !focused && !held && !tabHidden && !still;

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
        io.observe(trackRef.current);
        const onVis = () => setTabHidden(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        const timer = holdTimer.current;
        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
            clearTimeout(timer);
        };
    }, []);

    // Half the track is one full copy of the shelf; wrap within it.
    const wrap = (x) => {
        const half = trackRef.current.scrollWidth / 2;
        return ((x % half) + half) % half;
    };

    useEffect(() => {
        if (!running) return undefined;
        const el = trackRef.current;
        let raf = 0;
        let last = performance.now();
        const tick = (t) => {
            const dt = Math.min(64, t - last) / 1000;
            last = t;
            pos.current = wrap(pos.current + DRIFT_PXS * dt);
            el.scrollLeft = pos.current;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [running]);

    // Follow manual drags/swipes, and keep them inside the loop.
    const onScroll = () => {
        const el = trackRef.current;
        if (Math.abs(el.scrollLeft - pos.current) > 2) {
            const next = wrap(el.scrollLeft);
            pos.current = next;
            if (next !== el.scrollLeft) el.scrollLeft = next;
        }
    };

    const holdAfterTouch = () => {
        setHeld(true);
        clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => setHeld(false), 5000);
    };

    return (
        <div className="bk">
            <div className="bk-bar">
                <span className="cm-kicker">Reading list</span>
            </div>

            <div className="bk-shelfcase">
                <ul
                    className="bk-track"
                    ref={trackRef}
                    aria-label="Reading list"
                    onScroll={onScroll}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
                    onPointerLeave={() => setHovering(false)}
                    onTouchStart={holdAfterTouch}
                    onFocus={() => setFocused(true)}
                    onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
                >
                    {readings.map((b) => <Book key={b.title} book={b} onOpen={setOpen} />)}
                    {readings.map((b) => <Book key={`copy-${b.title}`} book={b} onOpen={setOpen} copy />)}
                </ul>
            </div>

            {open && <Reader book={open} onClose={close} />}
        </div>
    );
};

export default Reading;
