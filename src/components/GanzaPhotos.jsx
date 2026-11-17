import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Ganza Mwari photos, in the layouts we're comparing:
//   'mini'   – a small auto-sliding frame (like the Work gallery) that
//              opens the full-screen viewer; fits the card's spare space
//   'stack'  – small fanned thumbnails that open a full-screen viewer;
//              fits the card's existing empty space, so the card keeps its size
//   'grid'   – one large photo with two stacked beside it
//   'slider' – one photo at a time, auto-advancing like the Work gallery
// Pick one with the `variant` prop in BeyondTheCode.jsx.

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Grid = ({ photos }) => (
    <div className="cm-photos">
        {photos.map((ph, i) => (
            <img
                key={ph.src}
                src={ph.src}
                srcSet={ph.srcSet}
                sizes={i === 0 ? '(max-width: 640px) 90vw, 560px' : '(max-width: 640px) 45vw, 280px'}
                alt={ph.alt}
                loading="lazy"
                decoding="async"
            />
        ))}
    </div>
);

const Slider = ({ photos }) => {
    const rootRef = useRef(null);
    const [active, setActive] = useState(0);
    const [inView, setInView] = useState(false);
    // Off-frame slides sit sideways, where lazy loading can stall; load them once the card is near.
    const [seen, setSeen] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [focused, setFocused] = useState(false);
    const [tabHidden, setTabHidden] = useState(false);
    const [userPaused] = useState(() => reduceMotion());
    const running = inView && !hovering && !focused && !tabHidden && !userPaused;
    const swipe = useRef(null);

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
        io.observe(rootRef.current);
        const near = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: '400px' });
        near.observe(rootRef.current);
        const onVis = () => setTabHidden(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => {
            io.disconnect();
            near.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    const go = (i) => setActive((i + photos.length) % photos.length);

    // Touch/pen swipe: a 40px horizontal drag changes the photo.
    const onPointerDown = (e) => {
        if (e.pointerType !== 'mouse') swipe.current = e.clientX;
    };
    const onPointerUp = (e) => {
        if (swipe.current == null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
    };

    return (
        <div
            className="cm-slider"
            ref={rootRef}
            aria-roledescription="carousel"
            aria-label="Ganza Mwari photos"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onFocus={() => setFocused(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        >
            <div className="cm-slider-frame">
                <div className="cm-slider-track" style={{ transform: `translateX(${-active * 100}%)` }}>
                    {photos.map((ph, i) => (
                        <img
                            key={ph.src}
                            src={i === 0 || seen ? ph.src : undefined}
                            srcSet={i === 0 || seen ? ph.srcSet : undefined}
                            sizes="(max-width: 640px) 90vw, 600px"
                            alt={ph.alt}
                            loading="lazy"
                            decoding="async"
                            aria-hidden={i !== active}
                            draggable="false"
                        />
                    ))}
                </div>
            </div>

            <div className="cm-slider-foot">
                <p className="cm-slider-caption" aria-live="polite">{photos[active].alt}</p>
                <div className={`gal-controls ${running ? 'is-running' : ''}`}>
                    <div className="gal-dots" role="tablist" aria-label="Choose a photo">
                        {photos.map((ph, i) => (
                            <button key={ph.src} role="tab" aria-selected={i === active} aria-label={`Photo ${i + 1} of ${photos.length}`} onClick={() => go(i)}>
                                <span className="gal-dot">
                                    {i === active && <i key={active} onAnimationEnd={() => go(active + 1)} />}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Viewer: opens over the Ganza Mwari card at exactly the card's size ── */
const Viewer = ({ photos, start, container, onClose }) => {
    const [i, setI] = useState(start);
    const closeRef = useRef(null);
    const boxRef = useRef(null);
    const step = useCallback((d) => setI((v) => (v + d + photos.length) % photos.length), [photos.length]);
    // Mounted inside the card so the photo takes the card's footprint, not the screen.
    const card = container || document.body;

    useEffect(() => {
        const opener = document.activeElement;
        closeRef.current?.focus({ preventScroll: true });
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        // A click anywhere outside the open photo closes it.
        const onDown = (e) => !boxRef.current?.contains(e.target) && onClose();
        window.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onDown);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onDown);
            opener?.focus?.({ preventScroll: true });
        };
    }, [onClose, step]);

    const ph = photos[i];
    return createPortal(
        <div className="ph-inline" ref={boxRef} role="dialog" aria-label="Ganza Mwari photos">
            <img className="ph-inline-img" src={ph.src} alt={ph.alt} />
            <div className="ph-inline-bar">
                <p className="ph-inline-caption">
                    <span className="ph-count">{i + 1} / {photos.length}</span> {ph.alt}
                </p>
                <div className="ph-controls">
                    <button className="gal-arrow" onClick={() => step(-1)} aria-label="Previous photo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button className="gal-arrow" onClick={() => step(1)} aria-label="Next photo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                    <button ref={closeRef} className="gal-arrow" onClick={onClose} aria-label="Close photos">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        </div>,
        card
    );
};

// The card an opener sits in; the viewer mounts there.
const cardOf = (el) => el.closest('.cm-feature');

/* ── Thumbnail stack: three fanned photos that open the viewer ── */
const Stack = ({ photos }) => {
    const [open, setOpen] = useState(null);
    const [card, setCard] = useState(null);
    const close = useCallback(() => setOpen(null), []);
    return (
        <>
            <button type="button" className="ph-stack" onClick={(e) => { setCard(cardOf(e.currentTarget)); setOpen(0); }} aria-label={`View ${photos.length} photos of Ganza Mwari`}>
                <span className="ph-thumbs" aria-hidden="true">
                    {photos.slice(0, 3).map((ph) => (
                        <img key={ph.src} src={ph.thumb || ph.src} alt="" loading="lazy" decoding="async" />
                    ))}
                </span>
                <span className="ph-stack-label">{photos.length} photos</span>
            </button>
            {open !== null && <Viewer photos={photos} start={open} container={card} onClose={close} />}
        </>
    );
};

/* ── Mini slider: stack-sized frame that auto-advances; click to expand ── */
const MiniSlider = ({ photos }) => {
    const rootRef = useRef(null);
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(null);
    const [card, setCard] = useState(null);
    const [inView, setInView] = useState(false);
    const [seen, setSeen] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [focused, setFocused] = useState(false);
    const [tabHidden, setTabHidden] = useState(false);
    const [userPaused] = useState(() => reduceMotion());
    const running = inView && open === null && !hovering && !focused && !tabHidden && !userPaused;
    const close = useCallback(() => setOpen(null), []);

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
        io.observe(rootRef.current);
        // Off-frame slides sit sideways, where lazy loading can stall; load them once the card is near.
        const near = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: '400px' });
        near.observe(rootRef.current);
        const onVis = () => setTabHidden(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => {
            io.disconnect();
            near.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    const go = (i) => setActive((i + photos.length) % photos.length);
    const expand = (e) => {
        setCard(cardOf(e.currentTarget));
        setOpen(active);
    };

    return (
        <div
            className="ph-mini"
            ref={rootRef}
            aria-roledescription="carousel"
            aria-label="Ganza Mwari photos"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        >
            <button
                type="button"
                className="ph-mini-frame"
                onClick={expand}
                aria-label={`Expand photo ${active + 1} of ${photos.length}: ${photos[active].alt}`}
            >
                <span className="ph-mini-track" style={{ transform: `translateX(${-active * 100}%)` }}>
                    {photos.map((ph, i) => (
                        <img
                            key={ph.src}
                            src={i === 0 || seen ? ph.thumb || ph.src : undefined}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                        />
                    ))}
                </span>
                <span className="ph-mini-expand" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                </span>
            </button>

            <div className="ph-mini-side">
                <div className={`gal-controls ${running ? 'is-running' : ''}`}>
                    <div className="gal-dots" role="tablist" aria-label="Choose a photo">
                        {photos.map((ph, i) => (
                            <button key={ph.src} role="tab" aria-selected={i === active} aria-label={`Photo ${i + 1} of ${photos.length}`} onClick={() => go(i)}>
                                <span className="gal-dot">
                                    {i === active && <i key={active} onAnimationEnd={() => go(active + 1)} />}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <button type="button" className="ph-stack-label ph-mini-label" onClick={expand}>
                    {photos.length} photos · Expand
                </button>
            </div>

            {open !== null && <Viewer photos={photos} start={open} container={card} onClose={close} />}
        </div>
    );
};

const GanzaPhotos = ({ photos, variant = 'mini' }) => {
    if (variant === 'mini') return <MiniSlider photos={photos} />;
    if (variant === 'grid') return <Grid photos={photos} />;
    if (variant === 'slider') return <Slider photos={photos} />;
    return <Stack photos={photos} />;
};

export default GanzaPhotos;
