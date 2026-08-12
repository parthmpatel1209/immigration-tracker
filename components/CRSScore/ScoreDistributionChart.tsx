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
    Label,
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
    const gridColor = darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(107, 114, 128, 0.08)";

    // Split data by category for coloring and legend
    const cecData = data.filter(d => d.category === "CEC");
    const pnpData = data.filter(d => d.category === "PNP");
    const catBasedData = data.filter(d => d.category === "CategoryBased");
    const nonEEData = data.filter(d => d.category === "NonEE");

    // Static X-axis categories to ensure order
    const xDomain = ["CEC", "PNP", "CategoryBased", "NonEE"];

    const categoryColors = {
        CEC: "#ef4444",
        PNP: "#10b981",
        CategoryBased: "#3b82f6",
        NonEE: "#64748b",
    };

    // Custom Glassmorphic Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            const color = categoryColors[dataPoint.category as keyof typeof categoryColors] || "#ef4444";
            
            return (
                <div
                    className={styles.chartTooltipGlass}
                    style={{
                        borderLeft: `4px solid ${color}`,
                        minWidth: "180px",
                    }}
                >
                    <p className={styles.chartTooltipTitle} style={{ color, marginBottom: "0.25rem" }}>
                        {dataPoint.program}
                    </p>
                    <div className={styles.chartTooltipItem}>
                        CRS Score: <strong className={styles.chartTooltipValue}>{dataPoint.crs}</strong>
                    </div>
                    <div className={styles.chartTooltipItem} style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                        {dataPoint.date}
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
                    CRS Score Distribution by Category
                </h3>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={450}>
                    <ScatterChart margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="category"
                            type="category"
                            stroke={axisColor}
                            tick={{ fontSize: 11, fill: axisColor }}
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
                            tick={{ fontSize: 11, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dx={-5}
                            domain={['dataMin - 20', 'dataMax + 20']}
                            label={{ value: 'CRS Score', angle: -90, position: 'insideLeft', fill: axisColor, style: { textAnchor: 'middle', fontSize: 11 }, offset: 5 }}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3', stroke: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}
                            content={<CustomTooltip />}
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
                        >
                            <Label
                                value={`Safe Score: ${safeScore}`}
                                position="insideTopRight"
                                fill="#ef4444"
                                fontSize={11}
                                fontWeight="bold"
                                offset={10}
                            />
                        </ReferenceLine>
                        <Scatter name="CEC" data={cecData} fill={categoryColors.CEC} />
                        <Scatter name="PNP" data={pnpData} fill={categoryColors.PNP} />
                        <Scatter name="Category Based" data={catBasedData} fill={categoryColors.CategoryBased} />
                        <Scatter name="Other" data={nonEEData} fill={categoryColors.NonEE} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
