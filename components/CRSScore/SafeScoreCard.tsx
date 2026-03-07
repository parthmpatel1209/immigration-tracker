import { AlertCircle } from "lucide-react";
import { ProgramCategory } from "./types";
import styles from "./CRSScore.module.css";

interface SafeScoreRange {
    min: number;
    max: number;
    median: number;
}

interface SafeScoreCardProps {
    cecRange: SafeScoreRange | null;
    pnpRange: SafeScoreRange | null;
    categoryBasedRange: SafeScoreRange | null;
    nonEERange: SafeScoreRange | null;
}

export default function SafeScoreCard({
    cecRange,
    pnpRange,
    categoryBasedRange,
    nonEERange,
}: SafeScoreCardProps) {
    const renderRange = (
        category: string,
        range: SafeScoreRange | null,
        color: string
    ) => (
        <div className={styles.safeScoreItem}>
            <div className={styles.safeScoreCategory}>
                <div
                    className={styles.safeScoreDot}
                    style={{ backgroundColor: color }}
                />
                <span>{category}</span>
            </div>
            <div className={styles.safeScoreRange}>
                {range
                    ? `${range.min} - ${range.max}`
                    : "No data"}
            </div>
        </div>
    );

    return (
        <div className={styles.safeScoreSection}>
            <div className={styles.safeScoreCard}>
                <div className={styles.safeScoreHeader}>
                    <h3 className={styles.safeScoreTitle}>Current Safe Score Ranges</h3>
                    <p className={styles.safeScoreSubtitle}>
                        Based on recent draw history (25th-75th percentile)
                    </p>
                </div>
                <div className={styles.safeScoreGrid}>
                    {renderRange("CEC", cecRange, "#991b1b")}
                    {renderRange("PNP", pnpRange, "#065f46")}
                    {renderRange("Category Based", categoryBasedRange, "#1e40af")}
                    {renderRange("Other", nonEERange, "#334155")}
                </div>
                <div className={styles.safeScoreTip}>
                    <AlertCircle className={styles.tipIcon} />
                    <p>
                        <strong>Pro Tip:</strong> French speakers can qualify with scores
                        as low as 400+. Healthcare workers see similar benefits!
                    </p>
                </div>
            </div>
        </div>
    );
}
