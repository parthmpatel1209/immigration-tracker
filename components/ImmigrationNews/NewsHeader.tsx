// ImmigrationNews/NewsHeader.tsx
import styles from "./ImmigrationNews.module.css";

interface Props {
  showFilters: boolean;
  onToggleFilters: () => void;
  theme: any;
}

export function NewsHeader({ showFilters, onToggleFilters, theme }: Props) {
  // Fallback so UI never crashes even if theme is undefined
  const safeTheme = theme ?? {
    border: "#e5e7eb",
    bgSecondary: "#f3f4f6",
  };

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
        style={{
          borderColor: safeTheme.border,
        }}
      >
        <span
          className={styles.filterIconWrapper}
          style={{
            backgroundColor: showFilters
              ? "rgba(99,102,241,0.12)"
              : safeTheme.bgSecondary,
            borderColor: safeTheme.border,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.filterIconModern}
          >
            <path d="M4 4h16"></path>
            <path d="M6 8h12"></path>
            <path d="M8 12h8"></path>
          </svg>
        </span>

        <span className={styles.filterToggleText}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </span>
      </button>
    </header>
  );
}
