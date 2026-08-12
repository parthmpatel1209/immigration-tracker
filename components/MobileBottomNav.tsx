"use client";

import React, { useEffect, useState } from "react";
import {
    Home,
    TrendingUp,
    Calculator,
    Newspaper,
    MoreHorizontal,
    ChevronUp,
    ChevronDown,
    Activity,
    GraduationCap,
    MapPin,
    Bell,
    Heart,
    Mail,
    Sun,
    Moon
} from "lucide-react";

interface MobileBottomNavProps {
    activeIndex: number;
    onTabChange: (index: number) => void;
    tabs: { label: string; badge?: string }[];
}

export default function MobileBottomNav({
    activeIndex,
    onTabChange,
    tabs
}: MobileBottomNavProps) {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Detect mobile and dark mode
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));

        checkMobile();
        checkDark();

        window.addEventListener("resize", checkMobile);
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => {
            window.removeEventListener("resize", checkMobile);
            observer.disconnect();
        };
    }, []);

    // Scroll reveal logic
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if scrolling up, near top, or at bottom
            if (currentScrollY < lastScrollY || currentScrollY < 100 || (document.documentElement.scrollHeight - window.innerHeight - currentScrollY < 100)) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 120 && !isMoreOpen) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isMoreOpen]);

    // Tabs configuration
    const moreTabsInfo = [
        { index: 2, icon: <Activity size={18} /> },
        { index: 5, icon: <MapPin size={18} /> }, // My Journey
        { index: 6, icon: <GraduationCap size={18} /> },
        { index: 7, icon: <Bell size={18} /> },
        { index: 8, icon: <Heart size={18} /> },
        { index: 9, icon: <Mail size={18} /> },
    ];

    const handleTabClick = (index: number) => {
        onTabChange(index);
        setIsMoreOpen(false);

        const tabsSection = document.getElementById("tabs-section");
        if (tabsSection) {
            tabsSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const moreTabIndices = moreTabsInfo.map(t => t.index);
    const isMoreActive = moreTabIndices.includes(activeIndex);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 'max(env(safe-area-inset-bottom), 10px)',
                left: '12px',
                right: '12px',
                maxWidth: '460px',
                margin: '0 auto',
                zIndex: 9999,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: isMobile ? 'block' : 'none',
                transform: isVisible ? 'translateY(0)' : 'translateY(120%)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}
        >
            {/* Backdrop for More Menu */}
            {isMoreOpen && (
                <div
                    onClick={() => setIsMoreOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        zIndex: -1
                    }}
                />
            )}

            {/* More Menu Content (Expands Upwards from Floating Glass Dock) */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    left: 0,
                    right: 0,
                    transform: isMoreOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
                    opacity: isMoreOpen ? 1 : 0,
                    pointerEvents: isMoreOpen ? 'all' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div
                    style={{
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(30px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                        borderRadius: '26px',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.7)'}`,
                        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ padding: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        {moreTabsInfo.map((item) => (
                            <button
                                key={item.index}
                                onClick={() => handleTabClick(item.index)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.65rem',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '16px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    backgroundColor: activeIndex === item.index
                                        ? '#dc2626'
                                        : (isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.7)'),
                                    color: activeIndex === item.index ? 'white' : (isDark ? '#e2e8f0' : '#334155'),
                                    boxShadow: activeIndex === item.index ? '0 4px 12px rgba(220, 38, 38, 0.35)' : 'none'
                                }}
                            >
                                <div style={{ color: activeIndex === item.index ? 'white' : '#ef4444' }}>
                                    {item.icon}
                                </div>
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700' }}>{tabs[item.index].label}</span>
                                    {tabs[item.index].badge && (
                                        <span style={{
                                            fontSize: '8px',
                                            padding: '1px 4px',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            borderRadius: '9999px',
                                            width: 'fit-content',
                                            marginTop: '2px',
                                            textTransform: 'uppercase',
                                            fontWeight: '900'
                                        }}>
                                            {tabs[item.index].badge}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Theme Toggle Button */}
                    <div style={{ padding: '0 0.85rem 0.85rem 0.85rem' }}>
                        <button
                            onClick={() => {
                                document.documentElement.classList.toggle("dark");
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.65rem',
                                padding: '0.65rem',
                                borderRadius: '16px',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.6)',
                                color: isDark ? '#fde68a' : '#475569'
                            }}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            <span style={{ fontSize: '12px', fontWeight: '700' }}>
                                Switch to {isDark ? 'Light' : 'Dark'} Mode
                            </span>
                        </button>
                    </div>

                    <div style={{ padding: '0.4rem', textAlign: 'center', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.4)' }}>
                        <div style={{ width: '36px', height: '4px', backgroundColor: isDark ? '#475569' : '#cbd5e1', borderRadius: '2px', margin: '0 auto' }} />
                    </div>
                </div>
            </div>

            {/* iOS Floating Liquid Glass Dock */}
            <div
                style={{
                    height: '64px',
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(25px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(25px) saturate(200%)',
                    borderRadius: '26px',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.65)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '4px 6px',
                    boxShadow: isDark
                        ? '0 16px 40px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        : '0 16px 40px -8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
            >
                <TabButton
                    icon={<Home size={20} />}
                    label="Home"
                    isActive={activeIndex === 0}
                    onClick={() => handleTabClick(0)}
                    isDark={isDark}
                />
                <TabButton
                    icon={<TrendingUp size={20} />}
                    label="Draws"
                    isActive={activeIndex === 1}
                    onClick={() => handleTabClick(1)}
                    isDark={isDark}
                />
                <TabButton
                    icon={<Calculator size={20} />}
                    label="Calc"
                    isActive={activeIndex === 3}
                    onClick={() => handleTabClick(3)}
                    badge={tabs[3].badge}
                    isDark={isDark}
                />
                <TabButton
                    icon={<Newspaper size={20} />}
                    label="News"
                    isActive={activeIndex === 4}
                    onClick={() => handleTabClick(4)}
                    isDark={isDark}
                />
                <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        padding: '6px 12px',
                        height: '52px',
                        borderRadius: '18px',
                        background: isMoreOpen
                            ? (isDark ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(185, 28, 28, 0.95))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.92), rgba(220, 38, 38, 0.95))')
                            : (isMoreActive ? (isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.12)') : 'transparent'),
                        border: isMoreOpen
                            ? '1px solid rgba(255, 255, 255, 0.3)'
                            : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        color: isMoreOpen ? '#ffffff' : (isMoreActive ? '#ef4444' : (isDark ? '#94a3b8' : '#64748b')),
                        boxShadow: isMoreOpen ? '0 4px 14px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)' : 'none',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        transform: isMoreOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease'
                    }}>
                        <MoreHorizontal size={20} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: isMoreOpen || isMoreActive ? '700' : '500' }}>More</span>
                </button>
            </div>
        </div>
    );
}

function TabButton({
    icon,
    label,
    isActive,
    onClick,
    badge,
    isDark
}: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    badge?: string;
    isDark: boolean;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '6px 12px',
                height: '52px',
                borderRadius: '18px',
                background: isActive
                    ? (isDark
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(185, 28, 28, 0.95))'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.92), rgba(220, 38, 38, 0.95))')
                    : 'transparent',
                border: isActive
                    ? '1px solid rgba(255, 255, 255, 0.3)'
                    : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                color: isActive ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                boxShadow: isActive ? '0 4px 14px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)' : 'none',
                position: 'relative'
            }}
        >
            <div>
                {icon}
            </div>
            <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '500' }}>{label}</span>
            {badge && (
                <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    fontSize: '8px',
                    padding: '1px 5px',
                    backgroundColor: isActive ? '#ffffff' : '#ef4444',
                    color: isActive ? '#dc2626' : 'white',
                    borderRadius: '9999px',
                    fontWeight: '900',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                    {badge}
                </span>
            )}
        </button>
    );
}
