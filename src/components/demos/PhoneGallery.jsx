import { useState } from 'react';
import './Frames.css';

// A phone frame that cross-fades between app screenshots.
const PhoneGallery = ({ shots, note }) => {
    const [i, setI] = useState(0);

    return (
        <div className="pgal">
            <div className="pframe">
                <div className="pframe-island" aria-hidden="true" />
                {shots.map((s, k) => (
                    <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className={k === i ? 'on' : ''} aria-hidden={k !== i} />
                ))}
            </div>
            <div className="pgal-side">
                <div className="pgal-list" role="tablist" aria-label="Screens" aria-orientation="vertical">
                    {shots.map((s, k) => (
                        <button key={s.label} role="tab" aria-selected={k === i} onClick={() => setI(k)} className="pgal-item">
                            <strong>{s.label}</strong>
                            <span>{s.caption}</span>
                        </button>
                    ))}
                </div>
                {note && <p className="pgal-note">{note}</p>}
            </div>
        </div>
    );
};

export default PhoneGallery;
