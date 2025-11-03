"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Filter, X } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source?: string;
  published_at?: string;
  url?: string;
  program?: string;
}

// ───── Color Map for Programs ─────
const PROGRAM_COLORS: Record<
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

export default function ImmigrationNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // ───── Detect dark mode from <html class="dark"> ─────
  useEffect(() => {
    const checkDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode(); // Initial check

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ───── Fetch News ─────
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
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  // ───── Filter News by Month & Year ─────
  useEffect(() => {
    let updated = [...news];

    if (year) {
      updated = updated.filter((n) => {
        const nYear = n.published_at
          ? new Date(n.published_at).getFullYear().toString()
          : "";
        return nYear === year;
      });
    }

    if (month) {
      updated = updated.filter((n) => {
        const nMonth = n.published_at
          ? (new Date(n.published_at).getMonth() + 1)
              .toString()
              .padStart(2, "0")
          : "";
        return nMonth === month;
      });
    }

    setFiltered(updated);
  }, [month, year, news]);

  // ───── Unique Years ─────
  const uniqueYears = useMemo(() => {
    return Array.from(
      new Set(
        news
          .map((n) =>
            n.published_at
              ? new Date(n.published_at).getFullYear().toString()
              : ""
          )
          .filter(Boolean)
      )
    ).sort((a, b) => Number(b) - Number(a));
  }, [news]);

  // ───── Get Badge Style ─────
  const getBadgeStyle = (program?: string) => {
    const colors = program
      ? PROGRAM_COLORS[program] || PROGRAM_COLORS.default
      : PROGRAM_COLORS.default;
    return darkMode
      ? { backgroundColor: colors.darkBg, color: colors.darkText }
      : { backgroundColor: colors.lightBg, color: colors.lightText };
  };

  // ───── Loading State ─────
  if (loading) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          color: darkMode ? "#d1d5db" : "#374151",
          fontSize: "0.875rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        Loading latest news...
      </div>
    );
  }

  // ───── Empty State ─────
  if (news.length === 0) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          color: darkMode ? "#9ca3af" : "#6b7280",
          fontSize: "0.875rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        No news available right now.
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%" }}>
      {/* Header + Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Immigration News
          </h2>
          <Filter style={{ width: "14px", height: "14px", color: "#6366f1" }} />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {/* Month Filter */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: darkMode ? "#d1d5db" : "#374151",
                marginBottom: "0.25rem",
              }}
            >
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
                borderRadius: "0.375rem",
                backgroundColor: darkMode ? "#1f2937" : "white",
                color: darkMode ? "#f3f4f6" : "#111827",
                minWidth: "140px",
              }}
            >
              <option value="">All</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: darkMode ? "#d1d5db" : "#374151",
                marginBottom: "0.25rem",
              }}
            >
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
                borderRadius: "0.375rem",
                backgroundColor: darkMode ? "#1f2937" : "white",
                color: darkMode ? "#f3f4f6" : "#111827",
                minWidth: "100px",
              }}
            >
              <option value="">All</option>
              {uniqueYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(month || year) && (
            <button
              onClick={() => {
                setMonth("");
                setYear("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                backgroundColor: darkMode ? "#374151" : "#e5e7eb",
                color: darkMode ? "#d1d5db" : "#374151",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X style={{ width: "14px", height: "14px" }} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* News List */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "0.5rem",
                padding: "1rem",
                backgroundColor: darkMode ? "#1f2937" : "white",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0,0,0,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")
              }
            >
              {/* Title */}
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: darkMode ? "#f3f4f6" : "#111827",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h3>

              {/* Summary */}
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: darkMode ? "#f3f4f6" : "#111827",
                  marginBottom: "0.5rem",
                }}
              >
                {item.summary}
              </h3>

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  color: darkMode ? "#9ca3af" : "#6b7280",
                  marginBottom: "0.5rem",
                }}
              >
                {item.source && <span>{item.source}</span>}
                {item.published_at && (
                  <>
                    <span>•</span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <Calendar style={{ width: "12px", height: "12px" }} />
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                  </>
                )}
                {item.program && (
                  <>
                    <span>•</span>
                    <span
                      style={{
                        ...getBadgeStyle(item.program),
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.7rem",
                        fontWeight: "500",
                      }}
                    >
                      {item.program}
                    </span>
                  </>
                )}
              </div>

              {/* Read More */}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                    color: "#4f46e5",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  Read more
                  <ExternalLink style={{ width: "14px", height: "14px" }} />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: darkMode ? "#9ca3af" : "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          No news found for selected filters.
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: darkMode ? "#9ca3af" : "#6b7280",
        }}
      >
        Showing <strong>{filtered.length}</strong> of{" "}
        <strong>{news.length}</strong> articles
      </div>
    </div>
  );
}
