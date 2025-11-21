import styles from "../PRPathways.module.css";

interface ProvinceSlideProps {
  p: any;
  darkMode: boolean;
}

export function ProvinceSlide({ p, darkMode }: ProvinceSlideProps) {
  return (
    <div className="space-y-6">
      <h3 className={styles.provinceTitle}>{p.province}</h3>

      <div className={styles.badgeContainer}>
        <span className={styles.programBadge}>{p.program}</span>
        <span className={styles.statusBadge}>{p.status}</span>
      </div>
    </div>
  );
}
