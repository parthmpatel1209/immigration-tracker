"use client";

import { TrendingUp, Target, Users, Award, Layers } from "lucide-react";
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
            <h3 className={styles.sectionTitle}>Invitation Allocation by Program</h3>
            <div className={styles.summaryGrid}>
                {/* CEC Card */}
                <div className={`${styles.summaryCard} ${styles.cecCard}`}>
                    <div>
                        <div className={styles.cardHeaderSummary}>
                            <div className={styles.cardIconSummary}>
                                <TrendingUp />
                            </div>
                            <h4 className={styles.cardTitleSummary}>CEC</h4>
                        </div>
                        <div className={styles.cardValueSummary}>
                            {cecTotal.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className={styles.cardProgressSummary}>
                            <div
                                className={styles.cardProgressBarSummary}
                                style={{ width: `${cecPercent}%` }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className={styles.cardLabelSummary}>Canadian Experience</span>
                            <span className={styles.cardPercentSummary}>{cecPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* PNP Card */}
                <div className={`${styles.summaryCard} ${styles.pnpCard}`}>
                    <div>
                        <div className={styles.cardHeaderSummary}>
                            <div className={styles.cardIconSummary}>
                                <Target />
                            </div>
                            <h4 className={styles.cardTitleSummary}>PNP</h4>
                        </div>
                        <div className={styles.cardValueSummary}>
                            {pnpTotal.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className={styles.cardProgressSummary}>
                            <div
                                className={styles.cardProgressBarSummary}
                                style={{ width: `${pnpPercent}%` }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className={styles.cardLabelSummary}>Provincial Nominee</span>
                            <span className={styles.cardPercentSummary}>{pnpPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Category-Based Card */}
                <div className={`${styles.summaryCard} ${styles.categoryBasedCard}`}>
                    <div>
                        <div className={styles.cardHeaderSummary}>
                            <div className={styles.cardIconSummary}>
                                <Users />
                            </div>
                            <h4 className={styles.cardTitleSummary}>Category-Based</h4>
                        </div>
                        <div className={styles.cardValueSummary}>
                            {categoryBasedTotal.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className={styles.cardProgressSummary}>
                            <div
                                className={styles.cardProgressBarSummary}
                                style={{ width: `${categoryBasedPercent}%` }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className={styles.cardLabelSummary}>Targeted Occupations</span>
                            <span className={styles.cardPercentSummary}>{categoryBasedPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Other Card */}
                <div className={`${styles.summaryCard} ${styles.nonEECard}`}>
                    <div>
                        <div className={styles.cardHeaderSummary}>
                            <div className={styles.cardIconSummary}>
                                <Award />
                            </div>
                            <h4 className={styles.cardTitleSummary}>Other</h4>
                        </div>
                        <div className={styles.cardValueSummary}>
                            {nonEETotal.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className={styles.cardProgressSummary}>
                            <div
                                className={styles.cardProgressBarSummary}
                                style={{ width: `${nonEEPercent}%` }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className={styles.cardLabelSummary}>Non-EE & Specialized</span>
                            <span className={styles.cardPercentSummary}>{nonEEPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Total Combined Card */}
                <div className={`${styles.summaryCard} ${styles.totalCard}`}>
                    <div>
                        <div className={styles.cardHeaderSummary}>
                            <div className={styles.cardIconSummary}>
                                <Layers />
                            </div>
                            <h4 className={styles.cardTitleSummary}>Total Invitations</h4>
                        </div>
                        <div className={styles.cardValueSummary}>
                            {grandTotal.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className={styles.cardProgressSummary}>
                            <div
                                className={styles.cardProgressBarSummary}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className={styles.cardLabelSummary}>All Streams Combined</span>
                            <span className={styles.cardPercentSummary}>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
