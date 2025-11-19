// ImmigrationNews/NewsFooter.tsx
import styles from "./ImmigrationNews.module.css";

interface Props {
  total: number;
  shown: number;
  theme: any;
}

export function NewsFooter({ total, shown, theme }: Props) {
  return (
    <footer className={styles.footer} style={{ color: theme.textMuted }}>
      Showing <strong>{shown}</strong> of <strong>{total}</strong> articles
    </footer>
  );
}
