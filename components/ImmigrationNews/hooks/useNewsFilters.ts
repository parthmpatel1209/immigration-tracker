// ImmigrationNews/hooks/useNewsFilters.ts
import { useState, useEffect, useMemo } from "react";
import { NewsItem } from "../types";

export function useNewsFilters(news: NewsItem[]) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

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
  }, [news, month, year]);

  return {
    month,
    setMonth,
    year,
    setYear,
    uniqueYears,
    filtered,
    clearFilters: () => {
      setMonth("");
      setYear("");
    },
    hasActiveFilters: !!(month || year),
  };
}
