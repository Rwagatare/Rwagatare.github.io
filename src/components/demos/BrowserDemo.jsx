import { useState } from 'react';
import './Frames.css';

/*
 * A browser-window frame that flips between screenshots and, on request,
 * the live deployed app in an iframe (loaded only when asked for).
 */
const BrowserDemo = ({ url, shots, liveLabel = 'Live app', allow }) => {
    const [tab, setTab] = useState(0);
    const isLive = tab === shots.length;
    const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    return (
        <div className="bframe">
            <div className="bframe-bar">
                <span className="bframe-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="bframe-url">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" /></svg>
                    {host}
                </span>
                <a className="bframe-open" href={url} target="_blank" rel="noopener noreferrer" aria-label="Open in a new tab">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
                </a>
            </div>

            <div className="bframe-view">
                {isLive ? (
                    <iframe src={url} title={`${host} — live`} allow={allow} loading="lazy" />
                ) : (
                    shots.map((s, i) => (
                        <img
                            key={s.src}
                            src={s.src}
                            alt={s.alt}
                            loading="lazy"
                            className={i === tab ? 'on' : ''}
                            aria-hidden={i !== tab}
                        />
                    ))
                )}
            </div>

            <div className="bframe-tabs segmented" role="tablist" aria-label="Views">
                {shots.map((s, i) => (
                    <button key={s.label} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{s.label}</button>
                ))}
                <button role="tab" aria-selected={isLive} onClick={() => setTab(shots.length)} className="bframe-live">
                    <span className="bframe-live-dot" aria-hidden="true" /> {liveLabel}
                </button>
            </div>
        </div>
    );
};

export default BrowserDemo;
