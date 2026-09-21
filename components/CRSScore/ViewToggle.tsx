"use client";

import { Table, LineChart as LineChartIcon } from "lucide-react";
import styles from "./CRSScore.module.css";

interface ViewToggleProps {
    viewMode: "table" | "analytics";
    onViewChange: (mode: "table" | "analytics") => void;
}

export default function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
    return (
        <div className={styles.viewToggleContainer} role="tablist" aria-label="View Mode">
            <button
                type="button"
                role="tab"
                aria-selected={viewMode === "table"}
                onClick={() => onViewChange("table")}
                className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleBtnActive : ""}`}
            >
                <Table className={styles.viewToggleIcon} />
                <span>Draw Records</span>
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={viewMode === "analytics"}
                onClick={() => onViewChange("analytics")}
                className={`${styles.viewToggleBtn} ${viewMode === "analytics" ? styles.viewToggleBtnActive : ""}`}
            >
                <LineChartIcon className={styles.viewToggleIcon} />
                <span>Trends & Intelligence</span>
            </button>
        </div>
    );
}
