"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface Props {
    value: string | number;
    /** seconds */
    duration?: number;
    className?: string;
}

/** Counts up to `value` when scrolled into view, always ending on the exact number. */
export default function AnimatedCounter({ value, duration = 1.2, className }: Props) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const reduce = useReducedMotion();

    const target = parseFloat(String(value).replace(/,/g, "").trim());
    const isNumber = Number.isFinite(target);
    const [display, setDisplay] = useState(() => (isNumber ? "0" : String(value)));

    useEffect(() => {
        if (!isNumber) {
            setDisplay(String(value));
            return;
        }
        if (reduce) {
            setDisplay(Math.round(target).toLocaleString());
            return;
        }
        if (!inView) return;
        const controls = animate(0, target, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
            onComplete: () => setDisplay(Math.round(target).toLocaleString()),
        });
        return () => controls.stop();
    }, [target, isNumber, inView, reduce, duration, value]);

    return <span ref={ref} className={className}>{display}</span>;
}
