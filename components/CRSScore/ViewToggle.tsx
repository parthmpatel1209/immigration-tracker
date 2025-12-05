import { Table, LineChart as LineChartIcon } from "lucide-react";
import styles from "./CRSScore.module.css";

interface ViewToggleProps {
    viewMode: "table" | "analytics";
    onViewChange: (mode: "table" | "analytics") => void;
}

export default function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
    return (
        <div className={styles.viewToggleContainer} data-active={viewMode}>
            <button
                onClick={() => onViewChange("table")}
                className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleBtnActive : ""}`}
            >
                <Table className={styles.viewToggleIcon} />
                Numbers
            </button>
            <button
                onClick={() => onViewChange("analytics")}
                className={`${styles.viewToggleBtn} ${viewMode === "analytics" ? styles.viewToggleBtnActive : ""}`}
            >
                <LineChartIcon className={styles.viewToggleIcon} />
                Analytics
            </button>
        </div>
    );
}
