import { useMemo, useState } from 'react';
import data from '../../data/youtube-history.json';
import './HeatmapDemo.css';

/*
 * Aggregates computed from the public watch-history.json in
 * Rwagatare/IR_from_real_world_data (same cleaning as analysis.ipynb:
 * ads and null rows dropped). Only counts ship to the browser.
 */

const pad = (h) => `${String(h).padStart(2, '0')}:00`;

const HeatmapDemo = () => {
    const [cell, setCell] = useState(null); // { h, d }
    const [year, setYear] = useState(null);

    const { max, peak, hourTotals, dayTotals } = useMemo(() => {
        let m = 0;
        let p = { h: 0, d: 0, v: 0 };
        const ht = data.grid.map((row) => row.reduce((a, b) => a + b, 0));
        const dt = data.days.map((_, d) => data.grid.reduce((a, row) => a + row[d], 0));
        data.grid.forEach((row, h) => row.forEach((v, d) => {
            if (v > m) m = v;
            if (v > p.v) p = { h, d, v };
        }));
        return { max: m, peak: p, hourTotals: ht, dayTotals: dt };
    }, []);

    const yearMax = Math.max(...data.years.map(([, c]) => c));
    const wordMax = data.words[0][1];
    const busiestDay = dayTotals.indexOf(Math.max(...dayTotals));
    const busiestHour = hourTotals.indexOf(Math.max(...hourTotals));

    const active = cell ?? { h: peak.h, d: peak.d };
    const activeVal = data.grid[active.h][active.d];
    const hoveredYear = year ?? data.years[data.years.length - 2];

    return (
        <div className="hm">
            <div className="hm-readout" aria-live="polite">
                <div>
                    <span className="hm-k">{cell ? 'Selected' : 'Peak'}</span>
                    <strong>{data.days[active.d]} {pad(active.h)}</strong>
                    <span className="hm-v">{activeVal.toLocaleString()} videos</span>
                </div>
                <div>
                    <span className="hm-k">Busiest day</span>
                    <strong>{data.days[busiestDay]}</strong>
                    <span className="hm-v">{dayTotals[busiestDay].toLocaleString()} videos</span>
                </div>
                <div>
                    <span className="hm-k">Busiest hour</span>
                    <strong>{pad(busiestHour)} {data.tz}</strong>
                    <span className="hm-v">{hourTotals[busiestHour].toLocaleString()} videos</span>
                </div>
            </div>

            <div className="hm-figure">
                <div className="hm-grid" role="img" aria-label={`Heatmap of ${data.total.toLocaleString()} YouTube videos by weekday and hour, ${data.tz}. Peak: ${data.days[peak.d]} ${pad(peak.h)} with ${peak.v} videos.`} onMouseLeave={() => setCell(null)}>
                    <span />
                    {Array.from({ length: 24 }, (_, h) => (
                        <span key={`h${h}`} className="hm-hour" aria-hidden="true">{h % 3 === 0 ? String(h).padStart(2, '0') : ''}</span>
                    ))}
                    {data.days.map((day, d) => (
                        <div key={day} className="hm-row">
                            <span className={`hm-day ${active.d === d && cell ? 'on' : ''}`} aria-hidden="true">{day}</span>
                            {data.grid.map((row, h) => {
                                const v = row[d];
                                const pct = Math.round(8 + (v / max) * 92);
                                const on = cell && cell.h === h && cell.d === d;
                                return (
                                    <button
                                        type="button"
                                        key={h}
                                        className={`hm-cell ${on ? 'on' : ''} ${cell && (cell.h === h || cell.d === d) ? 'axis' : ''}`}
                                        style={{ '--p': `${pct}%` }}
                                        onMouseEnter={() => setCell({ h, d })}
                                        onFocus={() => setCell({ h, d })}
                                        aria-label={`${day} ${pad(h)}: ${v} videos`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="hm-legend" aria-hidden="true">
                    <span>fewer</span>
                    <i />
                    <span>more</span>
                    <span className="hm-tz">Hours in {data.tz}</span>
                </div>
            </div>

            <div className="hm-lower">
                <div className="hm-years">
                    <h4>Videos per year</h4>
                    <div className="hm-bars" onMouseLeave={() => setYear(null)}>
                        {data.years.map(([y, c]) => {
                            const on = hoveredYear[0] === y;
                            return (
                                <button
                                    type="button"
                                    key={y}
                                    className={`hm-bar ${on ? 'on' : ''}`}
                                    onMouseEnter={() => setYear([y, c])}
                                    onFocus={() => setYear([y, c])}
                                    aria-label={`${y}: ${c} videos`}
                                >
                                    <span className="hm-bar-val">{on ? c.toLocaleString() : ''}</span>
                                    <span className="hm-bar-fill" style={{ height: `${Math.max(3, (c / yearMax) * 100)}%` }} />
                                    <span className="hm-bar-year">{String(y).slice(2)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="hm-words">
                    <h4>Most frequent title words</h4>
                    <ul>
                        {data.words.map(([w, c]) => (
                            <li key={w} style={{ '--w': `${(c / wordMax) * 100}%` }}>
                                <span>{w}</span>
                                <span className="hm-count">{c.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <table className="sr-only">
                <caption>Videos watched by hour ({data.tz}) and weekday</caption>
                <thead><tr><th>Hour</th>{data.days.map((d) => <th key={d}>{d}</th>)}</tr></thead>
                <tbody>
                    {data.grid.map((row, h) => (
                        <tr key={h}><th>{pad(h)}</th>{row.map((v, d) => <td key={d}>{v}</td>)}</tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HeatmapDemo;
