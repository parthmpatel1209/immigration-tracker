import React from "react";
import styles from "./Calculator.module.css";

interface ResultProps {
    result: {
        agePoints: number;
        educationPoints: number;
        languagePoints: number;
        secondLanguagePoints?: number;
        canadianWorkPoints?: number;
        spouseEducationPoints?: number;
        spouseLanguagePoints?: number;
        skillTransferabilityPoints?: number;
        additionalPoints?: number;
        total: number;
    };
    hasSpouse: boolean;
}

export default function ResultsBreakdown({ result, hasSpouse }: ResultProps) {
    return (
        <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
                <div>
                    <div className={styles.totalScoreTitle}>Total CRS Score</div>
                    <div className={styles.totalScoreValue}>{result.total}</div>
                </div>
                <div className={styles.totalScoreSubtitle}>
                    / 1200
                </div>
            </div>

            <div className={styles.breakdownGrid}>
                <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>Age</div>
                    <div className={styles.breakdownValue}>{result.agePoints}</div>
                </div>
                <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>Education</div>
                    <div className={styles.breakdownValue}>{result.educationPoints}</div>
                </div>
                <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>First Language</div>
                    <div className={styles.breakdownValue}>{result.languagePoints}</div>
                </div>

                {result.secondLanguagePoints ? (
                    <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Second Language</div>
                        <div className={styles.breakdownValue}>{result.secondLanguagePoints}</div>
                    </div>
                ) : null}

                {result.canadianWorkPoints ? (
                    <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Canadian Work</div>
                        <div className={styles.breakdownValue}>{result.canadianWorkPoints}</div>
                    </div>
                ) : null}

                {hasSpouse && (
                    <>
                        <div className={styles.breakdownItem}>
                            <div className={styles.breakdownLabel}>Spouse Education</div>
                            <div className={styles.breakdownValue}>{result.spouseEducationPoints}</div>
                        </div>
                        <div className={styles.breakdownItem}>
                            <div className={styles.breakdownLabel}>Spouse Language</div>
                            <div className={styles.breakdownValue}>{result.spouseLanguagePoints}</div>
                        </div>
                    </>
                )}

                <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>Skill Transferability</div>
                    <div className={styles.breakdownValue}>{result.skillTransferabilityPoints}</div>
                </div>

                <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>Additional Points</div>
                    <div className={styles.breakdownValue}>{result.additionalPoints}</div>
                </div>
            </div>
        </div>
    );
}
