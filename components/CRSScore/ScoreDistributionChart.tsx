import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import styles from "./CRSScore.module.css";
import { ScatterDataPoint } from "./types";

interface ScoreDistributionChartProps {
    data: ScatterDataPoint[];
    safeScore: number;
    darkMode: boolean;
}

export default function ScoreDistributionChart({ data, safeScore, darkMode }: ScoreDistributionChartProps) {
    const axisColor = darkMode ? "#9ca3af" : "#6b7280";
    const tooltipBg = darkMode ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)";
    const tooltipColor = darkMode ? "#f3f4f6" : "#374151";

    // Split data by category for coloring and legend
    const cecData = data.filter(d => d.category === "CEC");
    const pnpData = data.filter(d => d.category === "PNP");
    const othersData = data.filter(d => d.category === "Others");

    // Static X-axis categories to ensure order
    const xDomain = ["CEC", "PNP", "Others"];

    return (
        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                    CRS Score Distribution by Category
                </h3>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={450}>
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(107, 114, 128, 0.1)"} vertical={false} />
                        <XAxis
                            dataKey="category"
                            type="category"
                            stroke={axisColor}
                            tick={{ fontSize: 12, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            allowDuplicatedCategory={false}
                            domain={xDomain}
                            dy={10}
                        />
                        <YAxis
                            dataKey="crs"
                            type="number"
                            name="CRS Score"
                            stroke={axisColor}
                            tick={{ fontSize: 12, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                            domain={['dataMin - 20', 'dataMax + 20']}
                            label={{ value: 'CRS Score', angle: -90, position: 'insideLeft', fill: axisColor, style: { textAnchor: 'middle' }, offset: 0 }}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div style={{
                                            backgroundColor: tooltipBg,
                                            border: "none",
                                            borderRadius: "12px",
                                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                            padding: "12px",
                                            color: tooltipColor,
                                            borderLeft: `4px solid ${payload[0].color}`
                                        }}>
                                            <p style={{ fontWeight: 600, marginBottom: "0.25rem", color: payload[0].color }}>{data.program}</p>
                                            <p style={{ fontSize: "0.9rem", margin: 0 }}>CRS Score: <strong>{data.crs}</strong></p>
                                            <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: 0 }}>{data.date}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                        />
                        <ReferenceLine
                            y={safeScore}
                            stroke="#ef4444"
                            strokeDasharray="5 5"
                            strokeWidth={1.5}
                            label={{
                                position: 'insideTopRight',
                                value: `Safe Score: ${safeScore}`,
                                fill: '#ef4444',
                                fontSize: 12
                            }}
                        />
                        <Scatter name="CEC" data={cecData} fill="#3b82f6" />
                        <Scatter name="PNP" data={pnpData} fill="#10b981" />
                        <Scatter name="Others" data={othersData} fill="#8b5cf6" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
