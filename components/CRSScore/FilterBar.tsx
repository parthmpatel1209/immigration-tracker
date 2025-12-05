import styles from "./CRSScore.module.css";

interface FilterBarProps {
    selectedFilter: string;
    selectedYear: string;
    availableYears: string[];
    onFilterChange: (filter: string) => void;
    onYearChange: (year: string) => void;
}

const filterButtons = ["All", "CEC", "PNP", "Others"];

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
                    {filterButtons.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onFilterChange(filter)}
                            className={`${styles.filterBtn} ${selectedFilter === filter ? styles.filterBtnActive : ""
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Year</label>
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className={styles.yearSelect}
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
