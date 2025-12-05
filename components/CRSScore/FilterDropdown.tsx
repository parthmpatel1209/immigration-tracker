import { useState } from "react";
import { SlidersHorizontal, Calendar, Target, Users } from "lucide-react";
import styles from "./CRSScore.module.css";

interface FilterDropdownProps {
    sortBy: "date" | "crs" | "invitations";
    sortOrder: "asc" | "desc";
    onSortChange: (sortBy: "date" | "crs" | "invitations", sortOrder: "asc" | "desc") => void;
}

export default function FilterDropdown({ sortBy, sortOrder, onSortChange }: FilterDropdownProps) {
    const [filterOpen, setFilterOpen] = useState(false);

    const handleSortClick = (newSortBy: "date" | "crs" | "invitations") => {
        const newOrder = sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
        onSortChange(newSortBy, newOrder);
    };

    return (
        <div className={styles.filterDropdownContainer}>
            <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={styles.filterDropdownBtn}
                aria-label="Filter and sort options"
            >
                <SlidersHorizontal className={styles.filterDropdownIcon} />
            </button>

            {filterOpen && (
                <div className={styles.filterDropdownMenu}>
                    <div className={styles.filterDropdownSection}>
                        <h4 className={styles.filterDropdownTitle}>Sort By</h4>
                        <button
                            onClick={() => handleSortClick("date")}
                            className={`${styles.filterDropdownOption} ${sortBy === "date" ? styles.filterDropdownOptionActive : ""}`}
                        >
                            <Calendar className={styles.filterDropdownOptionIcon} />
                            <span>Date</span>
                            <span className={styles.filterDropdownSortIndicator}>
                                {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
                            </span>
                        </button>
                        <button
                            onClick={() => handleSortClick("crs")}
                            className={`${styles.filterDropdownOption} ${sortBy === "crs" ? styles.filterDropdownOptionActive : ""}`}
                        >
                            <Target className={styles.filterDropdownOptionIcon} />
                            <span>CRS Score</span>
                            <span className={styles.filterDropdownSortIndicator}>
                                {sortBy === "crs" && (sortOrder === "desc" ? "↓" : "↑")}
                            </span>
                        </button>
                        <button
                            onClick={() => handleSortClick("invitations")}
                            className={`${styles.filterDropdownOption} ${sortBy === "invitations" ? styles.filterDropdownOptionActive : ""}`}
                        >
                            <Users className={styles.filterDropdownOptionIcon} />
                            <span>Invitations</span>
                            <span className={styles.filterDropdownSortIndicator}>
                                {sortBy === "invitations" && (sortOrder === "desc" ? "↓" : "↑")}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
