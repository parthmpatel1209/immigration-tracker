"use client";

import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import {
  Users,
  Hash,
  MapPin,
  Activity,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import styles from "./DrawCardsGrid.module.css";
import CanadaPNPMap from "./CanadaPNPMap";
import ChatBot from "@/components/ChatBot";
import AdSenseAd from "@/components/AdSenseAd";
import Sparkline from "./home/Sparkline";

dayjs.extend(relativeTime);

// ──────────────────────────────────────────────────────────────
// Types & Interfaces
// ──────────────────────────────────────────────────────────────
interface Draw {
  id: number;
  round: string;
  program: string;
  draw_province: string | null;
  crs_cutoff?: string | null;
  invitations?: string | null;
  draw_date: string;
  category?: string;
  delta?: number;
}

interface DrawCardsGridProps {
  onNavigateToTab?: (tabName: string, subView?: string) => void;
}

// Category Badge Color Mapping
const BADGE_CLASSES: Record<string, string> = {
  "Express Entry": styles.badgeEE,
  PNP: styles.badgePNP,
  CEC: styles.badgeCEC,
  FSW: styles.badgeFSW,
  STEM: styles.badgeSTEM,
  French: styles.badgeFrench,
  Healthcare: styles.badgeHealthcare,
  Trade: styles.badgeTrade,
  General: styles.badgeGeneral,
};

// Helper: Display "N/A" for null/undefined/empty
const NA = (value: any, fallback = "N/A"): string => {
  if (value == null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
};

// Program Categorization Helper
const getProgramCategory = (program: string): string => {
  const p = program.toLowerCase();
  if (p.includes("stem")) return "STEM";
  if (p.includes("french") || p.includes("francophone")) return "French";
  if (p.includes("provincial") || p.includes("pnp")) return "PNP";
  if (p.includes("healthcare")) return "Healthcare";
  if (p.includes("trade")) return "Trade";
  if (p.includes("canadian experience class") || p.includes("cec")) return "CEC";
  if (p.includes("federal skilled worker") || p.includes("fsw")) return "FSW";
  return "General";
};

// Pre-compute score deltas compared to the previous draw of the same category
const computeDeltas = (rawDraws: Draw[]): Draw[] => {
  // Sort oldest first to calculate changes progressively
  const chronDraws = [...rawDraws].sort(
    (a, b) => dayjs(a.draw_date).valueOf() - dayjs(b.draw_date).valueOf()
  );

  const lastCrsByProgram: Record<string, number> = {};

  const drawsWithDelta = chronDraws.map((d) => {
    const category = getProgramCategory(d.program);
    const currentCrs = Number(d.crs_cutoff);
    let delta = 0;

    if (!isNaN(currentCrs) && d.crs_cutoff != null) {
      const lastCrs = lastCrsByProgram[d.program];
      if (lastCrs !== undefined) {
        delta = currentCrs - lastCrs;
      }
      lastCrsByProgram[d.program] = currentCrs;
    }

    return {
      ...d,
      category,
      delta,
    };
  });

  // Return sorted newest first
  return drawsWithDelta.sort(
    (a, b) => dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
  );
};

export default function DrawCardsGrid({ onNavigateToTab }: DrawCardsGridProps) {
  const [allDraws, setAllDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode
  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Fetch Draws data
  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await fetch("/api/draws", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch draws");
        const data: Draw[] = await res.json();

        // Filter out invalid dates and compute deltas
        const processed = computeDeltas(
          data.filter((d) => d.draw_date && dayjs(d.draw_date).isValid())
        );

        setAllDraws(processed);
      } catch (err) {
        console.error("Error fetching draws:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDraws();
  }, []);

  // Federal Express Entry draws only (provincial rounds use a different score scale)
  const federalDraws = useMemo(
    () => allDraws.filter((d) => /^express entry/i.test(d.program) && Number(d.crs_cutoff) > 0),
    [allDraws]
  );

  // Latest federal draw; falls back to any draw if none are federal
  const latestDraw = useMemo(() => {
    return federalDraws[0] || allDraws[0] || null;
  }, [federalDraws, allDraws]);

  // Latest round for each federal program, with a short score history
  const programCards = useMemo(() => {
    const byProgram = new Map<string, Draw[]>();
    for (const d of federalDraws) {
      const list = byProgram.get(d.program) ?? [];
      list.push(d);
      byProgram.set(d.program, list);
    }
    return [...byProgram.values()]
      .map((list) => ({
        latest: list[0],
        history: list.slice(0, 10).reverse().map((d) => Number(d.crs_cutoff)),
        count: list.length,
      }))
      .sort((a, b) => dayjs(b.latest.draw_date).valueOf() - dayjs(a.latest.draw_date).valueOf())
      .slice(0, 8);
  }, [federalDraws]);

  const programLabel = (p: string) =>
    p.replace(/^Express Entry\s*[-–—:]\s*/i, "").replace(/\(.*?\)/g, "").trim();

  return (
    <div className={styles.pageWrapper}>
      {/* Decorative Canvas Background Elements */}
      <div className={styles.glowCanvas} aria-hidden="true">
        <div className={styles.canvasBlobRed}></div>
        <div className={styles.canvasBlobBlue}></div>
      </div>

      <div className={styles.resultsContainer}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <span className={styles.sectionLabel}>Express Entry & PNP</span>
          <h1 className={styles.pageTitle}>Draw Results</h1>
          <p className={styles.pageSubtitle}>
            <RefreshCw size={13} className={styles.syncIcon} />
            {loading ? (
              "Loading latest draw parameters..."
            ) : latestDraw ? (
              <>
                Last updated {dayjs(latestDraw.draw_date).format("MMMM DD, YYYY")} · Source:{" "}
                <a
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  IRCC Official
                </a>
              </>
            ) : (
              "No draws loaded."
            )}
          </p>
        </div>

        {/* Latest Draw Large Hero Card */}
        <div className={styles.latestCardContainer}>
          {loading ? (
            <div className={styles.skeletonHeroCard}>
              <div className={styles.skelBadge}></div>
              <div className={styles.skelMetrics}></div>
            </div>
          ) : latestDraw ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.latestHeroCard}
            >
              <div className={styles.cardGlowBorder} />
              <div className={styles.heroCardHeader}>
                <div className={styles.heroBadgeRow}>
                  <span className={styles.heroCardBadge}>Latest federal draw</span>
                  {latestDraw.round && String(latestDraw.round).trim() !== "" && (
                    <span className={styles.heroDrawNumber}>Round #{latestDraw.round}</span>
                  )}
                </div>
                <span className={styles.heroDrawDate}>
                  {dayjs(latestDraw.draw_date).format("MMMM D, YYYY")}
                </span>
              </div>

              <div className={styles.heroMetricsGrid}>
                {/* Score */}
                <div className={styles.heroMetricItem}>
                  <span className={styles.heroMetricLabel}>CRS Cutoff Score</span>
                  <div className={styles.heroMetricValueRow}>
                    <Hash size={24} className={styles.heroMetricIcon} />
                    <span className={styles.heroMetricValue}>{NA(latestDraw.crs_cutoff)}</span>
                  </div>
                </div>

                {/* Invitations */}
                <div className={styles.heroMetricItem}>
                  <span className={styles.heroMetricLabel}>Invitations Issued</span>
                  <div className={styles.heroMetricValueRow}>
                    <Users size={24} className={styles.heroMetricIcon} />
                    <span className={styles.heroMetricValue}>
                      {latestDraw.invitations != null
                        ? Number(latestDraw.invitations).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Score change Comparison */}
                <div className={styles.heroMetricItem}>
                  <span className={styles.heroMetricLabel}>vs Prev (Same Program)</span>
                  <div className={styles.heroMetricValueRow}>
                    <Activity size={24} className={styles.heroMetricIcon} />
                    {latestDraw.delta !== undefined ? (
                      <span
                        className={`${styles.heroMetricValue} ${
                          latestDraw.delta > 0
                            ? styles.deltaUp
                            : latestDraw.delta < 0
                            ? styles.deltaDown
                            : styles.deltaFlat
                        }`}
                      >
                        {latestDraw.delta > 0 ? "+" : ""}
                        {latestDraw.delta === 0 ? "No change" : latestDraw.delta}
                      </span>
                    ) : (
                      <span className={styles.heroMetricValue}>—</span>
                    )}
                  </div>
                  <span className={styles.comparisonSub}>
                    {latestDraw.delta !== undefined && latestDraw.delta > 0
                      ? "Score increased"
                      : latestDraw.delta !== undefined && latestDraw.delta < 0
                      ? "Score decreased"
                      : ""}
                  </span>
                </div>
              </div>

              <div className={styles.heroCardFooter}>
                <div className={styles.heroCardProgram}>
                  <strong>Program:</strong> {programLabel(latestDraw.program)}
                  {latestDraw.draw_province && (
                    <span className={styles.heroProvinceTag}>
                      <MapPin size={12} />
                      {latestDraw.draw_province}
                    </span>
                  )}
                </div>
                <div className={styles.heroCardActions}>
                  <button
                    onClick={() => onNavigateToTab?.("CRS Scores", "analytics")}
                    className={styles.compareBtn}
                  >
                    Compare Trends
                  </button>
                  <a
                    href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceExternalBtn}
                  >
                    IRCC Source <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className={styles.emptyHero}>No draws data found.</div>
          )}
        </div>
      </div>

      {/* Latest round per program */}
      {programCards.length > 0 && (
        <section className={styles.programSection}>
          <div className={styles.programHead}>
            <span className={styles.sectionLabel}>By program</span>
            <h2 className={styles.programTitle}>Latest round in each stream</h2>
          </div>
          <div className={styles.programGrid}>
            {programCards.map(({ latest, history, count }, i) => {
              const delta = latest.delta ?? 0;
              return (
                <motion.article
                  key={latest.program}
                  className={styles.programCard}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 4) * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <header>
                    <h3 title={latest.program}>{programLabel(latest.program)}</h3>
                    <time dateTime={latest.draw_date}>{dayjs(latest.draw_date).format("MMM D, YYYY")}</time>
                  </header>
                  <div className={styles.programScoreRow}>
                    <span className={styles.programScore}>{NA(latest.crs_cutoff)}</span>
                    {delta !== 0 && (
                      <span className={`${styles.programDelta} ${delta < 0 ? styles.deltaDown : styles.deltaUp}`}>
                        {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
                      </span>
                    )}
                  </div>
                  <div className={styles.programSpark}>
                    <Sparkline values={history} height={44} />
                  </div>
                  <footer>
                    <span>
                      <b>{latest.invitations != null ? Number(latest.invitations).toLocaleString() : "N/A"}</b> invitations
                    </span>
                    <span>{count} {count === 1 ? "round" : "rounds"}</span>
                  </footer>
                </motion.article>
              );
            })}
          </div>
        </section>
      )}

      {/* Canada PNP Map */}
      <AdSenseAd adSlot="8160396935" style={{ margin: "1.5rem auto", maxWidth: "900px" }} />
      <section className={styles.mapSection}>
        <CanadaPNPMap />
      </section>
      <ChatBot />
    </div>
  );
}
