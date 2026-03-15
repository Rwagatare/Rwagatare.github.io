import { useEffect, useRef } from 'react';

const BackgroundGraph = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });
    const nodesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId;

        const termToSection = {
            "Empathy": "about",
            "Algorithms": "experience",
            "Global Health": "beyond",
            "HCI": "experience",
            "AI": "experience",
            "Community": "about",
            "Scale": "projects",
            "Education": "education",
            "Impact": "about",
            "Data Science": "experience",
            "Rwanda": "about",
            "Access": "beyond",
            "Equity": "beyond",
            "Design": "projects",
            "Machine Learning": "experience",
            "MIT": "experience",
            "Catlab": "projects",
            "Ganza Mwari": "projects",
        };

        const resizeCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const updateMouse = (x, y) => {
            mouseRef.current.x = x;
            mouseRef.current.y = y;
        };

        const handleMouseMove = (e) => updateMouse(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                updateMouse(e.touches[0].clientX, e.touches[0].clientY);
            }
        };
        const handleTouchEnd = () => {
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        };

        const handleClick = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            for (const node of nodesRef.current) {
                const dx = x - node.x;
                const dy = y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 30) {
                    const targetId = termToSection[node.text];
                    if (targetId) {
                        const el = document.getElementById(targetId);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('click', handleClick);

        const terms = [
            "Empathy", "Algorithms", "Global Health", "HCI", "AI",
            "Community", "Scale", "Education", "Impact", "Data Science",
            "Rwanda", "Access", "Equity", "Design", "Machine Learning",
            "MIT", "Catlab", "Ganza Mwari"
        ];

        class Node {
            constructor(text) {
                this.text = text;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = 3;
            }

            update() {
                if (mouseRef.current.x != null) {
                    const dx = mouseRef.current.x - this.x;
                    const dy = mouseRef.current.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150;

                    if (distance < maxDistance && distance > 0) {
                        const force = (maxDistance - distance) / maxDistance;
                        this.x -= (dx / distance) * force * 2;
                        this.y -= (dy / distance) * force * 2;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(244, 211, 94, 0.35)';
                ctx.fill();

                ctx.font = '11px "JetBrains Mono", monospace';
                ctx.fillStyle = 'rgba(204, 214, 246, 0.2)';
                ctx.fillText(this.text, this.x + 8, this.y + 4);
            }
        }

        nodesRef.current = terms.map(t => new Node(t));

        const drawEdges = () => {
            const maxDist = 200;
            for (let i = 0; i < nodesRef.current.length; i++) {
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const a = nodesRef.current[i];
                    const b = nodesRef.current[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const opacity = 1 - dist / maxDist;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(136, 146, 176, ${opacity * 0.12})`;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            nodesRef.current.forEach(node => {
                node.update();
                node.draw();
            });
            drawEdges();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'transparent'
            }}
        />
    );
};

export default BackgroundGraph;
