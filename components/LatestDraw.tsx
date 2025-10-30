// components/LatestDraw.tsx
"use client";

import { useEffect, useState } from "react";

interface Draw {
  round: number;
  program: string;
  crs_cutoff: number;
  invitations: number;
  draw_date: string;
  draw_province?: string;
}

export default function LatestDraw() {
  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/draws");
        const data = await res.json();
        if (mounted && Array.isArray(data)) {
          const latest = data.sort((a, b) => b.round - a.round)[0];
          setDraw(latest);
        }
      } catch (err) {
        console.error("Failed to fetch draws:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLatest();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading latest draw...</p>;
  if (!draw) return <p>No draws available.</p>;

  return (
    <div className="border rounded-lg p-6 shadow-sm space-y-2">
      <h2 className="text-xl font-bold">Latest Immigration Draw</h2>
      <p>
        <strong>Program:</strong> {draw.program}
      </p>
      <p>
        <strong>CRS Cutoff:</strong> {draw.crs_cutoff}
      </p>
      <p>
        <strong>Invitations:</strong> {draw.invitations}
      </p>
      <p>
        <strong>Date:</strong> {draw.draw_date}
      </p>
    </div>
  );
}
