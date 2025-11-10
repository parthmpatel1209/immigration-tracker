// components/PRPathways.tsx
"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./PRPathways.module.css";

/* ────────────────────── SHARED TYPE & COLORS ────────────────────── */
export interface Pathway {
  id: number;
  province: string;
  program: string;
  summary: string;
  url?: string;
  status: string;
  key_requirements: string;
}

export const PROGRAM_COLORS: Record<
  string,
  { lightBg: string; lightText: string; darkBg: string; darkText: string }
> = {
  "Express Entry": {
    lightBg: "#e0e7ff",
    lightText: "#4338ca",
    darkBg: "#312e81",
    darkText: "#c7d2fe",
  },
  PNP: {
    lightBg: "#d1fae5",
    lightText: "#065f46",
    darkBg: "#064e3b",
    darkText: "#a7f3d0",
  },
  CEC: {
    lightBg: "#e9d5ff",
    lightText: "#6b21a8",
    darkBg: "#4c1d95",
    darkText: "#e9d5ff",
  },
  FSW: {
    lightBg: "#fef3c7",
    lightText: "#92400e",
    darkBg: "#78350f",
    darkText: "#fde68a",
  },
  default: {
    lightBg: "#e5e7eb",
    lightText: "#374151",
    darkBg: "#374151",
    darkText: "#d1d5db",
  },
};

/* ────────────────────── Carousel Card (same file) ────────────────────── */
function CarouselCard({ p, darkMode }: { p: Pathway; darkMode: boolean }) {
  const [slide, setSlide] = useState(0);
  const totalSlides = 3;

  const next = () => setSlide((s) => (s + 1) % totalSlides);
  const prev = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides);

  const badge = PROGRAM_COLORS[p.program] ?? PROGRAM_COLORS.default;
  const badgeStyle = darkMode
    ? {
        backgroundColor: badge.darkBg,
        color: badge.darkText,
        marginBottom: "0.75rem",
      }
    : {
        backgroundColor: badge.lightBg,
        color: badge.lightText,
        marginBottom: "0.75rem",
      };

  const statusBadge = darkMode
    ? {
        fontSize: "0.80rem",
        backgroundColor: "rgba(139, 92, 246, 0.15)",
        padding: "1rem",
        color: "#d8b4fe",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(139, 92, 246, 0.2)",
      }
    : {
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        color: "#4f46e5",
        border: "1px solid rgba(79, 70, 229, 0.25)",
        boxShadow: "0 0 6px rgba(79, 70, 229, 0.15)",
        borderRadius: "10px",
        padding: "1rem",
        fontSize: "0.80rem",
      };

  return (
    <div
      className={`${styles.card} ${darkMode ? styles.dark : ""}`}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        const glow = darkMode ? badge.darkBg : badge.lightBg;
        el.style.boxShadow = darkMode
          ? `0 20px 30px -10px ${glow}60, 0 8px 16px -6px rgba(0,0,0,0.4)`
          : `0 20px 30px -10px ${glow}60, 0 8px 16px -6px rgba(0,0,0,0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Carousel */}
      <div className={styles.carouselContainer}>
        {/* Slide 1 – Province & Badges */}
        <div className={`${styles.slide} ${slide === 0 ? styles.active : ""}`}>
          <h3
            className={`${styles.provinceTitle} ${
              darkMode ? styles.dark : styles.light
            }`}
          >
            {p.province}
          </h3>
          <div className={styles.badgeContainer}>
            <span className={styles.badge} style={badgeStyle}>
              {p.program}
            </span>
            <span className={styles.badge} style={statusBadge}>
              {p.status}
            </span>
          </div>
        </div>

        {/* Slide 2 – Key Points (bullet list) */}
        <div
          className={`${styles.slide} ${styles.requirements} ${
            slide === 1 ? styles.active : ""
          }`}
        >
          <h3
            className={`${styles.keyPoints} ${
              darkMode ? styles.dark : styles.light
            }`}
          >
            Key Points
          </h3>
          {p.key_requirements ? (
            <ul className={styles.bulletList}>
              {p.key_requirements
                .split(";")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
            </ul>
          ) : (
            "—"
          )}
        </div>

        {/* Slide 3 – Summary & Link */}
        <div
          className={`${styles.slide} ${styles.summary} ${
            slide === 2 ? styles.active : ""
          }`}
        >
          {p.summary || "—"}
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Learn more
              <ExternalLink className={styles.linkIcon} />
            </a>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <button onClick={prev} className={`${styles.navButton} ${styles.left}`}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className={`${styles.navButton} ${styles.right}`}>
        <ChevronRight size={20} />
      </button>

      {/* Progress bar */}
      <div className={styles.trackContainer}>
        <div className={styles.track}>
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`${styles.trackSegment} ${
                slide === i ? styles.active : ""
              } ${darkMode ? styles.dark : styles.light}`}
              aria-label={`Slide ${i + 1}`}
            >
              <span className={styles.trackFill} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── Main Page Component ────────────────────── */
export default function PRPathways() {
  const [list, setList] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState<string>("All");
  const [darkMode, setDarkMode] = useState(false);

  /* ── Dark-mode detection ── */
  useEffect(() => {
    const check = () =>
      setDarkMode(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* ── Fetch pathways ── */
  useEffect(() => {
    let mounted = true;
    const fetchPathways = async () => {
      try {
        const res = await fetch("/api/pathways");
        const data = (await res.json()) as Pathway[];
        if (mounted) setList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch pathways:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPathways();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={`pr-loading ${darkMode ? "dark" : ""}`}>
        Loading pathways...
      </div>
    );
  }
  if (list.length === 0) {
    return (
      <div className={`pr-empty ${darkMode ? "dark" : ""}`}>
        No pathways found.
      </div>
    );
  }

  const provinces = [
    "All",
    ...Array.from(new Set(list.map((p) => p.province))),
  ];
  const filtered =
    province === "All" ? list : list.filter((p) => p.province === province);

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>PR Pathways by Province</h2>
        <Filter
          width={14}
          height={14}
          stroke={darkMode ? "rgba(129,140,248,0.5)" : "rgba(79,70,229,0.35)"}
        />
      </div>

      {/* Province filter */}
      <div className={styles.filterSection}>
        <label
          className={`${styles.filterLabel} ${darkMode ? styles.dark : ""}`}
        >
          Filter by Province
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className={`${styles.filterSelect} ${darkMode ? styles.dark : ""}`}
          style={{
            borderColor: darkMode
              ? "rgba(129,140,248,0.5)"
              : "rgba(79,70,229,0.35)",
            backgroundColor: darkMode ? "#1f2937" : "white",
            color: darkMode ? "#f3f4f6" : "#111827",
          }}
        >
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of cards */}
      <div className={styles.grid}>
        {filtered.map((p) => (
          <CarouselCard key={p.id} p={p} darkMode={darkMode} />
        ))}
      </div>

      {/* Footer */}
      <div className={`${styles.footer} ${darkMode ? styles.dark : ""}`}>
        Showing <strong>{filtered.length}</strong> of{" "}
        <strong>{list.length}</strong> pathways
      </div>
    </div>
  );
}
