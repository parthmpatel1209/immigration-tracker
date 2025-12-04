"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Calendar, Users, Hash, MapPin, TrendingUp } from "lucide-react";
import styles from "./LatestDrawsEnhanced.module.css";

dayjs.extend(relativeTime);

interface Draw {
    id: number;
    round: string;
    program: string;
    crs_cutoff: string;
    invitations: string;
    draw_date: string;
    draw_province: string | null;
}

interface MonthlyData {
    month: string;
    CEC: number;
    PNP: number;
    Others: number;
}

export default function LatestDrawsEnhanced() {
    const [draws, setDraws] = useState<Draw[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("All");
    const [selectedYear, setSelectedYear] = useState<string>("All Years");
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    // Detect dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setDarkMode(document.documentElement.classList.contains("dark"));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Fetch draws
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

    // Helper function to categorize programs
    const categorizeProgram = (program: string): "CEC" | "PNP" | "Others" => {
        const upperProgram = program.toUpperCase();
        if (upperProgram.includes("CEC") || upperProgram === "CANADIAN EXPERIENCE CLASS") {
            return "CEC";
        }
        if (upperProgram.includes("PNP") || upperProgram.includes("PROVINCIAL")) {
            return "PNP";
        }
        return "Others";
    };

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

    // Filter draws
    const filteredDraws = useMemo(() => {
        let filtered = [...draws];

        // Filter by program category
        if (selectedFilter !== "All") {
            filtered = filtered.filter(
                (d) => categorizeProgram(d.program) === selectedFilter
            );
        }

        // Filter by year
        if (selectedYear !== "All Years") {
            filtered = filtered.filter(
                (d) => dayjs(d.draw_date).year().toString() === selectedYear
            );
        }

        // Sort by date (most recent first)
        filtered.sort(
            (a, b) =>
                dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
        );

        return filtered;
    }, [draws, selectedFilter, selectedYear]);

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

        // Convert to array and sort by date
        const chartData = Array.from(monthMap.values()).sort((a, b) =>
            dayjs(a.month, "MMM YYYY").valueOf() - dayjs(b.month, "MMM YYYY").valueOf()
        );

        // Return last 12 months
        return chartData.slice(-12);
    }, [draws]);

    const filterButtons = ["All", "CEC", "PNP", "Others"];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading draws data...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Latest Draws</h2>
                <p className={styles.subtitle}>
                    Express Entry invitation rounds and statistics
                </p>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Program</label>
                    <div className={styles.filterButtons}>
                        {filterButtons.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`${styles.filterBtn} ${selectedFilter === filter ? styles.filterBtnActive : ""
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Year</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={styles.yearSelect}
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={`${styles.summaryCard} ${styles.cecCard}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <TrendingUp />
                        </div>
                        <h3 className={styles.cardTitle}>CEC</h3>
                    </div>
                    <div className={styles.cardBody}>
                        <p className={styles.cardValue}>
                            {summaryStats.CEC.toLocaleString()}
                        </p>
                        <p className={styles.cardLabel}>invitations</p>
                        <div className={styles.cardProgress}>
                            <div
                                className={styles.cardProgressBar}
                                style={{
                                    width: `${(summaryStats.CEC / summaryStats.total) * 100}%`,
                                    backgroundColor: "#3b82f6",
                                }}
                            ></div>
                        </div>
                        <p className={styles.cardPercent}>
                            {((summaryStats.CEC / summaryStats.total) * 100).toFixed(1)}% of
                            total
                        </p>
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${styles.pnpCard}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <MapPin />
                        </div>
                        <h3 className={styles.cardTitle}>PNP</h3>
                    </div>
                    <div className={styles.cardBody}>
                        <p className={styles.cardValue}>
                            {summaryStats.PNP.toLocaleString()}
                        </p>
                        <p className={styles.cardLabel}>invitations</p>
                        <div className={styles.cardProgress}>
                            <div
                                className={styles.cardProgressBar}
                                style={{
                                    width: `${(summaryStats.PNP / summaryStats.total) * 100}%`,
                                    backgroundColor: "#10b981",
                                }}
                            ></div>
                        </div>
                        <p className={styles.cardPercent}>
                            {((summaryStats.PNP / summaryStats.total) * 100).toFixed(1)}% of
                            total
                        </p>
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${styles.othersCard}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <Users />
                        </div>
                        <h3 className={styles.cardTitle}>Others</h3>
                    </div>
                    <div className={styles.cardBody}>
                        <p className={styles.cardValue}>
                            {summaryStats.Others.toLocaleString()}
                        </p>
                        <p className={styles.cardLabel}>invitations</p>
                        <div className={styles.cardProgress}>
                            <div
                                className={styles.cardProgressBar}
                                style={{
                                    width: `${(summaryStats.Others / summaryStats.total) * 100}%`,
                                    backgroundColor: "#a855f7",
                                }}
                            ></div>
                        </div>
                        <p className={styles.cardPercent}>
                            {((summaryStats.Others / summaryStats.total) * 100).toFixed(1)}%
                            of total
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className={styles.chartSection}>
                <h3 className={styles.chartTitle}>
                    Monthly Invitations by Program (Last 12 Months)
                </h3>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyChartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={darkMode ? "#374151" : "#e5e7eb"}
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                                    borderRadius: "8px",
                                    color: darkMode ? "#f3f4f6" : "#111827",
                                }}
                                cursor={{ fill: darkMode ? "#374151" : "#f3f4f6" }}
                            />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: "20px",
                                }}
                            />
                            <Bar dataKey="CEC" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="PNP" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                            <Bar
                                dataKey="Others"
                                stackId="a"
                                fill="#a855f7"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table Section */}
            <div className={styles.tableSection}>
                <h3 className={styles.tableTitle}>
                    Draw History ({filteredDraws.length} results)
                </h3>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>
                                    <Hash className={styles.thIcon} />
                                    Round
                                </th>
                                <th className={styles.th}>Date</th>
                                <th className={styles.th}>Program</th>
                                <th className={styles.th}>Province</th>
                                <th className={styles.th}>CRS</th>
                                <th className={styles.th}>
                                    <Users className={styles.thIcon} />
                                    ITAs
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDraws.length > 0 ? (
                                filteredDraws.map((draw, index) => (
                                    <tr
                                        key={draw.id}
                                        className={styles.tr}
                                        style={{
                                            animationDelay: `${index * 0.02}s`,
                                        }}
                                    >
                                        <td className={styles.td}>
                                            <span className={styles.roundBadge}>#{draw.round}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.dateCell}>
                                                <div className={styles.datePrimary}>
                                                    {dayjs(draw.draw_date).format("MMM D, YYYY")}
                                                </div>
                                                <div className={styles.dateSecondary}>
                                                    {dayjs(draw.draw_date).fromNow()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span
                                                className={`${styles.programBadge} ${styles[`badge${categorizeProgram(draw.program)}`]
                                                    }`}
                                            >
                                                {draw.program}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.province}>
                                                {draw.draw_province || "All Canada"}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.crsScore}>
                                                {draw.crs_cutoff || "N/A"}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.invitations}>
                                                {Number(draw.invitations).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.emptyRow}>
                                        <div className={styles.emptyState}>
                                            <Calendar className={styles.emptyIcon} />
                                            <p>No draws found for the selected filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Last updated: {dayjs().format("MMM D, YYYY [at] h:mm A")}
                </p>
            </div>
        </div>
    );
}
