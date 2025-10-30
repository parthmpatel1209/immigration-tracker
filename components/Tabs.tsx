"use client";

import { useState, ReactNode, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

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

  // Apply dark class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b mb-4">
        {/* Tabs */}
        <div className="flex flex-wrap">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 font-medium transition-colors duration-200 ${
                index === activeIndex
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Active Tab Content */}
      <div>{tabs[activeIndex].content}</div>
    </div>
  );
}
