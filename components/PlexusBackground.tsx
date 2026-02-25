import React, { useEffect, useRef } from 'react';
import styles from './PlexusBackground.module.css';

const PlexusBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDark, setIsDark] = React.useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const check = () => setIsDark(root.classList.contains("dark"));
        check();

        const observer = new MutationObserver(check);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 60;
        const connectionDistance = 150;
        const mouseDistance = 200;
        let mouse = { x: -1000, y: -1000 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update(width: number, height: number) {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseDistance) {
                    const force = (mouseDistance - dist) / mouseDistance;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            draw(ctx: CanvasRenderingContext2D, color: string) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                initParticles();
            }
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const drawLines = (color: string) => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = 1 - dist / connectionDistance;
                        ctx.strokeStyle = color.replace('opacity', (opacity * 0.2).toString());
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particleColor = isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.4)';
            const lineColor = isDark ? 'rgba(96, 165, 250, opacity)' : 'rgba(37, 99, 235, opacity)';

            particles.forEach(p => {
                p.update(canvas.width, canvas.height);
                p.draw(ctx, particleColor);
            });

            drawLines(lineColor);
            animationFrameId = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        render();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.plexusCanvas}
            aria-hidden="true"
        />
    );
};

export default PlexusBackground;
