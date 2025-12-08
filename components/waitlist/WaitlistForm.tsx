'use client';

import React, { useState, useEffect } from 'react';
import styles from './waitlist.module.css';
import {
    Rocket, Mail, Check, Zap, ArrowRight, Loader2,
    ChevronLeft, ChevronRight,
    Calendar, FileCheck, Shield, Zap as FeatureZap
} from 'lucide-react';
import WaitlistSuccess from './WaitlistSuccess';

export default function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [signupCount, setSignupCount] = useState<number | null>(null);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Feature data for carousel
    const features = [
        {
            title: "Document Expiry Alerts",
            description: "Smart 90/30/7-day renewal alerts for passports & visas. Timelines are cross-referenced so you never miss a deadline.",
            color: "#3B82F6",
            vectorIcon: <Calendar size={64} />
        },
        {
            title: "Smart Checklists",
            description: "Personalized step-by-step guides for your specific immigration pathway.",
            color: "#10B981",
            vectorIcon: <FileCheck size={64} />
        },
        {
            title: "Secure Cloud Vault",
            description: "Bank-level encryption for your most sensitive immigration documents.",
            color: "#8B5CF6",
            vectorIcon: <Shield size={64} />
        },
        {
            title: "Priority Access",
            description: "Be the first to use new tools designed to simplify your Canadian journey.",
            color: "#F59E0B",
            vectorIcon: <FeatureZap size={64} />
        }
    ];

    useEffect(() => {
        fetchSignupCount();
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, features.length]);

    const fetchSignupCount = async () => {
        try {
            const response = await fetch('/api/waitlist?action=count');
            if (response.ok) {
                const data = await response.json();
                setSignupCount(data.count || 0);
            }
        } catch (error) {
            console.log('Could not fetch signup count:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to join waitlist');
            }

            setStatus('success');
            setMessage(data.message);
            setEmail('');
            if (signupCount !== null) setSignupCount(signupCount + 1);
            else fetchSignupCount();

        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    const nextFeature = () => {
        setIsAutoPlaying(false);
        setCurrentFeature((prev) => (prev + 1) % features.length);
    };

    const prevFeature = () => {
        setIsAutoPlaying(false);
        setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
    };

    const goToFeature = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentFeature(index);
    };

    if (status === 'success') {
        return <WaitlistSuccess email={email} onClose={() => setStatus('idle')} />;
    }

    return (
        <div className={styles.container}>
            {/* 1. HEADER SECTION */}
            <div className={styles.header}>
                <div className={styles.brandBadge}>
                    <Rocket size={16} />
                    <span>Early Access</span>
                </div>

                <h2 className={styles.title}>
                    Immigration Tracking <br />
                    <span className={styles.gradientText}>Reimagined.</span>
                </h2>

                <p className={styles.description}>
                    Be the first to access our new smart tracking tools.
                    Completely free for early adopters.
                </p>

                {signupCount !== null && signupCount > 0 && (
                    <div className={styles.socialProof}>
                        <div className={styles.userAvatars}>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={styles.avatar} style={{ zIndex: 3 - i }} />
                            ))}
                        </div>
                        <span>Join <strong>{signupCount.toLocaleString()}+</strong> others</span>
                    </div>
                )}
            </div>

            {/* 2. VISUAL CAROUSEL - Appears second on mobile */}
            <div className={styles.visualSide}>
                <div
                    className={styles.carouselCard}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    style={{
                        background: `linear-gradient(135deg, ${features[currentFeature].color}08, ${features[currentFeature].color}15)`
                    }}
                >
                    <div className={styles.carouselHeader}>
                        <div
                            className={styles.featureIconBox}
                            style={{
                                backgroundColor: features[currentFeature].color,
                                boxShadow: `0 8px 16px -4px ${features[currentFeature].color}50`
                            }}
                        >
                            {features[currentFeature].vectorIcon}
                        </div>
                    </div>

                    <div className={styles.carouselBody}>
                        <h3 className={styles.featureTitle}>
                            {features[currentFeature].title}
                        </h3>
                        <p className={styles.featureDesc}>
                            {features[currentFeature].description}
                        </p>
                    </div>

                    <div className={styles.carouselNav}>
                        <button onClick={prevFeature} className={styles.navButton}>
                            <ChevronLeft size={20} />
                        </button>
                        <div className={styles.dots}>
                            {features.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.dot} ${idx === currentFeature ? styles.activeDot : ''}`}
                                    onClick={() => goToFeature(idx)}
                                    style={{
                                        backgroundColor: idx === currentFeature ? features[currentFeature].color : undefined
                                    }}
                                />
                            ))}
                        </div>
                        <button onClick={nextFeature} className={styles.navButton}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. FORM SECTION - Appears third on mobile */}
            <div className={styles.formSection}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                disabled={status === 'loading'}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={styles.button}
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className={styles.spinner} size={20} />
                                    <span>Joining...</span>
                                </>
                            ) : (
                                <>
                                    Join Waitlist <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                    {status === 'error' && (
                        <div className={`${styles.message} ${styles.error}`}>
                            {message}
                        </div>
                    )}
                </form>

                <div className={styles.benefitsRow}>
                    <div className={styles.benefit}>
                        <Check size={16} className={styles.checkIcon} />
                        <span>Free Forever</span>
                    </div>
                    <div className={styles.benefit}>
                        <Check size={16} className={styles.checkIcon} />
                        <span>No Credit Card</span>
                    </div>
                </div>
            </div>
        </div>
    );
}