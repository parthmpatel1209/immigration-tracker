// components/pr-pathways/PathwayCard.tsx
"use client";

import { useState } from "react";
import { ProvinceSlide } from "./slides/ProvinceSlide";
import { RequirementsSlide } from "./slides/RequirementsSlide";
import { SummarySlide } from "./slides/SummarySlide";
import { CarouselNav } from "./CarouselNav";
import styles from "./PRPathways.module.css";

interface PathwayCardProps {
  pathway: any;
  darkMode: boolean;
}

export function PathwayCard({ pathway: p, darkMode }: PathwayCardProps) {
  const [slide, setSlide] = useState(0);
  const total = 3;

  const next = () => setSlide((s) => (s + 1) % total);
  const prev = () => setSlide((s) => (s - 1 + total) % total);
  const goTo = (i: number) => setSlide(i);

  // Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };

  return (
    <div
      className={`${styles.card} ${
        darkMode ? styles.darkCard : styles.lightCard
      }`}
    >
      <div
        className={styles.carouselContainer}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div className={`${styles.slide} ${slide === 0 ? styles.active : ""}`}>
          <ProvinceSlide p={p} darkMode={darkMode} />
        </div>
        <div className={`${styles.slide} ${slide === 1 ? styles.active : ""}`}>
          <RequirementsSlide p={p} darkMode={darkMode} />
        </div>
        <div className={`${styles.slide} ${slide === 2 ? styles.active : ""}`}>
          <SummarySlide p={p} darkMode={darkMode} />
        </div>

        {/* Unified Navigation (no duplicates!) */}
        <CarouselNav
          currentSlide={slide}
          totalSlides={total}
          onPrev={prev}
          onNext={next}
          onGoTo={goTo}
        />
      </div>
    </div>
  );
}
