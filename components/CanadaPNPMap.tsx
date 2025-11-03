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
    fetch("/api/pnpdata")
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
    if (ratio >= 0.9) return "bg-red-500";
    if (ratio >= 0.7) return "bg-orange-500";
    if (ratio >= 0.5) return "bg-yellow-500";
    return "bg-green-500";
  };

  /* ------------------- LOADING ------------------- */
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading 2025 PNP Quotas...
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
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className={styles.headerTitle}>Canada PNP Quotas 2025</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time Provincial Nominee Program allocations
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
              label: "Bonus Points",
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
                {/* Bonus badge */}
                {p.bonus_points > 0 && (
                  <div className={styles.bonusBadge}>
                    <Rocket size={14} />+{p.bonus_points}
                  </div>
                )}

                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>
                    <div>
                      <h3>{p.name}</h3>
                      <span className={styles.cardCode}>{p.code}</span>
                    </div>
                    {isFull && <span className={styles.fullBadge}>FULL</span>}
                  </div>

                  {p.total === 0 ? (
                    <div className={styles.noPnp}>
                      {p.note || "No PNP Program"}
                    </div>
                  ) : (
                    <>
                      {/* Progress */}
                      <div className={styles.progressWrapper}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${filledRatio * 100}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={`${styles.progressFill} ${getProgressColor(
                            filledRatio
                          )}`}
                        />
                        <div className={styles.progressPercent}>
                          {Math.round(filledRatio * 100)}%
                        </div>
                      </div>

                      {/* Stats */}
                      <div className={styles.cardStats}>
                        <div>
                          <div className={styles.statNumber}>
                            {p.filled.toLocaleString()}
                          </div>
                          <div className={styles.statLabel}>Filled</div>
                        </div>
                        <div>
                          <div
                            className={`${styles.statNumber} ${styles.remainingNumber}`}
                          >
                            {p.remaining.toLocaleString()}
                          </div>
                          <div className={styles.statLabel}>Remaining</div>
                        </div>
                      </div>

                      <div className={styles.totalLine}>
                        Total:{" "}
                        <strong className={styles.totalNumber}>
                          {p.total.toLocaleString()}
                        </strong>
                      </div>

                      {/* Bonus note */}
                      {p.bonus_note && (
                        <div className={styles.bonusNote}>
                          {p.bonus_note} + {p.note}
                        </div>
                      )}

                      {/* Source */}
                      {p.source_url && (
                        <a
                          href={p.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceLink}
                        >
                          Official Source <ExternalLink size={14} />
                        </a>
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
