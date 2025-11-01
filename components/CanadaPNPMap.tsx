"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import CanadaMap, { Provinces } from "react-canada-map";

const PROVINCE_DATA: Record<
  Provinces,
  {
    name: string;
    total: number;
    filled: number;
    remaining: number;
    note?: string;
  }
> = {
  AB: {
    name: "Alberta",
    total: 2400,
    filled: 2100,
    remaining: 300,
    note: "Boosted for energy/healthcare",
  },
  BC: {
    name: "British Columbia",
    total: 4000,
    filled: 3600,
    remaining: 400,
    note: "Tech/health focus",
  },
  MB: {
    name: "Manitoba",
    total: 4750,
    filled: 4300,
    remaining: 450,
    note: "Skilled trades priority",
  },
  NB: {
    name: "New Brunswick",
    total: 3000,
    filled: 2700,
    remaining: 300,
    note: "French speakers targeted",
  },
  NL: {
    name: "Newfoundland and Labrador",
    total: 1300,
    filled: 1100,
    remaining: 200,
    note: "EOI for AIP",
  },
  NS: {
    name: "Nova Scotia",
    total: 3709,
    filled: 3300,
    remaining: 409,
    note: "Healthcare boost",
  },
  NT: {
    name: "Northwest Territories",
    total: 150,
    filled: 100,
    remaining: 50,
    note: "Critical workers",
  },
  NU: {
    name: "Nunavut",
    total: 0,
    filled: 0,
    remaining: 0,
    note: "No PNP program",
  },
  ON: {
    name: "Ontario",
    total: 10750,
    filled: 9800,
    remaining: 950,
    note: "High-CRS Express Entry",
  },
  PE: {
    name: "Prince Edward Island",
    total: 400,
    filled: 320,
    remaining: 80,
    note: "Entrepreneurs prioritized",
  },
  QC: {
    name: "Quebec",
    total: 0,
    filled: 0,
    remaining: 0,
    note: "Independent CAQ system (~50,000 separate)",
  },
  SK: {
    name: "Saskatchewan",
    total: 4761,
    filled: 4200,
    remaining: 561,
    note: "Uncapped health/ag",
  },
  YT: {
    name: "Yukon",
    total: 250,
    filled: 200,
    remaining: 50,
    note: "Mining/demand focus",
  },
};

export default function CanadaPNPMap() {
  const [hovered, setHovered] = useState<Provinces | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Adapted from library's click handler logic to detect province on hover
  const detectProvince = (event: React.MouseEvent) => {
    const target = event.target as SVGPathElement;
    let current = target;
    while (current && current.tagName !== "path") {
      current = current.parentElement as SVGPathElement;
    }
    if (current && current.id) {
      const code = current.id.toUpperCase() as Provinces;
      return PROVINCE_DATA[code] ? code : null;
    }
    return null;
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    const code = detectProvince(event);
    if (code) setHovered(code);
  };

  const handleMouseLeave = () => setHovered(null);

  const getFillColor = (code: Provinces) => {
    return "rgba(123, 123, 255, 0.9)"; // All same
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem 0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "1.5rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 0 40px rgba(139, 92, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25)
          `,
          overflow: "hidden",
        }}
      >
        {/* Province label */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: hovered ? 1 : 0.45, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            textAlign: "center",
            padding: "1rem 0 0.5rem",
            fontSize: "1.25rem",
            fontWeight: "600",
            color: hovered ? "#e2e8f0" : "#94a3b8",
            letterSpacing: "0.5px",
          }}
        >
          {hovered
            ? (() => {
                const data = PROVINCE_DATA[hovered];
                return data.total === 0
                  ? `${data.name}: No PNP Quota`
                  : `${data.name}: 2025 PNP Quota (Filled: ${
                      data.filled
                    }, Remaining: ${data.remaining}, Total: ${data.total}) ${
                      data.note ? `| ${data.note}` : ""
                    }`;
              })()
            : "2025 PNP Quotas by Province (Filled, remaining, and total)"}
        </motion.div>

        {/* Map container with overlay for hover detection */}
        <div
          ref={mapRef}
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 1rem 1rem",
            position: "relative",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseEnter} // Re-detect on move for accuracy
        >
          <CanadaMap
            // Built-in hover styling (visual feedback)
            defaultFillColor="transparent"
            hoverColor="rgba(255, 255, 255, 0.35)"
            strokeColor="rgba(255, 255, 255, 0.6)"
            strokeWidth={1.6}
            // Per-province base colors (hover overrides)
            customize={Object.fromEntries(
              (Object.keys(PROVINCE_DATA) as Provinces[]).map((code) => [
                code,
                {
                  fillColor: getFillColor(code),
                },
              ])
            )}
            style={{
              width: "680px",
              maxWidth: "100%",
              height: "auto",
              display: "block",
              pointerEvents: "none", // Allow events to bubble to overlay
            }}
          />
        </div>
      </div>
    </div>
  );
}
