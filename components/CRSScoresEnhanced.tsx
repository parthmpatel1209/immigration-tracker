"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    ScatterChart,
    Scatter,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Label,
} from "recharts";
import {
    TrendingUp,
    Target,
    AlertCircle,
    BarChart3,
    Calendar,
    Users,
    Hash,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Award,
    Table,
    LineChart as LineChartIcon,
} from "lucide-react";
import styles from "./CRSScoresEnhanced.module.css";

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

interface TrendDataPoint {
    date: string;
    timestamp: number;
    crs: number;
    program: string;
    category: string;
}

interface ScatterDataPoint {
    category: string;
    crs: number;
    date: string;
    program: string;
}

interface MonthlyData {
    month: string;
    CEC: number;
    PNP: number;
    Others: number;
}

// Badge colors for draw cards
const BADGE_COLORS: Record<
    string,
    { light: { bg: string; text: string }; dark: { bg: string; text: string } }
> = {
    "Express Entry": {
        light: { bg: "#e0e7ff", text: "#4338ca" },
        dark: { bg: "#312e81", text: "#c7d2fe" },
    },
    PNP: {
        light: { bg: "#d1fae5", text: "#065f46" },
        dark: { bg: "#064e3b", text: "#a7f3d0" },
    },
    CEC: {
        light: { bg: "#e9d5ff", text: "#6b21a8" },
        dark: { bg: "#4c1d95", text: "#e9d5ff" },
    },
    FSW: {
        light: { bg: "#fef3c7", text: "#92400e" },
        dark: { bg: "#78350f", text: "#fde68a" },
    },
    default: {
        light: { bg: "#e5e7eb", text: "#374151" },
        dark: { bg: "#374151", text: "#d1d5db" },
    },
};

const NA = (value: any, fallback = "N/A"): string => {
    if (value == null) return fallback;
    if (typeof value === "string" && value.trim() === "") return fallback;
    return String(value);
};

// Draw Card Component
function DrawCard({ draw, rank }: { draw: Draw; rank: 1 | 2 | 3 }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const badge = BADGE_COLORS[draw.program] ?? BADGE_COLORS.default;
    const colors = isDark ? badge.dark : badge.light;

    const formattedDate = dayjs(draw.draw_date, "MM/DD/YYYY", true).isValid()
        ? dayjs(draw.draw_date, "MM/DD/YYYY").format("MMM D, YYYY")
        : NA(draw.draw_date);

    const rankLabel =
        rank === 1 ? "Latest" : rank === 2 ? "2nd Latest" : "3rd Latest";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={styles.drawCard}
            style={
                {
                    "--badge-bg": colors.bg,
                    "--badge-text": colors.text,
                } as React.CSSProperties
            }
        >
            <div className={styles.cardGlass}>
                <div className={styles.cardGlow} />
                <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{rankLabel} Draw</h3>
                    <span className={styles.cardBadge}>{draw.program}</span>
                </header>
                <div className={styles.cardCrs}>
                    <Hash
                        className={styles.cardIcon}
                        style={{ color: isDark ? "#93c5fd" : "#3b82f6" }}
                    />
                    <span className={styles.cardCrsValue}>{NA(draw.crs_cutoff)}</span>
                </div>
                <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                        <Users className={styles.cardIconSm} />
                        <span>
                            {draw.invitations != null
                                ? /^\d+$/.test(draw.invitations)
                                    ? Number(draw.invitations).toLocaleString()
                                    : draw.invitations
                                : "N/A"}
                        </span>
                    </div>
                    <div className={styles.cardStat}>
                        <Calendar className={styles.cardIconSm} />
                        <span>{formattedDate}</span>
                    </div>
                </div>
                <footer className={styles.cardFooter}>
                    <span>Round #{NA(draw.round)}</span>
                    <span className={styles.cardSep}> | </span>
                    <span className={styles.cardProvince}>
                        <MapPin className={styles.cardProvIcon} />
                        {NA(draw.draw_province)}
                    </span>
                </footer>
            </div>
        </motion.div>
    );
}

