// ImmigrationNews/hooks/useNewsFilters.ts
import { useState, useEffect, useMemo } from "react";
import { NewsItem } from "../types";

export function useNewsFilters(news: NewsItem[]) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [specificDate, setSpecificDate] = useState<Date | null>(null);

  const uniqueYears = useMemo(() => {
    const years = new Set<string>();
    news.forEach((n) => {
      if (n.published_at) {
        years.add(new Date(n.published_at).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => +b - +a);
  }, [news]);

  const filtered = useMemo(() => {
    let list = [...news];

    // Specific date filter takes precedence or works in combination
    if (specificDate) {
      const targetDateStr = specificDate.toISOString().split('T')[0];
      list = list.filter((n) => {
        if (!n.published_at) return false;
        const itemDateStr = new Date(n.published_at).toISOString().split('T')[0];
        return itemDateStr === targetDateStr;
      });
      return list;
    }

    if (year) {
      list = list.filter(
        (n) =>
          n.published_at &&
          new Date(n.published_at).getFullYear().toString() === year
      );
    }
    if (month) {
      list = list.filter(
        (n) =>
          n.published_at &&
          (new Date(n.published_at).getMonth() + 1)
            .toString()
            .padStart(2, "0") === month
      );
    }
    return list;
  }, [news, month, year, specificDate]);

  return {
    month,
    setMonth: (m: string) => {
      setMonth(m);
      setSpecificDate(null); // Clear specific date when changing month
    },
    year,
    setYear: (y: string) => {
      setYear(y);
      setSpecificDate(null); // Clear specific date when changing year
    },
    specificDate,
    setSpecificDate: (date: Date | null) => {
      setSpecificDate(date);
      if (date) {
        // Optionally sync month/year dropdowns to the selected date
        setMonth((date.getMonth() + 1).toString().padStart(2, "0"));
        setYear(date.getFullYear().toString());
      }
    },
    uniqueYears,
    filtered,
    clearFilters: () => {
      setMonth("");
      setYear("");
      setSpecificDate(null);
    },
    hasActiveFilters: !!(month || year || specificDate),
  };
}
