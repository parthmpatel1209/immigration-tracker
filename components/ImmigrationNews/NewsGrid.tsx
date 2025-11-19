// ImmigrationNews/NewsGrid.tsx
import { NewsCard } from "./NewsCard";
import styles from "./ImmigrationNews.module.css";
import { NewsItem } from "./types";

interface Props {
  news: NewsItem[];
  darkMode: boolean;
  theme: any;
}

export function NewsGrid({ news, darkMode, theme }: Props) {
  if (news.length === 0) {
    return (
      <div className={styles.noResults} style={{ color: theme.textMuted }}>
        No news found for selected filters.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {news.map((item, index) => (
        <NewsCard
          key={item.id}
          item={item}
          index={index}
          darkMode={darkMode}
          theme={theme}
        />
      ))}
    </div>
  );
}
