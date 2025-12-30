"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import styles from "./Home.module.css";
import CLBConverter from './CLBConverter';
import ProvinceTicker from './ProvinceTicker';
import AnimatedCounter from './AnimatedCounter';
import ScrollHighlightText from './ScrollHighlightText';

interface HomeProps {
    onNavigateToTab?: (tabName: string) => void;
}

export default function Home({ onNavigateToTab }: HomeProps) {
    const [isDark, setIsDark] = useState(false);
    const [isConverterOpen, setIsConverterOpen] = useState(false);

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

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <div className={styles.badgePulse}></div>
                        <span>Live Immigration Tracker</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        Your Path to <span className={styles.gradient}>Canada</span> <br />
                        Starts Here
                    </h1>

                    <p className={styles.heroSubtitle}>
                        Track latest draws, calculate your CRS score, and explore immigration pathways with Canada's most accurate real-time tracker.
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

            {/* Scroll Highlight Text Section */}
            <ScrollHighlightText
                text="Navigate your Canadian immigration journey with real-time data, accurate CRS calculations, and comprehensive pathway insights that empower your decisions every step of the way"
            />

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
