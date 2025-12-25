"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, MouseEvent } from "react";
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

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

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
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className={`${styles.card} bg-gradient-to-br ${item.gradient}`}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
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
                        transform: "translateZ(50px)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Icon */}
                    <motion.div
                        className={styles.iconContainer}
                        style={{ transform: "translateZ(75px)" }}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                    </motion.div>

                    {/* Year Badge */}
                    <motion.div
                        className={styles.yearBadge}
                        style={{ transform: "translateZ(60px)" }}
                    >
                        {item.year}
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        className={styles.cardTitle}
                        style={{ transform: "translateZ(60px)" }}
                    >
                        {item.title}
                    </motion.h2>
                    <motion.h3
                        className={styles.cardSubtitle}
                        style={{ transform: "translateZ(55px)" }}
                    >
                        {item.subtitle}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                        className={styles.cardDescription}
                        style={{ transform: "translateZ(50px)" }}
                    >
                        {item.description}
                    </motion.p>

                    {/* Progress Indicator */}
                    <motion.div
                        className={styles.progressIndicator}
                        style={{ transform: "translateZ(55px)" }}
                    >
                        <span className={styles.progressDot} />
                        <span className={styles.progressText}>
                            Step {index + 1} of {journeyData.length}
                        </span>
                    </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <div className={styles.cardDecoration} />
            </motion.div>
        </motion.div>
    );
}
