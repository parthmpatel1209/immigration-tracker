'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
    key_detail: string | null;
    image: string | null;
}

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },

    // Indian Languages
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو (Urdu)', flag: '🇮🇳' },

    // European Languages
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська (Ukrainian)', flag: '🇺🇦' },
    { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
    { code: 'ro', name: 'Română (Romanian)', flag: '🇷🇴' },

    // East Asian Languages
    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },

    // Southeast Asian Languages
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
    { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
    { code: 'tl', name: 'Tagalog (Filipino)', flag: '🇵🇭' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇲🇾' },

    // Middle Eastern & African Languages
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'fa', name: 'فارسی (Persian)', flag: '🇮🇷' },
    { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
    { code: 'sw', name: 'Kiswahili (Swahili)', flag: '🇪🇸' },
    { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'so', name: 'Soomaali (Somali)', flag: '🇸🇴' },

    // Other Major Languages
    { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk (Danish)', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
    { code: 'el', name: 'Ελληνικά (Greek)', flag: '🇬🇷' },
    { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' },
];

const categories = [
    { id: 'Student', icon: '🎓', title: 'Student', description: 'Learn about study permits, co-op, PGWP, DLI rules, and more.' },
    { id: 'Worker', icon: '💼', title: 'Worker', description: 'Work permits, LMIA, open work permits, and employment requirements.' },
    { id: 'Visitor', icon: '✈️', title: 'Visitor', description: 'Visitor visas, eTA, extensions, and tourism information.' },
    { id: 'Refugee', icon: '🛡️', title: 'Refugee', description: 'Refugee claims, protection, and resettlement programs.' },
    { id: 'Permanent Resident (PR)', icon: '🏡', title: 'PR', description: 'Permanent residence pathways, Express Entry, PNP, and more.' },
    { id: 'Citizen', icon: '🍁', title: 'Citizen', description: 'Citizenship applications, tests, ceremonies, and requirements.' },
    { id: 'Family Sponsorship', icon: '👨‍👩‍👧‍👦', title: 'Family', description: 'Family sponsorship, reunification, and dependent applications.' },
    { id: 'General', icon: '📋', title: 'General', description: 'General immigration information and common questions.' },
];

export default function ImmigrationFAQPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Student');
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translating, setTranslating] = useState(false);
    const [openFAQId, setOpenFAQId] = useState<number | null>(null);

    useEffect(() => {
        fetchFAQs(selectedCategory, selectedLanguage);
    }, [selectedCategory, selectedLanguage]);

    const fetchFAQs = async (category: string, language: string) => {
        setLoading(true);
        setTranslating(true); // Set translating to true when fetching starts
        try {
            const response = await fetch(`/api/immigration-faq?category=${category}&language=${language}`);
            const result = await response.json();
            setFaqs(result.data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setFaqs([]);
        } finally {
            setLoading(false);
            setTranslating(false); // Set translating to false when fetching ends
        }
    };

    const toggleFAQ = (id: number) => {
        setOpenFAQId(openFAQId === id ? null : id);
    };

    const handleLanguageChange = (langCode: string) => {
        setSelectedLanguage(langCode);
        // The useEffect hook will trigger fetchFAQs with the new language
    };

    const currentCategory = categories.find(cat => cat.id === selectedCategory);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.headerTitle}>What is...?</h1>
                        <p className={styles.headerSubtitle}>Immigration FAQ & Information</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.languageSelector}>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className={styles.languageDropdown}
                                disabled={translating}
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>
                            {translating && <span className={styles.translatingBadge}>Translating...</span>}
                        </div>
                        <Link href="/" className={styles.backButton}>
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Category Tabs */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsList}>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`${styles.tab} ${selectedCategory === category.id
                                    ? styles.tabActive
                                    : ''
                                    }`}
                            >
                                <span className={styles.tabIcon}>{category.icon}</span>
                                <span>{category.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Category Header Card */}
                {currentCategory && (
                    <div className={styles.categoryCard}>
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryIcon}>{currentCategory.icon}</span>
                            <h2 className={styles.categoryTitle}>{currentCategory.title}</h2>
                        </div>
                        <p className={styles.categoryDescription}>{currentCategory.description}</p>
                    </div>
                )}

                {/* FAQ List */}
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : faqs.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>No FAQs available for this category yet.</p>
                    </div>
                ) : (
                    <div className={styles.faqList}>
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className={styles.faqItem}
                            >
                                <button
                                    onClick={() => toggleFAQ(faq.id)}
                                    className={styles.faqButton}
                                >
                                    <span className={styles.faqQuestion}>
                                        {openFAQId === faq.id ? '▾' : '▸'} {faq.question}
                                    </span>
                                </button>

                                {openFAQId === faq.id && (
                                    <div className={styles.faqContent}>
                                        <div className="prose prose-blue max-w-none">
                                            <p className={styles.faqAnswer}>
                                                {faq.answer}
                                            </p>
                                        </div>

                                        {faq.key_detail && (
                                            <div className={styles.keyDetail}>
                                                <div className={styles.keyDetailContent}>
                                                    <span className={styles.keyDetailIcon}>🔑 Key Detail:</span>
                                                    <p className={styles.keyDetailText}>{faq.key_detail}</p>
                                                </div>
                                            </div>
                                        )}

                                        {faq.image && (
                                            <div className={styles.faqImage}>
                                                <img
                                                    src={faq.image}
                                                    alt={faq.question}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
