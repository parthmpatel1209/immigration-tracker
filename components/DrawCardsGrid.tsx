"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Users, Hash, MapPin } from "lucide-react";
import styles from "./DrawCardsGrid.module.css";
import CanadaPNPMap from "./CanadaPNPMap";

// ──────────────────────────────────────────────────────────────
// Types – EXACT same as DrawsTable (draw_province: string | null)
// ──────────────────────────────────────────────────────────────
interface Draw {
  id: number;
  round: number;
  program: string;
  draw_province: string | null;
  crs_cutoff?: number | null;
  invitations?: number | null;
  draw_date: string;
}

// ──────────────────────────────────────────────────────────────
// Badge Colors (Light & Dark Mode)
// ──────────────────────────────────────────────────────────────
const BADGE_COLORS: Record<
  string,
  { light: { bg: string; text: string }; dark: { bg: string; text: string } }
> = {
  "Express Entry": {
    light: { bg: "#e0e7ff", text: "#4338ca" },
    dark: { bg: "#312e81", text: "#c7d2fe" },
  },
  PNP: {
    light: { bg: "#d1fae5", text: "#065f46" },
    dark: { bg: "#064e3b", text: "#a7f3d0" },
  },
  CEC: {
    light: { bg: "#e9d5ff", text: "#6b21a8" },
    dark: { bg: "#4c1d95", text: "#e9d5ff" },
  },
  FSW: {
    light: { bg: "#fef3c7", text: "#92400e" },
    dark: { bg: "#78350f", text: "#fde68a" },
  },
  default: {
    light: { bg: "#e5e7eb", text: "#374151" },
    dark: { bg: "#374151", text: "#d1d5db" },
  },
};

// ──────────────────────────────────────────────────────────────
// Helper: Display "N/A" for null/undefined/empty – same as table
// ──────────────────────────────────────────────────────────────
const NA = (value: any, fallback = "N/A"): string => {
  if (value == null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
};

// ──────────────────────────────────────────────────────────────
// DrawCard Component – Province shows correctly
// ──────────────────────────────────────────────────────────────
function DrawCard({ draw, rank }: { draw: Draw; rank: 1 | 2 | 3 }) {
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode – EXACT same as DrawsTable
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const badge = BADGE_COLORS[draw.program] ?? BADGE_COLORS.default;
  const colors = isDark ? badge.dark : badge.light;

  const formattedDate = dayjs(draw.draw_date, "MM/DD/YYYY", true).isValid()
    ? dayjs(draw.draw_date, "MM/DD/YYYY").format("MMM D, YYYY")
    : NA(draw.draw_date);

  const rankLabel =
    rank === 1 ? "Latest" : rank === 2 ? "2nd Latest" : "3rd Latest";

  // Footer: Province logic – matches DrawsTable behavior
  const renderFooterContent = () => {
    const isPNP = draw.program === "PNP";
    const province = draw.draw_province?.trim();

    // 1. PNP + has province → show icon + code
    if (isPNP && province) {
      return (
        <>
          <span className={styles.sep}> • </span>
          <span className={styles.province}>
            <MapPin className={styles.provIcon} />
            {province}
          </span>
        </>
      );
    }

    // 2. Not PNP → show N/A
    if (!isPNP) {
      return (
        <>
          <span className={styles.sep}> • </span>
          <span className={styles.province}>N/A</span>
        </>
      );
    }

    // 3. PNP but no province → show nothing
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={styles.card}
      style={
        {
          "--badge-bg": colors.bg,
          "--badge-text": colors.text,
        } as React.CSSProperties
      }
    >
      <div className={styles.glass}>
        <div className={styles.glow} />

        {/* Header */}
        <header className={styles.header}>
          <h3 className={styles.title}>{rankLabel} Draw</h3>
          <span className={styles.badge}>{draw.program}</span>
        </header>

        {/* CRS Score */}
        <div className={styles.crs}>
          <Hash
            className={styles.icon}
            style={{ color: isDark ? "#93c5fd" : "#3b82f6" }}
          />
          <span className={styles.crsValue}>{NA(draw.crs_cutoff)}</span>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Users className={styles.iconSm} />
            <span>
              {draw.invitations != null
                ? Number(draw.invitations).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className={styles.stat}>
            <Calendar className={styles.iconSm} />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <span>Round #{NA(draw.round)}</span>
          <span className={styles.sep}> | </span>
          <span className={styles.province}>
            <MapPin className={styles.provIcon} />
            {NA(draw.draw_province)}
          </span>
        </footer>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
// Skeleton Card (Loading State)
// ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.glass}>
        <header className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skelTitle}`} />
          <div className={`${styles.skeleton} ${styles.skelBadge}`} />
        </header>

        <div className={styles.crs}>
          <div className={`${styles.skeleton} ${styles.skelIcon}`} />
          <div className={`${styles.skeleton} ${styles.skelCrs}`} />
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={`${styles.skeleton} ${styles.skelIconSm}`} />
            <div className={`${styles.skeleton} ${styles.skelValue}`} />
          </div>
          <div className={styles.stat}>
            <div className={`${styles.skeleton} ${styles.skelIconSm}`} />
            <div className={`${styles.skeleton} ${styles.skelValue}`} />
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={`${styles.skeleton} ${styles.skelFooter}`} />
        </footer>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main Component: DrawCardsGrid – fetches & sorts like table
// ──────────────────────────────────────────────────────────────
export default function DrawCardsGrid() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await fetch("/api/draws");
        if (!res.ok) throw new Error("Failed to fetch draws");

        const data: Draw[] = await res.json();

        // Same validation & sorting as DrawsTable
        const validDraws = data
          .filter((d) => dayjs(d.draw_date, "MM/DD/YYYY", true).isValid())
          .sort(
            (a, b) =>
              dayjs(b.draw_date, "MM/DD/YYYY").valueOf() -
              dayjs(a.draw_date, "MM/DD/YYYY").valueOf()
          );

        setDraws(validDraws.slice(0, 3));
      } catch (err) {
        console.error("Error fetching draws:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  return (
    <div>
      {/* Cards Grid */}
      <div className={styles.root}>
        <div className={styles.grid}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : draws.length === 0 ? (
            <p className={styles.empty}>No draw data available.</p>
          ) : (
            draws.map((draw, index) => (
              <DrawCard
                key={draw.id}
                draw={draw}
                rank={(index + 1) as 1 | 2 | 3}
              />
            ))
          )}
        </div>
      </div>

      {/* Canada PNP Map */}
      <section className={styles.mapSection}>
        <CanadaPNPMap />
      </section>
    </div>
  );
}
