import {
    LineChart,
    Line,
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

const filterOptions = ["All", "CEC", "PNP", "Others"];

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
    const tooltipBg = darkMode ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)";
    const tooltipColor = darkMode ? "#f3f4f6" : "#374151";
    const gridColor = darkMode ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb";

    return (
        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h3 className={styles.sectionTitle}>
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
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis
                            dataKey="date"
                            stroke={axisColor}
                            tick={{ fontSize: 12, fill: axisColor }}
                        />
                        <YAxis
                            domain={yAxisDomain}
                            stroke={axisColor}
                            tick={{ fontSize: 12, fill: axisColor }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                color: tooltipColor,
                            }}
                            itemStyle={{ color: tooltipColor }}
                            labelStyle={{ color: tooltipColor }}
                        />
                        <Legend />
                        <ReferenceLine
                            y={safeLinePosition}
                            stroke="#10b981"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                        >
                            <Label
                                value={`Safe Score: ${safeLinePosition}`}
                                position="insideTopRight"
                                fill="#10b981"
                                fontSize={12}
                                fontWeight="bold"
                            />
                        </ReferenceLine>
                        <Line
                            type="monotone"
                            dataKey="crs"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#3b82f6" }}
                            activeDot={{ r: 6 }}
                            name="CRS Score"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
