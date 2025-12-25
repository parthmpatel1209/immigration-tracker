"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useSpring } from "framer-motion";

interface Props {
    value: string | number;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({ value, className }: Props) {
    const ref = useRef<HTMLSpanElement>(null);
    const [displayValue, setDisplayValue] = useState<string>("0");

    // Initialize spring at 0
    const springValue = useSpring(0, {
        damping: 30,
        stiffness: 60,
        mass: 1,
    });

    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        // Parse value - remove commas and parse
        const cleanValue = typeof value === "string"
            ? value.replace(/,/g, "").trim()
            : String(value);

        const numericValue = parseFloat(cleanValue);

        // If it's a valid number and in view, animate
        if (!isNaN(numericValue) && isInView) {
            springValue.set(numericValue);
        } else if (isNaN(numericValue)) {
            // If not a number (like "..." or "N/A"), just display it
            setDisplayValue(String(value));
        }
    }, [value, isInView, springValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                // Format with commas
                const formatted = Math.floor(latest).toLocaleString();
                setDisplayValue(formatted);
                ref.current.textContent = formatted;
            }
        });
    }, [springValue]);

    // Check if value is numeric
    const cleanValue = typeof value === "string"
        ? value.replace(/,/g, "").trim()
        : String(value);
    const isNumber = !isNaN(parseFloat(cleanValue));

    if (!isNumber) {
        return <span className={className}>{value}</span>;
    }

    return <span ref={ref} className={className}>{displayValue}</span>;
}
