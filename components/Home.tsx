"use client";

import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { motion, type Variants } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Calculator as CalcIcon,
    LineChart,
    Newspaper,
    MapPin,
    BookOpen,
    Bell,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ShieldCheck,
    CheckCircle2,
    Target,
    UserRound,
    Compass,
    Gauge,
    Mail,
    FileCheck2,
    Sparkles,
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
import AnimatedCounter from "./AnimatedCounter";
import TopoPattern from "./home/TopoPattern";
import Sparkline from "./home/Sparkline";
import { useTheme } from "@/lib/useTheme";

interface HomeProps {
    onNavigateToTab?: (tabName: string) => void;
}

interface Draw {
    id: number;
    round?: string;
    program: string;
    crs_cutoff: string | number | null;
    invitations: string | number | null;
    draw_date: string;
    draw_province?: string;
}

type SortKey = "year" | "pr" | "study" | "work" | "citizenship";
type SortDir = "asc" | "desc";
type MetricType = "pr" | "study" | "work" | "citizenship";
type TestType = "IELTS" | "CELPIP" | "PTE";

const rise: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
};

const inView = {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, margin: "-60px" },
} as const;

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
        if (score >= 8.0) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.0) return 6; if (score >= 4.0) return 5; return 4;
    }
    if (type === "L") {
        if (score >= 8.5) return 10; if (score >= 8.0) return 9; if (score >= 7.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; if (score >= 5.0) return 5; return 4;
    }
    if (score >= 7.5) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; if (score >= 5.0) return 5; return 4;
};

const getPteCLB = (type: "R" | "L" | "W" | "S", score: number): number => {
    if (type === "R") { if (score >= 88) return 10; if (score >= 78) return 9; if (score >= 69) return 8; if (score >= 60) return 7; return 5; }
    if (type === "W") { if (score >= 90) return 10; if (score >= 88) return 9; if (score >= 79) return 8; if (score >= 69) return 7; return 5; }
    if (type === "L") { if (score >= 89) return 10; if (score >= 82) return 9; if (score >= 71) return 8; if (score >= 60) return 7; return 5; }
    if (score >= 89) return 10; if (score >= 84) return 9; if (score >= 76) return 8; if (score >= 68) return 7; return 5;
};

