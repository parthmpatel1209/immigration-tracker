"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ImmigrationNews.module.css";
import { NewsItem } from "./types";
import { DateCalendar } from "./DateCalendar";

interface NewsTickerProps {
  items: NewsItem[];
  onItemClick?: (item: NewsItem) => void;
  onDateFilter?: (date: Date | null) => void;
}

export function NewsTicker({ items, onItemClick, onDateFilter }: NewsTickerProps) {
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
  const tickerElements: Array<{ type: 'date' | 'news'; content: string; item?: NewsItem }> = [];
  groupedByDate.forEach((group) => {
    if (group.date) {
      tickerElements.push({ type: 'date', content: group.date });
    }
    group.items.forEach((item) => {
      tickerElements.push({
        type: 'news',
        content: item.title_text || item.title,
        item
      });
    });
  });

  // Duplicate for seamless loop
  const loopedElements = [...tickerElements, ...tickerElements];

  const duration = tickerElements.length * 30; // slow & smooth

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [isPaused, setPaused] = useState(false);

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ x: 0, y: 0 });

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

  const handleDateClick = (e: React.MouseEvent, dateStr: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setCalendarPosition({ x: rect.left, y: rect.bottom + 10 });
    setShowCalendar(true);

    // Pause the ticker when calendar is open
    setPaused(true);
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleDateSelect = (date: Date) => {
    if (onDateFilter) {
      onDateFilter(date);
    }
    setShowCalendar(false);
    // Resume ticker
    setPaused(false);
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <div className={styles.tickerModernWrapper}>
      {/* Fades */}
      <div className={styles.tickerFadeLeft}></div>
      <div className={styles.tickerFadeRight}></div>

      {/* Calendar Popup - Rendered via Portal to escape overflow/backdrop-filter context */}
      {showCalendar && createPortal(
        <DateCalendar
          onDateSelect={handleDateSelect}
          onClose={() => {
            setShowCalendar(false);
            setPaused(false);
            if (trackRef.current) {
              trackRef.current.style.animationPlayState = "running";
            }
          }}
          position={calendarPosition}
          maxDate={new Date()} // Cannot select future dates
        />,
        document.body
      )}

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
              <span
                key={`date-${index}`}
                className={`${styles.tickerDateLabel} ${styles.clickableDate}`}
                onClick={(e) => handleDateClick(e, element.content)}
              >
                {element.content}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginLeft: '4px', opacity: 0.7 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            );
          } else {
            return (
              <span
                key={`news-${index}`}
                className={styles.tickerModernItem}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging && element.item && onItemClick) {
                    onItemClick(element.item);
                  }
                }}
                style={{ cursor: onItemClick ? 'pointer' : 'grab' }}
              >
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
