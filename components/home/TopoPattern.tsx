// Decorative topographic contour lines — deterministic (SSR-safe), pure SVG.
const RINGS = 16;
const POINTS = 72;

function ring(i: number, cx: number, cy: number) {
  const base = 40 + i * 26;
  const pts: string[] = [];
  for (let p = 0; p <= POINTS; p++) {
    const a = (p / POINTS) * Math.PI * 2;
    const wobble =
      Math.sin(a * 3 + i * 0.55) * (6 + i * 1.1) +
      Math.cos(a * 5 - i * 0.35) * (3 + i * 0.6) +
      Math.sin(a * 2 + i * 0.2) * (9 + i * 0.5);
    const r = base + wobble;
    const x = cx + Math.cos(a) * r * 1.25;
    const y = cy + Math.sin(a) * r * 0.92;
    pts.push(`${p === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ") + "Z";
}

export default function TopoPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {Array.from({ length: RINGS }, (_, i) => (
          <path key={i} d={ring(i, 740, 330)} opacity={0.35 + (i % 3) * 0.2} />
        ))}
      </g>
    </svg>
  );
}
