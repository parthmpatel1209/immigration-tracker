"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import dayjs from "dayjs";
import {
    Heart,
    ArrowRight,
    Globe,
    Users,
    TrendingUp,
    Activity,
    Calculator,
    Newspaper,
    MapPin,
    GraduationCap,
    CheckCircle2,
    Bell,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    BarChart2,
    Award,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
} from "recharts";
import styles from "./Home.module.css";
import CLBConverter from './CLBConverter';
import ProvinceTicker from './ProvinceTicker';
import AnimatedCounter from './AnimatedCounter';
import PlexusBackground from './PlexusBackground';
import Image from 'next/image';

interface HomeProps {
    onNavigateToTab?: (tabName: string) => void;
}

type SortKey = "year" | "pr" | "study" | "work" | "citizenship";
type SortDir = "asc" | "desc";
type MetricType = "pr" | "study" | "work" | "citizenship";
type TestType = "IELTS" | "CELPIP" | "PTE";

const RAW_DATA = [
    { year: 2010, pr: 280681, study: 225295, work: 145000, citizenship: 143600, notes: "" },
    { year: 2011, pr: 248748, study: 248470, work: 140000, citizenship: 181300, notes: "" },
    { year: 2012, pr: 257903, study: 274700, work: 149000, citizenship: 113100, notes: "" },
    { year: 2013, pr: 259023, study: 301545, work: 161000, citizenship: 128900, notes: "" },
    { year: 2014, pr: 260411, study: 330110, work: 164000, citizenship: 262600, notes: "" },
    { year: 2015, pr: 271845, study: 352330, work: 165000, citizenship: 252200, notes: "" },
    { year: 2016, pr: 296340, study: 410570, work: 215800, citizenship: 147700, notes: "" },
    { year: 2017, pr: 286475, study: 490775, work: 301236, citizenship: 106300, notes: "" },
    { year: 2018, pr: 321035, study: 567065, work: 337460, citizenship: 176400, notes: "" },
    { year: 2019, pr: 341180, study: 638280, work: 403869, citizenship: 250400, notes: "" },
    { year: 2020, pr: 184585, study: 528190, work: 326739, citizenship: 110900, notes: "COVID impact" },
    { year: 2021, pr: 405999, study: 621565, work: 416846, citizenship: 221919, notes: "" },
    { year: 2022, pr: 437539, study: 807750, work: 605851, citizenship: 373000, notes: "" },
    { year: 2023, pr: 471808, study: 1037200, work: 949270, citizenship: 354000, notes: "" },
    { year: 2024, pr: 483640, study: 996400, work: 911000, citizenship: 360000, notes: "" },
    { year: 2025, pr: 395000, study: 305900, work: null, citizenship: null, notes: "Target / Cap" },
    { year: 2026, pr: 380000, study: null, work: null, citizenship: null, notes: "Target" },
];

// --- CLB Quick Estimator Helpers ---
const getCelpipScore = (val: string): number => {
    if (["10+", "12", "11", "10"].includes(val)) return 10;
    if (["M", "3-"].includes(val)) return 0;
    const p = parseInt(val);
    return isNaN(p) ? 0 : p;
};

const getIeltsCLB = (type: 'R' | 'L' | 'W' | 'S', score: number): number => {
    if (type === 'R') {
        if (score >= 8.0) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.0) return 6; return 4;
    }
    if (type === 'L') {
        if (score >= 8.5) return 10; if (score >= 8.0) return 9; if (score >= 7.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; return 4;
    }
    if (score >= 7.5) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; return 4;
};

const getPteCLB = (type: 'R' | 'L' | 'W' | 'S', score: number): number => {
    if (type === 'R') { if (score >= 88) return 10; if (score >= 78) return 9; if (score >= 69) return 8; if (score >= 60) return 7; return 5; }
    if (type === 'W') { if (score >= 90) return 10; if (score >= 88) return 9; if (score >= 79) return 8; if (score >= 69) return 7; return 5; }
    if (type === 'L') { if (score >= 89) return 10; if (score >= 82) return 9; if (score >= 71) return 8; if (score >= 60) return 7; return 5; }
    if (score >= 89) return 10; if (score >= 84) return 9; if (score >= 76) return 8; if (score >= 68) return 7; return 5;
};

