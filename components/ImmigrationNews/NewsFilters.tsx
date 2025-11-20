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
      style={{
        backgroundColor:
          theme.bgCard + (theme.bgCard === "#ffffff" ? "dd" : "cc"),
        borderColor: theme.border,
        boxShadow:
          theme.bgPrimary === "#ffffff"
            ? "0 4px 18px rgba(0,0,0,0.06)"
            : "0 4px 18px rgba(0,0,0,0.3)",
      }}
    >
      <div className={styles.filters}>
        {/* Month Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label} style={{ color: theme.textMuted }}>
            Month
          </label>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={styles.modernSelect}
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

        {/* Year Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label} style={{ color: theme.textMuted }}>
            Year
          </label>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={styles.modernSelect}
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

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={styles.clearFiltersButton}
            style={{
              backgroundColor: theme.bgTertiary,
              color: theme.textSecondary,
              borderColor: theme.border,
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
