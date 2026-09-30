import { useEffect, useRef } from 'react';

// Floating "knowledge graph": labeled nodes drift, push away from the cursor
// (anti-gravity), link to nearby nodes, and jump to their section on click.
const TERMS = {
    'FastAPI': 'work-bridge',
    'WhatsApp': 'work-bridge',
    'PostgreSQL': 'work-bridge',
    'Offline-first': 'work-teachable',
    'TensorFlow.js': 'work-teachable',
    'PWA': 'work-teachable',
    'Local LLMs': 'work',
    'RL agents': 'experience',
    'Rivetfields': 'experience',
    'MIT': 'experience',
    'React': 'work',
    'Data': 'work',
    'Rwanda': 'beyond',
    'Ghana': 'work-bridge',
    'Education': 'beyond',
    'Empathy': 'beyond',
    'Books': 'beyond',
    'Access': 'work',
};

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], .surface, .glass';

const readColors = () => {
    const s = getComputedStyle(document.documentElement);
    return {
        dot: s.getPropertyValue('--graph-dot').trim(),
        text: s.getPropertyValue('--graph-text').trim(),
        edge: s.getPropertyValue('--graph-edge').trim(),
        edgeA: parseFloat(s.getPropertyValue('--graph-edge-a')) || 0.14,
    };
};

const BackgroundGraph = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mouse = { x: null, y: null };
        let width = 0;
        let height = 0;
        let raf = 0;
        let colors = readColors();
        let hovering = null;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const labels = Object.keys(TERMS);
        const count = width < 640 ? 11 : labels.length;
        const nodes = labels.slice(0, count).map((text) => ({
            text,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
        }));

        const nodeAt = (x, y) => nodes.find((n) => Math.hypot(x - n.x, y - n.y) < 26);

        const onMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            const overUi = e.target instanceof Element && e.target.closest(INTERACTIVE);
            const n = overUi ? null : nodeAt(e.clientX, e.clientY);
            if (n !== hovering) {
                hovering = n;
                document.body.style.cursor = n ? 'pointer' : '';
            }
        };
        const onTouch = (e) => {
            if (e.touches.length) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };
        const onLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };
        const onClick = (e) => {
            if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;
            const n = nodeAt(e.clientX, e.clientY);
            if (!n) return;
            document.getElementById(TERMS[n.text])?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            const maxDist = 190;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${colors.edge}, ${(1 - d / maxDist) * colors.edgeA})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            ctx.font = '500 11px ui-monospace, "SF Mono", Menlo, monospace';
            for (const n of nodes) {
                const hot = n === hovering;
                ctx.beginPath();
                ctx.arc(n.x, n.y, hot ? 4.5 : 3, 0, Math.PI * 2);
                ctx.fillStyle = colors.dot;
                ctx.fill();
                ctx.fillStyle = hot ? colors.dot : colors.text;
                ctx.fillText(n.text, n.x + 9, n.y + 4);
            }
        };

        const step = () => {
            for (const n of nodes) {
                if (mouse.x != null) {
                    const dx = mouse.x - n.x;
                    const dy = mouse.y - n.y;
                    const d = Math.hypot(dx, dy);
                    const reach = 150;
                    if (d < reach && d > 0) {
                        const f = (reach - d) / reach;
                        n.x -= (dx / d) * f * 2;
                        n.y -= (dy / d) * f * 2;
                    }
                }
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;
                n.x = Math.max(-10, Math.min(width + 10, n.x));
                n.y = Math.max(-10, Math.min(height + 10, n.y));
            }
            draw();
            raf = requestAnimationFrame(step);
        };

        const onVisibility = () => {
            cancelAnimationFrame(raf);
            if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(step);
        };

        const themeObserver = new MutationObserver(() => {
            colors = readColors();
            if (reduceMotion) draw();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        const onResize = () => {
            resize();
            if (reduceMotion) draw();
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onTouch, { passive: true });
        window.addEventListener('touchend', onLeave);
        document.addEventListener('mouseleave', onLeave);
        window.addEventListener('click', onClick);
        document.addEventListener('visibilitychange', onVisibility);

        if (reduceMotion) draw();
        else raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            themeObserver.disconnect();
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onTouch);
            window.removeEventListener('touchend', onLeave);
            document.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('click', onClick);
            document.removeEventListener('visibilitychange', onVisibility);
            document.body.style.cursor = '';
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        />
    );
};

export default BackgroundGraph;
