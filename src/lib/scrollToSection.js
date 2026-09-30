// Eased, interruptible scroll to an in-page section, followed by an
// "arrival" animation on the section's heading.
//
// Emits `section-scroll` events on window: { detail: { id, phase } } with
// phase 'start' | 'end', so the nav can lock its indicator to the target.

const NAV_OFFSET = 72;
let cancelCurrent = null;

const easeInOutQuint = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const emit = (id, phase) => window.dispatchEvent(new CustomEvent('section-scroll', { detail: { id, phase } }));

const arrive = (el) => {
    if (reduceMotion()) return;
    el.classList.remove('is-arriving');
    // Force a reflow so the animation restarts when re-triggered.
    void el.offsetWidth;
    el.classList.add('is-arriving');
    setTimeout(() => el.classList.remove('is-arriving'), 1400);
};

export const scrollToSection = (id) => {
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;

    cancelCurrent?.();
    const startY = window.scrollY;
    const targetY = id === 'top' ? 0 : Math.max(0, el.getBoundingClientRect().top + startY - NAV_OFFSET);
    const distance = targetY - startY;

    history.replaceState(null, '', `#${id}`);
    emit(id, 'start');

    if (reduceMotion() || Math.abs(distance) < 4) {
        window.scrollTo({ top: targetY, behavior: 'instant' });
        emit(id, 'end');
        return;
    }

    // Longer trips take a little longer, within a comfortable range.
    const duration = Math.min(1300, Math.max(650, Math.abs(distance) * 0.45));
    const t0 = performance.now();
    let raf = 0;

    const stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchstart', stop);
        window.removeEventListener('keydown', stop);
        cancelCurrent = null;
    };

    const frame = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo({ top: startY + distance * easeInOutQuint(t), behavior: 'instant' });
        if (t < 1) {
            raf = requestAnimationFrame(frame);
        } else {
            stop();
            emit(id, 'end');
            if (id !== 'top') arrive(el);
        }
    };

    // Any user scroll input takes control back immediately.
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    cancelCurrent = () => {
        stop();
        emit(id, 'end');
    };
    raf = requestAnimationFrame(frame);
};

// Route plain in-page anchors (#work, #experience, …) through the animation.
// #project-* links are left alone: the Work gallery handles those.
export const installAnchorScrolling = () => {
    const onClick = (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target instanceof Element && e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href').slice(1);
        if (!id || id.startsWith('project-')) return;
        if (id !== 'top' && !document.getElementById(id)) return;
        e.preventDefault();
        scrollToSection(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
};
