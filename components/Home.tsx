"use client";

import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Calculator,
    Activity,
    Newspaper,
    MapPin,
    GraduationCap,
    Bell,
    Heart,
    ArrowRight,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Award,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    Users,
    Calendar,
    Target,
    BarChart3
} from "lucide-react";
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
import CLBConverter from "./CLBConverter";
import ProvinceTicker from "./ProvinceTicker";

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

const getIeltsCLB = (type: "R" | "L" | "W" | "S", score: number): number => {
    if (type === "R") {
        if (score >= 8.0) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.0) return 6; return 4;
    }
    if (type === "L") {
        if (score >= 8.5) return 10; if (score >= 8.0) return 9; if (score >= 7.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; return 4;
    }
    if (score >= 7.5) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; return 4;
};

const getPteCLB = (type: "R" | "L" | "W" | "S", score: number): number => {
    if (type === "R") { if (score >= 88) return 10; if (score >= 78) return 9; if (score >= 69) return 8; if (score >= 60) return 7; return 5; }
    if (type === "W") { if (score >= 90) return 10; if (score >= 88) return 9; if (score >= 79) return 8; if (score >= 69) return 7; return 5; }
    if (type === "L") { if (score >= 89) return 10; if (score >= 82) return 9; if (score >= 71) return 8; if (score >= 60) return 7; return 5; }
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

    // Live Draw Statistics State
    const [drawStats, setDrawStats] = useState({
        score: "510",
        program: "Canadian Experience Class",
        invitations: "3,200",
        date: "Latest IRCC Draw",
        delta: "-4 pts",
        isPositiveDelta: false,
    });

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

    // Fetch and compute real live draw analytics
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
                            const prev = sorted[1];
                            let deltaStr = "Benchmark";
                            let isPositive = false;

                            if (prev && latest.crs_cutoff && prev.crs_cutoff) {
                                const diff = Number(latest.crs_cutoff) - Number(prev.crs_cutoff);
                                if (!isNaN(diff)) {
                                    deltaStr = diff > 0 ? `+${diff} pts` : diff < 0 ? `${diff} pts` : "0 pts";
                                    isPositive = diff <= 0; // Negative or zero is positive for candidates
                                }
                            }

                            setDrawStats({
                                score: latest.crs_cutoff ? String(latest.crs_cutoff) : "N/A",
                                program: latest.program || latest.draw_name || "Express Entry",
                                invitations: latest.invitations ? Number(latest.invitations).toLocaleString() : "N/A",
                                date: dayjs(latest.draw_date).format("MMM DD, YYYY"),
                                delta: deltaStr,
                                isPositiveDelta: isPositive,
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching live draw stats:", err);
            }
        };
        fetchLatestDraw();
    }, []);

    const handleNavigate = (tabName: string) => {
        if (onNavigateToTab) {
            onNavigateToTab(tabName);
        }
    };

    // Calculate Inline CLB
    const getClb = (f: "r" | "w" | "l" | "s") => {
        const val = clbScores[f];
        if (clbTest === "CELPIP") return getCelpipScore(val);
        if (clbTest === "IELTS") {
            const types = { r: "R", w: "W", l: "L", s: "S" } as const;
            return getIeltsCLB(types[f], parseFloat(val));
        }
        if (clbTest === "PTE") {
            const types = { r: "R", w: "W", l: "L", s: "S" } as const;
            return getPteCLB(types[f], parseInt(val) || 0);
        }
        return 4;
    };

    const inlineCLBLevels = useMemo(() => {
        const r = getClb("r");
        const w = getClb("w");
        const l = getClb("l");
        const s = getClb("s");
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

    // Core Operations Deck Cards
    const operationsCards = [
        {
            icon: TrendingUp,
            title: "Latest Express Entry Draws",
            description: "Real-time draw history, cutoff trajectories, and invitation quota distributions across all streams.",
            action: "Latest Draw",
            meta: "Live IRCC sync",
            badge: "Live Feed",
        },
        {
            icon: Calculator,
            title: "Comprehensive CRS Calculator",
            description: "Assess your Comprehensive Ranking System score across Human Capital, Spouse, and Skill Transferability.",
            action: "Calculator",
            meta: "Accurate point rules",
            badge: "Popular",
        },
        {
            icon: Activity,
            title: "Cutoff Trends & Score Analytics",
            description: "Interactive historical trendlines, category cutoff distributions, and draw frequency metrics.",
            action: "CRS Scores",
            meta: "Historical depth",
            badge: "Analytics",
        },
        {
            icon: Newspaper,
            title: "Immigration Pathways & News",
            description: "Provincial allocations (PNP), category-based selection mandates, and official gazette dispatches.",
            action: "News",
            meta: "Policy updates",
            badge: "Gazette",
        },
    ];

    const secondaryTools = [
        { icon: MapPin, label: "PR Pathways Directory", sub: "Federal & Provincial", action: "PR Pathways" },
        { icon: GraduationCap, label: "Immigration FAQ & Guides", sub: "Legal framework", action: "What Is...?" },
        { icon: Bell, label: "Priority Notifications", sub: "Instant draw alerts", action: "Early Access" },
        { icon: Heart, label: "Support Open Intelligence", sub: "Community sponsored", action: "Support" },
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
        if (sortKey !== col) return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
        return sortDir === "asc"
            ? <ChevronUp size={13} style={{ color: "var(--primary)" }} />
            : <ChevronDown size={13} style={{ color: "var(--primary)" }} />;
    };

    // Recharts Data Prep
    const chartData = useMemo(() => {
        return RAW_DATA.map(d => ({
            year: d.year.toString(),
            value: d[selectedMetric] || 0,
            isProjected: d.notes.includes("Target"),
        }));
    }, [selectedMetric]);

    const metricLabels = {
        pr: "Permanent Residents (Admissions)",
        study: "Study Permit Holders",
        work: "Work Permit Holders",
        citizenship: "Citizenship Grants",
    };

    const CELPIP_OPTIONS = ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "M"];
    const IELTS_OPTIONS = ["9.0", "8.5", "8.0", "7.5", "7.0", "6.5", "6.0", "5.5", "5.0", "4.5", "4.0"];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <span>Immigration Intelligence & Data Platform</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        Your Path to <span className={styles.gradient}>
                            C<Image src="/journey/maple.png" alt="" width={64} height={64} className={styles.titleIcon} priority />NADA
                        </span> <br />
                        Starts Here
                    </h1>

                    <p className={styles.heroSubtitle}>
                        Navigate your Canadian immigration journey with real-time data, accurate CRS calculations, and comprehensive pathway insights that empower your decisions every step of the way.
                    </p>

                    {/* Executive Live Intelligence Bar */}
                    <div className={styles.intelligenceBar}>
                        {/* 1. Latest Cutoff Score */}
                        <div
                            className={styles.intelligenceCard}
                            onClick={() => handleNavigate("CRS Scores")}
                            title="View CRS score analytics"
                        >
                            <div className={styles.intelligenceTop}>
                                <div className={styles.intelligenceIconWrap}>
                                    <TrendingUp size={18} />
                                </div>
                                <span className={styles.intelligenceBadge}>
                                    {drawStats.delta}
                                </span>
                            </div>
                            <div className={styles.intelligenceValue}>{drawStats.score}</div>
                            <div className={styles.intelligenceLabel}>Latest CRS Cutoff</div>
                            <div className={styles.intelligenceMeta}>{drawStats.program}</div>
                        </div>

                        {/* 2. Invitations Issued */}
                        <div
                            className={styles.intelligenceCard}
                            onClick={() => handleNavigate("Latest Draw")}
                            title="View latest draw details"
                        >
                            <div className={styles.intelligenceTop}>
                                <div className={styles.intelligenceIconWrap} style={{ color: "var(--secondary)", background: "rgba(2, 132, 199, 0.08)" }}>
                                    <Users size={18} />
                                </div>
                                <span className={styles.intelligenceBadge} style={{ background: "rgba(2, 132, 199, 0.08)", color: "#0369a1", borderColor: "rgba(2, 132, 199, 0.2)" }}>
                                    ITAs Issued
                                </span>
                            </div>
                            <div className={styles.intelligenceValue}>{drawStats.invitations}</div>
                            <div className={styles.intelligenceLabel}>Round Invitations</div>
                            <div className={styles.intelligenceMeta}>Express Entry Round</div>
                        </div>

                        {/* 3. Last Draw Date */}
                        <div
                            className={styles.intelligenceCard}
                            onClick={() => handleNavigate("Latest Draw")}
                            title="View draw history"
                        >
                            <div className={styles.intelligenceTop}>
                                <div className={styles.intelligenceIconWrap} style={{ color: "#059669", background: "rgba(16, 185, 129, 0.08)" }}>
                                    <Calendar size={18} />
                                </div>
                                <span className={styles.intelligenceBadgeNeutral}>
                                    Bi-Weekly
                                </span>
                            </div>
                            <div className={styles.intelligenceValue} style={{ fontSize: "1.25rem", paddingTop: "0.25rem", paddingBottom: "0.15rem" }}>
                                {drawStats.date}
                            </div>
                            <div className={styles.intelligenceLabel}>Last Draw Date</div>
                            <div className={styles.intelligenceMeta}>IRCC Official Gazette</div>
                        </div>

                        {/* 4. Federal PR Target */}
                        <div
                            className={styles.intelligenceCard}
                            onClick={() => {
                                const targetSec = document.getElementById("historical-data-section");
                                if (targetSec) targetSec.scrollIntoView({ behavior: "smooth" });
                            }}
                            title="View historical levels"
                        >
                            <div className={styles.intelligenceTop}>
                                <div className={styles.intelligenceIconWrap} style={{ color: "#d97706", background: "rgba(245, 158, 11, 0.08)" }}>
                                    <Target size={18} />
                                </div>
                                <span className={styles.intelligenceBadgeNeutral}>
                                    2026 Plan
                                </span>
                            </div>
                            <div className={styles.intelligenceValue}>380,000</div>
                            <div className={styles.intelligenceLabel}>Annual PR Target</div>
                            <div className={styles.intelligenceMeta}>Federal Immigration Levels</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Provincial PNP Real-time Ticker */}
            <ProvinceTicker />

            {/* Core Operations Command Deck */}
            <section className={styles.hubSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeading}>
                        <h2 className={styles.sectionTitle}>Operations & Tool Suite</h2>
                        <p className={styles.sectionSubtitle}>
                            Verified utilities for Express Entry candidates and permanent residency applicants.
                        </p>
                    </div>
                </div>

                <div className={styles.hubGrid}>
                    {operationsCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={idx}
                                className={styles.hubCard}
                                onClick={() => handleNavigate(card.action)}
                            >
                                <div className={styles.hubIconBox}>
                                    <Icon size={22} />
                                </div>

                                <div className={styles.hubContent}>
                                    <div className={styles.hubTop}>
                                        <h3 className={styles.hubCardTitle}>{card.title}</h3>
                                        <span className={styles.hubCardBadge}>{card.badge}</span>
                                    </div>
                                    <p className={styles.hubDescription}>{card.description}</p>
                                    <div className={styles.hubFooter}>
                                        <span className={styles.hubActionText}>
                                            Launch Module <ArrowRight size={13} />
                                        </span>
                                        <span className={styles.hubMetadata}>{card.meta}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Secondary Tools Strip */}
            <section className={styles.secondarySection}>
                <div className={styles.secondaryGrid}>
                    {secondaryTools.map((tool, idx) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={idx}
                                className={styles.secondaryCard}
                                onClick={() => handleNavigate(tool.action)}
                            >
                                <div className={styles.secondaryIconWrap}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <div className={styles.secondaryLabel}>{tool.label}</div>
                                    <div className={styles.secondarySub}>{tool.sub}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Precision CLB Language Benchmark Tool */}
            <section className={styles.toolsSection}>
                <div className={styles.clbCard}>
                    <div className={styles.clbHeader}>
                        <div className={styles.clbTitleArea}>
                            <div className={styles.clbIconBox}>
                                <Award size={22} />
                            </div>
                            <div>
                                <h3 className={styles.clbMainTitle}>Canadian Language Benchmark (CLB) Estimator</h3>
                                <p className={styles.clbMainSubtitle}>
                                    Translate standard language test results into official IRCC CLB benchmarks.
                                </p>
                            </div>
                        </div>

                        <button
                            className={styles.clbDetailedBtn}
                            onClick={() => setIsConverterOpen(true)}
                        >
                            Open Detailed Converter <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className={styles.clbLayout}>
                        <div className={styles.clbControls}>
                            {/* Segmented Test Switcher */}
                            <div className={styles.clbTestTabs}>
                                {(["IELTS", "CELPIP", "PTE"] as TestType[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => handleQuickCLBDefault(t)}
                                        className={`${styles.clbTabBtn} ${clbTest === t ? styles.clbTabBtnActive : ""}`}
                                    >
                                        {t === "IELTS" ? "IELTS General" : t === "CELPIP" ? "CELPIP-General" : "PTE Core"}
                                    </button>
                                ))}
                            </div>

                            {/* 4 Skill Inputs Grid */}
                            <div className={styles.clbInputsGrid}>
                                {(["Reading", "Writing", "Listening", "Speaking"] as const).map((skill) => {
                                    const keys = { Reading: "r", Writing: "w", Listening: "l", Speaking: "s" } as const;
                                    const field = keys[skill];
                                    const val = clbScores[field];
                                    const singleCLB = getClb(field);

                                    return (
                                        <div key={skill} className={styles.clbInputGroup}>
                                            <label className={styles.clbInputLabel}>{skill}</label>
                                            {clbTest === "PTE" ? (
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={(e) => setClbScores({ ...clbScores, [field]: e.target.value })}
                                                    className={styles.clbNumInput}
                                                    placeholder="0-90"
                                                    min="0"
                                                    max="90"
                                                />
                                            ) : (
                                                <div className={styles.clbSelectWrapper}>
                                                    <select
                                                        value={val}
                                                        onChange={(e) => setClbScores({ ...clbScores, [field]: e.target.value })}
                                                        className={styles.clbSelect}
                                                    >
                                                        {(clbTest === "CELPIP" ? CELPIP_OPTIONS : IELTS_OPTIONS).map((o) => (
                                                            <option key={o} value={o}>{o}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className={styles.clbArrowIcon} size={14} />
                                                </div>
                                            )}

                                            <span className={`${styles.clbBandPill} ${singleCLB >= 9 ? styles.clbBandPillGold : ""}`}>
                                                CLB {singleCLB}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Executive Score & Bonus Display */}
                        <div className={styles.clbResultBox}>
                            <div>
                                <div className={styles.clbResultHeader}>
                                    <span className={styles.clbResultTag}>Overall Benchmark Result</span>
                                    {inlineCLBLevels.min >= 9 && (
                                        <span className={styles.hubCardBadge}>
                                            <Sparkles size={11} style={{ display: "inline", marginRight: 3 }} />
                                            Golden CLB 9+
                                        </span>
                                    )}
                                </div>

                                <div className={styles.clbScoreRow}>
                                    <span className={styles.clbMainScore}>CLB {inlineCLBLevels.min}</span>
                                    <span className={styles.clbScaleNote}>Minimum Skill Level</span>
                                </div>

                                <p style={{ fontSize: "0.825rem", color: "#64748b", margin: "0 0 0.5rem" }}>
                                    Band breakdown: R: {inlineCLBLevels.r} · W: {inlineCLBLevels.w} · L: {inlineCLBLevels.l} · S: {inlineCLBLevels.s}
                                </p>
                            </div>

                            <div className={styles.clbStatusCallout}>
                                {inlineCLBLevels.min >= 9 ? (
                                    <>
                                        <div className={styles.clbCalloutTitle}>
                                            <CheckCircle2 size={15} /> Maximum CRS Skill Transferability
                                        </div>
                                        <span>
                                            With all bands at CLB 9 or higher, you qualify for up to <strong>136 bonus points</strong> under CRS skill transferability combinations.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.clbCalloutTitle}>
                                            <Target size={15} /> Target CLB 9 for 136 Bonus Points
                                        </div>
                                        <span>
                                            Reaching CLB 9 in all four abilities unlocks maximum CRS skill transferability points for post-secondary education and foreign work experience.
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CLBConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} isDark={isDark} />

            {/* Historical Admissions & Targets (2010–2026) */}
            <section id="historical-data-section" className={styles.dataSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeading}>
                        <h2 className={styles.sectionTitle}>Canadian Immigration Admissions & Targets</h2>
                        <p className={styles.sectionSubtitle}>
                            Historical federal admissions (2010–2024) and government quota levels (2025–2026).
                        </p>
                    </div>
                </div>

                {/* Trend Chart Component */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitleWrap}>
                            <h3 className={styles.chartMainTitle}>{metricLabels[selectedMetric]}</h3>
                            <p className={styles.chartSubtitle}>Historical annual counts and parliamentary levels plan</p>
                        </div>

                        <div className={styles.metricTabs}>
                            {(["pr", "study", "work", "citizenship"] as MetricType[]).map((metric) => (
                                <button
                                    key={metric}
                                    onClick={() => setSelectedMetric(metric)}
                                    className={`${styles.metricTabBtn} ${selectedMetric === metric ? styles.metricTabBtnActive : ""}`}
                                >
                                    {metric === "pr" ? "Permanent Residents" : metric === "study" ? "Study Permits" : metric === "work" ? "Work Permits" : "Citizenship"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={280} minWidth={0}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isDark ? "#ef4444" : "#c52222"} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={isDark ? "#ef4444" : "#c52222"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                                />
                                <XAxis
                                    dataKey="year"
                                    stroke={isDark ? "#94a3b8" : "#64748b"}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={isDark ? "#94a3b8" : "#64748b"}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                    width={45}
                                />
                                <ChartTooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? "#0f172a" : "#ffffff",
                                        borderColor: isDark ? "#1e293b" : "#e2e8f0",
                                        borderRadius: "8px",
                                        color: isDark ? "#f8fafc" : "#0f172a",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                    }}
                                    formatter={(value: any) => [Number(value).toLocaleString(), metricLabels[selectedMetric]]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isDark ? "#ef4444" : "#c52222"}
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table */}
                <div className={styles.tableCard}>
                    <div className={styles.tableScrollArea}>
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
                                        <span>Status / Classification</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((row) => (
                                    <tr key={row.year} className={styles.tr}>
                                        <td className={`${styles.td} ${styles.tdYear}`}>{row.year}</td>
                                        <td className={styles.td}>{fmt(row.pr)}</td>
                                        <td className={styles.td}>{fmt(row.study)}</td>
                                        <td className={styles.td}>{fmt(row.work)}</td>
                                        <td className={styles.td}>{fmt(row.citizenship)}</td>
                                        <td className={`${styles.td} ${styles.tdNote}`}>
                                            {row.notes === "COVID impact" && (
                                                <span className={styles.pillCovid}>COVID Impact</span>
                                            )}
                                            {(row.notes === "Target / Cap" || row.notes === "Target") && (
                                                <span className={styles.pillTarget}>Federal Target</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className={styles.dataFootnote}>
                    Sources: Immigration, Refugees and Citizenship Canada (IRCC) Annual Reports to Parliament & Statistics Canada Gazette. Approximate figures (~) indicated where rounded in official releases. 2025–2026 figures represent parliamentary target quotas.
                </p>
            </section>

            {/* High-Trust Dispatch & Notification Suite */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaCard}>
                    <div className={styles.ctaContent}>
                        <div className={styles.ctaBadge}>
                            <Bell size={13} />
                            <span>Official Draw Dispatch</span>
                        </div>

                        <h2 className={styles.ctaHeading}>
                            Never Miss an Express Entry Cutoff Update
                        </h2>

                        <p className={styles.ctaDescription}>
                            Join candidates receiving instant notifications the moment IRCC releases new draw cutoffs, category selections, and Provincial Nominee rounds.
                        </p>

                        <button
                            className={styles.ctaActionBtn}
                            onClick={() => handleNavigate("Early Access")}
                        >
                            Join Priority Notifications Free
                            <ArrowRight size={16} />
                        </button>

                        <div className={styles.ctaTrustRow}>
                            <div className={styles.trustItem}>
                                <ShieldCheck size={14} style={{ color: "var(--primary)" }} />
                                <span>Zero Spam Guarantee</span>
                            </div>
                            <div className={styles.trustItem}>
                                <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                                <span>Official Gazette Feed</span>
                            </div>
                            <div className={styles.trustItem}>
                                <Sparkles size={14} style={{ color: "var(--secondary)" }} />
                                <span>100% Free For Applicants</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
