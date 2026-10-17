"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Light/dark theme. The initial class is applied by an inline script in
 * app/layout.tsx (no flash); this hook mirrors it into React state, persists
 * explicit choices, and follows the OS setting until the user picks one.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDark(root.classList.contains("dark"))
    );
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {}
      root.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", onSystem);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }, []);

  return { isDark, toggle };
}
