"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./NewsModal.module.css";
import { NewsItem } from "./types";

interface NewsModalProps {
    item: NewsItem | null;
    allItems: NewsItem[];
    onClose: () => void;
    onNavigate: (direction: "prev" | "next") => void;
}

export function NewsModal({ item, allItems, onClose, onNavigate }: NewsModalProps) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (item) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [item, onClose]);

    // Navigate with arrow keys
    const handleKeyNav = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") onNavigate("prev");
            if (e.key === "ArrowRight") onNavigate("next");
        },
        [onNavigate]
    );

    useEffect(() => {
        if (item) {
            document.addEventListener("keydown", handleKeyNav);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyNav);
        };
    }, [item, handleKeyNav]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !item) return null;

    const currentIndex = allItems.findIndex((n) => n.id === item.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allItems.length - 1;

    const getRelativeDate = (dateStr?: string): string => {
        if (!dateStr) return "Date not available";
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        return date.toLocaleDateString("en", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Navigation Arrows */}
                {hasPrev && (
                    <button
                        className={`${styles.navBtn} ${styles.navBtnPrev}`}
                        onClick={() => onNavigate("prev")}
                        aria-label="Previous news"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {hasNext && (
                    <button
                        className={`${styles.navBtn} ${styles.navBtnNext}`}
                        onClick={() => onNavigate("next")}
                        aria-label="Next news"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {/* Content Container */}
                <div className={styles.content}>
                    {/* Left: Image */}
                    <div className={styles.imageSection}>
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
                                    <polyline points="21 15 16 10 5 21" strokeWidth="2" />
                                </svg>
                                <p>No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className={styles.detailsSection}>
                        {/* Program Badge */}
                        {item.program && (
                            <div className={styles.programBadge}>
                                {item.program}
                            </div>
                        )}

                        {/* Title */}
                        <h2 className={styles.title}>{item.title_text || item.title}</h2>

                        {/* Date */}
                        <div className={styles.date}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                            </svg>
                            <span>{getRelativeDate(item.published_at)}</span>
                        </div>

                        {/* Summary */}
                        <div className={styles.summary}>
                            <p>{item.summary || "No summary available."}</p>
                        </div>

                        {/* Source Link */}
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.readMoreLink}
                            >
                                Read Full Article
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        )}

                        {/* Counter */}
                        <div className={styles.counter}>
                            {currentIndex + 1} / {allItems.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
