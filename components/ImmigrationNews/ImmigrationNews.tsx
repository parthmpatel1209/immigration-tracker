"use client";

import { useEffect, useState } from "react";
import styles from "./ImmigrationNews.module.css";
import { NewsItem } from "./types";
import { useNewsFilters } from "./hooks/useNewsFilters";
import { NewsHeader } from "./NewsHeader";
import { NewsFilters } from "./NewsFilters";
import { NewsGrid } from "./NewsGrid";
import { NewsFooter } from "./NewsFooter";
import { NewsTicker } from "./NewsTicker";

const ITEMS_PER_PAGE = 30; // ✅ REQUIRED CONSTANT

const LIGHT = {
  bgPrimary: "#ffffff",
  bgCard: "#ffffff",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
} as const;

const DARK = {
  bgPrimary: "#0f172a",
  bgCard: "#1e293b",
  textPrimary: "#f1f5f9",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  border: "#334155",
} as const;

export default function ImmigrationNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE); // ✅ initial 30 items

  const theme = darkMode ? DARK : LIGHT;

  const { filtered, ...filterProps } = useNewsFilters(news);

  // Dark mode detection
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

  // Fetch news
  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (mounted) setNews(data || []);
      } catch (err) {
        console.error("Failed to load news:", err);
        if (mounted) setNews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filterProps.month, filterProps.year]);

  const visibleNews = filtered.slice(0, visibleCount); // 👈 only show this many

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p style={{ color: theme.textMuted }}>Loading latest news...</p>
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary }}
    >
      <NewsHeader
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      <NewsFilters show={showFilters} theme={theme} {...filterProps} />

      <NewsTicker
        items={news.map((n) => ({
          title: n.title_text || n.title,
          published_at: n.published_at,
        }))}
      />

      {/* Visible news only */}
      <NewsGrid news={visibleNews} darkMode={darkMode} theme={theme} />

      {/* Footer: Showing X of Y */}
      <NewsFooter
        total={filtered.length}
        shown={visibleNews.length}
        theme={theme}
      />

      {/* Load More Button */}
      {visibleCount < filtered.length && (
        <div className={styles.loadMoreWrapper}>
          <button
            className={styles.loadMoreModern}
            onClick={() => setVisibleCount((v) => v + ITEMS_PER_PAGE)}
          >
            <span>Load More</span>
          </button>
        </div>
      )}
    </div>
  );
}
