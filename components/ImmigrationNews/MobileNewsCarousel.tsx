"use client";

import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

import { NewsItem, PROGRAM_COLORS } from "./types";

interface Props {
    news: NewsItem[];
    darkMode: boolean;
    theme: any;
    onItemClick?: (item: NewsItem) => void;
}

const MobileNewsCarousel = ({
    news,
    darkMode,
    theme,
    onItemClick
}: Props) => {

    if (news.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                No news found.
            </div>
        );
    }

    const getRelativeDate = (dateStr?: string): string => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString("en", { month: "short", day: "numeric" });
    };

    const css = `
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.5rem;
    color: #fff;
  }
  .swiper-pagination-bullet {
    background-color: ${darkMode ? '#fff' : '#000'} !important;
  }
  .news-card-shadow {
     box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
  }
  `;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center overflow-hidden py-4"
        >
            <style>{css}</style>

            {/* Fixed-size wrapper to constrain Swiper */}
            <div style={{ width: '260px', height: '380px', maxWidth: '85vw' }}>
                <Swiper
                    effect={"cards"}
                    grabCursor={true}
                    modules={[EffectCards, Navigation, Pagination]}
                    style={{ width: '100%', height: '100%' }}
                    cardsEffect={{
                        perSlideOffset: 8,
                        perSlideRotate: 2,
                        slideShadows: false,
                    }}
                >
                    {news.map((item, index) => {
                        const dateLabel = getRelativeDate(item.published_at);
                        const badgeColor = item.program
                            ? (PROGRAM_COLORS[item.program as keyof typeof PROGRAM_COLORS] || PROGRAM_COLORS.default)
                            : PROGRAM_COLORS.default;

                        const badgeBg = darkMode ? badgeColor.dark : badgeColor.light;

                        return (
                            <SwiperSlide
                                key={item.id}
                                className="bg-white dark:bg-slate-800 rounded-3xl news-card-shadow relative overflow-hidden"
                                onClick={() => onItemClick && onItemClick(item)}
                            >
                                {/* Compact Header Image */}
                                {item.image_url ? (
                                    <div className="absolute top-0 left-0 w-full h-[140px] overflow-hidden">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                                    </div>
                                ) : (
                                    <div className="absolute top-0 left-0 w-full h-[140px] bg-gradient-to-br from-blue-600 to-indigo-800">
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>
                                )}

                                {/* Card Background */}
                                <div className="absolute inset-0 bg-white dark:bg-slate-800" />

                                {/* Date Label (Top Right) */}
                                <div className="absolute top-3 right-3 z-30">
                                    <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg border border-white/20">
                                        {dateLabel}
                                    </span>
                                </div>

                                {/* Content Section */}
                                <div className="absolute top-[140px] left-0 w-full p-4 text-left z-20 flex flex-col gap-2">
                                    {/* Program Badge */}
                                    {item.program && (
                                        <span
                                            className="inline-block px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider w-fit"
                                            style={{
                                                backgroundColor: badgeBg,
                                                color: '#fff',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {item.program}
                                        </span>
                                    )}

                                    <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-white mb-1 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-3 font-normal leading-relaxed">
                                        {item.summary}
                                    </p>

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 dark:text-gray-400">
                                            <span>{item.source || "News"}</span>
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            <ChevronRightIcon className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </motion.div>
    );
};

export { MobileNewsCarousel };
