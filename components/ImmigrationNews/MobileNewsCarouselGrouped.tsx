"use client";

import React from "react";
import { ChevronRight, Layers, Play } from "lucide-react";
import { NewsItem, NewsVersion, PROGRAM_COLORS } from "./types";

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

const MobileNewsCarouselGrouped = ({
    news,
    darkMode,
    theme,
    onItemClick,
}: Props) => {
    if (news.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 gap-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                    No news available.
                </p>
            </div>
        );
    }

    const getRelativeDate = (
        dateStr?: string
    ): { label: string; daysAgo: number } => {
        if (!dateStr) return { label: "Recent", daysAgo: 999 };
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

        if (diffDays === 0) return { label: "Today", daysAgo: 0 };
        if (diffDays === 1) return { label: "Yesterday", daysAgo: 1 };
        if (diffDays < 7)
            return { label: `${diffDays} days ago`, daysAgo: diffDays };
        return {
            label: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
            daysAgo: diffDays,
        };
    };

    const groupedNews: GroupedNews[] = [];
    const seenLabels = new Set<string>();

    news.forEach((item) => {
        const { label, daysAgo } = getRelativeDate(item.published_at);
        if (!seenLabels.has(label)) {
            seenLabels.add(label);
            groupedNews.push({
                label,
                daysAgo,
                items: news.filter(
                    (n) => getRelativeDate(n.published_at).label === label
                ),
            });
        }
    });

    groupedNews.sort((a, b) => a.daysAgo - b.daysAgo);

    return (
        <div className="flex flex-col gap-48 pb-64 w-full overflow-hidden pt-8">
            {groupedNews.map((group) => (
                <div key={group.label} className="flex flex-col gap-10 w-full mb-12">
                    {/* Date Header */}
                    <div className="px-8">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-10">
                            {group.label}
                        </h2>
                    </div>

                    {/* Horizontal Scroller */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-8 gap-0.5 pt-4 pb-16 w-full">
                        {group.items.map((item) => {
                            const badgeColor = item.program
                                ? PROGRAM_COLORS[item.program as keyof typeof PROGRAM_COLORS] ||
                                PROGRAM_COLORS.default
                                : PROGRAM_COLORS.default;

                            const badgeBg = darkMode ? badgeColor.dark : badgeColor.light;
                            const badgeText = darkMode ? '#000' : '#fff';
                            const isReel = item.media_type === "instagram_reel" || Boolean(item.instagram_reel_id);

                            return (
                                <div
                                    key={item.id}
                                    className="flex-shrink-0 snap-center"
                                    style={{ width: 'min(86vw, 360px)' }}
                                >
                                    <div
                                        onClick={() => onItemClick && onItemClick(item)}
                                        className="relative h-[520px] w-full bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl transition-all active:scale-[0.98]"
                                    >
                                        {/* Image Content Only */}
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                style={{ width: '100%', height: '100%', transform: 'scale(1.05)' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                    const ph = e.currentTarget.nextElementSibling as HTMLElement;
                                                    if (ph) ph.style.display = "flex";
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white"
                                            style={{
                                                display: item.image_url ? "none" : "flex",
                                                background: isReel
                                                    ? "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)"
                                                    : "#1e293b"
                                            }}
                                        >
                                            {isReel ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Play size={48} fill="currentColor" />
                                                    <span className="font-extrabold text-lg tracking-wide">Instagram Reel</span>
                                                    <span className="text-xs opacity-80">Tap to watch video</span>
                                                </div>
                                            ) : (
                                                <Layers className="text-slate-600 w-8 h-8" />
                                            )}
                                        </div>

                                        {/* Subtle overlay for badge legibility */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                                        {/* Program Badge */}
                                        {item.program && (
                                            <div className="absolute top-6 left-6">
                                                <span
                                                    className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20"
                                                    style={{ backgroundColor: badgeBg, color: badgeText }}
                                                >
                                                    {item.program}
                                                </span>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            );
                        })}
                        <div className="w-8 flex-shrink-0" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export { MobileNewsCarouselGrouped };
