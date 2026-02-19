import styles from "../PRPathways.module.css";
import { MapPin } from "lucide-react";

interface ProvinceSlideProps {
  p: any;
  darkMode: boolean;
}

export function ProvinceSlide({ p, darkMode }: ProvinceSlideProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className={`${styles.provinceIconContainer}`}>
          <MapPin size={28} className={styles.provinceIcon} />
        </div>
        <div className="flex-1">
          <h3 className={styles.provinceTitle}>{p.province}</h3>
        </div>
      </div>

      <div className={styles.badgeContainer}>
        <span className={styles.programBadge}>{p.program}</span>
        <span className={styles.statusBadge}>{p.status}</span>
      </div>
    </div>
  );
}