function CRSScoresEnhanced() {
    const [draws, setDraws] = useState<Draw[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("All");
    const [selectedYear, setSelectedYear] = useState<string>("All Years");
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [lineChartFilter, setLineChartFilter] = useState("CEC");
    const [lineChartYear, setLineChartYear] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "analytics">("table");

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

    // Helper function to categorize programs
    const categorizeProgram = (program: string): "CEC" | "PNP" | "Others" => {
        const upperProgram = program.toUpperCase();
        if (
            upperProgram.includes("CEC") ||
            upperProgram === "CANADIAN EXPERIENCE CLASS"
        ) {
            return "CEC";
        }
        if (upperProgram.includes("PNP") || upperProgram.includes("PROVINCIAL")) {
            return "PNP";
        }
        return "Others";
    };

    // Generate trend data specifically for the Line Chart (independent of global program filter)
    const lineChartData = useMemo(() => {
        let filtered = draws;

        // Filter by Line Chart Year
        if (lineChartYear !== "All") {
            filtered = filtered.filter((draw) => {
                const drawYear = dayjs(draw.draw_date).year().toString();
                return drawYear === lineChartYear;
            });
        }

        // Filter by Line Chart Category
        if (lineChartFilter !== "All") {
            filtered = filtered.filter(
                (draw) => categorizeProgram(draw.program) === lineChartFilter
            );
        }

        const data = filtered
            .map((draw) => ({
                date: dayjs(draw.draw_date).format("MMM DD, YYYY"),
                timestamp: dayjs(draw.draw_date).valueOf(),
                crs: Number(draw.crs_cutoff),
                program: draw.program,
                category: categorizeProgram(draw.program),
            }))
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

    // Filter draws
    const filteredDraws = useMemo(() => {
        let filtered = [...draws];

        // Only filter by valid CRS in analytics view (for charts)
        // In table/numbers view, show all entries
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

        return filtered.sort(
            (a, b) =>
                dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
        );
    }, [draws, selectedFilter, selectedYear, viewMode]);

    // Generate trend data
    const trendData = useMemo(() => {
        const data: TrendDataPoint[] = filteredDraws
            .map((draw) => ({
                date: dayjs(draw.draw_date).format("MMM DD, YYYY"),
                timestamp: dayjs(draw.draw_date).valueOf(),
                crs: Number(draw.crs_cutoff),
                program: draw.program,
                category: categorizeProgram(draw.program),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
        return data;
    }, [filteredDraws]);

    // Generate scatter data
    const scatterData = useMemo(() => {
        const grouped: Record<string, ScatterDataPoint[]> = {
            CEC: [],
            PNP: [],
            Others: [],
        };

        filteredDraws.forEach((draw) => {
            const category = categorizeProgram(draw.program);
            grouped[category].push({
                category,
                crs: Number(draw.crs_cutoff),
                date: dayjs(draw.draw_date).format("MMM DD, YYYY"),
                program: draw.program,
            });
        });

        return grouped;
    }, [filteredDraws]);

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

    // Pagination logic
    const totalPages = Math.ceil(filteredDraws.length / itemsPerPage);
    const paginatedDraws = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredDraws.slice(start, end);
    }, [filteredDraws, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter, selectedYear]);

    const filterButtons = ["All", "CEC", "PNP", "Others"];

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
            <div className={styles.viewToggleContainer}>
                <button
                    onClick={() => setViewMode("table")}
                    className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleBtnActive : ""} `}
                >
                    <Table className={styles.viewToggleIcon} />
                    Numbers
                </button>
                <button
                    onClick={() => setViewMode("analytics")}
                    className={`${styles.viewToggleBtn} ${viewMode === "analytics" ? styles.viewToggleBtnActive : ""} `}
                >
                    <LineChartIcon className={styles.viewToggleIcon} />
                    Analytics
                </button>
            </div>

            {/* Numbers View - Table Only */}
            {viewMode === "table" && (
                <>
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
                                            } `}
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

                    {/* Data Table */}
                    <div className={styles.tableSection}>
                        <div className={styles.tableHeaderRow}>
                            <h3 className={styles.tableTitle}>
                                Complete Draw History ({filteredDraws.length} results)
                            </h3>
                            <div className={styles.rowsPerPage}>
                                <span className={styles.rowsLabel}>Rows per page:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className={styles.rowsSelect}
                                >
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th className={styles.th}>
                                            <Hash className={styles.thIcon} />
                                            Round
                                        </th>
                                        <th className={styles.th}>
                                            <Calendar className={styles.thIcon} />
                                            Date
                                        </th>
                                        <th className={styles.th}>
                                            <Award className={styles.thIcon} />
                                            Program
                                        </th>
                                        <th className={styles.th}>
                                            <MapPin className={styles.thIcon} />
                                            Province
                                        </th>
                                        <th className={styles.th}>
                                            <Target className={styles.thIcon} />
                                            CRS
                                        </th>
                                        <th className={styles.th}>
                                            <Users className={styles.thIcon} />
                                            ITAs
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDraws.length > 0 ? (
                                        paginatedDraws.map((draw, index) => (
                                            <tr
                                                key={draw.id}
                                                className={styles.tr}
                                                style={{
                                                    animationDelay: `${index * 0.02} s`,
                                                }}
                                            >
                                                <td className={styles.td} data-label="Round">
                                                    <span className={styles.roundBadge}>#{draw.round}</span>
                                                </td>
                                                <td className={styles.td} data-label="Date">
                                                    <div className={styles.dateCell}>
                                                        <div className={styles.datePrimary}>
                                                            {dayjs(draw.draw_date).format("MMM D, YYYY")}
                                                        </div>
                                                        <div className={styles.dateSecondary}>
                                                            {dayjs(draw.draw_date).fromNow()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={styles.td} data-label="Program">
                                                    <span
                                                        className={`${styles.programBadge} ${styles[`badge${categorizeProgram(draw.program)}`]
                                                            } `}
                                                    >
                                                        {draw.program}
                                                    </span>
                                                </td>
                                                <td className={styles.td} data-label="Province">
                                                    <span className={styles.province}>
                                                        {draw.draw_province || "All Canada"}
                                                    </span>
                                                </td>
                                                <td className={styles.td} data-label="CRS Score">
                                                    <span className={styles.crsScore}>
                                                        {draw.crs_cutoff || "N/A"}
                                                    </span>
                                                </td>
                                                <td className={styles.td} data-label="Invitations">
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

                        {/* Pagination Controls */}
                        {filteredDraws.length > itemsPerPage && (
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={styles.paginationBtn}
                                >
                                    <ChevronLeft className={styles.paginationIcon} />
                                    Previous
                                </button>

                                <div className={styles.paginationPages}>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            // Show first page, last page, current page, and 1 page on each side
                                            if (page === 1 || page === totalPages) return true;
                                            if (Math.abs(page - currentPage) <= 1) return true;
                                            return false;
                                        })
                                        .map((page, index, array) => (
                                            <>
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span key={`ellipsis - ${page} `} className={styles.paginationEllipsis}>
                                                        ...
                                                    </span>
                                                )}
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`${styles.paginationPageBtn} ${currentPage === page ? styles.paginationPageBtnActive : ""
                                                        } `}
                                                >
                                                    {page}
                                                </button>
                                            </>
                                        ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={styles.paginationBtn}
                                >
                                    Next
                                    <ChevronRight className={styles.paginationIcon} />
                                </button>
                            </div>
                        )}

                        <div className={styles.paginationInfo}>
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredDraws.length)} of{" "}
                            {filteredDraws.length} results
                        </div>
                    </div>
                </>
            )}

            {/* Analytics View - Charts and Visualizations */}
            {viewMode === "analytics" && (
                <>
                    {/* Disclaimer Banner */}
                    <div className={styles.disclaimerBanner}>
                        <div className={styles.disclaimerIcon}>
                            <AlertCircle />
                        </div>
                        <div className={styles.disclaimerContent}>
                            <h4 className={styles.disclaimerTitle}>Data Accuracy Notice</h4>
                            <p className={styles.disclaimerText}>
                                The analytics presented here are based on historical draw data and may contain inaccuracies,
                                especially for the <strong>"Others"</strong> category (French-language, Healthcare, etc.).
                                Always verify official information directly with{" "}
                                <a
                                    href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.disclaimerLink}
                                >
                                    IRCC (Immigration, Refugees and Citizenship Canada)
                                </a>.
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className={styles.summarySection}>
                        <h3 className={styles.sectionTitle}>Total Invitations by Category</h3>
                        <div className={styles.summaryGrid}>
                            <div className={`${styles.summaryCard} ${styles.cecCard} `}>
                                <div className={styles.cardHeaderSummary}>
                                    <div className={styles.cardIconSummary}>
                                        <TrendingUp />
                                    </div>
                                    <h3 className={styles.cardTitleSummary}>CEC</h3>
                                </div>
                                <div className={styles.cardBodySummary}>
                                    <p className={styles.cardValueSummary}>
                                        {summaryStats.CEC.toLocaleString()}
                                    </p>
                                    <p className={styles.cardLabelSummary}>invitations</p>
                                    <div className={styles.cardProgressSummary}>
                                        <div
                                            className={styles.cardProgressBarSummary}
                                            style={{
                                                width: `${(summaryStats.CEC / summaryStats.total) * 100}% `,
                                                backgroundColor: "#3b82f6",
                                            }}
                                        ></div>
                                    </div>
                                    <p className={styles.cardPercentSummary}>
                                        {((summaryStats.CEC / summaryStats.total) * 100).toFixed(1)}% of
                                        total
                                    </p>
                                </div>
                            </div>

                            <div className={`${styles.summaryCard} ${styles.pnpCard} `}>
                                <div className={styles.cardHeaderSummary}>
                                    <div className={styles.cardIconSummary}>
                                        <MapPin />
                                    </div>
                                    <h3 className={styles.cardTitleSummary}>PNP</h3>
                                </div>
                                <div className={styles.cardBodySummary}>
                                    <p className={styles.cardValueSummary}>
                                        {summaryStats.PNP.toLocaleString()}
                                    </p>
                                    <p className={styles.cardLabelSummary}>invitations</p>
                                    <div className={styles.cardProgressSummary}>
                                        <div
                                            className={styles.cardProgressBarSummary}
                                            style={{
                                                width: `${(summaryStats.PNP / summaryStats.total) * 100}% `,
                                                backgroundColor: "#10b981",
                                            }}
                                        ></div>
                                    </div>
                                    <p className={styles.cardPercentSummary}>
                                        {((summaryStats.PNP / summaryStats.total) * 100).toFixed(1)}% of
                                        total
                                    </p>
                                </div>
                            </div>

                            <div className={`${styles.summaryCard} ${styles.othersCard} `}>
                                <div className={styles.cardHeaderSummary}>
                                    <div className={styles.cardIconSummary}>
                                        <Users />
                                    </div>
                                    <h3 className={styles.cardTitleSummary}>Others</h3>
                                </div>
                                <div className={styles.cardBodySummary}>
                                    <p className={styles.cardValueSummary}>
                                        {summaryStats.Others.toLocaleString()}
                                    </p>
                                    <p className={styles.cardLabelSummary}>invitations</p>
                                    <div className={styles.cardProgressSummary}>
                                        <div
                                            className={styles.cardProgressBarSummary}
                                            style={{
                                                width: `${(summaryStats.Others / summaryStats.total) * 100
                                                    }% `,
                                                backgroundColor: "#a855f7",
                                            }}
                                        ></div>
                                    </div>
                                    <p className={styles.cardPercentSummary}>
                                        {((summaryStats.Others / summaryStats.total) * 100).toFixed(1)}%
                                        of total
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Stacked Bar Chart */}
                    <div className={styles.chartSection}>
                        <div className={styles.chartHeader}>
                            <BarChart3 className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>
                                Monthly Invitations by Program (Last 12 Months)
                            </h3>
                        </div>
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
                                            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"} `,
                                            borderRadius: "8px",
                                            color: darkMode ? "#f3f4f6" : "#111827",
                                        }}
                                        cursor={{ fill: darkMode ? "#374151" : "#f3f4f6" }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                    <Bar
                                        dataKey="CEC"
                                        stackId="a"
                                        fill="#3b82f6"
                                        radius={[0, 0, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="PNP"
                                        stackId="a"
                                        fill="#10b981"
                                        radius={[0, 0, 0, 0]}
                                    />
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

                    {/* CRS Trend Line Chart */}
                    <div className={styles.chartSection}>
                        <div className={styles.chartHeader}>
                            <div className={styles.chartTitleGroup}>
                                <TrendingUp className={styles.chartIcon} />
                                <h3 className={styles.chartTitle}>CRS Cut-off Trend Over Time</h3>
                            </div>
                            <div className={styles.chartControls}>
                                <div className={styles.chartFilterGroup}>
                                    <span className={styles.chartFilterLabel}>Program:</span>
                                    <div className={styles.chartFilterButtons}>
                                        {["CEC", "PNP", "Others", "All"].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setLineChartFilter(filter)}
                                                className={`${styles.chartFilterBtn} ${lineChartFilter === filter ? styles.chartFilterBtnActive : ""
                                                    } `}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.chartFilterGroup}>
                                    <span className={styles.chartFilterLabel}>Year:</span>
                                    <div className={styles.chartFilterButtons}>
                                        {["2025", "2024", "2023", "All"].map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => setLineChartYear(year)}
                                                className={`${styles.chartFilterBtn} ${lineChartYear === year ? styles.chartFilterBtnActive : ""
                                                    } `}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <div className={styles.chartScrollContainer}>
                                <div style={{ minWidth: "600px", height: "400px" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={lineChartData}>
                                            <defs>
                                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#3b82f6" />
                                                    <stop offset="50%" stopColor="#8b5cf6" />
                                                    <stop offset="100%" stopColor="#ec4899" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke={darkMode ? "#374151" : "#e5e7eb"}
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 11 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                domain={yAxisDomain}
                                                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                label={{
                                                    value: "CRS Score",
                                                    angle: -90,
                                                    position: "insideLeft",
                                                    style: { fill: darkMode ? "#9ca3af" : "#6b7280" },
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: darkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)",
                                                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"} `,
                                                    borderRadius: "12px",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    color: darkMode ? "#f3f4f6" : "#111827",
                                                    backdropFilter: "blur(8px)",
                                                }}
                                                cursor={{ stroke: darkMode ? "#6366f1" : "#3b82f6", strokeWidth: 1, strokeDasharray: "5 5" }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                            <ReferenceLine
                                                y={safeLinePosition}
                                                stroke="#ef4444"
                                                strokeDasharray="3 3"
                                                strokeWidth={2}
                                            >
                                                <Label
                                                    value={`Safe Score: ${safeLinePosition} `}
                                                    position="right"
                                                    fill="#ef4444"
                                                    fontSize={12}
                                                    fontWeight="bold"
                                                />
                                            </ReferenceLine>
                                            <Line
                                                type="monotone"
                                                dataKey="crs"
                                                stroke="url(#lineGradient)"
                                                strokeWidth={4}
                                                dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "#fff" }}
                                                activeDot={{ r: 7, strokeWidth: 0 }}
                                                name="CRS Score"
                                                animationDuration={1500}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CRS Distribution Scatter Chart */}
                    <div className={styles.chartSection}>
                        <div className={styles.chartHeader}>
                            <Target className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>
                                CRS Score Distribution by Category
                            </h3>
                        </div>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                                    />
                                    <XAxis
                                        type="category"
                                        dataKey="category"
                                        allowDuplicatedCategory={false}
                                        tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                                        name="Category"
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="crs"
                                        domain={[300, 900]}
                                        tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                                        label={{
                                            value: "CRS Score",
                                            angle: -90,
                                            position: "insideLeft",
                                            style: { fill: darkMode ? "#9ca3af" : "#6b7280" },
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                                            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"} `,
                                            borderRadius: "8px",
                                            color: darkMode ? "#f3f4f6" : "#111827",
                                        }}
                                        cursor={{ strokeDasharray: "3 3" }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                    <ReferenceLine
                                        y={safeLinePosition}
                                        stroke="#ef4444"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                    />
                                    <Scatter
                                        name="CEC"
                                        data={scatterData.CEC}
                                        fill="#3b82f6"
                                        shape="circle"
                                        opacity={0.7}
                                    />
                                    <Scatter
                                        name="PNP"
                                        data={scatterData.PNP}
                                        fill="#10b981"
                                        shape="circle"
                                        opacity={0.7}
                                    />
                                    <Scatter
                                        name="Others"
                                        data={scatterData.Others}
                                        fill="#a855f7"
                                        shape="circle"
                                        opacity={0.7}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Safe Score Indicator */}
                    <div className={styles.safeScoreCard}>
                        <div className={styles.safeScoreHeader}>
                            <Target className={styles.safeScoreIcon} />
                            <h3 className={styles.safeScoreTitle}>Current Safe Score Ranges</h3>
                        </div>
                        <div className={styles.safeScoreBody}>
                            <div className={styles.safeScoreGrid}>
                                <div className={`${styles.scoreBox} ${styles.scoreBoxCEC} `}>
                                    <div className={styles.scoreLabel}>CEC</div>
                                    <div className={styles.scoreValue}>
                                        {safeScoreInfo.CEC
                                            ? `${safeScoreInfo.CEC.min}–${safeScoreInfo.CEC.max} `
                                            : "N/A"}
                                    </div>
                                    <div className={styles.scoreSubtext}>
                                        {safeScoreInfo.CEC
                                            ? `Median: ${safeScoreInfo.CEC.median} `
                                            : "No data"}
                                    </div>
                                </div>
                                <div className={`${styles.scoreBox} ${styles.scoreBoxPNP} `}>
                                    <div className={styles.scoreLabel}>PNP</div>
                                    <div className={styles.scoreValue}>
                                        {safeScoreInfo.PNP
                                            ? `${safeScoreInfo.PNP.min}–${safeScoreInfo.PNP.max} `
                                            : "N/A"}
                                    </div>
                                    <div className={styles.scoreSubtext}>
                                        {safeScoreInfo.PNP
                                            ? `Median: ${safeScoreInfo.PNP.median} `
                                            : "No data"}
                                    </div>
                                </div>
                                <div className={`${styles.scoreBox} ${styles.scoreBoxOthers} `}>
                                    <div className={styles.scoreLabel}>
                                        Others (French, Healthcare)
                                    </div>
                                    <div className={styles.scoreValue}>
                                        {safeScoreInfo.Others
                                            ? `${safeScoreInfo.Others.min}–${safeScoreInfo.Others.max} `
                                            : "N/A"}
                                    </div>
                                    <div className={styles.scoreSubtext}>
                                        {safeScoreInfo.Others
                                            ? `Median: ${safeScoreInfo.Others.median} `
                                            : "No data"}
                                    </div>
                                </div>
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
