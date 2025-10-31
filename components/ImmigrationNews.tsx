"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  source?: string;
  published_at?: string;
  url?: string;
}

export default function ImmigrationNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (mounted && Array.isArray(data)) {
          setNews(data);
          setFiltered(data);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter news when month/year changes
  useEffect(() => {
    let updated = [...news];

    if (year) {
      updated = updated.filter((n) => {
        const nYear = n.published_at
          ? new Date(n.published_at).getFullYear().toString()
          : "";
        return nYear === year;
      });
    }

    if (month) {
      updated = updated.filter((n) => {
        const nMonth = n.published_at
          ? (new Date(n.published_at).getMonth() + 1)
              .toString()
              .padStart(2, "0")
          : "";
        return nMonth === month;
      });
    }

    setFiltered(updated);
  }, [month, year, news]);

  // Generate unique years dynamically
  const uniqueYears = Array.from(
    new Set(
      news
        .map((n) =>
          n.published_at
            ? new Date(n.published_at).getFullYear().toString()
            : ""
        )
        .filter(Boolean)
    )
  ).sort((a, b) => Number(b) - Number(a));

  if (loading) return <p>Loading latest news...</p>;
  if (news.length === 0)
    return <p className="text-gray-600">No news available right now.</p>;

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {(month || year) && (
          <button
            onClick={() => {
              setMonth("");
              setYear("");
            }}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* News list */}
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 hover:shadow-md">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">
              {item.source} •{" "}
              {item.published_at
                ? new Date(item.published_at).toLocaleDateString()
                : ""}
            </p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Read more →
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No news found for selected filters.</p>
      )}
    </div>
  );
}
