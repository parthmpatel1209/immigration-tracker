"use client";

import { useState, ReactNode, useEffect, useRef, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

interface Tab {
  label: string;
  content: ReactNode;
  badge?: string;
}
interface TabsProps {
  tabs: Tab[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  hideHeaderOnMobile?: boolean;
}

/* --------------------------------------------------------------- */
export default function Tabs({ tabs, activeIndex: controlledIndex, onTabChange, hideHeaderOnMobile }: TabsProps) {
  const [localActiveIndex, setLocalActiveIndex] = useState(0);

  // Determine if controlled or uncontrolled
  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : localActiveIndex;

  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* ---- Detect mobile (≤640px) --------------------------------- */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  /* ---- Dark-mode handling -------------------------------------- */
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ---- Center active tab (mobile only) ------------------------ */
  const scrollToTab = useCallback(
    (idx: number) => {
      if (!isMobile) return;

      const container = scrollContainerRef.current;
      const tab = tabRefs.current[idx];
      if (!container || !tab) return;

      const cW = container.clientWidth;
      const tW = tab.offsetWidth;
      const tL = tab.offsetLeft;

      const desired = tL - cW / 2 + tW / 2;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const bounded = Math.max(0, Math.min(desired, maxScroll));

      container.scrollTo({ left: bounded, behavior: "smooth" });
    },
    [isMobile]
  );


  useEffect(() => {
    scrollToTab(activeIndex);
  }, [activeIndex, scrollToTab]);


  /* ---- Fade gradients (mobile only) --------------------------- */
  useEffect(() => {
    if (!isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const update = () => {
      const left = container.querySelector("#fade-left") as HTMLElement;
      const right = container.querySelector("#fade-right") as HTMLElement;

      const atStart = container.scrollLeft <= 1;
      const atEnd =
        Math.abs(
          container.scrollWidth - container.scrollLeft - container.clientWidth
        ) <= 1;

      if (left) left.style.opacity = atStart ? "0" : "1";
      if (right) right.style.opacity = atEnd ? "0" : "1";
    };

    update();
    const debounced = (() => {
      let t: NodeJS.Timeout;
      return () => {
        clearTimeout(t);
        t = setTimeout(update, 30);
      };
    })();

    container.addEventListener("scroll", debounced);
    window.addEventListener("resize", update);
    return () => {
      container.removeEventListener("scroll", debounced);
      window.removeEventListener("resize", update);
    };
  }, [isMobile, tabs]);


  /* ---- Scale & opacity (mobile only – **all tabs** treated equally) */
  const getScaleAndOpacity = (idx: number) => {
    if (!isMobile) return { scale: 1, opacity: 1 };

    const container = scrollContainerRef.current;
    if (!container) return { scale: 1, opacity: 1 };

    const tab = tabRefs.current[idx];
    if (!tab) return { scale: 1, opacity: 1 };

    const cRect = container.getBoundingClientRect();
    const tRect = tab.getBoundingClientRect();

    const tabCenter = tRect.left + tRect.width / 2;
    const containerCenter = cRect.left + cRect.width / 2;
    const distance = Math.abs(tabCenter - containerCenter);
    const maxDist = cRect.width * 0.45;
    if (maxDist <= 0) return { scale: 1, opacity: 1 };

    const scale = 1 - (distance / maxDist) * 0.15;
    const clamped = Math.max(scale, 0.85);
    const opacity = 0.7 + (clamped - 0.85) * 2;

    return { scale: clamped, opacity };
  };

  /* --------------------------------------------------------------- */
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%" }}>
      {/* Header ----------------------------------------------------- */}
      <div
        style={{
          display: isMobile && hideHeaderOnMobile ? "none" : "flex",
          alignItems: "center",
          paddingBottom: "1.25rem",
          marginBottom: "0",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Subtle Gradient Fade-out at the bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '-24px',
            left: 0,
            right: 0,
            height: '24px',
            background: isDark
              ? 'transparent'
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), transparent)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
        {/* Subtle Ambient Line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '5%',
            right: '5%',
            height: '1px',
            background: isDark
              ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)'
              : 'linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)',
            zIndex: 11,
          }}
        />
        {/* Scrollable area (mobile) / static (desktop) ------------- */}
        <div
          ref={scrollContainerRef}
          style={{
            position: "relative",
            flex: 1,
            overflowX: isMobile ? "auto" : "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: isMobile ? "0 3rem 4px 3rem" : "0",
            maskImage: isMobile
              ? isDark
                ? "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)"
                : "linear-gradient(to right, transparent 0%, white 12%, white 88%, transparent 100%)"
              : "none",
          }}
          className={isMobile ? "no-scrollbar" : undefined}
        >
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              minWidth: isMobile ? "max-content" : "auto",
              alignItems: "center",
              height: "3rem",
              position: "relative",
            }}
          >
            {tabs.map((tab, i) => {
              if ((tab as any).hidden) return null;
              const isActive = i === activeIndex;
              const { scale, opacity } = isActive
                ? { scale: 1, opacity: 1 }
                : getScaleAndOpacity(i);

              const fontSize = isActive ? "1rem" : `${0.875 * scale}rem`;

              return (
                <button
                  key={i}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  onClick={() => {
                    if (onTabChange) onTabChange(i);
                    if (!isControlled) setLocalActiveIndex(i);
                    scrollToTab(i);
                  }}
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    padding: "0.5rem 1rem",
                    fontSize,
                    fontWeight: isActive ? "700" : "500",
                    color: isActive
                      ? isDark
                        ? "#ffffff"
                        : "#2563eb"
                      : isDark
                        ? "#9ca3af"
                        : "#6b7280",
                    backgroundColor: "transparent",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: "pointer",
                    transition:
                      "all 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s",
                    outline: "none",
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                    whiteSpace: "nowrap",
                    overflow: "visible",
                    zIndex: 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = isDark
                        ? "rgba(55, 65, 81, 0.3)"
                        : "rgba(243, 244, 246, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {/* Individual Liquid Glass Layer - Fades In/Out */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: isDark
                        ? "linear-gradient(135deg, rgba(79, 70, 229, 0.4), rgba(124, 58, 237, 0.4))"
                        : "linear-gradient(135deg, rgba(219, 234, 254, 1), rgba(239, 246, 255, 1))",
                      borderRadius: "9999px",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      boxShadow: isDark
                        ? "0 4px 20px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 4px 12px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                      border: isDark
                        ? "1px solid rgba(139, 92, 246, 0.4)"
                        : "1px solid rgba(191, 219, 254, 0.8)",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      pointerEvents: "none",
                      zIndex: -1,
                      overflow: "hidden",
                    }}
                  >
                    {/* Shine overlay - only visible when active */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "200%",
                          height: "100%",
                          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                          animation: "shine 3s infinite",
                        }}
                      />
                    )}
                  </div>

                  {tab.label}
                  {tab.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-4px",
                        background: isDark
                          ? "linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(79, 70, 229, 0.95))"
                          : "linear-gradient(135deg, rgba(129, 140, 248, 0.95), rgba(99, 102, 241, 0.95))",
                        color: "white",
                        fontSize: "0.55rem",
                        fontWeight: "700",
                        padding: "1px 5px",
                        borderRadius: "9999px",
                        boxShadow: isDark
                          ? "0 2px 4px rgba(79, 70, 229, 0.3)"
                          : "0 2px 4px rgba(99, 102, 241, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(4px)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        zIndex: 10,
                        animation: "pulse-badge 2.5s infinite",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tab.badge}
                      {/* Shine effect */}
                      <span style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                        borderRadius: "9999px",
                        pointerEvents: "none",
                      }}></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* left fade (mobile only) */}
          {isMobile && (
            <div
              id="fade-left"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "3rem",
                background: isDark
                  ? "linear-gradient(to right, #1f2937 30%, transparent)"
                  : "linear-gradient(to right, #ffffff 30%, transparent)",
                pointerEvents: "none",
                opacity: 0,
                transition: "opacity 0.3s ease",
                zIndex: 10,
              }}
            />
          )}

          {/* right fade (mobile only) */}
          {isMobile && (
            <div
              id="fade-right"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "3rem",

                pointerEvents: "none",
                opacity: 1,
                transition: "opacity 0.3s ease",
                zIndex: 10,
              }}
            />
          )}
        </div>

        {/* Dark-mode toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            flexShrink: 0,
            padding: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            color: isDark ? "#d1d5db" : "#374151",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            marginLeft: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Toggle Dark Mode"
        >
          {isDark ? (
            <Sun style={{ width: "14px", height: "14px", color: "#fde68a" }} />
          ) : (
            <Moon style={{ width: "14px", height: "14px", color: "#6b7280" }} />
          )}
        </button>
      </div>

      {/* Content ---------------------------------------------------- */}
      <div
        style={{
          animation: "fadeIn 0.3s ease-in-out",
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40px, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40px, black 100%)',
        }}
      >
        {tabs[activeIndex].content}
      </div>

      {/* Global styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-badge {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        @keyframes shine {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
