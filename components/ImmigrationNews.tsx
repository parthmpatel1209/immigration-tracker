// components/ImmigrationNews.tsx
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (mounted) setNews(Array.isArray(data) ? data : []);
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

  if (loading) return <p>Loading latest news...</p>;

  if (news.length === 0)
    return <p className="text-gray-600">No news available right now.</p>;

  return (
    <div className="space-y-4">
      {news.map((item) => (
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
      ))}
    </div>
  );
}
