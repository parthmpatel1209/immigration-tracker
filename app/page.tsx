"use client";

import { useEffect, useState } from "react";

type DrawData = {
  round: number;
  program: string;
  crs_cutoff: number;
  invitations: number;
  draw_date: string;
};

export default function Home() {
  const [data, setData] = useState<DrawData | null>(null);

  useEffect(() => {
    fetch("/api/draws")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Latest Immigration Draw</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>
          <strong>Program:</strong> {data.program}
        </p>
        <p>
          <strong>CRS Cutoff:</strong> {data.crs_cutoff}
        </p>
        <p>
          <strong>Invitations:</strong> {data.invitations}
        </p>
        <p>
          <strong>Date:</strong> {data.draw_date}
        </p>
      </div>
    </main>
  );
}
