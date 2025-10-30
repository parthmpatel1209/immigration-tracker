"use client";

import { useEffect, useState } from "react";
import CRSFilter from "./CRSFilter";

interface Draw {
  id: number;
  round: number;
  program: string;
  crs_cutoff: number;
  invitations: number;
  draw_date: string;
  draw_province: string | null;
}

export default function DrawsTable() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [filteredDraws, setFilteredDraws] = useState<Draw[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [crsRange, setCrsRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "crs">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch draws from API
  useEffect(() => {
    const fetchDraws = async () => {
      const res = await fetch("/api/draws");
      const data = await res.json();
      setDraws(data);
      setFilteredDraws(data);
    };
    fetchDraws();
  }, []);

  // Filter + sort logic
  useEffect(() => {
    let filtered = [...draws];

    if (selectedProgram !== "All") {
      filtered = filtered.filter((d) => d.program === selectedProgram);
    }

    if (selectedProvince !== "All") {
      filtered = filtered.filter(
        (d) => d.draw_province && d.draw_province === selectedProvince
      );
    }

    if (crsRange) {
      filtered = filtered.filter(
        (d) => d.crs_cutoff >= crsRange[0] && d.crs_cutoff <= crsRange[1]
      );
    }

    if (sortBy === "crs") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? a.crs_cutoff - b.crs_cutoff
          : b.crs_cutoff - a.crs_cutoff
      );
    } else if (sortBy === "date") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.draw_date).getTime() - new Date(b.draw_date).getTime()
          : new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime()
      );
    }

    setFilteredDraws(filtered);
  }, [draws, selectedProgram, selectedProvince, crsRange, sortBy, sortOrder]);

  const programs = ["All", ...Array.from(new Set(draws.map((d) => d.program)))];
  const provinces = [
    "All",
    ...Array.from(
      new Set(draws.map((d) => d.draw_province).filter((p) => p && p !== ""))
    ),
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Latest Immigration Draws</h2>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Program Filter */}
        <select
          className="border p-2 rounded"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          {programs.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        {/* Province Filter */}
        <select
          className="border p-2 rounded"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          {provinces.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        {/* CRS Range */}
        <CRSFilter onRangeChange={setCrsRange} />

        {/* Sort */}
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "crs")}
        >
          <option value="date">Sort by Date</option>
          <option value="crs">Sort by CRS</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          {sortOrder === "asc" ? "⬆ Asc" : "⬇ Desc"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 mt-4 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border px-3 py-2">Round</th>
              <th className="border px-3 py-2">Program</th>
              <th className="border px-3 py-2">Province</th>
              <th className="border px-3 py-2">CRS Cutoff</th>
              <th className="border px-3 py-2">Invitations</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDraws.length > 0 ? (
              filteredDraws.map((draw) => (
                <tr key={draw.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{draw.round}</td>
                  <td className="border px-3 py-2">{draw.program}</td>
                  <td className="border px-3 py-2">
                    {draw.draw_province || "-"}
                  </td>
                  <td className="border px-3 py-2">{draw.crs_cutoff}</td>
                  <td className="border px-3 py-2">{draw.invitations}</td>
                  <td className="border px-3 py-2">
                    {new Date(draw.draw_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No draws found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
