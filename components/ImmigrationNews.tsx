"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ExternalLink, Filter, X } from "lucide-react";
import styles from "./ImmigrationNews.module.css";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source?: string;
  published_at?: string;
  url?: string;
  program?: string;
  image_url?: string;
}

/* ------------------------------------------------------------------ */
/* Badge colour map – light / dark values (used only in JSX)          */
/* ------------------------------------------------------------------ */
const PROGRAM_COLORS: Record<string, { light: string; dark: string }> = {
  "Express Entry": { light: "#4338ca", dark: "#c7d2fe" },
  PNP: { light: "#065f46", dark: "#a7f3d0" },
  CEC: { light: "#6b21a8", dark: "#e9d5ff" },
  FSW: { light: "#92400e", dark: "#fde68a" },
  default: { light: "#374151", dark: "#d1d5db" },
};

/* ------------------------------------------------------------------ */
/* Theme colour palette – defined once, reused everywhere            */
/* ------------------------------------------------------------------ */
const LIGHT = {
  bgPrimary: "#ffffff",
  bgSecondary: "#ffffff",
  bgCard: "#ffffff",
  bgTertiary: "#e5e7eb",
  bgTertiaryHover: "#d1d5db",
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  borderHover: "#d1d5db",
};

const DARK = {
  bgPrimary: "#0f172a",
  bgSecondary: "#1e293b",
  bgCard: "#1e293b",
  bgTertiary: "#374151",
  bgTertiaryHover: "#475569",
  textPrimary: "#f8fafc",
  textSecondary: "#e2e8f0",
  textMuted: "#94a3b8",
  border: "#334155",
  borderHover: "#475569",
};

