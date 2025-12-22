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
import { NewsModal } from "./NewsModal";
import { MobileNewsFeed } from "./MobileNewsFeed";

const ITEMS_PER_PAGE = 20;

const LIGHT = {
  bgPrimary: "#ffffff",
  bgCard: "#ffffff",
  bgSecondary: "#ffffff",
  bgTertiary: "#f3f4f6",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
} as const;

const DARK = {
  bgPrimary: "#0f172a",
  bgCard: "#1e293b",
  bgSecondary: "#0f172a",
  bgTertiary: "#334155",
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
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

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

  // Mobile detection
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchNews = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setTranslating(true);
    } else {
      setFetchingMore(true);
    }

    try {
      const res = await fetch(`/api/news?language=${selectedLanguage}&page=${pageNum}&limit=${ITEMS_PER_PAGE}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const newItems = data || [];

      if (reset) {
        setNews(newItems);
      } else {
        setNews((prev) => [...prev, ...newItems]);
      }

      setHasMore(newItems.length === ITEMS_PER_PAGE);
      setPage(pageNum);

    } catch (err) {
      console.error("Failed to load news:", err);
      if (reset) setNews([]);
    } finally {
      setLoading(false);
      setTranslating(false);
      setFetchingMore(false);
    }
  };

  // Initial fetch using the function
  useEffect(() => {
    fetchNews(1, true);
  }, [selectedLanguage]);

  // Handler for Load More
  const handleLoadMore = () => {
    fetchNews(page + 1, false);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleNewsItemClick = (item: NewsItem) => {
    setSelectedNewsItem(item);
  };

  const handleCloseModal = () => {
    setSelectedNewsItem(null);
  };

  const handleNavigateModal = (direction: "prev" | "next") => {
    if (!selectedNewsItem) return;
    const currentIndex = news.findIndex((n) => n.id === selectedNewsItem.id);
    if (direction === "prev" && currentIndex > 0) {
      setSelectedNewsItem(news[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < news.length - 1) {
      setSelectedNewsItem(news[currentIndex + 1]);
    }
  };

  // We show all filtered items now, as pagination is server-side (kind of) + client side append
  // But wait, if we filter by Year/Month on client side, it only filters loaded items.
  // The 'filtered' array is what we show.

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
        theme={theme}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        translating={translating}
      />

      <NewsFilters show={showFilters} theme={theme} {...filterProps} />

      {!isMobile && (
        <NewsTicker
          items={news}
          onItemClick={handleNewsItemClick}
          onDateFilter={filterProps.setSpecificDate}
        />
      )}

      {/* Conditional Rendering based on Device Type */}
      {!isMobile ? (
        <div className={styles.desktopGridWrapper}>
          <NewsGrid news={filtered} darkMode={darkMode} theme={theme} />
        </div>
      ) : (
        <div className={styles.mobileFeedWrapper}>
          <MobileNewsFeed
            news={filtered}
            darkMode={darkMode}
            theme={theme}
            onItemClick={handleNewsItemClick}
          />
        </div>
      )}

      {/* Footer: Showing X of Y */}
      <NewsFooter
        total={filtered.length} // This shows total LOADED and FILTERED
        shown={filtered.length}
        theme={theme}
      />

      {/* Load More Button */}
      {hasMore && !filterProps.hasActiveFilters && (
        <div className={styles.loadMoreWrapper}>
          <button
            className={styles.loadMoreModern}
            onClick={handleLoadMore}
            disabled={fetchingMore}
          >
            {fetchingMore ? (
              <span className={styles.loaderSmall}></span>
            ) : (
              <span>Load More</span>
            )}
          </button>
        </div>
      )}

      {/* News Modal */}
      <NewsModal
        item={selectedNewsItem}
        allItems={news}
        onClose={handleCloseModal}
        onNavigate={handleNavigateModal}
      />
    </div>
  );
}

