import { useState, useEffect, useCallback } from 'react';

const Typewriter = ({ text: fullText, speed = 35, startDelay = 400, className = '' }) => {
    const [text, setText] = useState('');
    const [started, setStarted] = useState(false);
    const [node, setNode] = useState(null);

    const setRef = useCallback((el) => {
        if (el) setNode(el);
    }, []);

    useEffect(() => {
        if (!node || started) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [node, started]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        let interval;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                i++;
                setText(fullText.slice(0, i));
                if (i >= fullText.length) clearInterval(interval);
            }, speed);
        }, startDelay);
        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [started, fullText, speed, startDelay]);

    const done = text.length === fullText.length && started;

    return (
        <p className={`section-typewriter ${className}`} ref={setRef}>
            {text}
            <span className={`tw-cursor ${done ? 'blink' : ''}`}>|</span>
        </p>
    );
};

export default Typewriter;
