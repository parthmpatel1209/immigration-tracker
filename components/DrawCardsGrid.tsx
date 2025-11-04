// components/DrawCardsGrid.tsx
"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Users, Hash, MapPin } from "lucide-react";
import styles from "./DrawCardsGrid.module.css";
import CanadaPNPMap from "./CanadaPNPMap";

interface Draw {
  id: number;
  round: number;
  program: string;
  province?: string;
  crs_cutoff: number;
  invitations: number;
  draw_date: string;
}

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

function DrawCard({ draw, rank }: { draw: Draw; rank: 1 | 2 | 3 }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsDark(root.getAttribute("data-theme") === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const badge = BADGE_COLORS[draw.program] ?? BADGE_COLORS.default;
  const colors = isDark ? badge.dark : badge.light;
  const date = dayjs(draw.draw_date, "MM/DD/YYYY").format("MMM D, YYYY");
  const rankText =
    rank === 1 ? "Latest" : rank === 2 ? "2nd Latest" : "3rd Latest";

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

        <header className={styles.header}>
          <h3 className={styles.title}>{rankText} Draw</h3>
          <span className={styles.badge}>{draw.program}</span>
        </header>

        <div className={styles.crs}>
          <Hash
            style={{
              color: isDark ? "#93c5fd" : "#3b82f6",
            }}
          />
          <span className={styles.crsValue}>{draw.crs_cutoff}</span>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <Users className={styles.iconSm} />
            <span>{draw.invitations.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <Calendar className={styles.iconSm} />
            <span>{date}</span>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>Round #{draw.round}</span>
          {draw.province && (
            <>
              <span className={styles.sep}> • </span>
              <span className={styles.province}>
                <MapPin className={styles.provIcon} />
                {draw.province}
              </span>
            </>
          )}
        </footer>
      </div>
    </motion.div>
  );
}

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

export default function DrawCardsGrid() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await fetch("/api/draws");
        const data: Draw[] = await res.json();

        const sorted = data
          .filter((d) => dayjs(d.draw_date, "MM/DD/YYYY", true).isValid())
          .sort(
            (a, b) =>
              dayjs(b.draw_date, "MM/DD/YYYY").valueOf() -
              dayjs(a.draw_date, "MM/DD/YYYY").valueOf()
          );

        setDraws(sorted.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDraws();
  }, []);

  return (
    <div>
      <div className={styles.root}>
        {/* Cards Grid */}
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
            draws.map((draw, i) => (
              <DrawCard key={draw.id} draw={draw} rank={(i + 1) as 1 | 2 | 3} />
            ))
          )}
        </div>
      </div>
      <section className={styles.mapSection}>
        <div>
          <CanadaPNPMap />
        </div>
      </section>
    </div>
  );
}
