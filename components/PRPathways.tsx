// components/PRPathways.tsx
"use client";

import { useEffect, useState } from "react";

interface Pathway {
  id: number;
  province: string;
  program: string;
  summary?: string;
  url?: string;
}

export default function PRPathways() {
  const [list, setList] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState<string>("All");

  useEffect(() => {
    let mounted = true;
    const fetchPathways = async () => {
      try {
        const res = await fetch("/api/pathways");
        const data = await res.json();
        if (mounted) setList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch pathways:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPathways();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading pathways...</p>;
  if (list.length === 0) return <p>No pathways found.</p>;

  const provinces = [
    "All",
    ...Array.from(new Set(list.map((p) => p.province))),
  ];
  const filtered =
    province === "All" ? list : list.filter((p) => p.province === province);

  return (
    <div className="space-y-4">
      <select
        className="border rounded-lg p-2 w-full md:w-1/3"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
      >
        {provinces.map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="border p-4 rounded-lg hover:shadow-md">
            <h3 className="font-semibold">{p.province}</h3>
            <p className="text-sm text-gray-600">{p.program}</p>
            {p.summary && <p className="text-sm mt-1">{p.summary}</p>}
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Learn more →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
