import { TrendingUp, Target, Users } from "lucide-react";
import styles from "./CRSScore.module.css";

interface SummaryCardsProps {
    cecTotal: number;
    pnpTotal: number;
    categoryBasedTotal: number;
    nonEETotal: number;
    grandTotal: number;
}

export default function SummaryCards({
    cecTotal,
    pnpTotal,
    categoryBasedTotal,
    nonEETotal,
    grandTotal,
}: SummaryCardsProps) {
    const totalSafe = grandTotal || 1;
    const cecPercent = Math.round((cecTotal / totalSafe) * 100);
    const pnpPercent = Math.round((pnpTotal / totalSafe) * 100);
    const categoryBasedPercent = Math.round((categoryBasedTotal / totalSafe) * 100);
    const nonEEPercent = Math.round((nonEETotal / totalSafe) * 100);

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
                    <div className={styles.cardProgressSummary}>
                        <div
                            className={styles.cardProgressBarSummary}
                            style={{ width: `${cecPercent}%` }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className={styles.cardLabelSummary}>Canadian Experience Class</div>
                        <div className={styles.cardPercentSummary}>{cecPercent}%</div>
                    </div>
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
                    <div className={styles.cardProgressSummary}>
                        <div
                            className={styles.cardProgressBarSummary}
                            style={{ width: `${pnpPercent}%` }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className={styles.cardLabelSummary}>Provincial Nominee Program</div>
                        <div className={styles.cardPercentSummary}>{pnpPercent}%</div>
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${styles.categoryBasedCard}`}>
                    <div className={styles.cardHeaderSummary}>
                        <div className={styles.cardIconSummary}>
                            <Users />
                        </div>
                        <h3 className={styles.cardTitleSummary}>Category Based</h3>
                    </div>
                    <div className={styles.cardValueSummary}>
                        {categoryBasedTotal.toLocaleString()}
                    </div>
                    <div className={styles.cardProgressSummary}>
                        <div
                            className={styles.cardProgressBarSummary}
                            style={{ width: `${categoryBasedPercent}%` }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className={styles.cardLabelSummary}>French, Healthcare, STEM, etc.</div>
                        <div className={styles.cardPercentSummary}>{categoryBasedPercent}%</div>
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${styles.nonEECard}`}>
                    <div className={styles.cardHeaderSummary}>
                        <div className={styles.cardIconSummary}>
                            <Target />
                        </div>
                        <h3 className={styles.cardTitleSummary}>Other</h3>
                    </div>
                    <div className={styles.cardValueSummary}>
                        {nonEETotal.toLocaleString()}
                    </div>
                    <div className={styles.cardProgressSummary}>
                        <div
                            className={styles.cardProgressBarSummary}
                            style={{ width: `${nonEEPercent}%` }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className={styles.cardLabelSummary}>Non-Express Entry Draws</div>
                        <div className={styles.cardPercentSummary}>{nonEEPercent}%</div>
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
                    <div className={styles.cardProgressSummary}>
                        <div
                            className={styles.cardProgressBarSummary}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className={styles.cardLabelSummary}>All Programs Combined</div>
                        <div className={styles.cardPercentSummary}>100%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
