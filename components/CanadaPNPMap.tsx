"use client";
 
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ExternalLink,
  Rocket,
  AlertCircle,
  Grid,
  Table,
  ArrowUpDown,
} from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortField, setSortField] = useState<
    "name" | "total" | "filled" | "remaining" | "usage"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
 
  /* ------------------- FETCH ------------------- */
  useEffect(() => {
    fetch("/api/pnpdata", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((data) => {
        setProvinces(data);
        if (data && data.length > 0) {
          const latest = data.reduce((a: any, b: any) =>
            new Date(a.updated_at) > new Date(b.updated_at) ? a : b
          );
          setLastUpdated(new Date(latest.updated_at).toLocaleString("en-CA"));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
 
  const handleSort = (
    field: "name" | "total" | "filled" | "remaining" | "usage"
  ) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };
 
  const sortedAndFiltered = useMemo(() => {
    const list = provinces.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())
    );
 
    return list.sort((a, b) => {
      let valA: any = a[sortField === "usage" ? "filled" : sortField];
      let valB: any = b[sortField === "usage" ? "filled" : sortField];
 
      if (sortField === "usage") {
        valA = a.total > 0 ? a.filled / a.total : 0;
        valB = b.total > 0 ? b.filled / b.total : 0;
      }
 
      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return sortOrder === "asc" ? numA - numB : numB - numA;
      }
    });
  }, [provinces, search, sortField, sortOrder]);
 
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
 
        {/* Controls Row: Search Bar & Toggle View Button */}
        <div className={styles.controlsRow}>
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
 
          <div className={styles.toggleWrapper}>
            <button
              onClick={() => setViewMode("table")}
              className={`${styles.toggleBtn} ${
                viewMode === "table" ? styles.toggleBtnActive : ""
              }`}
              title="Table View"
            >
              <Table size={15} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`${styles.toggleBtn} ${
                viewMode === "grid" ? styles.toggleBtnActive : ""
              }`}
              title="Grid View"
            >
              <Grid size={15} />
              <span>Grid</span>
            </button>
          </div>
        </div>
 
        {/* Stats Summary Panel */}
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
              transition={{ delay: i * 0.05 }}
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
 
        {/* View Mode Conditional Output */}
        {viewMode === "table" ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th onClick={() => handleSort("name")} className={styles.th}>
                    <div className={styles.thContent}>
                      Province/Territory
                      <ArrowUpDown size={13} className={styles.sortIcon} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("total")}
                    className={`${styles.th} ${styles.textRight}`}
                  >
                    <div className={`${styles.thContent} ${styles.justifyEnd}`}>
                      Total Quota
                      <ArrowUpDown size={13} className={styles.sortIcon} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("filled")}
                    className={`${styles.th} ${styles.textRight}`}
                  >
                    <div className={`${styles.thContent} ${styles.justifyEnd}`}>
                      Filled
                      <ArrowUpDown size={13} className={styles.sortIcon} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("remaining")}
                    className={`${styles.th} ${styles.textRight}`}
                  >
                    <div className={`${styles.thContent} ${styles.justifyEnd}`}>
                      Remaining
                      <ArrowUpDown size={13} className={styles.sortIcon} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("usage")} className={styles.th}>
                    <div className={styles.thContent}>
                      Usage Rate
                      <ArrowUpDown size={13} className={styles.sortIcon} />
                    </div>
                  </th>
                  <th className={styles.th}>Priority Sectors / Streams</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {sortedAndFiltered.length > 0 ? (
                  sortedAndFiltered.map((p) => {
                    const filledRatio = p.total > 0 ? p.filled / p.total : 0;
                    const isFull = p.remaining === 0 && p.total > 0;
                    const hasNoPnp =
                      p.note?.toLowerCase().includes("no pnp") ||
                      p.note?.toLowerCase().includes("no provincial");
 
                    return (
                      <tr
                        key={p.id}
                        className={`${styles.tr} ${
                          isFull ? styles.trFull : ""
                        }`}
                      >
                        <td className={styles.td} data-label="Province">
                          <div className={styles.provinceCell}>
                            <span className={styles.codeBadge}>{p.code}</span>
                            <span className={styles.provinceNameText}>
                              {p.name}
                            </span>
                            {isFull && (
                              <span className={styles.fullBadgeCompact}>
                                FULL
                              </span>
                            )}
                            {p.bonus_points > 0 && (
                              <span
                                className={styles.bonusBadgeCompact}
                                title={`Bonus Quota Boost: +${p.bonus_points}`}
                              >
                                <Rocket size={10} /> +{p.bonus_points}
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className={`${styles.td} ${styles.textRight} font-mono`}
                          data-label="Total Quota"
                        >
                          {p.total > 0 ? p.total.toLocaleString() : "—"}
                        </td>
                        <td
                          className={`${styles.td} ${styles.textRight} font-mono`}
                          data-label="Filled"
                        >
                          {p.total > 0 ? p.filled.toLocaleString() : "—"}
                        </td>
                        <td
                          className={`${styles.td} ${styles.textRight} ${styles.textGreen} font-mono`}
                          data-label="Remaining"
                        >
                          {p.total > 0 ? p.remaining.toLocaleString() : "—"}
                        </td>
                        <td className={styles.td} data-label="Usage Rate">
                          {hasNoPnp ? (
                            <span className={styles.noPnpLabel}>N/A</span>
                          ) : p.total > 0 ? (
                            <div className={styles.tableProgressWrapper}>
                              <div className={styles.tableProgressTrack}>
                                <div
                                  className={`${styles.tableProgressFill} ${
                                    filledRatio >= 0.9
                                      ? styles.bgRed
                                      : filledRatio >= 0.7
                                      ? styles.bgOrange
                                      : filledRatio >= 0.5
                                      ? styles.bgYellow
                                      : styles.bgGreen
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      filledRatio * 100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className={styles.tableProgressPercent}>
                                {Math.round(filledRatio * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className={styles.pendingLabel}>Pending</span>
                          )}
                        </td>
                        <td
                          className={styles.td}
                          data-label="Priority Sectors"
                        >
                          <div className={styles.tableStreamsText}>
                            {p.bonus_note && p.note
                              ? `${p.bonus_note} · ${p.note}`
                              : p.bonus_note || p.note || "General streams"}
                          </div>
                        </td>
                        <td className={styles.td}>
                          {p.source_url && (
                            <a
                              href={p.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.tableSourceLink}
                              title="Official Source"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      No provincial nominee programs match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {sortedAndFiltered.length > 0 ? (
              sortedAndFiltered.map((p, idx) => {
                const filledRatio = p.total > 0 ? p.filled / p.total : 0;
                const isFull = p.remaining === 0 && p.total > 0;
 
                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
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
                          <div
                            className={styles.bonusBadge}
                            title={`Bonus: +${p.bonus_points}`}
                          >
                            <Rocket size={12} />
                            <span>+{p.bonus_points}</span>
                          </div>
                        )}
                        {isFull && (
                          <span className={styles.fullBadge}>FULL</span>
                        )}
                      </div>
                    </div>
 
                    <div className={styles.cardBody}>
                      {p.note?.toLowerCase().includes("no pnp") ||
                      p.note?.toLowerCase().includes("no provincial") ? (
                        <div className={styles.noPnp}>{p.note}</div>
                      ) : (
                        <>
                          {/* Stats Row: Total | Filled | Remaining */}
                          <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                              <span className={styles.statLabel}>Total</span>
                              <span className={styles.statValueCompact}>
                                {p.total > 0 ? p.total.toLocaleString() : "—"}
                              </span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statLabel}>Filled</span>
                              <span className={styles.statValueCompact}>
                                {p.total > 0 ? p.filled.toLocaleString() : "—"}
                              </span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statLabel}>Remaining</span>
                              <span
                                className={`${styles.statValueCompact} ${styles.textGreen}`}
                              >
                                {p.total > 0
                                  ? p.remaining.toLocaleString()
                                  : "—"}
                              </span>
                            </div>
                          </div>
 
                          {/* Progress Bar */}
                          <div className="mt-4 mb-3">
                            <div
                              className="flex justify-between text-xs font-medium"
                              style={{ marginBottom: "0.75rem" }}
                            >
                              <span className="text-gray-700 dark:text-gray-200">
                                {p.total > 0
                                  ? `Quota Usage ${Math.round(
                                      filledRatio * 100
                                    )}%`
                                  : "Quota data pending"}
                              </span>
                            </div>
                            <div className={styles.revealProgressTrack}>
                              {/* The Full Gradient (Fixed underneath) */}
                              <div className={styles.revealProgressGradient} />
                              {/* Mask overlay – covers unfilled portion */}
                              <motion.div
                                className={styles.revealProgressMask}
                                initial={{ width: "100%" }}
                                animate={{
                                  width:
                                    p.total > 0
                                      ? `${100 - filledRatio * 100}%`
                                      : "100%",
                                }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
 
                          {/* Streams / Target Draws Note */}
                          {(p.bonus_note || p.note) && (
                            <div className={styles.streamNote}>
                              {p.bonus_note && p.note
                                ? `${p.bonus_note} + ${p.note}`
                                : p.bonus_note || p.note}
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
                                Source{" "}
                                <ExternalLink size={12} className="ml-1" />
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div className={styles.emptyGridState}>
                No provincial nominee programs match your search query.
              </div>
            )}
          </div>
        )}
 
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
