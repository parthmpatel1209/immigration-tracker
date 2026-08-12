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
import { MonthlyData } from "./types";
import styles from "./CRSScore.module.css";

interface MonthlyBarChartProps {
    data: MonthlyData[];
    darkMode: boolean;
}

export default function MonthlyBarChart({ data, darkMode }: MonthlyBarChartProps) {
    const axisColor = darkMode ? "#9ca3af" : "#6b7280";
    const gridColor = darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(107, 114, 128, 0.08)";

    // Custom Detailed Breakdown Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            const total =
                (dataPoint.CEC || 0) +
                (dataPoint.PNP || 0) +
                (dataPoint.CategoryBased || 0) +
                (dataPoint.NonEE || 0);

            return (
                <div className={styles.chartTooltipGlass} style={{ minWidth: "220px" }}>
                    <p className={styles.chartTooltipTitle}>{label}</p>
                    <table className={styles.chartTooltipTable}>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th style={{ textAlign: "right" }}>Invited</th>
                                <th style={{ textAlign: "right" }}>Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payload.map((item: any) => {
                                const val = Number(item.value) || 0;
                                const percent = total > 0 ? Math.round((val / total) * 100) : 0;
                                return (
                                    <tr key={item.name} style={{ color: item.color }}>
                                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                                            {val.toLocaleString()}
                                        </td>
                                        <td style={{ textAlign: "right", opacity: 0.85 }}>
                                            {percent}%
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr style={{ borderTop: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", fontWeight: 700 }}>
                                <td>Total</td>
                                <td style={{ textAlign: "right" }}>{total.toLocaleString()}</td>
                                <td style={{ textAlign: "right" }}>100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.chartSection}>
            <h3 className={styles.sectionTitle}>
                Monthly Invitations by Program (Last 12 Months)
            </h3>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorCEC" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="colorPNP" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#059669" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="colorCategoryBased" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="colorNonEE" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#475569" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke={axisColor}
                            tick={{ fontSize: 11, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke={axisColor}
                            tick={{ fontSize: 11, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dx={-5}
                        />
                        <Tooltip
                            cursor={{ fill: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(107, 114, 128, 0.04)' }}
                            content={<CustomTooltip />}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="CEC"
                            fill="url(#colorCEC)"
                            radius={[4, 4, 0, 0]}
                            name="CEC"
                            stackId="a"
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="PNP"
                            fill="url(#colorPNP)"
                            radius={[4, 4, 0, 0]}
                            name="PNP"
                            stackId="a"
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="CategoryBased"
                            fill="url(#colorCategoryBased)"
                            radius={[4, 4, 0, 0]}
                            name="Category Based"
                            stackId="a"
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="NonEE"
                            fill="url(#colorNonEE)"
                            radius={[4, 4, 0, 0]}
                            name="Other"
                            stackId="a"
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
