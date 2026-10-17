"use client";

import React, { useState } from "react";
import { Layers, Play } from "lucide-react";
import { NewsItem } from "./types";
import styles from "./MobileNewsCarousel.module.css";

interface Props {
    news: NewsItem[];
    darkMode: boolean;
    theme: any;
    onItemClick?: (item: NewsItem) => void;
}

interface GroupedNews {
    label: string;
    items: NewsItem[];
    daysAgo: number;
}

const getRelativeDate = (dateStr?: string): { label: string; daysAgo: number } => {
    if (!dateStr) return { label: "Recent", daysAgo: 999 };
    const date = new Date(dateStr);
    const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (diffDays <= 0) return { label: "Today", daysAgo: 0 };
    if (diffDays === 1) return { label: "Yesterday", daysAgo: 1 };
    if (diffDays < 7) return { label: `${diffDays} days ago`, daysAgo: diffDays };
    return {
        label: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
        daysAgo: diffDays,
    };
};

function Poster({ item, onItemClick }: { item: NewsItem; onItemClick?: (item: NewsItem) => void }) {
    const [failed, setFailed] = useState(false);
    const isReel = item.media_type === "instagram_reel" || Boolean(item.instagram_reel_id);
    const showImage = Boolean(item.image_url) && !failed;

    return (
        <div className={styles.slide}>
            <button
                type="button"
                className={styles.poster}
                onClick={() => onItemClick?.(item)}
                aria-label={item.title_text || item.title}
            >
                {showImage && (
                    <img
                        src={item.image_url as string}
                        alt={item.title_text || item.title || ""}
                        className={styles.img}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailed(true)}
                    />
                )}
                <div className={`${styles.fallback} ${isReel ? styles.fallbackReel : ""} ${!showImage ? styles.fallbackShow : ""}`}>
                    {isReel ? (
                        <>
                            <Play size={40} fill="currentColor" />
                            <strong>Instagram Reel</strong>
                            <span>Tap to open</span>
                        </>
                    ) : (
                        <>
                            <Layers size={28} />
                            <span>{item.title_text || item.title}</span>
                        </>
                    )}
                </div>
                {item.program && <span className={styles.badge}>{item.program}</span>}
            </button>
        </div>
    );
}

const MobileNewsCarouselGrouped = ({ news, onItemClick }: Props) => {
    if (news.length === 0) {
        return <div className={styles.empty}>No news available.</div>;
    }

    const groups = new Map<string, GroupedNews>();
    for (const item of news) {
        const { label, daysAgo } = getRelativeDate(item.published_at);
        const g = groups.get(label) ?? { label, daysAgo, items: [] };
        g.items.push(item);
        groups.set(label, g);
    }
    const grouped = [...groups.values()].sort((a, b) => a.daysAgo - b.daysAgo);

    return (
        <div className={styles.wrap}>
            {grouped.map((group) => (
                <section key={group.label} className={styles.group}>
                    <div className={styles.groupHead}>
                        <h2 className={styles.groupTitle}>{group.label}</h2>
                        <span className={styles.groupCount}>
                            {group.items.length} {group.items.length === 1 ? "story" : "stories"}
                        </span>
                    </div>
                    <div className={`${styles.track} no-scrollbar`}>
                        {group.items.map((item) => (
                            <Poster key={item.id} item={item} onItemClick={onItemClick} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export { MobileNewsCarouselGrouped };
