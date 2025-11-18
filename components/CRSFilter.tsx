"use client";

import styles from "./DrawsTable.module.css"; // Import the same CSS module

interface CRSFilterProps {
  onRangeChange: (range: [number, number] | null) => void;
  styles: {
    select: string;
    selectOption: string;
  };
}

export default function CRSFilter({
  onRangeChange,
  styles: themeStyles,
}: CRSFilterProps) {
  const ranges = [
    { label: "All", value: null },
    { label: "200 - 400", value: [200, 400] },
    { label: "401 - 500", value: [401, 500] },
    { label: "501 - 600", value: [501, 600] },
    { label: "600 +", value: [601, 700] },
  ];

  return (
    <select
      className={`${styles.select} ${themeStyles.select}`}
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
          className={themeStyles.selectOption}
        >
          {r.label}
        </option>
      ))}
    </select>
  );
}
