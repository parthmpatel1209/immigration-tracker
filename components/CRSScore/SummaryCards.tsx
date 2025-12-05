import { TrendingUp, Target, Users } from "lucide-react";
import styles from "./CRSScore.module.css";

interface SummaryCardsProps {
    cecTotal: number;
    pnpTotal: number;
    othersTotal: number;
    grandTotal: number;
}

export default function SummaryCards({
    cecTotal,
    pnpTotal,
    othersTotal,
    grandTotal,
}: SummaryCardsProps) {
    return (
        <div className={styles.summarySection}>
            <h3 className={styles.sectionTitle}>Total Invitations by Category</h3>
            <div className={styles.summaryGrid}>
                <div className={`${styles.summaryCard} ${styles.cecCard}`}>
                    <div className={styles.cardHeaderSummary}>
                        <div className={styles.cardIconSummary}>
                            <TrendingUp />
                        </div>
                        <h3 className={styles.cardTitleSummary}>CEC</h3>
                    </div>
                    <div className={styles.cardValueSummary}>
                        {cecTotal.toLocaleString()}
                    </div>
                    <div className={styles.cardLabelSummary}>Canadian Experience Class</div>
                </div>

                <div className={`${styles.summaryCard} ${styles.pnpCard}`}>
                    <div className={styles.cardHeaderSummary}>
                        <div className={styles.cardIconSummary}>
                            <Target />
                        </div>
                        <h3 className={styles.cardTitleSummary}>PNP</h3>
                    </div>
                    <div className={styles.cardValueSummary}>
                        {pnpTotal.toLocaleString()}
                    </div>
                    <div className={styles.cardLabelSummary}>Provincial Nominee Program</div>
                </div>

                <div className={`${styles.summaryCard} ${styles.othersCard}`}>
                    <div className={styles.cardHeaderSummary}>
                        <div className={styles.cardIconSummary}>
                            <Users />
                        </div>
                        <h3 className={styles.cardTitleSummary}>Others</h3>
                    </div>
                    <div className={styles.cardValueSummary}>
                        {othersTotal.toLocaleString()}
                    </div>
                    <div className={styles.cardLabelSummary}>
                        French, Healthcare, STEM, etc.
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${styles.totalCard}`}>
                    <div className={styles.cardHeaderSummary}>
                        <div className={styles.cardIconSummary}>
                            <TrendingUp />
                        </div>
                        <h3 className={styles.cardTitleSummary}>Total</h3>
                    </div>
                    <div className={styles.cardValueSummary}>
                        {grandTotal.toLocaleString()}
                    </div>
                    <div className={styles.cardLabelSummary}>All Programs Combined</div>
                </div>
            </div>
        </div>
    );
}
