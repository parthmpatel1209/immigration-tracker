"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Tab {
  label: string;
  content: ReactNode;
  badge?: string;
}
interface TabsProps {
  tabs: Tab[];
  activeIndex: number;
}

/**
 * Renders the active tab's content with a short fade-up on change.
 * Navigation chrome lives in shell/SiteHeader (desktop) and MobileBottomNav (phone).
 */
export default function Tabs({ tabs, activeIndex }: TabsProps) {
  return (
    <motion.div
      key={activeIndex}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {tabs[activeIndex].content}
    </motion.div>
  );
}
