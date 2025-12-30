"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./ScrollHighlightText.module.css";

interface ScrollHighlightTextProps {
    text: string;
    highlightColor?: string;
}

export default function ScrollHighlightText({
    text,
    highlightColor = "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)"
}: ScrollHighlightTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "end 0.2"]
    });

    // Split text into words
    const words = text.split(" ");

    return (
        <div ref={containerRef} className={styles.container}>
            <h2 className={styles.text}>
                {words.map((word, index) => {
                    const start = index / words.length;
                    const end = start + (1 / words.length);

                    return (
                        <Word
                            key={index}
                            progress={scrollYProgress}
                            range={[start, end]}
                            highlightColor={highlightColor}
                        >
                            {word}
                        </Word>
                    );
                })}
            </h2>
        </div>
    );
}

interface WordProps {
    children: string;
    progress: any;
    range: [number, number];
    highlightColor: string;
}

function Word({ children, progress, range, highlightColor }: WordProps) {
    const opacity = useTransform(progress, range, [0.3, 1]);
    const color = useTransform(
        progress,
        range,
        ["rgba(100, 116, 139, 0.6)", "transparent"]
    );

    return (
        <span className={styles.word}>
            <span className={styles.wordShadow}>{children}</span>
            <motion.span
                className={styles.wordHighlight}
                style={{
                    opacity,
                    color,
                    background: highlightColor,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: color,
                    backgroundClip: "text",
                }}
            >
                {children}
            </motion.span>
        </span>
    );
}