export default function ImmigrationNews() {
  /* ------------------------------------------------- */
  /* State & refs                                      */
  /* ------------------------------------------------- */
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const theme = darkMode ? DARK : LIGHT;

  /* ------------------------------------------------- */
  /* Detect dark mode from <html class="dark">         */
  /* ------------------------------------------------- */
  useEffect(() => {
    const check = () =>
      setDarkMode(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  /* ------------------------------------------------- */
  /* Fetch news                                        */
  /* ------------------------------------------------- */
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (mounted && Array.isArray(data)) {
          setNews(data);
          setFiltered(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------- */
  /* Filter by month / year                            */
  /* ------------------------------------------------- */
  useEffect(() => {
    let list = [...news];
    if (year) {
      list = list.filter(
        (n) =>
          n.published_at &&
          new Date(n.published_at).getFullYear().toString() === year
      );
    }
    if (month) {
      list = list.filter(
        (n) =>
          n.published_at &&
          (new Date(n.published_at).getMonth() + 1)
            .toString()
            .padStart(2, "0") === month
      );
    }
    setFiltered(list);
  }, [month, year, news]);

  /* ------------------------------------------------- */
  /* Unique years                                      */
  /* ------------------------------------------------- */
  const uniqueYears = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => {
      if (n.published_at)
        set.add(new Date(n.published_at).getFullYear().toString());
    });
    return Array.from(set).sort((a, b) => +b - +a);
  }, [news]);

  /* ------------------------------------------------- */
  /* Badge colour helper                               */
  /* ------------------------------------------------- */
  const badgeColor = (program?: string) => {
    const { light, dark } = program
      ? PROGRAM_COLORS[program] ?? PROGRAM_COLORS.default
      : PROGRAM_COLORS.default;
    return darkMode ? dark : light;
  };

  /* ------------------------------------------------- */
  /* Swipe + click state                               */
  /* ------------------------------------------------- */
  const toggleFlip = (flipper: HTMLElement) => {
    const isFlipped = flipper.classList.contains(styles.flipped);
    flipper.classList.remove(styles.swiping);
    if (isFlipped) {
      flipper.classList.remove(styles.flipped);
    } else {
      flipper.classList.add(styles.flipped);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent, id: number) => {
    if (!touchStartX.current) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 30) {
      isSwiping.current = true;
      const flipper = e.currentTarget;
      if (deltaX < 0) {
        flipper.classList.add(styles.swiping);
      } else {
        flipper.classList.remove(styles.swiping);
      }
    }
  };

  const handleTouchEnd = (id: number) => {
    touchStartX.current = null;
    if (isSwiping.current) {
      isSwiping.current = false;
      const flipper = document
        .querySelector(`[data-card-id="${id}"]`)
        ?.closest(`.${styles.cardFlipper}`) as HTMLElement;
      if (flipper) toggleFlip(flipper);
    }
  };

  /* ------------------------------------------------- */
  /* Render                                            */
  /* ------------------------------------------------- */
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p style={{ color: theme.textMuted }}>Loading latest news...</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className={styles.empty} style={{ color: theme.textMuted }}>
        No news available right now.
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary }}
    >
      {/* ------------------- Header ------------------- */}
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Immigration News</h1>
        </div>

        <div className={styles.filters}>
          <Filter className={styles.filterIcon} />
          <div className={styles.filterGroup}>
            <label className={styles.label} style={{ color: theme.textMuted }}>
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={styles.select}
              style={{
                backgroundColor: theme.bgSecondary,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label} style={{ color: theme.textMuted }}>
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={styles.select}
              style={{
                backgroundColor: theme.bgSecondary,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
            >
              <option value="">All Years</option>
              {uniqueYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {(month || year) && (
            <button
              onClick={() => {
                setMonth("");
                setYear("");
              }}
              className={styles.clearButton}
              style={{
                backgroundColor: theme.bgTertiary,
                color: theme.textSecondary,
              }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </header>

      {/* ------------------- Grid ------------------- */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className={styles.card}
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.border,
              }}
            >
              <div
                data-card-id={item.id}
                className={`${styles.cardFlipper} ${
                  index < 3 ? styles.intro : ""
                }`}
                ref={(el) => {
                  if (el && index < 3) {
                    const timer = setTimeout(
                      () => el.classList.remove(styles.intro),
                      4000
                    );
                    return () => clearTimeout(timer);
                  }
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, item.id)}
                onTouchEnd={() => handleTouchEnd(item.id)}
                onClick={(e) => {
                  const flipper = e.currentTarget;
                  if (!isSwiping.current) toggleFlip(flipper);
                }}
              >
                {/* FRONT: Image */}
                <div className={styles.cardFront}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className={styles.cardImage}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const placeholder = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={styles.imagePlaceholder}
                    style={{ display: item.image_url ? "none" : "flex" }}
                  >
                    No Image
                  </div>
                </div>

                {/* BACK: Info */}
                {/* BACK: Info */}
                <div
                  className={styles.cardBack}
                  style={
                    {
                      "--bg-card": theme.bgCard,
                      "--text-primary": theme.textPrimary,
                      "--text-secondary": theme.textSecondary,
                      "--text-muted": theme.textMuted,
                    } as React.CSSProperties
                  }
                >
                  {/* Scrollable Content */}
                  <div className={styles.content}>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>

                  {/* Fixed Footer */}
                  <div className={styles.footer}>
                    <div className={styles.meta}>
                      {item.source && <span>{item.source}</span>}
                      {item.published_at && (
                        <>
                          {item.source && (
                            <span className={styles.dot}> • </span>
                          )}
                          <span className={styles.date}>
                            <Calendar size={12} />
                            {new Date(item.published_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                      {item.program && (
                        <>
                          {(item.source || item.published_at) && (
                            <span className={styles.dot}> • </span>
                          )}
                          <span
                            className={styles.badge}
                            style={{
                              backgroundColor: darkMode
                                ? `${badgeColor(item.program)}20`
                                : `${badgeColor(item.program)}15`,
                              color: badgeColor(item.program),
                            }}
                          >
                            {item.program}
                          </span>
                        </>
                      )}
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.readMore}
                      >
                        Read more
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.noResults} style={{ color: theme.textMuted }}>
          No news found for selected filters.
        </div>
      )}

      {/* ------------------- Footer ------------------- */}
      <footer className={styles.footer} style={{ color: theme.textMuted }}>
        Showing <strong>{filtered.length}</strong> of{" "}
        <strong>{news.length}</strong> articles
      </footer>
    </div>
  );
}
