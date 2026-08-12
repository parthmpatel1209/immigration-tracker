import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Label,
} from "recharts";
import { TrendDataPoint } from "./types";
import styles from "./CRSScore.module.css";

interface LineChartSectionProps {
    data: TrendDataPoint[];
    yAxisDomain: [number, number];
    safeLinePosition: number;
    selectedFilter: string;
    selectedYear: string;
    availableYears: string[];
    onFilterChange: (filter: string) => void;
    onYearChange: (year: string) => void;
    darkMode: boolean;
}

const filterOptions = ["All", "CEC", "PNP", "CEC - Category Based", "Other"];

export default function LineChartSection({
    data,
    yAxisDomain,
    safeLinePosition,
    selectedFilter,
    selectedYear,
    availableYears,
    onFilterChange,
    onYearChange,
    darkMode,
}: LineChartSectionProps) {
    const axisColor = darkMode ? "#9ca3af" : "#6b7280";
    const gridColor = darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(107, 114, 128, 0.08)";

    // Dynamic line color matching the categories
    const getLineColor = (filter: string) => {
        if (filter === "PNP") return "#10b981"; // Emerald
        if (filter === "CEC - Category Based") return "#3b82f6"; // Glacier Blue
        if (filter === "Other") return "#64748b"; // Cool Slate
        return "#ef4444"; // Crimson Red default for CEC / All
    };

    const lineColor = getLineColor(selectedFilter);

    // Custom Glassmorphic Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className={styles.chartTooltipGlass}>
                    <p className={styles.chartTooltipTitle}>{label}</p>
                    <div className={styles.chartTooltipItem}>
                        <span
                            className={styles.chartTooltipDot}
                            style={{ backgroundColor: lineColor }}
                        />
                        CRS Cutoff: <strong className={styles.chartTooltipValue}>{dataPoint.crs}</strong>
                    </div>
                    <div className={styles.chartTooltipItem} style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                        Program: {dataPoint.program}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                    CRS Score Trends Over Time
                </h3>
                <div className={styles.chartFilters}>
                    <div className={styles.chartFilterGroup}>
                        <label className={styles.chartFilterLabel}>Category:</label>
                        <select
                            value={selectedFilter}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className={styles.chartSelect}
                        >
                            {filterOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.chartFilterGroup}>
                        <label className={styles.chartFilterLabel}>Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => onYearChange(e.target.value)}
                            className={styles.chartSelect}
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={lineColor} stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke={axisColor}
                            tick={{ fontSize: 11, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={yAxisDomain}
                            stroke={axisColor}
                            tick={{ fontSize: 11, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dx={-5}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: "15px" }} />
                        <ReferenceLine
                            y={safeLinePosition}
                            stroke="#10b981"
                            strokeDasharray="5 5"
                            strokeWidth={1.5}
                        >
                            <Label
                                value={`Safe Score: ${safeLinePosition}`}
                                position="insideTopRight"
                                fill="#10b981"
                                fontSize={11}
                                fontWeight="bold"
                                offset={10}
                            />
                        </ReferenceLine>
                        <Area
                            type="monotone"
                            dataKey="crs"
                            stroke={lineColor}
                            strokeWidth={3}
                            fill="url(#lineGradient)"
                            dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: lineColor, stroke: "#fff", strokeWidth: 2 }}
                            name="CRS Score"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
