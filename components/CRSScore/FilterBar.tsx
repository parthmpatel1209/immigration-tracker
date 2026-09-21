"use client";

import styles from "./CRSScore.module.css";

interface FilterBarProps {
    selectedFilter: string;
    selectedYear: string;
    availableYears: string[];
    onFilterChange: (filter: string) => void;
    onYearChange: (year: string) => void;
}

const filterButtons = [
    { label: "All Streams", value: "All" },
    { label: "CEC", value: "CEC" },
    { label: "PNP", value: "PNP" },
    { label: "Category-Based", value: "Category Based" },
    { label: "Other", value: "Other" },
];

export default function FilterBar({
    selectedFilter,
    selectedYear,
    availableYears,
    onFilterChange,
    onYearChange,
}: FilterBarProps) {
    return (
        <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Program</label>
                <div className={styles.filterButtons}>
                    {filterButtons.map((filter) => {
                        const isActive =
                            selectedFilter === filter.value ||
                            (filter.value === "Category Based" && selectedFilter === "CEC - Category Based");
                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => onFilterChange(filter.value)}
                                className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Year</label>
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className={styles.yearSelect}
                    aria-label="Filter draws by year"
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
