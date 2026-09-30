import { useEffect, useRef, useState } from 'react';
import './Previews.css';

// Card-sized teasers for the project gallery. Full demos live in the sheet.

const CHAT = [
    { me: true, text: 'What is machine learning?' },
    { me: false, text: 'It’s when a computer learns patterns from examples instead of rules we write by hand…' },
    { me: true, text: '/switch ai-or-not' },
    { me: false, text: 'Switched to AI or Not. Your next message will use this bot.' },
];

export const BridgePreview = () => {
    const ref = useRef(null);
    const [shown, setShown] = useState(CHAT.length);

    // Replay the conversation while the card is on screen.
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let timer = 0;
        let n = 0;
        const tick = () => {
            n = n >= CHAT.length + 2 ? 0 : n + 1;
            setShown(Math.min(n, CHAT.length));
            timer = setTimeout(tick, n === 0 ? 500 : 1300);
        };
        const io = new IntersectionObserver(([e]) => {
            clearTimeout(timer);
            if (e.isIntersecting) {
                n = 0;
                setShown(0);
                timer = setTimeout(tick, 400);
            }
        }, { threshold: 0.4 });
        io.observe(ref.current);
        return () => {
            io.disconnect();
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="pv pv-bridge" ref={ref} aria-hidden="true">
            <div className="pv-wa">
                <div className="pv-wa-bar">
                    <span className="pv-wa-av">W</span>
                    <span><strong>Welcome Guide</strong><em>Day of AI tutor</em></span>
                </div>
                <div className="pv-wa-chat">
                    {CHAT.slice(0, shown).map((m) => (
                        <span key={m.text} className={`pv-wa-msg ${m.me ? 'me' : ''}`}>{m.text}</span>
                    ))}
                </div>
            </div>
            <div className="pv-trace">
                <span><b className="c1">HTTP</b> POST /webhook ✓ 200</span>
                <span><b className="c2">INFO</b> sha256(salt:phone) → 56ebe3…</span>
                <span><b className="c3">WAIT</b> debounce 3s</span>
                <span><b className="c4">LLM</b> playlab.stream → SSE</span>
            </div>
        </div>
    );
};

export const BrowserPreview = ({ src }) => (
    <div className="pv pv-browser" aria-hidden="true">
        <div className="pv-win">
            <div className="pv-win-bar"><i /><i /><i /></div>
            <img src={src} alt="" loading="lazy" />
        </div>
    </div>
);

export const PhonesPreview = ({ back, front }) => (
    <div className="pv pv-phones" aria-hidden="true">
        <div className="pv-phone pv-phone-back"><img src={back} alt="" loading="lazy" /></div>
        <div className="pv-phone pv-phone-front"><img src={front} alt="" loading="lazy" /></div>
    </div>
);

export const RivetPreview = () => (
    <div className="pv pv-rivet" aria-hidden="true">
        <svg viewBox="0 0 32 40" width="64" height="80"><path d="M4 4h16a8 8 0 0 1 8 8v4H16a4 4 0 0 0-4 4v16H4z" fill="currentColor" /><path d="M16 20h12v16H16z" fill="currentColor" opacity=".45" /></svg>
        <span>The last flight simulator<br />for agentic AI.</span>
    </div>
);
