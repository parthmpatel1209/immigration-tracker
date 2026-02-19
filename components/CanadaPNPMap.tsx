"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Rocket, AlertCircle } from "lucide-react";
import styles from "./CanadaPNPMap.module.css";

type Province = {
  id: string;
  code: string;
  name: string;
  total: number;
  filled: number;
  remaining: number;
  bonus_points: number;
  bonus_note: string | null;
  note: string | null;
  source_url: string | null;
  updated_at: string;
};

export default function CanadaPNPMap() {
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  /* ------------------- FETCH ------------------- */
  useEffect(() => {
    fetch("/api/pnpdata", { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((data) => {
        setProvinces(data);
        const latest = data.reduce((a: any, b: any) =>
          new Date(a.updated_at) > new Date(b.updated_at) ? a : b
        );
        setLastUpdated(new Date(latest.updated_at).toLocaleString("en-CA"));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = provinces.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const getProgressColor = (ratio: number) => {
    if (ratio >= 0.9) return styles.progRed;
    if (ratio >= 0.7) return styles.progOrange;
    if (ratio >= 0.5) return styles.progYellow;
    return styles.progGreen;
  };

  /* ------------------- LOADING ------------------- */
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading 2026 PNP Quotas...
          </p>
        </div>
      </div>
    );
  }

  /* ------------------- ERROR ------------------- */
  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorBox}>
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle size={32} />
            <h3 className="text-xl font-bold">Error</h3>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  /* ------------------- MAIN UI ------------------- */
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className={styles.headerTitle}>Canada PNP Quotas 2026</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Latest Provincial Nominee Program allocations
          </p>
        </header>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search by province or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Stats Summary */}
        <div className={styles.statsGrid}>
          {[
            {
              label: "Total Nominations",
              value: provinces
                .reduce((a, p) => a + p.total, 0)
                .toLocaleString(),
            },
            {
              label: "Filled",
              value: provinces
                .reduce((a, p) => a + p.filled, 0)
                .toLocaleString(),
            },
            {
              label: "Remaining",
              value: provinces
                .reduce((a, p) => a + p.remaining, 0)
                .toLocaleString(),
              extraCls: styles.statRemaining,
            },
            {
              label: "Quota Boost",
              value: provinces.reduce((a, p) => a + p.bonus_points, 0),
              icon: Rocket,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={styles.statCard}
            >
              <div className={`${styles.statValue} ${stat.extraCls || ""}`}>
                {stat.icon && (
                  <stat.icon
                    className="inline-block mr-2 text-yellow-500"
                    size={28}
                  />
                )}
                {stat.value}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Province Cards */}
        <div className={styles.cardsGrid}>
          {filtered.map((p, idx) => {
            const filledRatio = p.total > 0 ? p.filled / p.total : 0;
            const isFull = p.remaining === 0 && p.total > 0;

            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={styles.card}
              >
                {/* Header: Name + Code + Status */}
                <div className={styles.cardHeader}>
                  <div className="flex items-center gap-2">
                    <h3 className={styles.provinceName}>{p.name}</h3>
                    <span className={styles.codeBadge}>{p.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.bonus_points > 0 && (
                      <div className={styles.bonusBadge} title={`Bonus: +${p.bonus_points}`}>
                        <Rocket size={12} />
                        <span>+{p.bonus_points}</span>
                      </div>
                    )}
                    {isFull && <span className={styles.fullBadge}>FULL</span>}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  {p.total === 0 ? (
                    <div className={styles.noPnp}>
                      {p.note || "No PNP Program"}
                    </div>
                  ) : (
                    <>
                      {/* Stats Row: Total | Filled | Remaining */}
                      <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Total</span>
                          <span className={styles.statValueCompact}>{p.total.toLocaleString()}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Filled</span>
                          <span className={styles.statValueCompact}>{p.filled.toLocaleString()}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Remaining</span>
                          <span className={`${styles.statValueCompact} ${styles.textGreen}`}>
                            {p.remaining.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* "Reveal" Gradient Progress Bar */}
                      <div className="mt-4 mb-3">
                        <div className="flex justify-between text-xs font-medium" style={{ marginBottom: '0.75rem' }}>
                          <span className="text-gray-700 dark:text-gray-200">
                            Quota Usage {Math.round(filledRatio * 100)}%
                          </span>
                        </div>
                        <div className={styles.revealProgressTrack}>
                          {/* The Full Gradient (Fixed underneath) */}
                          <div className={styles.revealProgressGradient} />

                          {/* The Mask (Slides from left to right to reveal gradient? No, slides from Right to Left to un-cover) */}
                          {/* Actually, it's easier to just animate the Width of a container that Holds the Gradient, 
                              and the Gradient inside that container is W-Full of the PARENT (Track). 
                              No, that squeezes. 
                              The 'Mask' approach: Overlay a gray div on the right. */}
                          <motion.div
                            className={styles.revealProgressMask}
                            initial={{ width: "100%" }}
                            animate={{ width: `${100 - (filledRatio * 100)}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Streams / Target Draws Note */}
                      {(p.bonus_note || p.note) && (
                        <div className={styles.streamNote}>
                          {p.bonus_note && p.note
                            ? `${p.bonus_note} + ${p.note}`
                            : p.bonus_note || p.note
                          }
                        </div>
                      )}
                      {p.source_url && (
                        <div className="mt-3 text-right">
                          <a
                            href={p.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.sourceLink}
                          >
                            Source <ExternalLink size={12} className="ml-1" />
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>
            Last updated: <strong>{lastUpdated}</strong> • Data from official
            provincial sources
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
