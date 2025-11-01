interface FilterBarProps {
  program: string;
  setProgram: (value: string) => void;
  crsRange: string;
  setCrsRange: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  programs: string[];
  provinces: string[];
}

export default function FilterBar({
  program,
  setProgram,
  crsRange,
  setCrsRange,
  province,
  setProvince,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  programs,
  provinces,
}: FilterBarProps) {
  const ranges = ["All", "200–400", "401–500", "501–600", "601+"];
  const sortOptions = ["Date", "CRS Cutoff"];
  const orderOptions = ["Descending", "Ascending"];

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center my-6 px-4">
      {/* Program Filter */}

      <select
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
      >
        {programs.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      {/* CRS Range Filter */}
      <label className="block text-sm font-medium text-gray-700">
        CRS Range &nbsp;
      </label>
      <select
        value={crsRange}
        onChange={(e) => setCrsRange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
      >
        {ranges.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      {/* Province Filter */}
      <select
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
      >
        {provinces.map((prov) => (
          <option key={prov}>{prov}</option>
        ))}
      </select>

      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
      >
        {sortOptions.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>

      {/* Sort Order */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
      >
        {orderOptions.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
