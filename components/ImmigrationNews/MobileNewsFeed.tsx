"use client";

import { useState } from "react";
import { NewsItem, PROGRAM_COLORS } from "./types";
import styles from "./MobileNewsFeed.module.css";
import { ExternalLink, Calendar, ChevronRight } from "lucide-react";

interface Props {
    news: NewsItem[];
    darkMode: boolean;
    theme: any;
    onItemClick?: (item: NewsItem) => void;
}

export function MobileNewsFeed({ news, darkMode, theme, onItemClick }: Props) {
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

    const getBadgeColor = (program?: string) => {
        const { light, dark } = program
            ? PROGRAM_COLORS[program] ?? PROGRAM_COLORS.default
            : PROGRAM_COLORS.default;
        return darkMode ? dark : light;
    };

    if (news.length === 0) {
        return (
            <div className={styles.noResults} style={{ color: theme.textMuted, textAlign: 'center', padding: '2rem' }}>
                No news found.
            </div>
        );
    }

    return (
        <div className={styles.feed}>
            {news.map((item) => (
                <article
                    key={item.id}
                    className={styles.card}
                    onClick={() => onItemClick && onItemClick(item)}
                >
                    {/* Image Section */}
                    <div className={styles.imageContainer}>
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className={styles.image}
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    const ph = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (ph) ph.style.display = "flex";
                                }}
                            />
                        ) : null}
                        <div
                            className={styles.placeholder}
                            style={{ display: item.image_url ? "none" : "flex" }}
                        >
                            No Image
                        </div>

                        {/* Overlay with Title and Date */}
                        <div className={styles.imageOverlay}>
                            <h3 className={styles.overlayTitle}>{item.title}</h3>
                            <div className={styles.overlayMeta}>
                                <Calendar size={12} style={{ opacity: 0.9 }} />
                                {getRelativeDate(item.published_at)}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className={styles.content}>
                        {/* Program Badge */}
                        {item.program && (
                            <div style={{ display: 'flex' }}>
                                <span
                                    className={styles.badge}
                                    style={{
                                        backgroundColor: darkMode
                                            ? `${getBadgeColor(item.program)}20`
                                            : `${getBadgeColor(item.program)}15`,
                                        color: getBadgeColor(item.program),
                                    }}
                                >
                                    {item.program}
                                </span>
                            </div>
                        )}

                        {/* Title removed from here, now in overlay */}

                        <p className={styles.summary}>{item.summary}</p>

                        <div className={styles.footer}>
                            <div className={styles.meta}>
                                {item.source && <span>{item.source}</span>}
                            </div>

                            <div className={styles.readMore}>
                                Read More <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
