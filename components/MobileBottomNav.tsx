"use client";

import React, { useEffect, useState } from "react";
import {
    Home,
    TrendingUp,
    BarChart3,
    Calculator,
    Newspaper,
    MoreHorizontal,
    Compass,
    Award,
    HelpCircle,
    Sparkles,
    Heart,
    Mail,
    Sun,
    Moon,
    X
} from "lucide-react";
import styles from "./MobileBottomNav.module.css";
import { useTheme } from "@/lib/useTheme";

interface TabItem {
    label: string;
    badge?: string;
    hidden?: boolean;
}

interface MobileBottomNavProps {
    activeIndex: number;
    onTabChange: (index: number) => void;
    tabs: TabItem[];
}

export default function MobileBottomNav({
    activeIndex,
    onTabChange,
    tabs
}: MobileBottomNavProps) {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { isDark, toggle: toggleTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Detect mobile viewport and dark mode
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 960);

        checkMobile();

        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // Intelligent scroll reveal behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always visible if scrolling up, near page top, or near bottom
            if (
                currentScrollY < lastScrollY ||
                currentScrollY < 100 ||
                (document.documentElement.scrollHeight - window.innerHeight - currentScrollY < 120)
            ) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 120 && !isMoreOpen) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isMoreOpen]);

    const handleTabClick = (index: number) => {
        onTabChange(index);
        setIsMoreOpen(false);

        const tabsSection = document.getElementById("tabs-section");
        if (tabsSection) {
            tabsSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Primary items displayed directly in the icon-only dock
    const primaryDockTabs = [
        { index: 0, label: "Home", icon: <Home size={20} strokeWidth={1.9} /> },
        { index: 1, label: "Draws", icon: <TrendingUp size={20} strokeWidth={1.9} /> },
        { index: 2, label: "Scores", icon: <BarChart3 size={20} strokeWidth={1.9} /> },
        { index: 3, label: "Calculator", icon: <Calculator size={20} strokeWidth={1.9} />, hasBadge: true },
        { index: 4, label: "News", icon: <Newspaper size={20} strokeWidth={1.9} /> },
    ];

    // Secondary items accessible via the expanding Liquid Glass drawer
    const moreDrawerTabs = [
        { index: 5, label: "My Journey", icon: <Compass size={17} strokeWidth={2.2} /> },
        { index: 7, label: "PR Pathways", icon: <Award size={17} strokeWidth={2.2} /> },
        { index: 8, label: "What Is...?", icon: <HelpCircle size={17} strokeWidth={2.2} /> },
        { index: 9, label: "Early Access", icon: <Sparkles size={17} strokeWidth={2.2} /> },
        { index: 10, label: "Support Us", icon: <Heart size={17} strokeWidth={2.2} /> },
        { index: 11, label: "Contact", icon: <Mail size={17} strokeWidth={2.2} /> },
    ];

    // Check if any tab inside the More drawer is currently active
    const isMoreActive = moreDrawerTabs.some(t => t.index === activeIndex) || activeIndex === 6;

    if (!isMobile) return null;

    return (
        <>
            {/* Frosted Dimming Backdrop when More Drawer is open */}
            {isMoreOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setIsMoreOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Floating Liquid Glass Container */}
            <div
                className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}
                role="navigation"
                aria-label="Mobile Navigation"
            >
                {/* Expanding "More" Liquid Glass Sheet */}
                <div
                    className={`${styles.moreDrawer} ${isMoreOpen ? styles.moreDrawerOpen : styles.moreDrawerClosed}`}
                    aria-hidden={!isMoreOpen}
                >
                    <div className={styles.drawerHeader}>
                        <span className={styles.drawerTitle}>More</span>
                        <button
                            type="button"
                            onClick={() => setIsMoreOpen(false)}
                            aria-label="Close menu"
                            className={styles.drawerClose}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className={styles.drawerGrid}>
                        {moreDrawerTabs.map((item) => {
                            const isSelected = activeIndex === item.index;
                            return (
                                <button
                                    key={item.index}
                                    type="button"
                                    onClick={() => handleTabClick(item.index)}
                                    className={`${styles.drawerTile} ${isSelected ? styles.drawerTileActive : ''}`}
                                    aria-label={item.label}
                                >
                                    <span className={styles.drawerTileIcon}>
                                        {item.icon}
                                    </span>
                                    <span className={styles.drawerTileLabel}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Theme Switcher Pill */}
                    <div className={styles.drawerFooter}>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={styles.themeButton}
                            aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
                        </button>
                        <div className={styles.drawerHandle} />
                    </div>
                </div>

                {/* Floating Island Liquid Glass Dock */}
                <div className={styles.dock}>
                    {primaryDockTabs.map((tab) => {
                        const isActive = activeIndex === tab.index;
                        return (
                            <button
                                key={tab.index}
                                type="button"
                                onClick={() => handleTabClick(tab.index)}
                                className={`${styles.iconButton} ${isActive ? styles.activeButton : ''}`}
                                aria-label={tab.label}
                                title={tab.label}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.icon}
                                <span className={styles.label}>{tab.label}</span>
                                {tab.hasBadge && (
                                    <span
                                        className={styles.jewelBadge}
                                        aria-label="Popular"
                                    />
                                )}
                            </button>
                        );
                    })}

                    {/* "More" Trigger Icon */}
                    <button
                        type="button"
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        className={`${styles.iconButton} ${isMoreOpen || isMoreActive ? styles.activeButton : ''}`}
                        aria-label="More Features"
                        title="More Features"
                        aria-expanded={isMoreOpen}
                    >
                        <div
                            style={{
                                transform: isMoreOpen ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <MoreHorizontal size={20} strokeWidth={1.9} />
                        </div>
                        <span className={styles.label}>More</span>
                    </button>
                </div>
            </div>
        </>
    );
}
