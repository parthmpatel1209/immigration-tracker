"use client";

import { useState, ReactNode, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import TabButton from "./TabButton";

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

  // Handle dark mode toggle
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="w-full">
      {/* Tabs header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              label={tab.label}
              isActive={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
          {/* Dark Mode Toggle */}

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="animate-fadeIn">{tabs[activeIndex].content}</div>
    </div>
  );
}
