"use client";

import { useId } from "react";
import { motion } from "framer-motion";

interface SparklineProps {
  values: number[];
  height?: number;
  className?: string;
}

/** Minimal area sparkline that draws itself in. Values are oldest → newest. */
export default function Sparkline({ values, height = 72, className }: SparklineProps) {
  const uid = useId().replace(/:/g, "");
  if (values.length < 2) return null;

  const W = 320;
  const pad = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]} ${height} L${pts[0][0]} ${height}Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${height}`}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      role="img"
      aria-label={`Trend of the last ${values.length} cut-off scores`}
    >
      <defs>
        <linearGradient id={`sg-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#sg-${uid})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx={lx}
        cy={ly}
        r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 400, damping: 18 }}
        style={{ transformOrigin: `${lx}px ${ly}px` }}
      />
    </svg>
  );
}
