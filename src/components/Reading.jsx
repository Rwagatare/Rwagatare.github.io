import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { readings, shelfThemes } from '../data/readings';

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

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Book = ({ book, onOpen }) => {
    const canOpen = Boolean(book.reflection);
    return (
        <li className="bk-slide">
            <button
                type="button"
                className="bk-book"
                onClick={() => canOpen && onOpen(book)}
                disabled={!canOpen}
                aria-label={`${book.title} by ${book.author}${canOpen ? ', read my notes' : ''}`}
            >
                <span className="bk-cover"><Cover book={book} /></span>
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

const pad = (n) => String(n).padStart(2, '0');

// Books in theme order (see shelfThemes); anything unlisted goes last.
const rank = new Map(shelfThemes.flatMap((t) => t.titles).map((title, n) => [title, n]));
const shelf = [...readings].sort((a, b) => (rank.get(a.title) ?? Infinity) - (rank.get(b.title) ?? Infinity));

// Books move three at a time, on the same timer as the Work gallery.
const STEP = 3;

// The Reading tab, moving like the Work gallery but with small cards:
// the books join into merged hairline cells, snap to the centre, fade
// with distance, and advance three at a time on the gallery's timer. It pauses on hover, focus,
// touch, an open note, off-screen, a hidden tab or pane, reduced motion,
// or the pause button.
const Reading = ({ active = true }) => {
    const [open, setOpen] = useState(null);
    const close = () => setOpen(null);

    const trackRef = useRef(null);
    const holdTimer = useRef(0);
    const [current, setCurrent] = useState(0);
    const [userPaused, setUserPaused] = useState(() => reduceMotion());
    const [hovering, setHovering] = useState(false);
    const [focused, setFocused] = useState(false);
    const [held, setHeld] = useState(false);
    const [inView, setInView] = useState(false);
    const [tabHidden, setTabHidden] = useState(false);
    const running = active && inView && !open && !hovering && !focused && !held && !tabHidden && !userPaused;

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
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

    // Fade each card by its distance from the centre; track which one is there.
    useEffect(() => {
        const track = trackRef.current;
        let raf = 0;
        const update = () => {
            raf = 0;
            const mid = track.scrollLeft + track.clientWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            [...track.children].forEach((slide, n) => {
                const center = slide.offsetLeft + slide.offsetWidth / 2;
                const dist = Math.abs(center - mid);
                const f = Math.max(0, 1 - dist / (slide.offsetWidth * 3.5));
                slide.style.setProperty('--focus', f.toFixed(3));
                if (dist < bestDist) {
                    bestDist = dist;
                    best = n;
                }
            });
            setCurrent(best);
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

    const goTo = useCallback((n) => {
        const track = trackRef.current;
        const count = track.children.length;
        const slide = track.children[((n % count) + count) % count];
        track.scrollTo({
            left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
            behavior: reduceMotion() ? 'auto' : 'smooth',
        });
    }, []);

    // Step three books; past either end, wrap to the other.
    const step = (dir) => {
        const last = shelf.length - 1;
        const next = current + dir * STEP;
        goTo(next > last ? (current === last ? 0 : last) : next < 0 ? (current === 0 ? last : 0) : next);
    };

    const holdAfterTouch = () => {
        setHeld(true);
        clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => setHeld(false), 7000);
    };

    return (
        <div className="bk">
            <ul
                className="bk-gal"
                ref={trackRef}
                aria-label="Reading list"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
                onPointerLeave={() => setHovering(false)}
                onTouchStart={holdAfterTouch}
                onFocus={() => setFocused(true)}
                onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
            >
                {shelf.map((b) => <Book key={b.title} book={b} onOpen={setOpen} />)}
            </ul>

            <div className={`gal-controls bk-gal-controls ${running ? 'is-running' : ''}`}>
                <button className="gal-arrow" onClick={() => step(-1)} aria-label="Previous books">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="gal-dots" aria-hidden="true">
                    <span className="bk-progress">
                        <span className="gal-dot">
                            <i key={current} onAnimationEnd={() => step(1)} />
                        </span>
                    </span>
                    <span className="bk-counter">{pad(current + 1)} / {pad(shelf.length)}</span>
                </div>
                <button className="gal-arrow" onClick={() => step(1)} aria-label="Next books">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                </button>
                <button
                    className="gal-play"
                    onClick={() => setUserPaused((v) => !v)}
                    aria-label={userPaused ? 'Play reading list' : 'Pause reading list'}
                    title={userPaused ? 'Play' : 'Pause'}
                >
                    {userPaused ? (
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true"><path d="M0 0l10 6-10 6z" /></svg>
                    ) : (
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true"><path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z" /></svg>
                    )}
                </button>
            </div>

            {open && <Reader book={open} onClose={close} />}
        </div>
    );
};

export default Reading;
