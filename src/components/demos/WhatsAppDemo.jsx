import { useCallback, useEffect, useRef, useState } from 'react';
import './WhatsAppDemo.css';

/*
 * An in-browser model of playlab-whatsapp-bridge (app/workflows/bridge.py).
 * Command parsing, reply strings, the 3 s debounce, per-bot conversations and
 * SHA-256 pseudonymization mirror the production code. Only the tutor's
 * answers are canned — the real service streams them from Playlab.
 */

const BOTS = [
    { name: 'Welcome Guide', slug: 'guide' },
    { name: 'AI or Not', slug: 'ai-or-not' },
    { name: 'Teachable Machine', slug: 'teachable-machine' },
];

const DEBOUNCE_MS = 3000;
const DEMO_PHONE = '+250 788 123 456';
const DEMO_SALT = 'demo-salt';

const HELP = [
    'Available commands:',
    '  /bots — list available bots',
    '  /switch <slug> — switch to a different bot',
    '  /current — show active bot',
    '  /reset — clear conversation history',
    '  /help — show this message',
].join('\n');

const ANSWERS = {
    guide: [
        [/machine learning|what is ml|\bml\b/i, 'Machine learning is when a computer learns patterns from examples instead of following rules we write by hand. Show it 50 photos of cats and 50 of dogs, and it learns what makes each one different. Want to try an activity with your class?'],
        [/\bai\b|artificial/i, 'AI is software that can do tasks we usually think need human judgment, like recognizing speech or answering questions. It learns from data, so it is only as fair and accurate as the examples it was given. What would you like to explore?'],
        [/hello|hi|muraho|hey/i, 'Muraho! 👋 I’m the Welcome Guide. I can explain AI ideas for your lessons. Try asking “What is machine learning?” or send /bots to meet the other tutors.'],
    ],
    'ai-or-not': [
        [/.*/, 'Let’s play AI or Not! 🎲 A phone keyboard that suggests your next word: AI or not? Reply with your guess and why.'],
    ],
    'teachable-machine': [
        [/.*/, 'In Teachable Machine you train a model with your webcam: record ~30 examples per class, then watch it predict live. Tip: vary the angle and lighting so it learns the object, not the background.'],
    ],
};

const answerFor = (slug, text) => {
    const rules = ANSWERS[slug] || [];
    const hit = rules.find(([re]) => re.test(text));
    return hit ? hit[1] : 'Great question! In the live service this is answered by a Playlab tutor grounded in the Day of AI curriculum. Try “What is machine learning?”';
};

const parseCommand = (message) => {
    const stripped = (message || '').trim();
    if (!stripped.startsWith('/')) return null;
    const parts = stripped.slice(1).split(/\s+/);
    const verb = (parts[0] || '').toLowerCase();
    if (!['bots', 'switch', 'current', 'help', 'reset'].includes(verb)) return null;
    const arg = parts.slice(1).join(' ').trim().toLowerCase() || null;
    return { verb, arg };
};

const sha256 = async (text) => {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const nowStamp = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
};

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const SUGGESTIONS = ['/help', 'What is machine learning?', '/bots', '/switch ai-or-not', '/current', '/reset'];

let seq = 0;
const uid = () => ++seq;

