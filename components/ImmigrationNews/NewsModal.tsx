"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Calendar, ExternalLink, Play } from "lucide-react";
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
            document.body.style.overflow = "hidden";
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

    // Clean up "NA" fallback values
    const rawTitle = item.title_text || item.title;
    const cleanTitle = (rawTitle && rawTitle.trim() !== "NA" && rawTitle.trim() !== "")
        ? rawTitle
        : (item.program ? `${item.program} Update` : "Canada Immigration News");

    const rawSummary = item.summary;
    const cleanSummary = (rawSummary && rawSummary.trim() !== "NA" && rawSummary.trim() !== "")
        ? rawSummary
        : null;

    // Validate URL (filter out "NA.com" or "NA")
    const isValidArticleUrl = Boolean(
        item.url &&
        item.url.trim() !== "NA" &&
        item.url.trim() !== "NA.com" &&
        !item.url.includes("NA.com")
    );

    const isReel = item.media_type === "instagram_reel" || Boolean(item.instagram_reel_id);
    const reelId = item.instagram_reel_id || item.instagram_url?.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/)?.[1];

    const getRelativeDate = (dateStr?: string): string => {
        if (!dateStr) return "Latest Update";
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            {/* Outer Navigation Buttons (positioned on backdrop, never overlapping modal content) */}
            {hasPrev && (
                <button
                    className={`${styles.outerNavBtn} ${styles.outerNavBtnPrev}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate("prev");
                    }}
                    aria-label="Previous news"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {hasNext && (
                <button
                    className={`${styles.outerNavBtn} ${styles.outerNavBtnNext}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate("next");
                    }}
                    aria-label="Next news"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                {/* Content Layout */}
                <div className={styles.content}>
                    {/* Media Container (Reel Video / Image) */}
                    <div className={styles.mediaSection}>
                        {isReel && reelId ? (
                            <iframe
                                src={`https://www.instagram.com/reel/${reelId}/embed/`}
                                className={styles.reelIframe}
                                allow="encrypted-media"
                                loading="lazy"
                                title="Instagram Reel Player"
                            />
                        ) : item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={cleanTitle}
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.mediaPlaceholder}>
                                <Play size={48} className="text-red-500 opacity-60 mb-2" />
                                <p>Immigration News</p>
                            </div>
                        )}
                    </div>

                    {/* Details Container */}
                    <div className={styles.detailsSection}>
                        <div className={styles.detailsHeader}>
                            {item.program && (
                                <span className={styles.programBadge}>
                                    {item.program}
                                </span>
                            )}
                            <div className={styles.dateMeta}>
                                <Calendar size={14} />
                                <span>{getRelativeDate(item.published_at)}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className={styles.title}>{cleanTitle}</h2>

                        {/* Summary */}
                        {cleanSummary && (
                            <div className={styles.summary}>
                                <p>{cleanSummary}</p>
                            </div>
                        )}

                        {/* Source / Meta Tag */}
                        {item.source && item.source !== "NA" && (
                            <div className={styles.sourceTag}>
                                Source: <span>{item.source}</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={styles.actionsGroup}>
                            {item.instagram_url && (
                                <a
                                    href={item.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.instaBtn}
                                >
                                    <Play size={16} fill="currentColor" />
                                    <span>Watch on Instagram</span>
                                </a>
                            )}

                            {isValidArticleUrl && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.articleBtn}
                                >
                                    <span>Read Article</span>
                                    <ExternalLink size={15} />
                                </a>
                            )}
                        </div>

                        {/* Counter Pill */}
                        <div className={styles.counterPill}>
                            {currentIndex + 1} of {allItems.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
