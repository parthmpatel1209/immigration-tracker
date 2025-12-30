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
import { MobileNewsCarouselGrouped } from "./MobileNewsCarouselGrouped";

const ITEMS_PER_PAGE = 15;

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
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
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

  const fetchNews = async (currentOffset: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setTranslating(true);
    } else {
      setFetchingMore(true);
    }

    try {
      // Build URL with filters
      let url = `/api/news?language=${selectedLanguage}&limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`;
      if (filterProps.year) url += `&year=${filterProps.year}`;
      if (filterProps.month) url += `&month=${filterProps.month}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");

      const response = await res.json();
      const newItems = response.items || [];
      const total = response.total || 0;

      setTotalCount(total);

      if (reset) {
        setNews(newItems);
      } else {
        setNews((prev) => {
          // Filter out duplicates based on ID
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNewItems = newItems.filter((n: NewsItem) => !existingIds.has(n.id));
          return [...prev, ...uniqueNewItems];
        });
      }

      // Check if there's more data (if we got less than requested, no more data)
      setHasMore(newItems.length === ITEMS_PER_PAGE);

    } catch (err) {
      console.error("Failed to load news:", err);
      if (reset) setNews([]);
    } finally {
      setLoading(false);
      setTranslating(false);
      setFetchingMore(false);
    }
  };

  // Initial fetch - load first 15 items
  useEffect(() => {
    setOffset(0);
    fetchNews(0, true);
  }, [selectedLanguage]);

  // Refetch when filters change
  useEffect(() => {
    if (filterProps.month || filterProps.year) {
      setOffset(0);
      fetchNews(0, true);
    }
  }, [filterProps.month, filterProps.year]);

  // Handler for Load More - load next 15 items
  const handleLoadMore = () => {
    const newOffset = offset + ITEMS_PER_PAGE;
    setOffset(newOffset);
    fetchNews(newOffset, false);
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

      {selectedNewsItem && (
        <NewsModal
          item={selectedNewsItem}
          allItems={news}
          onClose={handleCloseModal}
          onNavigate={handleNavigateModal}
        />
      )}

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
          <NewsGrid news={filterProps.specificDate ? filtered : news} darkMode={darkMode} theme={theme} />
        </div>
      ) : (
        <div className={styles.mobileFeedWrapper}>
          <MobileNewsCarouselGrouped
            news={filterProps.specificDate ? filtered : news}
            darkMode={darkMode}
            theme={theme}
            onItemClick={handleNewsItemClick}
          />
        </div>
      )}

      {/* Footer: Showing X of Y */}
      {!isMobile && (
        <NewsFooter
          total={totalCount}
          shown={news.length}
          theme={theme}
        />
      )}

      {/* Load More Button */}
      {hasMore && !filterProps.specificDate && (
        <div className={styles.loadMoreWrapper}>
          <button
            className={styles.loadMoreModern}
            onClick={handleLoadMore}
            disabled={fetchingMore}
          >
            {fetchingMore ? (
              <span className={styles.loaderSmall}></span>
            ) : (
              <span>Load More News</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

