// ImmigrationNews/NewsFilters.tsx
import { X } from "lucide-react";
import styles from "./ImmigrationNews.module.css";

interface Props {
  show: boolean;
  month: string;
  setMonth: (m: string) => void;
  year: string;
  setYear: (y: string) => void;
  uniqueYears: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
  theme: any;
}

export function NewsFilters({
  show,
  month,
  setMonth,
  year,
  setYear,
  uniqueYears,
  clearFilters,
  hasActiveFilters,
  theme,
}: Props) {
  if (!show) return null;

  return (
    <div
      className={`${styles.filtersWrapper} ${
        show ? styles.filtersVisible : styles.filtersHidden
      }`}
    >
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.label} style={{ color: theme.textMuted }}>
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={styles.select}
            style={{
              backgroundColor: theme.bgSecondary,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label} style={{ color: theme.textMuted }}>
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={styles.select}
            style={{
              backgroundColor: theme.bgSecondary,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            <option value="">All Years</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={styles.clearButton}
            style={{
              backgroundColor: theme.bgTertiary,
              color: theme.textSecondary,
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