export default function Home({ onNavigateToTab }: HomeProps) {
    const [isDark, setIsDark] = useState(false);
    const [isConverterOpen, setIsConverterOpen] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>("year");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    // Interactive Analytics Chart State
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("pr");

    // Inline Quick CLB Estimator State
    const [clbTest, setClbTest] = useState<TestType>("IELTS");
    const [clbScores, setClbScores] = useState({ r: "7.0", w: "7.0", l: "7.5", s: "7.0" });

    // Sync dark mode
    useEffect(() => {
        const root = document.documentElement;
        const check = () => setIsDark(root.classList.contains("dark"));
        check();

        const observer = new MutationObserver(check);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const handleNavigate = (tabName: string) => {
        if (onNavigateToTab) {
            onNavigateToTab(tabName);
        }
    };

    // Calculate Inline CLB
    const getClb = (f: 'r' | 'w' | 'l' | 's') => {
        const val = clbScores[f];
        if (clbTest === "CELPIP") return getCelpipScore(val);
        if (clbTest === "IELTS") {
            const types = { r: 'R', w: 'W', l: 'L', s: 'S' } as const;
            return getIeltsCLB(types[f], parseFloat(val));
        }
        if (clbTest === "PTE") {
            const types = { r: 'R', w: 'W', l: 'L', s: 'S' } as const;
            return getPteCLB(types[f], parseInt(val) || 0);
        }
        return 4;
    };

    const inlineCLBLevels = useMemo(() => {
        const r = getClb('r');
        const w = getClb('w');
        const l = getClb('l');
        const s = getClb('s');
        const minVal = Math.min(r, w, l, s);
        return { r, w, l, s, min: minVal };
    }, [clbScores, clbTest]);

    // Handle Quick CLB Reset/Defaults
    const handleQuickCLBDefault = (testType: TestType) => {
        setClbTest(testType);
        if (testType === "IELTS") setClbScores({ r: "7.0", w: "7.0", l: "7.5", s: "7.0" });
        if (testType === "CELPIP") setClbScores({ r: "9", w: "9", l: "9", s: "9" });
        if (testType === "PTE") setClbScores({ r: "78", w: "88", l: "82", s: "84" });
    };

    const features = [
        {
            icon: TrendingUp,
            title: "Latest Draws",
            description: "Real-time updates on Express Entry and PNP draws",
            action: "Latest Draw",
            stats: "Updated 2h ago"
        },
        {
            icon: Calculator,
            title: "CRS Calculator",
            description: "Calculate your score accurately in seconds",
            action: "Calculator",
            badge: "Popular"
        },
        {
            icon: Activity,
            title: "Score Analytics",
            description: "Historical trends and cutoff predictions",
            action: "CRS Scores",
        },
        {
            icon: Newspaper,
            title: "Pathways & News",
            description: "Latest policy changes and immigration routes",
            action: "News",
        }
    ];

    const secondaryActions = [
        { icon: MapPin, label: "PR Pathways", action: "PR Pathways" },
        { icon: GraduationCap, label: "FAQ & Guides", action: "What Is...?" },
        { icon: Bell, label: "Early Access", action: "Early Access" },
        { icon: Heart, label: "Support Us", action: "Support" },
    ];

    const [drawStats, setDrawStats] = useState({ score: "0", invitations: "0", date: "Loading..." });

    useEffect(() => {
        const fetchLatestDraw = async () => {
            try {
                const res = await fetch("/api/draws");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const sorted = data
                            .filter((d: any) => d.draw_date && dayjs(d.draw_date).isValid())
                            .sort((a: any, b: any) =>
                                dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
                            );

                        if (sorted.length > 0) {
                            const latest = sorted[0];
                            setDrawStats({
                                score: latest.crs_cutoff || "N/A",
                                invitations: latest.invitations ? Number(latest.invitations).toLocaleString() : "N/A",
                                date: dayjs(latest.draw_date).format("MMM DD, YYYY")
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching hero stats:", err);
                setDrawStats({ score: "Error", invitations: "Error", date: "Error" });
            }
        };
        fetchLatestDraw();
    }, []);

    const quickStats = [
        { label: "Last Draw Cutoff", value: drawStats.score, sub: "CRS Score", icon: TrendingUp },
        { label: "Invitations Issued", value: drawStats.invitations, sub: "Express Entry", icon: Users },
        { label: "Update Frequency", value: "Bi-Weekly", sub: "Average", icon: Activity },
    ];

    const sortedData = useMemo(() => {
        return [...RAW_DATA].sort((a, b) => {
            const av = a[sortKey] ?? -1;
            const bv = b[sortKey] ?? -1;
            return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
        });
    }, [sortKey, sortDir]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const fmt = (n: number | null) =>
        n == null ? <span className={styles.cellPending}>Pending</span> : n.toLocaleString();

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <ChevronsUpDown size={13} className={styles.sortIconInactive} />;
        return sortDir === "asc"
            ? <ChevronUp size={13} className={styles.sortIconActive} />
            : <ChevronDown size={13} className={styles.sortIconActive} />;
    };

    // Recharts Data Prep
    const chartData = useMemo(() => {
        return RAW_DATA.map(d => ({
            year: d.year.toString(),
            value: d[selectedMetric] || 0,
            isProjected: d.notes.includes("Target")
        }));
    }, [selectedMetric]);

    const metricLabels = {
        pr: "Permanent Residents",
        study: "Study Permits",
        work: "Work Permits",
        citizenship: "Citizenship Grants"
    };

    const CELPIP_OPTIONS = ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "M"];
    const IELTS_OPTIONS = ["9.0", "8.5", "8.0", "7.5", "7.0", "6.5", "6.0", "5.5", "5.0", "4.5", "4.0"];

    return (
        <div className={styles.container}>
            {/* Ambient Aurora Gradient Canvas */}
            <div className={styles.auroraContainer} aria-hidden="true">
                <div className={`${styles.auroraBlob} ${styles.auroraRed}`}></div>
                <div className={`${styles.auroraBlob} ${styles.auroraBlue}`}></div>
            </div>

            {/* Hero Section */}
            <section className={styles.hero}>
                <PlexusBackground />
                <div className={styles.heroContent}>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={styles.badge}
                    >
                        <div className={styles.badgePulse}></div>
                        <span>Live Immigration Tracker</span>
                    </motion.div>

                    {/* KEPT EXACTLY UNCHANGED AS REQUESTED */}
                    <h1 className={styles.heroTitle}>
                        Your Path to <span className={styles.gradient}>
                            C<Image src="/journey/maple.png" alt="" width={64} height={64} className={styles.titleIcon} priority />NADA
                        </span> <br />
                        Starts Here
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className={styles.heroSubtitle}
                    >
                        Navigate your Canadian immigration journey with real-time data, accurate CRS calculations, and comprehensive pathway insights that empower your decisions every step of the way.
                    </motion.p>

                    {/* Redesigned Quick Stats Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className={styles.heroStats}
                    >
                        {quickStats.map((stat, idx) => (
                            <div key={idx} className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>
                                    <stat.icon size={20} />
                                </div>
                                <div className={styles.heroStatText}>
                                    <div className={styles.heroStatValue}>
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className={styles.heroStatLabel}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Province Ticker */}
            <ProvinceTicker />

            {/* Main Hub Section */}
            <section className={styles.hubSection}>
                <div className={styles.hubGrid}>
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -6, scale: 1.015 }}
                                whileTap={{ scale: 0.99 }}
                                className={styles.hubCard}
                                onClick={() => handleNavigate(feature.action)}
                            >
                                <div className={`${styles.hubIcon} ${styles[`gradient${idx}`]}`}>
                                    <Icon size={26} />
                                </div>
                                <div className={styles.hubContent}>
                                    <div className={styles.hubHeader}>
                                        <h3 className={styles.hubTitle}>{feature.title}</h3>
                                        {feature.badge && <span className={styles.hubBadge}>{feature.badge}</span>}
                                    </div>
                                    <p className={styles.hubDescription}>{feature.description}</p>
                                    {feature.stats && <div className={styles.hubStats}>{feature.stats}</div>}
                                </div>
                                <div className={styles.hubArrow}>
                                    <ArrowRight size={18} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Secondary Actions */}
            <section className={styles.secondarySection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>More Resources</h2>
                </div>
                <div className={styles.secondaryGrid}>
                    {secondaryActions.map((item, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className={styles.secondaryActionCard}
                            onClick={() => handleNavigate(item.action)}
                        >
                            <item.icon size={20} className={styles.secondaryIcon} />
                            <span>{item.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Redesigned Interactive CLB Language Widget */}
            <section className={styles.toolsSection}>
                <div className={styles.quickEstimatorCard}>
                    <div className={styles.estimatorHeader}>
                        <div className={styles.estimatorTitleArea}>
                            <Award className={styles.estimatorIcon} size={22} />
                            <div>
                                <h3 className={styles.estimatorTitle}>CLB Language Score Estimator</h3>
                                <p className={styles.estimatorSubtitle}>Estimate your Canadian Language Benchmark instantly</p>
                            </div>
                        </div>
                        <button 
                            className={styles.estimatorFullBtn}
                            onClick={() => setIsConverterOpen(true)}
                        >
                            Open Detailed Converter <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className={styles.estimatorGrid}>
                        {/* Selector Tabs */}
                        <div className={styles.estimatorControls}>
                            <div className={styles.testSelector}>
                                {(["IELTS", "CELPIP", "PTE"] as TestType[]).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => handleQuickCLBDefault(t)}
                                        className={`${styles.testBtn} ${clbTest === t ? styles.testBtnActive : ""}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <p className={styles.testNote}>
                                {clbTest === "IELTS" && "Select scores from standard IELTS General options."}
                                {clbTest === "CELPIP" && "Select CELPIP-General levels directly."}
                                {clbTest === "PTE" && "Type in your PTE Core raw test scores."}
                            </p>

                            {/* Inputs */}
                            <div className={styles.inputBoxGrid}>
                                {(["Reading", "Writing", "Listening", "Speaking"] as const).map(label => {
                                    const keys = { Reading: 'r', Writing: 'w', Listening: 'l', Speaking: 's' } as const;
                                    const field = keys[label];
                                    const val = clbScores[field];
                                    const singleCLB = getClb(field);

                                    return (
                                        <div key={label} className={styles.inputFieldGroup}>
                                            <label className={styles.inputLabel}>{label}</label>
                                            {clbTest === "PTE" ? (
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={e => setClbScores({ ...clbScores, [field]: e.target.value })}
                                                    className={styles.numInput}
                                                    placeholder="0-90"
                                                    min="0"
                                                    max="90"
                                                />
                                            ) : (
                                                <div className={styles.selectWrapper}>
                                                    <select
                                                        value={val}
                                                        onChange={e => setClbScores({ ...clbScores, [field]: e.target.value })}
                                                        className={styles.selectInput}
                                                    >
                                                        {(clbTest === "CELPIP" ? CELPIP_OPTIONS : IELTS_OPTIONS).map(o => (
                                                            <option key={o} value={o}>{o}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className={styles.selectArrow} size={14} />
                                                </div>
                                            )}
                                            <span className={`${styles.subCLBIndicator} ${singleCLB >= 9 ? styles.clbHighlight : ""}`}>
                                                CLB {singleCLB}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Visual Circular Gauge */}
                        <div className={styles.estimatorGauge}>
                            <div className={styles.gaugeContainer}>
                                <div className={`${styles.gaugeCircle} ${inlineCLBLevels.min >= 9 ? styles.gaugeGold : ""}`}>
                                    <span className={styles.gaugeLabel}>Overall Benchmark</span>
                                    <span className={styles.gaugeValue}>CLB {inlineCLBLevels.min}</span>
                                    {inlineCLBLevels.min >= 9 && (
                                        <span className={styles.gaugeBadge}>
                                            <Sparkles size={12} /> CRS Boost Eligible
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CLBConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} isDark={isDark} />

            {/* Historical Immigration Data Table & Recharts Graph */}
            <section className={styles.dataSection}>
                <div className={styles.dataSectionHeader}>
                    <div className={styles.dataSectionIcon}>
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <h2 className={styles.dataSectionTitle}>Canadian Immigration at a Glance</h2>
                        <p className={styles.dataSectionSubtitle}>Historical trends (2010–2026) · Admissions & target data visualizations</p>
                    </div>
                </div>

                {/* Dashboard Chart Component */}
                <div className={styles.chartPanel}>
                    <div className={styles.chartControls}>
                        <h4 className={styles.chartTitle}>{metricLabels[selectedMetric]} Over Time</h4>
                        <div className={styles.chartButtons}>
                            {(["pr", "study", "work", "citizenship"] as MetricType[]).map(metric => (
                                <button
                                    key={metric}
                                    onClick={() => setSelectedMetric(metric)}
                                    className={`${styles.chartTabBtn} ${selectedMetric === metric ? styles.chartTabBtnActive : ""}`}
                                >
                                    {metric === "pr" ? "PR Target" : metric === "study" ? "Study" : metric === "work" ? "Work" : "Citizenship"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isDark ? "#f87171" : "#d32f2f"} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={isDark ? "#f87171" : "#d32f2f"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} />
                                <XAxis 
                                    dataKey="year" 
                                    stroke={isDark ? "#9ca3af" : "#4b5563"} 
                                    fontSize={11}
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke={isDark ? "#9ca3af" : "#4b5563"} 
                                    fontSize={11}
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                                    width={40}
                                />
                                <ChartTooltip 
                                    contentStyle={{ 
                                        backgroundColor: isDark ? "#111827" : "#ffffff", 
                                        borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
                                        borderRadius: "12px",
                                        color: isDark ? "#ffffff" : "#111827",
                                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                                        fontSize: "12px",
                                        fontWeight: "600"
                                    }}
                                    formatter={(value: any) => [Number(value).toLocaleString(), metricLabels[selectedMetric]]}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke={isDark ? "#f87171" : "#d32f2f"} 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorMetric)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Styled Table Wrapper */}
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th className={styles.th} onClick={() => handleSort("year")}>
                                    <span className={styles.thInner}>Year <SortIcon col="year" /></span>
                                </th>
                                <th className={styles.th} onClick={() => handleSort("pr")}>
                                    <span className={styles.thInner}>Permanent Residents <SortIcon col="pr" /></span>
                                </th>
                                <th className={styles.th} onClick={() => handleSort("study")}>
                                    <span className={styles.thInner}>Study Permits <SortIcon col="study" /></span>
                                </th>
                                <th className={styles.th} onClick={() => handleSort("work")}>
                                    <span className={styles.thInner}>Work Permits <SortIcon col="work" /></span>
                                </th>
                                <th className={styles.th} onClick={() => handleSort("citizenship")}>
                                    <span className={styles.thInner}>Citizenship Grants <SortIcon col="citizenship" /></span>
                                </th>
                                <th className={`${styles.th} ${styles.thNote}`}>
                                    <span className={styles.thInner}>Notes</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((row) => (
                                <tr
                                    key={row.year}
                                    className={`${styles.tr} ${row.notes === "COVID impact" ? styles.trCovid : ""} ${row.notes === "Target / Cap" || row.notes === "Target" ? styles.trTarget : ""}`}
                                >
                                    <td className={`${styles.td} ${styles.tdYear}`}>{row.year}</td>
                                    <td className={styles.td}>{fmt(row.pr)}</td>
                                    <td className={styles.td}>{fmt(row.study)}</td>
                                    <td className={styles.td}>{fmt(row.work)}</td>
                                    <td className={styles.td}>{fmt(row.citizenship)}</td>
                                    <td className={`${styles.td} ${styles.tdNote}`}>
                                        {row.notes ? <span className={styles.noteTag}>{row.notes}</span> : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className={styles.dataFootnote}>
                    Sources: IRCC Annual Reports, Statistics Canada · Approximate figures (~) used where exact data unavailable · 2025–2026 figures are government targets
                </p>
            </section>

            {/* Redesigned CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <div className={styles.ctaGraphics}>
                        <div className={styles.ctaCircle1}></div>
                        <div className={styles.ctaCircle2}></div>
                        <div className={styles.ctaMapleOverlay}>🍁</div>
                    </div>
                    <h2 className={styles.ctaTitle}>Stay Ahead of the Curve</h2>
                    <p className={styles.ctaText}>
                        Join the waitlist for premium features including real-time alerts and personalized immigration roadmaps.
                    </p>
                    <button
                        className={styles.ctaButton}
                        onClick={() => handleNavigate("Early Access")}
                    >
                        Join the Waitlist
                        <ArrowRight size={18} />
                    </button>
                </div>
            </section>
        </div>
    );
}
