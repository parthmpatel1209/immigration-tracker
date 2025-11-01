"use client";

import { useState, ReactNode, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

// ───── Color Map (for future badge use) ─────
const PROGRAM_COLORS: Record<
  string,
  { lightBg: string; lightText: string; darkBg: string; darkText: string }
> = {
  "Express Entry": {
    lightBg: "#e0e7ff",
    lightText: "#4338ca",
    darkBg: "#312e81",
    darkText: "#c7d2fe",
  },
  PNP: {
    lightBg: "#d1fae5",
    lightText: "#065f46",
    darkBg: "#064e3b",
    darkText: "#a7f3d0",
  },
  CEC: {
    lightBg: "#e9d5ff",
    lightText: "#6b21a8",
    darkBg: "#4c1d95",
    darkText: "#e9d5ff",
  },
  FSW: {
    lightBg: "#fef3c7",
    lightText: "#92400e",
    darkBg: "#78350f",
    darkText: "#fde68a",
  },
  default: {
    lightBg: "#e5e7eb",
    lightText: "#374151",
    darkBg: "#374151",
    darkText: "#d1d5db",
  },
};

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Apply dark mode to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  // Optional: sync with system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%" }}>
      {/* Tabs Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.75rem",
          marginBottom: "1rem",
          borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        }}
      >
        {/* Tab Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: activeIndex === index ? "600" : "500",
                color:
                  activeIndex === index
                    ? isDark
                      ? "#c7d2fe"
                      : "#4f46e5"
                    : isDark
                    ? "#9ca3af"
                    : "#6b7280",
                backgroundColor:
                  activeIndex === index
                    ? isDark
                      ? "#312e81"
                      : "#e0e7ff"
                    : "transparent",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? "#374151"
                  : "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  activeIndex === index
                    ? isDark
                      ? "#312e81"
                      : "#e0e7ff"
                    : "transparent")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            color: isDark ? "#d1d5db" : "#374151",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isDark
              ? "#4b5563"
              : "#e5e7eb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isDark
              ? "#374151"
              : "#f3f4f6")
          }
          title="Toggle Dark Mode"
        >
          {isDark ? (
            <Sun style={{ width: "14px", height: "14px", color: "#fde68a" }} />
          ) : (
            <Moon style={{ width: "14px", height: "14px", color: "#6b7280" }} />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div
        style={{
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        {tabs[activeIndex].content}
      </div>

      {/* Keyframes for fade-in */}
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
      `}</style>
    </div>
  );
}
