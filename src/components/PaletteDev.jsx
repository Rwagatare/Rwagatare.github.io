import { useEffect, useState } from 'react';

// Dev-only accent picker (rendered only under `npm run dev`). Sets
// data-accent on <html>; palettes live in index.css. Once a palette is
// chosen, make it the default there and delete this component.
const OPTIONS = [
    { id: 'periwinkle', swatch: '#a5b4fc' },
    { id: 'mint', swatch: '#8ee6b8' },
    { id: 'sky', swatch: '#8fd3fe' },
    { id: 'lilac', swatch: '#d0b4fe' },
    { id: 'butter', swatch: '#fde68a' },
    { id: 'ember', swatch: '#ff7a4d' },
    { id: 'blue', swatch: '#0a84ff' },
];

const KEY = 'accent-dev';

const read = () => {
    try { return localStorage.getItem(KEY) || 'periwinkle'; } catch { return 'periwinkle'; }
};

const PaletteDev = () => {
    const [accent, setAccent] = useState(read);

    useEffect(() => {
        const root = document.documentElement;
        if (accent === 'periwinkle') delete root.dataset.accent;
        else root.dataset.accent = accent;
        try { localStorage.setItem(KEY, accent); } catch { /* storage blocked */ }
    }, [accent]);

    return (
        <div
            className="glass"
            style={{
                position: 'fixed',
                left: 16,
                bottom: 16,
                zIndex: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 16,
                fontSize: 12,
                color: 'var(--label-2)',
            }}
        >
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>Accent · <b style={{ color: 'var(--label)' }}>{accent}</b></span>
            {OPTIONS.map((o) => (
                <button
                    key={o.id}
                    type="button"
                    onClick={() => setAccent(o.id)}
                    aria-label={`Use ${o.id} accent`}
                    title={o.id}
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: o.swatch,
                        boxShadow: accent === o.id ? '0 0 0 2px var(--bg), 0 0 0 4px var(--label)' : 'inset 0 0 0 1px rgba(0,0,0,.15)',
                        transition: 'box-shadow 200ms',
                    }}
                />
            ))}
        </div>
    );
};

export default PaletteDev;
