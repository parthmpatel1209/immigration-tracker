"use client";

import { useState, useRef } from "react";
import styles from "./ImmigrationNews.module.css";

interface NewsTickerProps {
  items: { title: string; published_at?: string }[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (!items || items.length === 0) return null;

  const getRelativeDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en", { month: "short", day: "numeric" });
  };

  // Group items by date
  const groupedByDate: { date: string; items: typeof items }[] = [];
  items.forEach((item) => {
    const dateLabel = getRelativeDate(item.published_at);
    const existing = groupedByDate.find((g) => g.date === dateLabel);
    if (existing) {
      existing.items.push(item);
    } else {
      groupedByDate.push({ date: dateLabel, items: [item] });
    }
  });

  // Create flattened array with date separators
  const tickerElements: Array<{ type: 'date' | 'news'; content: string; item?: typeof items[0] }> = [];
  groupedByDate.forEach((group) => {
    if (group.date) {
      tickerElements.push({ type: 'date', content: group.date });
    }
    group.items.forEach((item) => {
      tickerElements.push({ type: 'news', content: item.title, item });
    });
  });

  // Duplicate for seamless loop
  const loopedElements = [...tickerElements, ...tickerElements];

  const duration = tickerElements.length * 30; // slow & smooth

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    startDrag(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    moveDrag(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    moveDrag(e.clientX);
  };

  const handleMouseUp = () => {
    endDrag();
  };

  const handleMouseLeave = () => {
    if (isDragging) endDrag();
  };

  const [isPaused, setPaused] = useState(false);

  // --- SHARED LOGIC ---
  const startDrag = (clientX: number) => {
    setDragging(true);
    setStartX(clientX);
    if (trackRef.current) {
      const computed = window.getComputedStyle(trackRef.current);
      const matrix = new WebKitCSSMatrix(computed.transform);
      setScrollX(matrix.m41); // current translateX
      trackRef.current.style.animationPlayState = "paused";
      trackRef.current.style.cursor = "grabbing";
    }
  };

  const moveDrag = (clientX: number) => {
    if (!isDragging || !trackRef.current) return;
    const delta = clientX - startX;
    trackRef.current.style.transform = `translateX(${scrollX + delta}px)`;
  };

  const endDrag = () => {
    setDragging(false);
    if (trackRef.current) {
      // Only resume if NOT manually paused
      if (!isPaused) {
        trackRef.current.style.animationPlayState = "running";
      }
      trackRef.current.style.transform = ""; // resume CSS animation
      trackRef.current.style.cursor = "grab";
    }
  };

  const handleClick = () => {
    if (isDragging) return; // Ignore clicks if we were dragging
    const newPaused = !isPaused;
    setPaused(newPaused);
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = newPaused ? "paused" : "running";
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {loopedElements.map((element, index) => {
          if (element.type === 'date') {
            return (
              <span key={`date-${index}`} className={styles.tickerDateLabel}>
                {element.content}
              </span>
            );
          } else {
            return (
              <span key={`news-${index}`} className={styles.tickerModernItem}>
                <span className={styles.liveDot}></span>
                <span className={styles.tickerItemTitle}>{element.content}</span>
              </span>
            );
          }
        })}
      </div>
    </div>
  );
}
