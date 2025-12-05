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
    const tooltipBg = darkMode ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)";
    const tooltipColor = darkMode ? "#f3f4f6" : "#374151";

    return (
        <div className={styles.chartSection}>
            <h3 className={styles.sectionTitle}>
                Monthly Invitations by Program (Last 12 Months)
            </h3>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorCEC" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="colorPNP" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="colorOthers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(107, 114, 128, 0.1)"} vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke={axisColor}
                            tick={{ fontSize: 12, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke={axisColor}
                            tick={{ fontSize: 12, fill: axisColor }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ fill: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(107, 114, 128, 0.05)' }}
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: "none",
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                padding: "12px",
                                color: tooltipColor,
                            }}
                            itemStyle={{ padding: "2px 0", color: tooltipColor }}
                            labelStyle={{ color: tooltipColor, marginBottom: "0.5rem", fontWeight: 600 }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="CEC"
                            fill="url(#colorCEC)"
                            radius={[6, 6, 0, 0]}
                            name="CEC"
                            stackId="a"
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="PNP"
                            fill="url(#colorPNP)"
                            radius={[6, 6, 0, 0]}
                            name="PNP"
                            stackId="a"
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="Others"
                            fill="url(#colorOthers)"
                            radius={[6, 6, 0, 0]}
                            name="Others"
                            stackId="a"
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
