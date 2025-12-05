"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    ViewToggle,
    FilterBar,
    DrawCard,
    DataTable,
    DisclaimerBanner,
    SummaryCards,
    LineChartSection,
    MonthlyBarChart,
    ScoreDistributionChart,
    SafeScoreCard,
    Draw,
    TrendDataPoint,
    ScatterDataPoint,
    MonthlyData,
    categorizeProgram,
} from "./";
import styles from "./CRSScore.module.css";

dayjs.extend(relativeTime);

function CRSScoresEnhanced() {
    // State
    const [draws, setDraws] = useState<Draw[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("All");
    const [selectedYear, setSelectedYear] = useState<string>("All Years");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [lineChartFilter, setLineChartFilter] = useState("CEC");
    const [lineChartYear, setLineChartYear] = useState("2025");
    const [viewMode, setViewMode] = useState<"table" | "analytics">("table");
    const [sortBy, setSortBy] = useState<"date" | "crs" | "invitations">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [darkMode, setDarkMode] = useState(false);

    // Detect dark mode
    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkDarkMode = () => {
                const isDark = document.documentElement.classList.contains("dark");
                setDarkMode(isDark);
            };

            checkDarkMode();

            const observer = new MutationObserver(checkDarkMode);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"],
            });

            return () => observer.disconnect();
        }
    }, []);

    // Fetch draws from API
    useEffect(() => {
        const fetchDraws = async () => {
            try {
                const res = await fetch("/api/draws");
                const data: Draw[] = await res.json();
                setDraws(data);
            } catch (err) {
                console.error("Failed to fetch draws:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDraws();
    }, []);

    // Get latest 3 draws for cards
    const latestThreeDraws = useMemo(() => {
        return [...draws]
            .filter((d) => dayjs(d.draw_date, "MM/DD/YYYY", true).isValid())
            .sort(
                (a, b) =>
                    dayjs(b.draw_date, "MM/DD/YYYY").valueOf() -
                    dayjs(a.draw_date, "MM/DD/YYYY").valueOf()
            )
            .slice(0, 3);
    }, [draws]);

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const stats = {
            CEC: 0,
            PNP: 0,
            Others: 0,
            total: 0,
        };

        draws.forEach((draw) => {
            const invites = Number(draw.invitations) || 0;
            const category = categorizeProgram(draw.program);
            stats[category] += invites;
            stats.total += invites;
        });

        return stats;
    }, [draws]);

    // Get available years
    const availableYears = useMemo(() => {
        const years = Array.from(
            new Set(draws.map((d) => dayjs(d.draw_date).year().toString()))
        ).sort((a, b) => Number(b) - Number(a));
        return ["All Years", ...years];
    }, [draws]);

    // Get available years for line chart
    const lineChartYears = useMemo(() => {
        const years = Array.from(
            new Set(draws.map((d) => dayjs(d.draw_date).year().toString()))
        ).sort((a, b) => Number(b) - Number(a));
        return ["All", ...years];
    }, [draws]);

    // Filter draws
    const filteredDraws = useMemo(() => {
        let filtered = [...draws];

        // Only filter by valid CRS in analytics view (for charts)
        if (viewMode === "analytics") {
            filtered = filtered.filter((d) => {
                const crs = Number(d.crs_cutoff);
                return !isNaN(crs) && crs > 0;
            });
        }

        if (selectedFilter !== "All") {
            filtered = filtered.filter(
                (d) => categorizeProgram(d.program) === selectedFilter
            );
        }

        if (selectedYear !== "All Years") {
            filtered = filtered.filter(
                (d) => dayjs(d.draw_date).year().toString() === selectedYear
            );
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "date") {
                comparison = dayjs(a.draw_date).valueOf() - dayjs(b.draw_date).valueOf();
            } else if (sortBy === "crs") {
                const crsA = Number(a.crs_cutoff) || 0;
                const crsB = Number(b.crs_cutoff) || 0;
                comparison = crsA - crsB;
            } else if (sortBy === "invitations") {
                const invA = Number(a.invitations) || 0;
                const invB = Number(b.invitations) || 0;
                comparison = invA - invB;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    }, [draws, selectedFilter, selectedYear, viewMode, sortBy, sortOrder]);

    // Generate line chart data
    const lineChartData = useMemo(() => {
        let filtered = draws;

        if (lineChartYear !== "All") {
            filtered = filtered.filter((draw) => {
                const drawYear = dayjs(draw.draw_date).year().toString();
                return drawYear === lineChartYear;
            });
        }

        if (lineChartFilter !== "All") {
            filtered = filtered.filter(
                (draw) => categorizeProgram(draw.program) === lineChartFilter
            );
        }

        const data: TrendDataPoint[] = filtered
            .map((draw) => ({
                date: dayjs(draw.draw_date).format("MMM DD, YYYY"),
                timestamp: dayjs(draw.draw_date).valueOf(),
                crs: Number(draw.crs_cutoff),
                program: draw.program,
                category: categorizeProgram(draw.program),
            }))
            .filter((d) => !isNaN(d.crs) && d.crs > 0)
            .sort((a, b) => a.timestamp - b.timestamp);

        return data;
    }, [draws, lineChartYear, lineChartFilter]);

    // Calculate dynamic Y-axis domain
    const yAxisDomain = useMemo(() => {
        if (lineChartData.length === 0) return [300, 900];
        const scores = lineChartData.map((d) => d.crs);
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        return [Math.max(0, min - 20), max + 20];
    }, [lineChartData]);

    // Generate monthly chart data
    const monthlyChartData = useMemo(() => {
        const monthMap = new Map<string, MonthlyData>();

        draws.forEach((draw) => {
            const monthKey = dayjs(draw.draw_date).format("MMM YYYY");
            const category = categorizeProgram(draw.program);
            const invites = Number(draw.invitations) || 0;

            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, {
                    month: monthKey,
                    CEC: 0,
                    PNP: 0,
                    Others: 0,
                });
            }

            const monthData = monthMap.get(monthKey)!;
            monthData[category] += invites;
        });

        const chartData = Array.from(monthMap.values()).sort(
            (a, b) =>
                dayjs(a.month, "MMM YYYY").valueOf() -
                dayjs(b.month, "MMM YYYY").valueOf()
        );

        return chartData.slice(-12);
    }, [draws]);

    // Generate distribution data (scatter plot)
    const distributionData = useMemo(() => {
        let filtered = draws;
        if (lineChartYear !== "All") {
            filtered = filtered.filter((draw) => {
                const drawYear = dayjs(draw.draw_date).year().toString();
                return drawYear === lineChartYear;
            });
        }

        const data: ScatterDataPoint[] = filtered
            .map(draw => ({
                category: categorizeProgram(draw.program),
                crs: Number(draw.crs_cutoff),
                date: dayjs(draw.draw_date).format("MMM DD, YYYY"),
                program: draw.program
            }))
            .filter(d => !isNaN(d.crs) && d.crs > 0);

        return data;
    }, [draws, lineChartYear]);

    // Calculate safe score ranges
    const safeScoreInfo = useMemo(() => {
        const cecScores = filteredDraws
            .filter((d) => categorizeProgram(d.program) === "CEC")
            .map((d) => Number(d.crs_cutoff))
            .filter((s) => s > 0);

        const pnpScores = filteredDraws
            .filter((d) => categorizeProgram(d.program) === "PNP")
            .map((d) => Number(d.crs_cutoff))
            .filter((s) => s > 0);

        const othersScores = filteredDraws
            .filter((d) => categorizeProgram(d.program) === "Others")
            .map((d) => Number(d.crs_cutoff))
            .filter((s) => s > 0);

        const getRange = (scores: number[]) => {
            if (scores.length === 0) return null;
            const sorted = scores.sort((a, b) => a - b);
            const min = Math.min(...sorted.slice(0, Math.ceil(sorted.length * 0.25)));
            const max = Math.max(...sorted.slice(-Math.ceil(sorted.length * 0.25)));
            return { min, max, median: sorted[Math.floor(sorted.length / 2)] };
        };

        return {
            CEC: getRange(cecScores),
            PNP: getRange(pnpScores),
            Others: getRange(othersScores),
        };
    }, [filteredDraws]);

    // Calculate safe line position
    const safeLinePosition = useMemo(() => {
        const recentCEC = filteredDraws
            .filter((d) => categorizeProgram(d.program) === "CEC")
            .sort(
                (a, b) =>
                    dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
            )
            .slice(0, 10)
            .map((d) => Number(d.crs_cutoff))
            .filter((s) => s > 0);

        if (recentCEC.length === 0) return 500;
        return Math.floor(recentCEC.reduce((a, b) => a + b, 0) / recentCEC.length);
    }, [filteredDraws]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter, selectedYear]);

    // Handlers
    const handleSortChange = (newSortBy: "date" | "crs" | "invitations", newSortOrder: "asc" | "desc") => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading CRS data...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>CRS Score Analysis & Draw History</h2>
                <p className={styles.subtitle}>
                    Comprehensive insights into Canadian immigration trends
                </p>
            </div>

            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

            {/* Numbers View - Table Only */}
            {viewMode === "table" && (
                <>
                    <FilterBar
                        selectedFilter={selectedFilter}
                        selectedYear={selectedYear}
                        availableYears={availableYears}
                        onFilterChange={setSelectedFilter}
                        onYearChange={setSelectedYear}
                    />

                    <DataTable
                        draws={filteredDraws}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        onSortChange={handleSortChange}
                    />
                </>
            )}

            {/* Analytics View - Charts and Visualizations */}
            {viewMode === "analytics" && (
                <>
                    <DisclaimerBanner />

                    <SummaryCards
                        cecTotal={summaryStats.CEC}
                        pnpTotal={summaryStats.PNP}
                        othersTotal={summaryStats.Others}
                        grandTotal={summaryStats.total}
                    />

                    <LineChartSection
                        data={lineChartData}
                        yAxisDomain={yAxisDomain as [number, number]}
                        safeLinePosition={safeLinePosition}
                        selectedFilter={lineChartFilter}
                        selectedYear={lineChartYear}
                        availableYears={lineChartYears}
                        onFilterChange={setLineChartFilter}
                        onYearChange={setLineChartYear}
                        darkMode={darkMode}
                    />

                    <MonthlyBarChart data={monthlyChartData} darkMode={darkMode} />

                    <ScoreDistributionChart data={distributionData} safeScore={safeLinePosition} darkMode={darkMode} />

                    <SafeScoreCard
                        cecRange={safeScoreInfo.CEC}
                        pnpRange={safeScoreInfo.PNP}
                        othersRange={safeScoreInfo.Others}
                    />
                </>
            )}

            {/* Footer */}
            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Last updated: {dayjs().format("MMM D, YYYY [at] h:mm A")}
                </p>
            </div>
        </div>
    );
}

export default CRSScoresEnhanced;
