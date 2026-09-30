import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DirectoryDemo.css';

/*
 * A from-scratch recreation of the technique behind the CATLAB directory
 * (the production app is internal to Westmont): windowed rendering plus a
 * debounced search over a large, synthetic list.
 */

const FIRST = ['Amani', 'Grace', 'Eric', 'Aline', 'Jean', 'Sofia', 'Daniel', 'Keza', 'Noah', 'Maya', 'Samuel', 'Ines', 'David', 'Chloe', 'Yves', 'Leah', 'Joseph', 'Nadia', 'Liam', 'Esther', 'Kevin', 'Olivia', 'Patrick', 'Ruth', 'Isaac', 'Hana', 'Moses', 'Clara', 'Ethan', 'Diane'];
const LAST = ['Mugisha', 'Johnson', 'Uwase', 'Garcia', 'Habimana', 'Chen', 'Niyonzima', 'Smith', 'Ishimwe', 'Nguyen', 'Kamanzi', 'Brown', 'Mutesi', 'Martinez', 'Nkurunziza', 'Lee', 'Ingabire', 'Davis', 'Byiringiro', 'Wilson', 'Umutoni', 'Clark', 'Hakizimana', 'Lopez'];
const DEPTS = ['Computer Science', 'Mathematics', 'Biology', 'Economics', 'Kinesiology', 'Art', 'Chemistry', 'History', 'Music', 'Physics', 'English', 'Psychology', 'Library', 'IT Services', 'Admissions'];
const ROLES = ['Student', 'Student', 'Student', 'Student', 'Faculty', 'Staff'];
const HALLS = ['Winter Hall', 'Porter Center', 'Voskuyl Library', 'Adams Center', 'Deane Chapel', 'Kerrwood Hall'];

const COUNT = 10000;
const ROW_H = 60;
const VIEW_H = 420;
const OVERSCAN = 6;

// Deterministic PRNG so every visitor sees the same dataset.
const mulberry32 = (a) => () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildPeople = () => {
    const rnd = mulberry32(2024);
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    return Array.from({ length: COUNT }, (_, i) => {
        const first = pick(FIRST);
        const last = pick(LAST);
        const role = pick(ROLES);
        const dept = pick(DEPTS);
        return {
            id: i,
            name: `${first} ${last}`,
            role,
            dept,
            where: `${pick(HALLS)} ${100 + Math.floor(rnd() * 300)}`,
            hay: `${first} ${last} ${role} ${dept}`.toLowerCase(),
            hue: Math.floor(rnd() * 360),
        };
    });
};

const Row = ({ p, style }) => (
    <li className="dir-row" style={style}>
        <span className="dir-avatar" style={{ '--h': p.hue }} aria-hidden="true">
            {p.name.split(' ').map((s) => s[0]).join('')}
        </span>
        <span className="dir-main">
            <span className="dir-name">{p.name}</span>
            <span className="dir-sub">{p.dept} · {p.where}</span>
        </span>
        <span className={`dir-role r-${p.role.toLowerCase()}`}>{p.role}</span>
    </li>
);

const DirectoryDemo = () => {
    const people = useMemo(() => buildPeople(), []);
    const [input, setInput] = useState('');
    const [query, setQuery] = useState('');
    const [debounce, setDebounce] = useState(true);
    const [virtual, setVirtual] = useState(true);
    const [scrollTop, setScrollTop] = useState(0);
    const [keystrokes, setKeystrokes] = useState(0);
    const [searches, setSearches] = useState(0);
    const viewportRef = useRef(null);
    const msRef = useRef(null);
    const timerRef = useRef(0);
    const t0 = useRef(0);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return people;
        const terms = q.split(/\s+/);
        return people.filter((p) => terms.every((t) => p.hay.includes(t)));
    }, [people, query]);

    const start = virtual ? Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN) : 0;
    const end = virtual ? Math.min(results.length, Math.ceil((scrollTop + VIEW_H) / ROW_H) + OVERSCAN) : results.length;
    const visible = results.slice(start, end);

    // Time from committing a search/toggle to the DOM being updated.
    useLayoutEffect(() => {
        if (!msRef.current || !t0.current) return;
        const ms = performance.now() - t0.current;
        msRef.current.textContent = `${ms.toFixed(1)} ms`;
        msRef.current.parentElement.classList.toggle('warn', ms > 50);
    }, [results, virtual]);

    const runSearch = (value) => {
        t0.current = performance.now();
        setQuery(value);
        setSearches((n) => n + 1);
        setScrollTop(0);
        if (viewportRef.current) viewportRef.current.scrollTop = 0;
    };

    // Debounced: one search 200 ms after typing pauses. Otherwise: every keystroke.
    const onType = (e) => {
        const value = e.target.value;
        setInput(value);
        setKeystrokes((n) => n + 1);
        clearTimeout(timerRef.current);
        if (debounce) timerRef.current = setTimeout(() => runSearch(value), 200);
        else runSearch(value);
    };

    const toggleVirtual = () => {
        t0.current = performance.now();
        setVirtual((v) => !v);
    };

    return (
        <div className="dir">
            <div className="dir-controls">
                <label className="dir-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                    <span className="sr-only">Search 10,000 people</span>
                    <input value={input} onChange={onType} placeholder="Search 10,000 people — try “grace faculty”" />
                </label>
                <div className="dir-toggles">
                    <button type="button" className={`dir-toggle ${virtual ? 'on' : ''}`} onClick={toggleVirtual} aria-pressed={virtual}>
                        <span className="dir-switch" aria-hidden="true" /> Virtualized
                    </button>
                    <button type="button" className={`dir-toggle ${debounce ? 'on' : ''}`} onClick={() => setDebounce((d) => !d)} aria-pressed={debounce}>
                        <span className="dir-switch" aria-hidden="true" /> Debounced
                    </button>
                </div>
            </div>

            <div className="dir-metrics" aria-live="polite">
                <div><strong>{results.length.toLocaleString()}</strong><span>matches</span></div>
                <div className={visible.length > 200 ? 'warn' : ''}><strong>{visible.length.toLocaleString()}</strong><span>rows in the DOM</span></div>
                <div><strong ref={msRef}>—</strong><span>last update</span></div>
                <div><strong>{searches}</strong><span>searches for {keystrokes} keystrokes</span></div>
            </div>

            <div
                className="dir-viewport"
                ref={viewportRef}
                style={{ height: VIEW_H }}
                onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
                tabIndex={0}
                aria-label="Directory results"
            >
                {results.length === 0 ? (
                    <p className="dir-empty">No one matches “{query}”.</p>
                ) : (
                    <ul style={{ position: 'relative', height: results.length * ROW_H }}>
                        {visible.map((p, i) => (
                            <Row key={p.id} p={p} style={{ position: 'absolute', top: (start + i) * ROW_H, left: 0, right: 0, height: ROW_H }} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DirectoryDemo;
