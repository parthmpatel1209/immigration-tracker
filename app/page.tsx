"use client";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import DrawCard from "./components/DrawCard";
import DrawTable from "./components/DrawTable";

export default function HomePage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [program, setProgram] = useState("All");
  const [crsRange, setCrsRange] = useState("All");
  const [province, setProvince] = useState("All");
  const [sortBy, setSortBy] = useState("Date");
  const [sortOrder, setSortOrder] = useState("Descending");

  useEffect(() => {
    fetch("/api/draws")
      .then((res) => res.json())
      .then((data) => setDraws(data))
      .catch((err) => console.error(err));
  }, []);

  if (!draws.length) return <p className="text-center mt-10">Loading...</p>;

  const programs = ["All", ...new Set(draws.map((d) => d.program))];
  const provinces = [
    "All",
    ...new Set(draws.map((d) => d.draw_province || "N/A")),
  ];

  const filtered = draws
    .filter((d) => {
      const matchesProgram = program === "All" || d.program === program;

      const matchesProvince =
        province === "All" ||
        (!d.draw_province && province === "N/A") ||
        d.draw_province === province;

      let matchesCRS = true;
      if (crsRange !== "All") {
        const [min, max] = crsRange.split("–").map(Number);
        matchesCRS = d.crs_cutoff >= min && (max ? d.crs_cutoff <= max : true);
      }

      return matchesProgram && matchesProvince && matchesCRS;
    })
    .sort((a, b) => {
      let valueA, valueB;
      if (sortBy === "Date") {
        valueA = new Date(a.draw_date).getTime();
        valueB = new Date(b.draw_date).getTime();
      } else {
        valueA = a.crs_cutoff;
        valueB = b.crs_cutoff;
      }
      return sortOrder === "Ascending" ? valueA - valueB : valueB - valueA;
    });

  const latestDraw = draws[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <FilterBar
        program={program}
        setProgram={setProgram}
        crsRange={crsRange}
        setCrsRange={setCrsRange}
        province={province}
        setProvince={setProvince}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        programs={programs}
        provinces={provinces}
      />
      {latestDraw && <DrawCard draw={latestDraw} />}
      <div className="max-w-5xl mx-auto px-4">
        <DrawTable draws={filtered} />
      </div>
    </div>
  );
}
