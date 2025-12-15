"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    Calculator,
    Globe,
    Bell,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Users,
    FileText,
    Sparkles,
    BarChart3,
    Compass,
} from "lucide-react";
import styles from "./Home.module.css";

interface HomeProps {
    onNavigateToTab?: (tabName: string) => void;
}

export default function Home({ onNavigateToTab }: HomeProps) {
    const [isDark, setIsDark] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);

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

    // Trigger stats animation
    useEffect(() => {
        const timer = setTimeout(() => setStatsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = (tabName: string) => {
        if (onNavigateToTab) {
            onNavigateToTab(tabName);
        }
    };

    const features = [
        {
            icon: TrendingUp,
            title: "Live Draw Updates",
            description: "Get real-time updates on Express Entry and Provincial Nominee Program draws",
            color: "from-blue-500 to-cyan-500",
            action: "Latest Draw",
        },
        {
            icon: BarChart3,
            title: "CRS Score Analytics",
            description: "Track historical CRS trends and understand your chances with detailed analytics",
            color: "from-purple-500 to-pink-500",
            action: "CRS Scores",
        },
        {
            icon: Calculator,
            title: "CRS Calculator",
            description: "Calculate your Comprehensive Ranking System score accurately in seconds",
            color: "from-green-500 to-emerald-500",
            action: "Calculator",
        },
        {
            icon: MapPin,
            title: "PR Pathways",
            description: "Explore all available immigration pathways and find the best fit for you",
            color: "from-orange-500 to-red-500",
            action: "PR Pathways",
        },
        {
            icon: FileText,
            title: "Immigration News",
            description: "Stay informed with the latest immigration policy updates and announcements",
            color: "from-indigo-500 to-blue-500",
            action: "News",
        },
        {
            icon: Compass,
            title: "Expert Guidance",
            description: "Access comprehensive FAQs and step-by-step immigration guides",
            color: "from-pink-500 to-rose-500",
            action: "What Is...?",
        },
    ];

    const quickStats = [
        { label: "Active PNP Streams", value: "80+", icon: Globe },
        { label: "Weekly Draws", value: "~12", icon: TrendingUp },
        { label: "Provinces Tracked", value: "13", icon: MapPin },
        { label: "Daily Users", value: "10K+", icon: Users },
    ];

    const steps = [
        {
            number: "01",
            title: "Calculate Your Score",
            description: "Use our CRS calculator to determine your eligibility score",
        },
        {
            number: "02",
            title: "Track Draw Trends",
            description: "Monitor latest draws and historical CRS score patterns",
        },
        {
            number: "03",
            title: "Choose Your Pathway",
            description: "Explore provincial programs and find the best immigration route",
        },
        {
            number: "04",
            title: "Stay Updated",
            description: "Get real-time notifications on draws and policy changes",
        },
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <Sparkles size={16} />
                        <span>Your Immigration Journey Starts Here</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        Navigate Your Path to <br />
                        <span className={styles.gradient}>Canadian PR</span>
                    </h1>

                    <p className={styles.heroSubtitle}>
                        Comprehensive, real-time immigration data and tools to help you achieve
                        your Canadian dream. Track draws, calculate scores, and explore pathways—all in one place.
                    </p>

                    <div className={styles.heroActions}>
                        <button
                            className={styles.primaryButton}
                            onClick={() => handleNavigate("Calculator")}
                        >
                            Calculate CRS Score
                            <ArrowRight size={18} />
                        </button>
                        <button
                            className={styles.secondaryButton}
                            onClick={() => handleNavigate("Latest Draw")}
                        >
                            View Latest Draws
                        </button>
                    </div>
                </div>

                {/* Floating Stats Cards */}
                <div className={`${styles.statsGrid} ${statsVisible ? styles.statsVisible : ""}`}>
                    {quickStats.map((stat, idx) => (
                        <div key={idx} className={styles.statCard} style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className={styles.statIcon}>
                                <stat.icon size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className={styles.featuresSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Everything You Need</h2>
                    <p className={styles.sectionSubtitle}>
                        Powerful tools and comprehensive data to simplify your immigration journey
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className={styles.featureCard}
                                onClick={() => handleNavigate(feature.action)}
                            >
                                <div className={`${styles.featureIcon} ${styles[`gradient${idx}`]}`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                                <div className={styles.featureAction}>
                                    Explore <ArrowRight size={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <p className={styles.sectionSubtitle}>
                        Your step-by-step guide to maximizing your PR chances
                    </p>
                </div>

                <div className={styles.stepsGrid}>
                    {steps.map((step, idx) => (
                        <div key={idx} className={styles.stepCard}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={styles.stepConnector}>
                                    <ArrowRight size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className={styles.whySection}>
                <div className={styles.whyContent}>
                    <h2 className={styles.sectionTitle}>Why Thousands Trust Us</h2>
                    <div className={styles.benefitsList}>
                        {[
                            "Real-time data updated daily from official sources",
                            "Accurate CRS calculator with detailed breakdowns",
                            "Comprehensive provincial program tracking",
                            "Expert insights and immigration guides",
                            "100% free with no hidden costs",
                            "Mobile-friendly interface for on-the-go access",
                        ].map((benefit, idx) => (
                            <div key={idx} className={styles.benefitItem}>
                                <CheckCircle2 className={styles.checkIcon} size={20} />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <Bell className={styles.ctaIcon} size={48} />
                    <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
                    <p className={styles.ctaText}>
                        Join thousands of aspiring immigrants who use our platform to track their progress
                        and make informed decisions about their Canadian PR application.
                    </p>
                    <div className={styles.ctaButtons}>
                        <button
                            className={styles.ctaPrimary}
                            onClick={() => handleNavigate("Calculator")}
                        >
                            Get Started Now
                            <ArrowRight size={18} />
                        </button>
                        <button
                            className={styles.ctaSecondary}
                            onClick={() => handleNavigate("Early Access")}
                        >
                            Join Waitlist for Premium Features
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
