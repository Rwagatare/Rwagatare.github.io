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
    { id: 'glass', swatch: 'rgba(255,255,255,.18)', glass: true },
    { id: 'glass-periwinkle', swatch: 'rgba(165,180,252,.35)', glass: true },
    { id: 'glass-mint', swatch: 'rgba(142,230,184,.32)', glass: true },
    { id: 'glass-sky', swatch: 'rgba(143,211,254,.32)', glass: true },
    { id: 'glass-lightblue', swatch: 'rgba(90,170,255,.55)', glass: true },
];

const KEY = 'accent-dev-v2';

const read = () => {
    try { return localStorage.getItem(KEY) || 'glass-lightblue'; } catch { return 'glass-lightblue'; }
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
            {OPTIONS.map((o, i) => (
                <span key={o.id} style={{ display: 'contents' }}>
                {o.glass && !OPTIONS[i - 1]?.glass && (
                    <span style={{ width: 1, height: 18, background: 'var(--separator)', margin: '0 2px' }} aria-hidden="true" />
                )}
                <button
                    type="button"
                    onClick={() => setAccent(o.id)}
                    aria-label={`Use ${o.id} accent`}
                    title={o.id}
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: o.glass ? `linear-gradient(180deg, rgba(255,255,255,.55), transparent 60%), ${o.swatch}` : o.swatch,
                        backdropFilter: o.glass ? 'blur(8px) saturate(180%)' : undefined,
                        boxShadow: accent === o.id
                            ? '0 0 0 2px var(--bg), 0 0 0 4px var(--label)'
                            : o.glass
                                ? 'inset 0 1px 0 rgba(255,255,255,.7), inset 0 0 0 1px rgba(128,128,140,.35)'
                                : 'inset 0 0 0 1px rgba(0,0,0,.15)',
                        transition: 'box-shadow 200ms',
                    }}
                />
                </span>
            ))}
        </div>
    );
};

export default PaletteDev;
