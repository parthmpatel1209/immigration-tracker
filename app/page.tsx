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
  const [draws, setDraws] = useState<DrawData[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/draws")
      .then((res) => res.json())
      .then(setDraws);
  }, []);

  const filteredDraws =
    filter === "All" ? draws : draws.filter((draw) => draw.program === filter);

  if (draws.length === 0)
    return <p className="text-center mt-10">Loading...</p>;

  // Get unique programs for the dropdown
  const programs = Array.from(new Set(draws.map((d) => d.program)));
  programs.unshift("All"); // add "All" at the start

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 text-gray-800 pt-10">
      <h1 className="text-3xl font-bold mb-6">Immigration Draws</h1>

      <div className="mb-6">
        <label className="mr-2 font-semibold">Filter by Program:</label>
        <select
          className="border rounded px-2 py-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {programs.map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 w-full max-w-3xl px-4">
        {filteredDraws.map((draw) => (
          <div key={draw.round} className="bg-white p-6 rounded-lg shadow-md">
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
        ))}
      </div>
    </main>
  );
}
