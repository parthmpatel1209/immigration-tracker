"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Users, Hash, MapPin, Activity } from "lucide-react";
import styles from "./DrawCardsGrid.module.css";
import CanadaPNPMap from "./CanadaPNPMap";
import ChatBot from "@/components/ChatBot";

// ──────────────────────────────────────────────────────────────
// Types – EXACT same as DrawsTable (draw_province: string | null)
// ──────────────────────────────────────────────────────────────
interface Draw {
  id: number;
  round: string;
  program: string;
  draw_province: string | null;
  crs_cutoff?: string | null;
  invitations?: string | null;
  draw_date: string;
}

interface DrawCardsGridProps {
  onNavigateToTab?: (tabName: string) => void;
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
// Helper: Display "N/A" for null/undefined/empty
// ──────────────────────────────────────────────────────────────
const NA = (value: any, fallback = "N/A"): string => {
  if (value == null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
};

// ──────────────────────────────────────────────────────────────
// Content Processors
// ──────────────────────────────────────────────────────────────
const getProgramCategory = (program: string): string => {
  const p = program.toLowerCase();
  if (p.includes("provincial") || p.includes("pnp")) return "PNP";
  if (p.includes("canadian experience class") || p.includes("cec")) return "CEC";
  if (p.includes("federal skilled worker") || p.includes("fsw")) return "FSW";
  if (p.includes("federal skilled trades") || p.includes("fst")) return "FST";
  if (p.includes("express entry")) return "Express Entry";
  return "General";
};

// ──────────────────────────────────────────────────────────────
// DrawCard Component
// ──────────────────────────────────────────────────────────────
function DrawCard({ draw, rank }: { draw: Draw; rank: 1 | 2 | 3 }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const category = getProgramCategory(draw.program);
  const badge = BADGE_COLORS[category] ?? BADGE_COLORS.default;
  const colors = isDark ? badge.dark : badge.light;

  const formattedDate = dayjs(draw.draw_date).isValid()
    ? dayjs(draw.draw_date).format("MMM D, YYYY")
    : NA(draw.draw_date);

  const rankLabel = rank === 1 ? "Latest Draw" : rank === 2 ? "Previous Draw" : "Older Draw";

  // Footer: Province logic
  const renderFooterContent = () => {
    const isPNP = draw.program.toLowerCase().includes("pnp") || draw.program.toLowerCase().includes("provincial");
    const province = draw.draw_province?.trim();

    if (isPNP && province) {
      return (
        <div className={styles.provinceTag}>
          <MapPin size={14} />
          {province}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={styles.card}
      style={{ "--badge-bg": colors.bg, "--badge-text": colors.text } as React.CSSProperties}
    >
      <div className={styles.glass}>
        {/* Glow Effects */}
        <div className={styles.glow} />
        <div className={styles.glowBorder} />

        {/* Top Meta: Rank & Date */}
        <div className={styles.topMeta}>
          <span className={styles.rankLabel}>{rankLabel}</span>
          <span className={styles.dateLabel}>{formattedDate}</span>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.programHeader}>
            <span className={styles.categoryBadge}>{category}</span>
            <div className={styles.programTitleWrapper}>
              <h3 className={styles.programTitle} title={draw.program}>
                {draw.program}
              </h3>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>CRS Cutoff</p>
              <div className={styles.statValueRow}>
                <Hash size={16} className={styles.statIcon} />
                <span className={styles.statValue}>{NA(draw.crs_cutoff)}</span>
              </div>
            </div>

            <div className={styles.statBox}>
              <p className={styles.statLabel}>Invitations</p>
              <div className={styles.statValueRow}>
                <Users size={16} className={styles.statIcon} />
                <span className={styles.statValue}>
                  {draw.invitations ? Number(draw.invitations).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.roundNumber}>#{NA(draw.round)}</span>
          {renderFooterContent()}
        </div>
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
export default function DrawCardsGrid({ onNavigateToTab }: DrawCardsGridProps) {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await fetch("/api/draws", { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch draws");

        const data: Draw[] = await res.json();

        // Relaxed sorting logic
        const validDraws = data
          .filter((d) => dayjs(d.draw_date).isValid())
          .sort(
            (a, b) =>
              dayjs(b.draw_date).valueOf() -
              dayjs(a.draw_date).valueOf()
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
    <div className={styles.pageWrapper}>
      {/* Top Section with seamless background */}
      <div className={styles.resultsContainer}>
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

        {/* More Data / Analytics Button */}
        <div className={styles.moreButtonContainer}>
          <button
            onClick={() => onNavigateToTab?.("CRS Scores")}
            className={styles.moreButton}
          >
            <div className={styles.moreButtonGlow} />
            <Activity size={20} className={styles.moreButtonIcon} />
            <span className={styles.moreButtonText}>More Analytics & Historical Data</span>
            <div className={styles.moreButtonBadge}>
              <Hash size={14} />
            </div>
          </button>
        </div>
      </div>

      {/* Canada PNP Map */}
      <section className={styles.mapSection}>
        <CanadaPNPMap />
      </section>
      <ChatBot />
    </div>
  );
}