const toNum = (v: string | number | null | undefined) => {
    const n = Number(String(v ?? "").replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};
const shortProgram = (p: string) =>
    p
        .replace(/^Express Entry\s*[-–—]\s*/i, "")
        .replace(/\(.*?\)/g, "")
        .trim();

const PROCESS = [
    {
        icon: UserRound,
        title: "Create your profile",
        body: "Enter your age, education, language results and work history into an Express Entry profile. It stays valid for 12 months.",
    },
    {
        icon: Gauge,
        title: "Get your CRS score",
        body: "You're ranked out of 1,200 points against everyone else in the pool. A higher score means better odds each draw.",
    },
    {
        icon: Mail,
        title: "Receive an invitation",
        body: "IRCC runs draws roughly every two weeks, inviting candidates at or above that round's cut-off score.",
    },
    {
        icon: FileCheck2,
        title: "Apply for PR in 60 days",
        body: "An Invitation to Apply (ITA) gives you 60 days to submit a complete permanent residence application.",
    },
];

export default function Home({ onNavigateToTab }: HomeProps) {
    const { isDark } = useTheme();
    const [isConverterOpen, setIsConverterOpen] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>("year");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("pr");

    const [clbTest, setClbTest] = useState<TestType>("IELTS");
    const [clbScores, setClbScores] = useState({ r: "7.0", w: "7.0", l: "7.5", s: "7.0" });

    const [draws, setDraws] = useState<Draw[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/draws");
                if (!res.ok) throw new Error(String(res.status));
                const data = await res.json();
                if (!cancelled && Array.isArray(data)) setDraws(data);
            } catch (err) {
                console.error("Error fetching draws:", err);
                if (!cancelled) setDraws([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    /* ---- Live federal Express Entry analytics ---- */
    const live = useMemo(() => {
        if (!draws) return null;
        const federal = draws
            .filter(
                (d) =>
                    /^express entry/i.test(d.program || "") &&
                    d.draw_date &&
                    dayjs(d.draw_date).isValid() &&
                    toNum(d.crs_cutoff) > 0
            )
            .sort((a, b) => dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf());
        if (!federal.length) return null;

        const latest = federal[0];
        const sameProgram = federal.filter((d) => d.program === latest.program);
        const prev = sameProgram[1];
        const delta = prev ? toNum(latest.crs_cutoff) - toNum(prev.crs_cutoff) : null;
        const trend = sameProgram
            .slice(0, 12)
            .reverse()
            .map((d) => toNum(d.crs_cutoff));

        const year = dayjs(latest.draw_date).year();
        const ytd = federal.filter((d) => dayjs(d.draw_date).year() === year);
        const invitations = ytd.reduce((n, d) => n + toNum(d.invitations), 0);
        const nonPnp = ytd.filter((d) => !/pnp/i.test(d.program));
        const lowest = nonPnp.length
            ? nonPnp.reduce((m, d) => (toNum(d.crs_cutoff) < toNum(m.crs_cutoff) ? d : m))
            : null;

        return {
            latest,
            delta,
            trend,
            year,
            ytdDraws: ytd.length,
            invitations,
            lowest,
            daysSince: Math.max(0, dayjs().diff(dayjs(latest.draw_date), "day")),
            recent: federal.slice(0, 8),
        };
    }, [draws]);

    const handleNavigate = (tabName: string) => onNavigateToTab?.(tabName);

    /* ---- CLB estimator ---- */
    const getClb = (f: "r" | "w" | "l" | "s") => {
        const val = clbScores[f];
        if (clbTest === "CELPIP") return getCelpipScore(val);
        const types = { r: "R", w: "W", l: "L", s: "S" } as const;
        if (clbTest === "IELTS") return getIeltsCLB(types[f], parseFloat(val));
        return getPteCLB(types[f], parseInt(val) || 0);
    };

    const inlineCLBLevels = useMemo(() => {
        const r = getClb("r");
        const w = getClb("w");
        const l = getClb("l");
        const s = getClb("s");
        return { r, w, l, s, min: Math.min(r, w, l, s) };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clbScores, clbTest]);

    const handleQuickCLBDefault = (testType: TestType) => {
        setClbTest(testType);
        if (testType === "IELTS") setClbScores({ r: "7.0", w: "7.0", l: "7.5", s: "7.0" });
        if (testType === "CELPIP") setClbScores({ r: "9", w: "9", l: "9", s: "9" });
        if (testType === "PTE") setClbScores({ r: "78", w: "88", l: "82", s: "84" });
    };

    /* ---- Admissions table / chart ---- */
    const sortedData = useMemo(() => {
        return [...RAW_DATA].sort((a, b) => {
            const av = a[sortKey] ?? -1;
            const bv = b[sortKey] ?? -1;
            return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
        });
    }, [sortKey, sortDir]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const fmt = (n: number | null) =>
        n == null ? <span className={styles.cellPending}>—</span> : n.toLocaleString();

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />;
        return sortDir === "asc" ? <ChevronUp size={12} className={styles.sortOn} /> : <ChevronDown size={12} className={styles.sortOn} />;
    };

    const chartData = useMemo(
        () =>
            RAW_DATA.map((d) => ({
                year: d.year.toString(),
                value: d[selectedMetric] || 0,
                isProjected: d.notes.includes("Target"),
            })),
        [selectedMetric]
    );

    const metricLabels = {
        pr: "Permanent residents admitted",
        study: "Study permit holders",
        work: "Work permit holders",
        citizenship: "Citizenship grants",
    };
    const metricShort = { pr: "PR", study: "Study", work: "Work", citizenship: "Citizenship" } as const;

    const CELPIP_OPTIONS = ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "M"];
    const IELTS_OPTIONS = ["9.0", "8.5", "8.0", "7.5", "7.0", "6.5", "6.0", "5.5", "5.0", "4.5", "4.0"];

    const accent = isDark ? "#f0483c" : "#d3261b";
    const axis = isDark ? "#8f95a1" : "#666b76";
    const grid = isDark ? "rgba(255,255,255,0.07)" : "rgba(20,23,28,0.08)";

    const DeltaIcon =
        live?.delta == null ? Minus : live.delta > 0 ? ArrowUpRight : live.delta < 0 ? ArrowDownRight : Minus;
    // For candidates a falling cut-off is good news
    const deltaTone = live?.delta == null || live.delta === 0 ? "flat" : live.delta < 0 ? "good" : "bad";

    return (
        <div className={styles.container}>
            {/* ============================ HERO ============================ */}
            <section className={styles.hero}>
                <TopoPattern className={styles.topo} />

                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <motion.p className={styles.eyebrow} variants={rise} initial="hidden" animate="show" custom={0}>
                            <span className={styles.eyebrowRule} />
                            Express Entry · CRS · PNP
                        </motion.p>

                        <motion.h1 className={styles.heroTitle} variants={rise} initial="hidden" animate="show" custom={1}>
                            Canada&rsquo;s immigration numbers, made <em>readable.</em>
                        </motion.h1>

                        <motion.p className={styles.heroSubtitle} variants={rise} initial="hidden" animate="show" custom={2}>
                            Every Express Entry draw, cut-off and provincial quota in one place &mdash; plus a free
                            CRS calculator to see exactly where you stand.
                        </motion.p>

                        <motion.div className={styles.heroActions} variants={rise} initial="hidden" animate="show" custom={3}>
                            <button className={styles.btnPrimary} onClick={() => handleNavigate("Calculator")}>
                                <CalcIcon size={16} />
                                Calculate my CRS score
                            </button>
                            <button className={styles.btnGhost} onClick={() => handleNavigate("Latest Draw")}>
                                Browse latest draws
                                <ArrowRight size={15} />
                            </button>
                        </motion.div>

                        <motion.ul className={styles.assure} variants={rise} initial="hidden" animate="show" custom={4}>
                            <li><CheckCircle2 size={14} /> Compiled from public IRCC data</li>
                            <li><CheckCircle2 size={14} /> Updated after each draw</li>
                            <li><CheckCircle2 size={14} /> Free &amp; independent</li>
                        </motion.ul>
                    </div>

                    {/* ---- Live dispatch card ---- */}
                    <motion.aside
                        className={styles.dispatch}
                        variants={rise}
                        initial="hidden"
                        animate="show"
                        custom={2}
                        aria-label="Latest Express Entry draw"
                    >
                        <div className={styles.dispatchHead}>
                            <span className={styles.live}><i /> Latest draw</span>
                            <span className={styles.dispatchDate}>
                                {live ? dayjs(live.latest.draw_date).format("MMM D, YYYY") : "—"}
                            </span>
                        </div>

                        {live ? (
                            <>
                                <div className={styles.dispatchProgram}>{shortProgram(live.latest.program)}</div>

                                <div className={styles.dispatchScoreRow}>
                                    <div className={styles.dispatchScore}>
                                        <AnimatedCounter value={toNum(live.latest.crs_cutoff)} />
                                    </div>
                                    <div className={styles.dispatchScoreMeta}>
                                        <span>CRS cut-off</span>
                                        {live.delta != null && (
                                            <span className={`${styles.delta} ${styles[`delta_${deltaTone}`]}`}>
                                                <DeltaIcon size={13} />
                                                {live.delta === 0 ? "No change" : `${Math.abs(live.delta)} ${Math.abs(live.delta) === 1 ? "pt" : "pts"}`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.dispatchSpark}>
                                    <Sparkline values={live.trend} />
                                    <div className={styles.sparkCaption}>
                                        Last {live.trend.length} {shortProgram(live.latest.program)} draws
                                    </div>
                                </div>

                                <dl className={styles.dispatchFacts}>
                                    <div>
                                        <dt>Invitations</dt>
                                        <dd>{toNum(live.latest.invitations).toLocaleString()}</dd>
                                    </div>
                                    <div>
                                        <dt>Round</dt>
                                        <dd>#{live.latest.round ?? "—"}</dd>
                                    </div>
                                    <div>
                                        <dt>Days ago</dt>
                                        <dd>{live.daysSince}</dd>
                                    </div>
                                </dl>

                                <button className={styles.dispatchLink} onClick={() => handleNavigate("Latest Draw")}>
                                    Full draw history <ArrowRight size={14} />
                                </button>
                            </>
                        ) : (
                            <div className={styles.skeleton} aria-busy="true">
                                <span /><span /><span /><span />
                            </div>
                        )}
                    </motion.aside>
                </div>
            </section>

            <ProvinceTicker />

            {/* ======================== YEAR AT A GLANCE ======================== */}
            {live && (
                <motion.section className={styles.glance} {...inView} variants={rise}>
                    <div className={styles.glanceHead}>
                        <span className={styles.kicker}>{live.year} so far</span>
                        <h2 className={styles.h2}>The year at a glance</h2>
                    </div>
                    <div className={styles.glanceGrid}>
                        <div className={styles.glanceItem}>
                            <div className={styles.glanceNum}><AnimatedCounter value={live.ytdDraws} /></div>
                            <div className={styles.glanceLabel}>Express Entry draws</div>
                        </div>
                        <div className={styles.glanceItem}>
                            <div className={styles.glanceNum}><AnimatedCounter value={live.invitations} /></div>
                            <div className={styles.glanceLabel}>Invitations issued</div>
                        </div>
                        <div className={styles.glanceItem}>
                            <div className={styles.glanceNum}>
                                {live.lowest ? <AnimatedCounter value={toNum(live.lowest.crs_cutoff)} /> : "—"}
                            </div>
                            <div className={styles.glanceLabel}>
                                Lowest cut-off
                                {live.lowest && <span className={styles.glanceSub} title={live.lowest.program}>{shortProgram(live.lowest.program)}</span>}
                            </div>
                        </div>
                        <div className={styles.glanceItem}>
                            <div className={styles.glanceNum}><AnimatedCounter value={live.daysSince} /></div>
                            <div className={styles.glanceLabel}>Days since last draw</div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* ========================= RECENT DRAWS ========================= */}
            {live && (
                <motion.section className={styles.section} {...inView} variants={rise}>
                    <div className={styles.sectionHead}>
                        <div>
                            <span className={styles.kicker}>01 · Draw log</span>
                            <h2 className={styles.h2}>Recent invitation rounds</h2>
                        </div>
                        <button className={styles.textLink} onClick={() => handleNavigate("Latest Draw")}>
                            View all draws <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className={styles.logCard}>
                        <div className={styles.logHeader} role="row">
                            <span>Date</span>
                            <span>Program</span>
                            <span className={styles.right}>Invitations</span>
                            <span className={styles.right}>CRS</span>
                        </div>
                        {live.recent.map((d) => (
                            <div className={styles.logRow} key={d.id} role="row">
                                <span className={styles.logDate}>
                                    <b>{dayjs(d.draw_date).format("MMM D")}</b>
                                    <i>{dayjs(d.draw_date).format("YYYY")}</i>
                                </span>
                                <span className={styles.logProgram}>
                                    {shortProgram(d.program)}
                                    <em>Round #{d.round ?? "—"}</em>
                                </span>
                                <span className={`${styles.right} ${styles.mono}`}>{toNum(d.invitations).toLocaleString()}</span>
                                <span className={`${styles.right} ${styles.logScore}`}>{toNum(d.crs_cutoff)}</span>
                            </div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* =========================== TOOLS BENTO =========================== */}
            <motion.section className={styles.section} {...inView} variants={rise}>
                <div className={styles.sectionHead}>
                    <div>
                        <span className={styles.kicker}>02 · Toolkit</span>
                        <h2 className={styles.h2}>Everything for your PR plan</h2>
                    </div>
                </div>

                <div className={styles.bento}>
                    <button className={`${styles.tile} ${styles.tileCalc}`} onClick={() => handleNavigate("Calculator")}>
                        <span className={styles.tileTag}>Most used</span>
                        <div className={styles.tileBody}>
                            <h3>CRS score calculator</h3>
                            <p>Core factors, spouse, skill transferability and bonus points &mdash; scored on IRCC&rsquo;s official tables.</p>
                        </div>
                        <div className={styles.gauge} aria-hidden="true">
                            <svg viewBox="0 0 120 70">
                                <path d="M10 62a50 50 0 0 1 100 0" className={styles.gaugeTrack} pathLength={100} />
                                <path d="M10 62a50 50 0 0 1 100 0" className={styles.gaugeFill} pathLength={100} />
                            </svg>
                            <span>487<small>/1200</small></span>
                        </div>
                        <span className={styles.tileGo}>Open calculator <ArrowRight size={14} /></span>
                    </button>

                    <button className={`${styles.tile} ${styles.tileDraws}`} onClick={() => handleNavigate("Latest Draw")}>
                        <LineChart size={20} className={styles.tileIcon} />
                        <h3>Draw tracker</h3>
                        <p>Every round, filterable by program and province.</p>
                        <span className={styles.tileGo}>Open <ArrowRight size={14} /></span>
                    </button>

                    <button className={`${styles.tile} ${styles.tileScores}`} onClick={() => handleNavigate("CRS Scores")}>
                        <Target size={20} className={styles.tileIcon} />
                        <h3>Score analytics</h3>
                        <p>Cut-off trends, distributions and monthly volume.</p>
                        <span className={styles.tileGo}>Open <ArrowRight size={14} /></span>
                    </button>

                    <button className={`${styles.tile} ${styles.tilePath}`} onClick={() => handleNavigate("PR Pathways")}>
                        <MapPin size={20} className={styles.tileIcon} />
                        <h3>PR pathways &amp; PNP</h3>
                        <p>Federal programs and provincial nominee streams with live quotas.</p>
                        <span className={styles.tileGo}>Explore <ArrowRight size={14} /></span>
                    </button>

                    <button className={`${styles.tile} ${styles.tileJourney}`} onClick={() => handleNavigate("My Journey")}>
                        <Compass size={20} className={styles.tileIcon} />
                        <h3>My journey</h3>
                        <p>Map your own path from arrival to citizenship, step by step.</p>
                        <span className={styles.tileGo}>Plan <ArrowRight size={14} /></span>
                    </button>

                    <button className={`${styles.tile} ${styles.tileNews}`} onClick={() => handleNavigate("News")}>
                        <Newspaper size={20} className={styles.tileIcon} />
                        <h3>Policy news</h3>
                        <p>Category changes, levels plans and IRCC announcements.</p>
                        <span className={styles.tileGo}>Read <ArrowRight size={14} /></span>
                    </button>

                    <button className={`${styles.tile} ${styles.tileFaq}`} onClick={() => handleNavigate("What Is...?")}>
                        <BookOpen size={20} className={styles.tileIcon} />
                        <h3>Plain-English guides</h3>
                        <p>CRS, ITA, PNP, LMIA &mdash; the jargon, explained.</p>
                        <span className={styles.tileGo}>Learn <ArrowRight size={14} /></span>
                    </button>
                </div>
            </motion.section>

            {/* ========================= HOW IT WORKS ========================= */}
            <motion.section className={styles.section} {...inView} variants={rise}>
                <div className={styles.sectionHead}>
                    <div>
                        <span className={styles.kicker}>03 · The process</span>
                        <h2 className={styles.h2}>How Express Entry works</h2>
                    </div>
                </div>

                <ol className={styles.steps}>
                    {PROCESS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.li
                                key={step.title}
                                className={styles.step}
                                variants={rise}
                                custom={i}
                                {...inView}
                            >
                                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                                <span className={styles.stepIcon}><Icon size={20} /></span>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </motion.li>
                        );
                    })}
                </ol>
            </motion.section>

            {/* =========================== CLB ESTIMATOR =========================== */}
            <motion.section className={styles.section} {...inView} variants={rise}>
                <div className={styles.sectionHead}>
                    <div>
                        <span className={styles.kicker}>04 · Language</span>
                        <h2 className={styles.h2}>CLB quick converter</h2>
                    </div>
                    <button className={styles.textLink} onClick={() => setIsConverterOpen(true)}>
                        Full score charts <ArrowRight size={14} />
                    </button>
                </div>

                <div className={styles.clbCard}>
                    <div className={styles.clbControls}>
                        <div className={styles.segment} role="tablist" aria-label="Language test">
                            {(["IELTS", "CELPIP", "PTE"] as TestType[]).map((t) => (
                                <button
                                    key={t}
                                    role="tab"
                                    aria-selected={clbTest === t}
                                    onClick={() => handleQuickCLBDefault(t)}
                                    className={`${styles.segBtn} ${clbTest === t ? styles.segBtnOn : ""}`}
                                >
                                    {t === "IELTS" ? "IELTS General" : t === "CELPIP" ? "CELPIP-General" : "PTE Core"}
                                </button>
                            ))}
                        </div>

                        <div className={styles.clbInputs}>
                            {(["Reading", "Writing", "Listening", "Speaking"] as const).map((skill) => {
                                const keys = { Reading: "r", Writing: "w", Listening: "l", Speaking: "s" } as const;
                                const field = keys[skill];
                                const val = clbScores[field];
                                const single = getClb(field);
                                const id = `clb-${field}`;
                                return (
                                    <div key={skill} className={styles.clbField}>
                                        <label htmlFor={id}>{skill}</label>
                                        {clbTest === "PTE" ? (
                                            <input
                                                id={id}
                                                type="number"
                                                inputMode="numeric"
                                                value={val}
                                                onChange={(e) => setClbScores({ ...clbScores, [field]: e.target.value })}
                                                className={styles.control}
                                                placeholder="0–90"
                                                min="0"
                                                max="90"
                                            />
                                        ) : (
                                            <div className={styles.selectWrap}>
                                                <select
                                                    id={id}
                                                    value={val}
                                                    onChange={(e) => setClbScores({ ...clbScores, [field]: e.target.value })}
                                                    className={styles.control}
                                                >
                                                    {(clbTest === "CELPIP" ? CELPIP_OPTIONS : IELTS_OPTIONS).map((o) => (
                                                        <option key={o} value={o}>{o}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} />
                                            </div>
                                        )}
                                        <div className={styles.clbMeter} aria-hidden="true">
                                            <i style={{ width: `${Math.min(100, (single / 10) * 100)}%` }} />
                                        </div>
                                        <span className={`${styles.clbPill} ${single >= 9 ? styles.clbPillHigh : ""}`}>CLB {single}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.clbResult}>
                        <span className={styles.kicker}>Your overall level</span>
                        <div className={styles.clbBig}>
                            <span>CLB</span>
                            {inlineCLBLevels.min}
                        </div>
                        <p className={styles.clbBreak}>
                            R {inlineCLBLevels.r} · W {inlineCLBLevels.w} · L {inlineCLBLevels.l} · S {inlineCLBLevels.s}
                        </p>
                        <div className={`${styles.callout} ${inlineCLBLevels.min >= 9 ? styles.calloutGood : ""}`}>
                            {inlineCLBLevels.min >= 9 ? (
                                <>
                                    <b><Sparkles size={14} /> CLB 9+ unlocked</b>
                                    <span>Every ability is at CLB 9 or higher, which unlocks the strongest skill-transferability bonuses.</span>
                                </>
                            ) : (
                                <>
                                    <b><Target size={14} /> Aim for CLB 9</b>
                                    <span>Reaching CLB 9 in all four abilities earns far more skill-transferability points with education and work experience.</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>

            <CLBConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} isDark={isDark} />

            {/* ============================ ADMISSIONS ============================ */}
            <motion.section id="historical-data-section" className={styles.section} {...inView} variants={rise}>
                <div className={styles.sectionHead}>
                    <div>
                        <span className={styles.kicker}>05 · Long view</span>
                        <h2 className={styles.h2}>Admissions &amp; targets, 2010&ndash;2026</h2>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3 className={styles.chartTitle}>{metricLabels[selectedMetric]}</h3>
                            <p className={styles.chartSub}>Annual counts; 2025&ndash;26 are government targets.</p>
                        </div>
                        <div className={styles.segment} role="tablist" aria-label="Metric">
                            {(["pr", "study", "work", "citizenship"] as MetricType[]).map((metric) => (
                                <button
                                    key={metric}
                                    role="tab"
                                    aria-selected={selectedMetric === metric}
                                    onClick={() => setSelectedMetric(metric)}
                                    className={`${styles.segBtn} ${selectedMetric === metric ? styles.segBtnOn : ""}`}
                                >
                                    {metricShort[metric]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.chartWrap}>
                        <ResponsiveContainer width="100%" height={300} minWidth={0}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={accent} stopOpacity={0.22} />
                                        <stop offset="100%" stopColor={accent} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke={grid} />
                                <XAxis dataKey="year" stroke={axis} fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={18} />
                                <YAxis
                                    stroke={axis}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                                    width={48}
                                />
                                <ChartTooltip
                                    cursor={{ stroke: axis, strokeDasharray: "3 3" }}
                                    contentStyle={{
                                        backgroundColor: isDark ? "#141820" : "#fbfaf6",
                                        border: `1px solid ${isDark ? "#262b35" : "#ddd8cb"}`,
                                        borderRadius: 10,
                                        color: isDark ? "#ecebe5" : "#14171c",
                                        boxShadow: "0 10px 30px -12px rgba(0,0,0,0.35)",
                                        fontSize: 12,
                                    }}
                                    formatter={(value: any) => [Number(value).toLocaleString(), metricShort[selectedMetric]]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={accent}
                                    strokeWidth={2.25}
                                    fill="url(#colorMetric)"
                                    activeDot={{ r: 5, strokeWidth: 2, stroke: isDark ? "#141820" : "#fbfaf6" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableScroll}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {([
                                        ["year", "Year"],
                                        ["pr", "Permanent residents"],
                                        ["study", "Study permits"],
                                        ["work", "Work permits"],
                                        ["citizenship", "Citizenship"],
                                    ] as [SortKey, string][]).map(([key, label]) => (
                                        <th key={key} aria-sort={sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button onClick={() => handleSort(key)}>
                                                {label} <SortIcon col={key} />
                                            </button>
                                        </th>
                                    ))}
                                    <th><span>Note</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((row) => (
                                    <tr key={row.year}>
                                        <th scope="row" className={styles.tdYear}>{row.year}</th>
                                        <td>{fmt(row.pr)}</td>
                                        <td>{fmt(row.study)}</td>
                                        <td>{fmt(row.work)}</td>
                                        <td>{fmt(row.citizenship)}</td>
                                        <td>
                                            {row.notes === "COVID impact" && <span className={styles.pillCovid}>COVID</span>}
                                            {(row.notes === "Target / Cap" || row.notes === "Target") && (
                                                <span className={styles.pillTarget}>Target</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className={styles.footnote}>
                    Sources: IRCC annual reports to Parliament and Statistics Canada. Some figures are rounded in official releases.
                    2025&ndash;2026 values are parliamentary targets, not outcomes.
                </p>
            </motion.section>

            {/* ============================== ALERTS CTA ============================== */}
            <motion.section className={styles.cta} {...inView} variants={rise}>
                <TopoPattern className={styles.ctaTopo} />
                <div className={styles.ctaInner}>
                    <span className={styles.ctaKicker}><Bell size={13} /> Draw alerts</span>
                    <h2 className={styles.ctaTitle}>Hear about the next draw <em>first.</em></h2>
                    <p>Get a note when IRCC publishes new Express Entry cut-offs, category rounds and provincial nominee draws.</p>
                    <div className={styles.ctaRow}>
                        <button className={styles.btnLight} onClick={() => handleNavigate("Early Access")}>
                            Join the free alert list <ArrowRight size={16} />
                        </button>
                        <span className={styles.ctaTrust}><ShieldCheck size={14} /> No spam. Unsubscribe anytime.</span>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
