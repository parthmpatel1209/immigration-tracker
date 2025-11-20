"use client";

import { useState, useRef } from "react";
import styles from "./ImmigrationNews.module.css";

interface NewsTickerProps {
  items: { title: string }[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (!items || items.length === 0) return null;

  const titles = items.map((n) => n.title);
  const loopedTitles = [...titles, ...titles];

  const duration = titles.length * 30; // slow & smooth

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  // Pause auto-scroll when touched
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    setStartX(e.touches[0].clientX);
    if (trackRef.current) {
      const computed = window.getComputedStyle(trackRef.current);
      const matrix = new WebKitCSSMatrix(computed.transform);
      setScrollX(matrix.m41); // current translateX
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  // Manual drag movement
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !trackRef.current) return;

    const delta = e.touches[0].clientX - startX;

    trackRef.current.style.transform = `translateX(${scrollX + delta}px)`;
  };

  // Resume auto-scroll when released
  const handleTouchEnd = () => {
    setDragging(false);

    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
      trackRef.current.style.transform = ""; // resume CSS animation
    }
  };

  return (
    <div className={styles.tickerModernWrapper}>
      {/* Fades */}
      <div className={styles.tickerFadeLeft}></div>
      <div className={styles.tickerFadeRight}></div>

      {/* Ticker Track */}
      <div
        ref={trackRef}
        className={styles.tickerModernTrack}
        style={{ animationDuration: `${duration}s` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loopedTitles.map((title, index) => (
          <span key={index} className={styles.tickerModernItem}>
            <span className={styles.liveDot}></span>
            {title}
          </span>
        ))}
      </div>
    </div>
  );
}
