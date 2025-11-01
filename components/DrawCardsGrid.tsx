// components/DrawCardsGrid.tsx
"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Users, Hash, MapPin } from "lucide-react";

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
      className="__drawcard__card"
      style={
        {
          "--badge-bg": colors.bg,
          "--badge-text": colors.text,
        } as React.CSSProperties
      }
    >
      <div className="__drawcard__glass">
        <div className="__drawcard__glow" />

        <header className="__drawcard__header">
          <h3 className="__drawcard__title">{rankText} Draw</h3>
          <span className="__drawcard__badge">{draw.program}</span>
        </header>

        <div className="__drawcard__crs">
          <Hash className="__drawcard__icon" />
          <span className="__drawcard__crsvalue">{draw.crs_cutoff}</span>
        </div>

        <div className="__drawcard__stats">
          <div className="__drawcard__stat">
            <Users className="__drawcard__iconsm" />
            <span>{draw.invitations.toLocaleString()}</span>
          </div>
          <div className="__drawcard__stat">
            <Calendar className="__drawcard__iconsm" />
            <span>{date}</span>
          </div>
        </div>

        <footer className="__drawcard__footer">
          <span>Round #{draw.round}</span>
          {draw.province && (
            <>
              <span className="__drawcard__sep"> • </span>
              <span className="__drawcard__province">
                <MapPin className="__drawcard__provicon" />
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
    <div className="__drawcard__card">
      <div className="__drawcard__glass">
        <header className="__drawcard__header">
          <div className="skeleton __drawcard__skeleton_title" />
          <div className="skeleton __drawcard__skeleton_badge" />
        </header>
        <div className="__drawcard__crs">
          <div className="skeleton __drawcard__skeleton_icon" />
          <div className="skeleton __drawcard__skeleton_crs" />
        </div>
        <div className="__drawcard__stats">
          <div className="__drawcard__stat">
            <div className="skeleton __drawcard__skeleton_iconsm" />
            <div className="skeleton __drawcard__skeleton_value" />
          </div>
          <div className="__drawcard__stat">
            <div className="skeleton __drawcard__skeleton_iconsm" />
            <div className="skeleton __drawcard__skeleton_value" />
          </div>
        </div>
        <footer className="__drawcard__footer">
          <div className="skeleton __drawcard__skeleton_footer" />
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
    <div className="__drawcard__root">
      <div className="__drawcard__grid">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : draws.length === 0 ? (
          <p className="__drawcard__empty">No draw data available.</p>
        ) : (
          draws.map((draw, i) => (
            <DrawCard key={draw.id} draw={draw} rank={(i + 1) as 1 | 2 | 3} />
          ))
        )}
      </div>

      {/* 100% ISOLATED CSS - NO CONFLICTS */}
      <style jsx global>{`
        /* Root */
        .__drawcard__root {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 2rem 1rem;
          box-sizing: border-box;
        }

        /* Grid */
        .__drawcard__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(21rem, 1fr));
          gap: 2rem;
          max-width: 82rem;
          width: 100%;
          margin: 0 auto;
        }

        /* Card */
        .__drawcard__card {
          --radius: 1.5rem;
          --gap: 1.5rem;
          --blur: 14px;
          max-width: 23rem;
          width: 100%;
          margin: 0 auto;
        }

        .__drawcard__glass {
          position: relative;
          padding: var(--gap);
          border-radius: var(--radius);
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(var(--blur));
          -webkit-backdrop-filter: blur(var(--blur));
          border: 1px solid rgba(255, 255, 255, 0.32);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.11);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        [data-theme="dark"] .__drawcard__glass {
          background: rgba(15, 23, 42, 0.5);
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
        }

        .__drawcard__glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          opacity: 0;
          filter: blur(22px);
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .__drawcard__card:hover .__drawcard__glow {
          opacity: 0.3;
        }

        /* Header */
        .__drawcard__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .__drawcard__title {
          font-size: 1.15rem;
          font-weight: 700;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .__drawcard__badge {
          padding: 0.28rem 0.7rem;
          font-size: 0.72rem;
          font-weight: 600;
          border-radius: 9999px;
          background: var(--badge-bg);
          color: var(--badge-text);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* CRS */
        .__drawcard__crs {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1.1rem;
          background: rgba(59, 130, 246, 0.18);
          border-radius: 1.1rem;
          border: 1px solid rgba(59, 130, 246, 0.32);
          margin-bottom: 1.1rem;
        }
        [data-theme="dark"] .__drawcard__crs {
          background: rgba(139, 92, 246, 0.24);
          border-color: rgba(139, 92, 246, 0.38);
        }
        .__drawcard__icon {
          width: 1.3rem;
          height: 1.3rem;
          color: #3b82f6;
        }
        [data-theme="dark"] .__drawcard__icon {
          color: #93c5fd;
        }
        .__drawcard__crsvalue {
          font-size: 2.1rem;
          font-weight: 800;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Stats */
        .__drawcard__stats {
          display: flex;
          justify-content: space-between;
          gap: 1.1rem;
          margin-bottom: 1.1rem;
        }
        .__drawcard__stat {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4b5563;
        }
        [data-theme="dark"] .__drawcard__stat {
          color: #e5e7eb;
        }
        .__drawcard__iconsm {
          width: 1.15rem;
          height: 1.15rem;
          color: #6b7280;
        }
        [data-theme="dark"] .__drawcard__iconsm {
          color: #9ca3af;
        }

        /* Footer */
        .__drawcard__footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.78rem;
          color: #6b7280;
          font-weight: 500;
        }
        [data-theme="dark"] .__drawcard__footer {
          color: #9ca3af;
        }
        .__drawcard__sep {
          opacity: 0.65;
        }
        .__drawcard__province {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.16rem 0.55rem;
          background: #8b5cf6;
          color: white;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .__drawcard__provicon {
          width: 0.85rem;
          height: 0.85rem;
        }

        /* Empty */
        .__drawcard__empty {
          grid-column: 1 / -1;
          text-align: center;
          color: #6b7280;
          font-size: 1.1rem;
          margin-top: 1rem;
        }
        [data-theme="dark"] .__drawcard__empty {
          color: #9ca3af;
        }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e5e7eb 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: __drawcard_pulse 1.6s ease-in-out infinite;
          border-radius: 0.5rem;
        }
        [data-theme="dark"] .skeleton {
          background: linear-gradient(
            90deg,
            #1f2937 25%,
            #374151 50%,
            #1f2937 75%
          );
        }
        @keyframes __drawcard_pulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .__drawcard__skeleton_title {
          height: 1.3rem;
          width: 52%;
        }
        .__drawcard__skeleton_badge {
          height: 1.3rem;
          width: 4.8rem;
          border-radius: 9999px;
        }
        .__drawcard__skeleton_icon {
          width: 1.3rem;
          height: 1.3rem;
        }
        .__drawcard__skeleton_crs {
          height: 2.3rem;
          flex: 1;
        }
        .__drawcard__skeleton_iconsm {
          width: 1.15rem;
          height: 1.15rem;
        }
        .__drawcard__skeleton_value {
          height: 1.05rem;
          flex: 1;
        }
        .__drawcard__skeleton_footer {
          height: 0.95rem;
          width: 65%;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
