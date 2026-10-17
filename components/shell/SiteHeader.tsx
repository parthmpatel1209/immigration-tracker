"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import MapleMark from "./MapleMark";
import styles from "./SiteHeader.module.css";

interface NavTab {
  label: string;
  badge?: string;
  hidden?: boolean;
}

interface SiteHeaderProps {
  tabs: NavTab[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  onAlerts: () => void;
}

const SHORT_LABEL: Record<string, string> = {
  "Latest Draw": "Draws",
  "My Journey": "Journey",
};

export default function SiteHeader({
  tabs,
  activeIndex,
  onTabChange,
  onAlerts,
}: SiteHeaderProps) {
  const { isDark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => onTabChange(0)}
          aria-label="Canada Immigration Data Tracker — home"
        >
          <span className={styles.brandMark}>
            <MapleMark size={17} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Immigration Data Tracker</span>
            <span className={styles.brandTag}>Canada · Independent</span>
          </span>
        </button>

        <nav className={styles.nav} aria-label="Primary">
          {tabs.map((tab, i) => {
            if (tab.hidden) return null;
            const active = i === activeIndex;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onTabChange(i)}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {SHORT_LABEL[tab.label] ?? tab.label}
                {tab.badge && <span className={styles.dot} aria-label={tab.badge} />}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className={styles.underline}
                    transition={{ type: "spring", stiffness: 520, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button type="button" className={styles.cta} onClick={onAlerts}>
            <Bell size={14} />
            <span>Draw alerts</span>
          </button>
        </div>
      </div>
    </header>
  );
}