const WhatsAppDemo = () => {
    const [messages, setMessages] = useState(() => [
        { id: uid(), from: 'bot', text: 'Muraho! 👋 I’m the Welcome Guide. Ask me anything about AI, or send /help.', time: clock() },
    ]);
    const [trace, setTrace] = useState([{ id: uid(), t: nowStamp(), kind: 'info', text: 'uvicorn app.main:app — listening on :8000 (provider=meta, llm=playlab)' }]);
    const [draft, setDraft] = useState('');
    const [typing, setTyping] = useState(false);
    const [activeBot, setActiveBot] = useState('guide');
    const [hash, setHash] = useState('');

    const activeRef = useRef('guide');
    const lastSeenRef = useRef(0);
    const convRef = useRef({}); // bot slug -> conversation id (per-bot isolation)
    const timersRef = useRef(new Set());
    const chatRef = useRef(null);
    const traceRef = useRef(null);

    useEffect(() => {
        sha256(`${DEMO_SALT}:${DEMO_PHONE}`).then(setHash);
        const timers = timersRef.current;
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, typing]);

    useEffect(() => {
        traceRef.current?.scrollTo({ top: traceRef.current.scrollHeight, behavior: 'smooth' });
    }, [trace]);

    const later = useCallback((ms, fn) => {
        const id = setTimeout(() => {
            timersRef.current.delete(id);
            fn();
        }, ms);
        timersRef.current.add(id);
    }, []);

    const log = useCallback((kind, text) => {
        setTrace((t) => [...t.slice(-60), { id: uid(), t: nowStamp(), kind, text }]);
    }, []);

    const reply = useCallback((text) => {
        setMessages((m) => [...m, { id: uid(), from: 'bot', text, time: clock() }]);
    }, []);

    const runCommand = useCallback((cmd) => {
        switch (cmd.verb) {
            case 'help':
                return HELP;
            case 'bots':
                return ['Available bots:', ...BOTS.map((b) => `  ${b.name} — /switch ${b.slug}`)].join('\n');
            case 'current':
                return `Current bot: ${BOTS.find((b) => b.slug === activeRef.current).name}`;
            case 'reset': {
                const n = Object.keys(convRef.current).length;
                convRef.current = {};
                log('db', `UPDATE conversations SET status='expired' WHERE user_id=:uid AND status='active'  → ${n} row(s)`);
                return 'Your conversation history has been cleared. Feel free to start a new conversation!';
            }
            case 'switch': {
                if (!cmd.arg) return 'Usage: /switch <slug>\nSend /bots to see available bots.';
                const bot = BOTS.find((b) => b.slug === cmd.arg);
                if (!bot) return `Unknown bot '${cmd.arg}'. Available: ${BOTS.map((b) => b.slug).join(', ')}`;
                activeRef.current = bot.slug;
                setActiveBot(bot.slug);
                log('db', `UPDATE users SET active_bot='${bot.slug}' WHERE phone_hash=:h`);
                return `Switched to ${bot.name}. Your next message will use this bot.`;
            }
            default:
                return null;
        }
    }, [log]);

    const send = useCallback((raw) => {
        const text = raw.trim();
        if (!text) return;
        setDraft('');
        setMessages((m) => [...m, { id: uid(), from: 'me', text, time: clock() }]);

        const short = hash.slice(0, 8) || 'pending';
        log('http', 'POST /webhook  X-Hub-Signature-256 ✓ HMAC verified');
        log('http', '← 200 {"status":"accepted"}  (processing continues in background task)');
        log('info', `pseudonymize(sender) → sha256(salt:phone) = ${short}…  (raw number never stored)`);

        const cmd = parseCommand(text);
        if (cmd) {
            log('cmd', `parse_command → /${cmd.verb}${cmd.arg ? ` ${cmd.arg}` : ''}  (commands skip debounce)`);
            later(250, () => {
                reply(runCommand(cmd));
                log('send', 'meta.send_text → delivered');
            });
            return;
        }

        const token = performance.now();
        lastSeenRef.current = token;
        log('wait', `debounce: waiting ${DEBOUNCE_MS / 1000}s for more messages from ${short}…`);

        later(DEBOUNCE_MS, () => {
            if (lastSeenRef.current !== token) {
                log('skip', 'debounce: newer message arrived — dropping this one (no duplicate replies)');
                return;
            }
            const slug = activeRef.current;
            log('send', 'meta.mark_read ✓  meta.send_typing_on ✓');
            setTyping(true);
            const existing = convRef.current[slug];
            if (existing) {
                log('db', `SELECT external_id FROM conversations WHERE user_id=:uid AND bot_key='${slug}' AND status='active'  → ${existing}`);
            } else {
                const id = `conv_${Math.random().toString(36).slice(2, 8)}`;
                convRef.current[slug] = id;
                log('db', `no active conversation for bot_key='${slug}' → INSERT conversations (…) → ${id}`);
            }
            log('llm', `playlab.stream(project=${slug}) → SSE chunks…`);
            later(1400, () => {
                setTyping(false);
                reply(answerFor(slug, text));
                log('send', 'meta.send_text → delivered  ·  typing_off');
            });
        });
    }, [hash, later, log, reply, runCommand]);

    const onSubmit = (e) => {
        e.preventDefault();
        send(draft);
    };

    const bot = BOTS.find((b) => b.slug === activeBot);

    return (
        <div className="wa">
            <div className="wa-phone" role="group" aria-label="WhatsApp conversation demo">
                <div className="wa-bar">
                    <div className="wa-avatar" aria-hidden="true">{bot.name[0]}</div>
                    <div className="wa-who">
                        <strong>{bot.name}</strong>
                        <span>{typing ? 'typing…' : 'Day of AI tutor · online'}</span>
                    </div>
                </div>

                <div className="wa-chat" ref={chatRef} aria-live="polite">
                    <p className="wa-system">Messages are pseudonymized with SHA-256 before they reach the database.</p>
                    {messages.map((m) => (
                        <div key={m.id} className={`wa-msg wa-${m.from}`}>
                            <span className="wa-text">{m.text}</span>
                            <span className="wa-time">{m.time}{m.from === 'me' && <span className="wa-ticks" aria-label="read"> ✓✓</span>}</span>
                        </div>
                    ))}
                    {typing && (
                        <div className="wa-msg wa-bot wa-typing" aria-label="Bot is typing">
                            <span /><span /><span />
                        </div>
                    )}
                </div>

                <form className="wa-input" onSubmit={onSubmit}>
                    <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Message or /help"
                        aria-label="Type a message to the bot"
                        maxLength={200}
                    />
                    <button type="submit" aria-label="Send" disabled={!draft.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" /></svg>
                    </button>
                </form>
            </div>

            <div className="wa-side">
                <div className="wa-suggest" aria-label="Try one">
                    {SUGGESTIONS.map((s) => (
                        <button key={s} type="button" className="chip wa-chip" onClick={() => send(s)}>{s}</button>
                    ))}
                </div>

                <div className="wa-trace" role="log" aria-label="Server trace">
                    <div className="wa-trace-head">
                        <span className="wa-dots" aria-hidden="true"><i /><i /><i /></span>
                        <span>server trace — FastAPI</span>
                    </div>
                    <ol ref={traceRef}>
                        {trace.map((l) => (
                            <li key={l.id} className={`k-${l.kind}`}>
                                <span className="wa-t">{l.t}</span>
                                <span className="wa-k">{l.kind}</span>
                                <span className="wa-l">{l.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>
                <p className="wa-note">
                    Tip: send two questions within three seconds and watch the debounce drop the first.
                    Commands, replies, and flow mirror <code>bridge.py</code>; tutor answers are canned here.
                </p>
            </div>
        </div>
    );
};

export default WhatsAppDemo;
