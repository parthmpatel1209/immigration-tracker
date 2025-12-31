/**
 * CLB Chart Modal Component
 * 
 * Displays comprehensive language test to CLB conversion chart in table format
 * Highlights rows matching user's entered scores
 */

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Info, CheckCircle } from "lucide-react";
import styles from "./CLBChartModal.module.css";

interface CLBChartModalProps {
    testType: string;
    benchmarks: any[];
    onClose: () => void;
    userScores?: {
        listening?: number;
        reading?: number;
        writing?: number;
        speaking?: number;
    };
}

export default function CLBChartModal({
    testType,
    benchmarks,
    onClose,
    userScores
}: CLBChartModalProps) {
    // Filter benchmarks for the selected test type
    const filteredBenchmarks = benchmarks.filter((b) => b.test_name === testType);

    // Sort by CLB level descending
    const sortedBenchmarks = filteredBenchmarks.sort((a, b) => b.clb_level - a.clb_level);

    // Helper function to check if a score matches a range
    const scoreMatchesRange = (userScore: number | undefined, rangeStr: string): boolean => {
        if (!userScore || !rangeStr) return false;

        // Handle ranges like "8.0–9.0" (en-dash) or "69-77" (hyphen) or single values like "7.0"
        // Check for both en-dash (–) and regular hyphen (-)
        if (rangeStr.includes("–") || rangeStr.includes("-")) {
            // Split by either en-dash or hyphen
            const separator = rangeStr.includes("–") ? "–" : "-";
            const [min, max] = rangeStr.split(separator).map(s => parseFloat(s.trim()));

            // Check if parsing was successful
            if (isNaN(min) || isNaN(max)) return false;

            return userScore >= min && userScore <= max;
        } else {
            const value = parseFloat(rangeStr);
            if (isNaN(value)) return false;
            return userScore === value;
        }
    };

    // Check if a row matches user's scores
    const rowMatchesUserScores = (benchmark: any): boolean => {
        if (!userScores) return false;

        const listeningMatch = userScores.listening ?
            scoreMatchesRange(userScores.listening, benchmark.listening) : true;
        const readingMatch = userScores.reading ?
            scoreMatchesRange(userScores.reading, benchmark.reading) : true;
        const writingMatch = userScores.writing ?
            scoreMatchesRange(userScores.writing, benchmark.writing) : true;
        const speakingMatch = userScores.speaking ?
            scoreMatchesRange(userScores.speaking, benchmark.speaking) : true;

        // At least one score must match
        const hasMatch = Boolean(
            (userScores.listening && listeningMatch) ||
            (userScores.reading && readingMatch) ||
            (userScores.writing && writingMatch) ||
            (userScores.speaking && speakingMatch)
        );

        return hasMatch;
    };

    // Check if a specific cell matches user's score
    const cellMatchesUserScore = (userScore: number | undefined, rangeStr: string): boolean => {
        return scoreMatchesRange(userScore, rangeStr);
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    let content;

    if (sortedBenchmarks.length === 0) {
        content = (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <Info className={styles.headerIcon} />
                            <div>
                                <h2 className={styles.title}>No Data Available</h2>
                                <p className={styles.subtitle}>
                                    CLB conversion data not found for {testType}
                                </p>
                            </div>
                        </div>
                        <button className={styles.closeButton} onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className={styles.content}>
                        <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                            Please check back later or contact support.
                        </p>
                    </div>
                </div>
            </div>
        );
    } else {
        const hasUserScores = userScores && (
            userScores.listening || userScores.reading || userScores.writing || userScores.speaking
        );

        content = (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <Info className={styles.headerIcon} />
                            <div>
                                <h2 className={styles.title}>{testType} to CLB Conversion Chart</h2>
                                <p className={styles.subtitle}>
                                    Complete Canadian Language Benchmark (CLB) equivalency reference
                                    {hasUserScores && " • Your scores are highlighted"}
                                </p>
                            </div>
                        </div>
                        <button className={styles.closeButton} onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content - Comprehensive Table */}
                    <div className={styles.content}>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.clbColumn}>CLB Level</th>
                                        <th>
                                            Listening
                                            {userScores?.listening && (
                                                <span className={styles.userScoreLabel}> ({userScores.listening})</span>
                                            )}
                                        </th>
                                        <th>
                                            Reading
                                            {userScores?.reading && (
                                                <span className={styles.userScoreLabel}> ({userScores.reading})</span>
                                            )}
                                        </th>
                                        <th>
                                            Writing
                                            {userScores?.writing && (
                                                <span className={styles.userScoreLabel}> ({userScores.writing})</span>
                                            )}
                                        </th>
                                        <th>
                                            Speaking
                                            {userScores?.speaking && (
                                                <span className={styles.userScoreLabel}> ({userScores.speaking})</span>
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedBenchmarks.map((benchmark) => {
                                        const isUserRow = rowMatchesUserScores(benchmark);
                                        const isHighCLB = benchmark.clb_level >= 9;

                                        return (
                                            <tr
                                                key={benchmark.id || benchmark.clb_level}
                                                className={`
                            ${isHighCLB ? styles.highCLB : ""}
                            ${isUserRow ? styles.userRow : ""}
                          `}
                                            >
                                                <td className={styles.clbCell}>
                                                    <span className={styles.clbBadge}>
                                                        {isUserRow && <CheckCircle size={14} style={{ marginRight: "4px" }} />}
                                                        CLB {benchmark.clb_level}
                                                    </span>
                                                </td>
                                                <td className={`${styles.scoreCell} ${cellMatchesUserScore(userScores?.listening, benchmark.listening)
                                                    ? styles.matchedCell : ""
                                                    }`}>
                                                    {benchmark.listening || "—"}
                                                </td>
                                                <td className={`${styles.scoreCell} ${cellMatchesUserScore(userScores?.reading, benchmark.reading)
                                                    ? styles.matchedCell : ""
                                                    }`}>
                                                    {benchmark.reading || "—"}
                                                </td>
                                                <td className={`${styles.scoreCell} ${cellMatchesUserScore(userScores?.writing, benchmark.writing)
                                                    ? styles.matchedCell : ""
                                                    }`}>
                                                    {benchmark.writing || "—"}
                                                </td>
                                                <td className={`${styles.scoreCell} ${cellMatchesUserScore(userScores?.speaking, benchmark.speaking)
                                                    ? styles.matchedCell : ""
                                                    }`}>
                                                    {benchmark.speaking || "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.footerNote}>
                            <Info size={16} />
                            <div>
                                <strong>Pro Tip:</strong> CLB 9+ in all four skills significantly increases
                                your CRS score. Aim for the highest possible scores in each module!
                                {hasUserScores && (
                                    <span className={styles.highlightNote}>
                                        {" "}Rows with <CheckCircle size={14} style={{ display: "inline", verticalAlign: "middle" }} /> show your current CLB levels.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return createPortal(content, document.body);
}
