"use client";

interface CRSFilterProps {
  onRangeChange: (range: [number, number] | null) => void;
}

export default function CRSFilter({ onRangeChange }: CRSFilterProps) {
  const ranges = [
    { label: "All", value: null },
    { label: "200 - 400", value: [200, 400] },
    { label: "401 - 500", value: [401, 500] },
    { label: "501 - 600", value: [501, 600] },
    { label: "601 - 700", value: [601, 700] },
  ];

  return (
    <select
      className="border p-2 rounded"
      onChange={(e) => {
        const val = e.target.value;
        const selected =
          val === "null" ? null : (JSON.parse(val) as [number, number]);
        onRangeChange(selected);
      }}
    >
      {ranges.map((r) => (
        <option
          key={r.label}
          value={r.value ? JSON.stringify(r.value) : "null"}
        >
          {r.label}
        </option>
      ))}
    </select>
  );
}
