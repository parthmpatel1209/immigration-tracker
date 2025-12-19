"use client";

import React, { useEffect, useState } from "react";
import {
    Home,
    TrendingUp,
    Calculator,
    Newspaper,
    MoreHorizontal,
    ChevronUp,
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

            // Show if: 
            // 1. Scrolling up
            // 2. Near top of page
            // 3. Page is very short (no scroll space)
            if (currentScrollY < lastScrollY || currentScrollY < 100 || (document.documentElement.scrollHeight - window.innerHeight < 100)) {
                setIsVisible(true);
            }
            // We never set isVisible(false) here because the user wants it to "always appear"
            // But having this logic ensures that if the browser hides its bars, 
            // our component reacts and translates itself back into view.

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Tabs configuration
    const moreTabsInfo = [
        { index: 2, icon: <Activity size={18} /> },
        { index: 4, icon: <Newspaper size={18} /> },
        { index: 6, icon: <MapPin size={18} /> },
        { index: 7, icon: <GraduationCap size={18} /> },
        { index: 8, icon: <Bell size={18} /> },
        { index: 9, icon: <Heart size={18} /> },
        { index: 10, icon: <Mail size={18} /> },
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
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                fontFamily: 'system-ui, sans-serif',
                display: isMobile ? 'block' : 'none', // Keep mounted, just hide via CSS
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
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
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(4px)',
                        zIndex: -1
                    }}
                />
            )}

            {/* More Menu Content */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    right: 0,
                    padding: '0 1rem 1rem 1rem',
                    transform: isMoreOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isMoreOpen ? 1 : 0,
                    pointerEvents: isMoreOpen ? 'all' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div
                    style={{
                        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(229, 231, 235, 0.5)'}`,
                        boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {moreTabsInfo.map((item) => (
                            <button
                                key={item.index}
                                onClick={() => handleTabClick(item.index)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '16px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: activeIndex === item.index
                                        ? '#2563eb'
                                        : (isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(249, 250, 251, 0.5)'),
                                    color: activeIndex === item.index ? 'white' : (isDark ? '#d1d5db' : '#374151')
                                }}
                            >
                                <div style={{ color: activeIndex === item.index ? 'white' : '#3b82f6' }}>
                                    {item.icon}
                                </div>
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{tabs[item.index].label}</span>
                                    {tabs[item.index].badge && (
                                        <span style={{
                                            fontSize: '8px',
                                            padding: '1px 4px',
                                            backgroundColor: '#60a5fa',
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
                    <div style={{ padding: '0 1rem 1rem 1rem' }}>
                        <button
                            onClick={() => {
                                document.documentElement.classList.toggle("dark");
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                borderRadius: '16px',
                                border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: isDark ? 'rgba(55, 65, 81, 0.4)' : 'rgba(243, 244, 246, 0.5)',
                                color: isDark ? '#fde68a' : '#4b5563'
                            }}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                Switch to {isDark ? 'Light' : 'Dark'} Mode
                            </span>
                        </button>
                    </div>

                    <div style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: isDark ? 'rgba(31, 41, 55, 0.3)' : 'rgba(249, 250, 251, 0.3)' }}>
                        <div style={{ width: '40px', height: '4px', backgroundColor: isDark ? '#4b5563' : '#d1d5db', borderRadius: '2px', margin: '0 auto' }} />
                    </div>
                </div>
            </div>

            {/* Main Bottom Bar */}
            <div
                style={{
                    height: '70px',
                    backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(229, 231, 235, 0.5)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '0 1rem',
                    paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <TabButton
                    icon={<Home size={22} />}
                    label="Home"
                    isActive={activeIndex === 0}
                    onClick={() => handleTabClick(0)}
                    isDark={isDark}
                />
                <TabButton
                    icon={<TrendingUp size={22} />}
                    label="Draws"
                    isActive={activeIndex === 1}
                    onClick={() => handleTabClick(1)}
                    isDark={isDark}
                />
                <TabButton
                    icon={<Calculator size={22} />}
                    label="Calc"
                    isActive={activeIndex === 3}
                    onClick={() => handleTabClick(3)}
                    badge={tabs[3].badge}
                    isDark={isDark}
                />
                <TabButton
                    icon={<Newspaper size={22} />}
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
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        color: (isMoreActive || isMoreOpen) ? '#3b82f6' : (isDark ? '#9ca3af' : '#6b7280'),
                        position: 'relative'
                    }}
                >
                    <div style={{
                        padding: '6px',
                        borderRadius: '12px',
                        backgroundColor: isMoreOpen ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)') : 'transparent',
                        transform: isMoreOpen ? 'rotate(180deg)' : 'none',
                        transition: 'all 0.3s'
                    }}>
                        {isMoreOpen ? <ChevronUp size={22} /> : <MoreHorizontal size={22} />}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '500' }}>More</span>
                    {isMoreActive && !isMoreOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            border: `2px solid ${isDark ? '#111827' : 'white'}`
                        }} />
                    )}
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
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                color: isActive ? '#3b82f6' : (isDark ? '#9ca3af' : '#6b7280'),
                position: 'relative'
            }}
        >
            <div style={{
                padding: '6px',
                borderRadius: '12px',
                backgroundColor: isActive ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)') : 'transparent',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s'
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '500' }}>{label}</span>
            {badge && (
                <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    fontSize: '8px',
                    padding: '1px 4px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '9999px',
                    fontWeight: '900',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.5)'
                }}>
                    {badge}
                </span>
            )}
            {isActive && (
                <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%'
                }} />
            )}
        </button>
    );
}
