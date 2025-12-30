"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, MouseEvent, useState, useEffect } from "react";
import Image from "next/image";
import { journeyData } from "./journeyData";
import styles from "./MyJourney.module.css";

export default function MyJourney() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className={styles.container}>
            {/* Floating Particles Background */}
            <FloatingParticles />

            {/* Journey Path SVG */}
            <JourneyPath progress={scrollYProgress} />

            {/* Progress Indicator */}
            <ProgressIndicator progress={scrollYProgress} />

            {/* Header */}
            <div className={styles.header}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    My Immigration Journey
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    A 7-year path from India to Canadian Citizenship
                </motion.p>
            </div>

            {/* Journey Cards */}
            <div className={styles.cardsContainer}>
                {journeyData.map((item, index) => {
                    const targetScale = 1 - ((journeyData.length - index) * 0.05);

                    return (
                        <Card
                            key={item.id}
                            item={item}
                            index={index}
                            progress={scrollYProgress}
                            range={[index * 0.14, 1]}
                            targetScale={targetScale}
                        />
                    );
                })}
            </div>

            {/* Bottom Spacer */}
            <div className={styles.spacer} />
        </div>
    );
}

// Floating Particles Component
function FloatingParticles() {
    const particles = [
        { icon: "/journey/icons/maple-leaf.svg", delay: 0, duration: 20 },
        { icon: "/journey/icons/star.svg", delay: 2, duration: 25 },
        { icon: "/journey/icons/document.svg", delay: 4, duration: 22 },
        { icon: "/journey/icons/maple-leaf.svg", delay: 6, duration: 18 },
        { icon: "/journey/icons/star.svg", delay: 8, duration: 24 },
        { icon: "/journey/icons/airplane.svg", delay: 10, duration: 30 },
    ];

    return (
        <div className={styles.particlesContainer}>
            {particles.map((particle, index) => (
                <motion.div
                    key={index}
                    className={styles.particle}
                    style={{
                        left: `${(index * 15) + 10}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.sin(index) * 50, 0],
                        rotate: [0, 360],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        src={particle.icon}
                        alt="particle"
                        width={24}
                        height={24}
                        className={styles.particleIcon}
                    />
                </motion.div>
            ))}
        </div>
    );
}

// Journey Path Component
function JourneyPath({ progress }: { progress: any }) {
    const pathLength = useTransform(progress, [0, 1], [0, 1]);

    return (
        <svg className={styles.journeyPath} viewBox="0 0 100 2000">
            <motion.path
                d="M 50 0 Q 30 200 50 400 Q 70 600 50 800 Q 30 1000 50 1200 Q 70 1400 50 1600 Q 30 1800 50 2000"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="10 5"
                style={{
                    pathLength,
                    opacity: 0.5,
                }}
            />
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// Progress Indicator Component
function ProgressIndicator({ progress }: { progress: any }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const unsubscribe = progress.on("change", (latest: number) => {
            const index = Math.floor(latest * journeyData.length);
            setActiveIndex(Math.min(index, journeyData.length - 1));
        });
        return () => unsubscribe();
    }, [progress]);

    return (
        <div className={styles.progressIndicatorSide}>
            {journeyData.map((item, index) => (
                <motion.div
                    key={item.id}
                    className={`${styles.progressDotSide} ${index <= activeIndex ? styles.progressDotActive : ''}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <span className={styles.progressTooltip}>{item.year}</span>
                </motion.div>
            ))}
        </div>
    );
}

interface CardProps {
    item: typeof journeyData[0];
    index: number;
    progress: any;
    range: [number, number];
    targetScale: number;
}

function Card({ item, index, progress, range, targetScale }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const scale = useTransform(progress, range, [1, targetScale]);
    const opacity = useTransform(progress, range, [1, 0.5]);

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Detect if mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isMobile) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className={styles.cardWrapper}
            style={{
                scale,
                opacity,
                top: `calc(10% + ${index * 25}px)`,
            }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
        >
            <motion.div
                className={`${styles.card} bg-gradient-to-br ${item.gradient}`}
                style={{
                    rotateX: isMobile ? 0 : rotateX,
                    rotateY: isMobile ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Hover Glow Effect */}
                <motion.div
                    className={styles.cardGlow}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: isMobile ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Background Image */}
                <div className={styles.cardImage}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        priority={index < 2}
                    />
                </div>

                {/* Card Content */}
                <motion.div
                    className={styles.cardContent}
                    style={{
                        transform: isMobile ? "none" : "translateZ(50px)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Year Badge */}
                    <motion.div
                        className={styles.yearBadge}
                        style={{ transform: isMobile ? "none" : "translateZ(70px)" }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    >
                        {item.year}
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        className={styles.cardTitle}
                        style={{ transform: isMobile ? "none" : "translateZ(65px)" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    >
                        {item.title}
                    </motion.h2>
                    <motion.h3
                        className={styles.cardSubtitle}
                        style={{ transform: isMobile ? "none" : "translateZ(60px)" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                    >
                        {item.subtitle}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                        className={styles.cardDescription}
                        style={{ transform: isMobile ? "none" : "translateZ(55px)" }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                        {item.description}
                    </motion.p>

                    {/* Progress Indicator */}
                    <motion.div
                        className={styles.progressIndicator}
                        style={{ transform: isMobile ? "none" : "translateZ(60px)" }}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                    >
                        <motion.span
                            className={styles.progressDot}
                            animate={{
                                scale: [1, 1.2, 1],
                                boxShadow: [
                                    "0 0 10px rgba(255, 255, 255, 0.5)",
                                    "0 0 20px rgba(255, 255, 255, 0.8)",
                                    "0 0 10px rgba(255, 255, 255, 0.5)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <span className={styles.progressText}>
                            Step {index + 1} of {journeyData.length}
                        </span>
                    </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    className={styles.cardDecoration}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
