// ImmigrationNews/NewsHeader.tsx
import { Filter } from "lucide-react";
import styles from "./ImmigrationNews.module.css";

interface Props {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function NewsHeader({ showFilters, onToggleFilters }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Immigration News</h1>
      </div>
      <button
        onClick={onToggleFilters}
        className={`${styles.filterToggleBtn} ${
          showFilters ? styles.filterToggleActive : ""
        }`}
        aria-label={showFilters ? "Hide filters" : "Show filters"}
      >
        <Filter className={styles.filterIcon} />
        <span className={styles.filterToggleText}>
          {showFilters ? "Hide" : "Show"} Filters
        </span>
      </button>
    </header>
  );
}
