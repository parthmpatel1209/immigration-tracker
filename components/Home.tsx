"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "lucide-react";
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

export default function Home({ onNavigateToTab }: HomeProps) {
    const [isDark, setIsDark] = useState(false);
    const [isConverterOpen, setIsConverterOpen] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>("year");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

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

    const features = [
        {
            icon: TrendingUp,
            title: "Latest Draws",
            description: "Real-time updates on Express Entry and PNP draws",
            color: "from-blue-600 to-indigo-600",
            action: "Latest Draw",
            stats: "Updated 2h ago"
        },
        {
            icon: Calculator,
            title: "CRS Calculator",
            description: "Calculate your score accurately in seconds",
            color: "from-emerald-600 to-teal-600",
            action: "Calculator",
            badge: "Popular"
        },
        {
            icon: Activity,
            title: "Score Analytics",
            description: "Historical trends and cutoff predictions",
            color: "from-purple-600 to-indigo-600",
            action: "CRS Scores",
        },
        {
            icon: Newspaper,
            title: "Pathways & News",
            description: "Latest policy changes and immigration routes",
            color: "from-orange-600 to-amber-600",
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
                console.log("Fetching latest draw data...");
                const res = await fetch("/api/draws");
                console.log("API Response status:", res.status);

                if (res.ok) {
                    const data = await res.json();
                    console.log("Received data:", data?.length, "draws");

                    if (data && data.length > 0) {
                        // Sort by date to ensure we get the latest
                        // API returns dates in YYYY-MM-DD format
                        const sorted = data
                            .filter((d: any) => d.draw_date && dayjs(d.draw_date).isValid())
                            .sort((a: any, b: any) =>
                                dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
                            );

                        console.log("Sorted draws:", sorted.length);

                        if (sorted.length > 0) {
                            const latest = sorted[0];
                            console.log("Latest draw:", latest);

                            setDrawStats({
                                score: latest.crs_cutoff || "N/A",
                                invitations: latest.invitations ? Number(latest.invitations).toLocaleString() : "N/A",
                                date: dayjs(latest.draw_date).format("MMM DD, YYYY")
                            });
                        } else {
                            console.warn("No valid draws found after filtering");
                        }
                    } else {
                        console.warn("No data received from API");
                    }
                } else {
                    console.error("API returned error status:", res.status);
                }
            } catch (err) {
                console.error("Error fetching hero stats:", err);
                setDrawStats({ score: "Error", invitations: "Error", date: "Error" });
            }
        };
        fetchLatestDraw();
    }, []);

    const quickStats = [
        { label: "Last Draw", value: drawStats.score, sub: "CRS Score", icon: TrendingUp },
        { label: "Invitations", value: drawStats.invitations, sub: "Express Entry", icon: Users },
        { label: "Frequency", value: "Bi-Weekly", sub: "Average", icon: Activity },
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

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <PlexusBackground />
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <div className={styles.badgePulse}></div>
                        <span>Live Immigration Tracker</span>
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

                    {/* Quick Stats Banner */}
                    <div className={styles.heroStats}>
                        {quickStats.map((stat, idx) => (
                            <div key={idx} className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>
                                    <stat.icon size={18} />
                                </div>
                                <div className={styles.heroStatText}>
                                    <div className={styles.heroStatValue}>
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className={styles.heroStatLabel}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                            <div
                                key={idx}
                                className={styles.hubCard}
                                onClick={() => handleNavigate(feature.action)}
                            >
                                <div className={`${styles.hubIcon} ${styles[`gradient${idx}`]}`}>
                                    <Icon size={32} />
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
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Secondary Tools Area */}
            <section className={styles.secondarySection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>More Resources</h2>
                </div>
                <div className={styles.secondaryGrid}>
                    {secondaryActions.map((item, idx) => (
                        <button
                            key={idx}
                            className={styles.secondaryActionCard}
                            onClick={() => handleNavigate(item.action)}
                        >
                            <item.icon size={20} className={styles.secondaryIcon} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Interactive Tools */}
            <section className={styles.toolsSection}>
                <button
                    onClick={() => setIsConverterOpen(true)}
                    className={styles.converterBar}
                >
                    <div className={styles.converterIcon}>
                        <Globe size={20} />
                    </div>
                    <div className={styles.converterText}>
                        <span className={styles.converterLabel}>New Tool</span>
                        <span className={styles.converterTitle}>CLB Language Converter</span>
                    </div>
                    <ArrowRight size={20} className={styles.converterArrow} />
                </button>
            </section>

            <CLBConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} isDark={isDark} />

            {/* Historical Immigration Data Table */}
            <section className={styles.dataSection}>
                <div className={styles.dataSectionHeader}>
                    <div className={styles.dataSectionIcon}>
                        <BarChart2 size={22} />
                    </div>
                    <div>
                        <h2 className={styles.dataSectionTitle}>Canadian Immigration at a Glance</h2>
                        <p className={styles.dataSectionSubtitle}>Historical admissions data from 2010 – 2026 · Click any column header to sort</p>
                    </div>
                </div>

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

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <div className={styles.ctaGraphics}>
                        <div className={styles.ctaCircle1}></div>
                        <div className={styles.ctaCircle2}></div>
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
