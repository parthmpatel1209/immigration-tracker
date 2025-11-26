'use client';

import { useState, useEffect } from 'react';

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
    { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },

    // European Languages
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },

    // East Asian Languages
    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },

    // Southeast Asian Languages
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },

    // Middle Eastern & African Languages
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'fa', name: 'فارسی (Persian)', flag: '🇮🇷' },
    { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
    { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
];

const categories = [
    { id: 'Student', icon: '🎓', title: 'Student' },
    { id: 'Worker', icon: '💼', title: 'Worker' },
    { id: 'Visitor', icon: '✈️', title: 'Visitor' },
    { id: 'Refugee', icon: '🛡️', title: 'Refugee' },
    { id: 'Permanent Resident (PR)', icon: '🏡', title: 'PR' },
    { id: 'Citizen', icon: '🍁', title: 'Citizen' },
    { id: 'Family Sponsorship', icon: '👨‍👩‍👧‍👦', title: 'Family' },
    { id: 'General', icon: '📋', title: 'General' },
];

export default function ImmigrationFAQComponent() {
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
        setTranslating(true);
        try {
            const response = await fetch(`/api/immigration-faq?category=${category}&language=${language}`);
            const result = await response.json();
            setFaqs(result.data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setFaqs([]);
        } finally {
            setLoading(false);
            setTranslating(false);
        }
    };

    const toggleFAQ = (id: number) => {
        setOpenFAQId(openFAQId === id ? null : id);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '100%' }} className="faq-container">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                    <h2 className="faq-title">
                        What is...?
                    </h2>
                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'var(--foreground)', opacity: 0.6, marginTop: '0.25rem' }}>
                        Immigration FAQ & Information
                    </p>
                </div>

                {/* Language Selector - Responsive */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px', flex: '0 1 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                            fontWeight: '500',
                            color: 'var(--foreground)',
                            opacity: 0.8,
                        }}>
                            Translate to
                        </span>
                        {translating && (
                            <span style={{
                                fontSize: '0.7rem',
                                color: '#2563eb',
                                fontWeight: '500',
                                animation: 'pulse 2s infinite',
                            }}>
                                (Translating...)
                            </span>
                        )}
                    </div>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        disabled={translating}
                        style={{
                            padding: '0.625rem 2.5rem 0.625rem 1rem',
                            borderRadius: '0.5rem',
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            fontWeight: '500',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                            border: '1px solid var(--hover)',
                            cursor: translating ? 'not-allowed' : 'pointer',
                            opacity: translating ? 0.6 : 1,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '12px',
                            width: '100%',
                        }}
                        onMouseEnter={(e) => {
                            if (!translating) {
                                e.currentTarget.style.borderColor = '#2563eb';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!translating) {
                                e.currentTarget.style.borderColor = 'var(--hover)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                            }
                        }}
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code} style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Category Tabs - Futuristic Design */}
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '0.625rem',
                marginBottom: '1.5rem',
                paddingTop: '0.5rem',
                paddingBottom: '1rem',
                marginLeft: '-0.25rem',
                marginRight: '-0.25rem',
                paddingLeft: '0.25rem',
                paddingRight: '0.25rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }} className="no-scrollbar">
                {categories.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                position: 'relative',
                                overflow: 'hidden',
                                background: isActive
                                    ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%)'
                                    : 'rgba(var(--hover-rgb, 229, 231, 235), 0.5)',
                                backdropFilter: isActive ? 'blur(12px)' : 'blur(8px)',
                                color: isActive ? 'white' : 'var(--foreground)',
                                border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(var(--hover-rgb, 229, 231, 235), 0.8)',
                                cursor: 'pointer',
                                boxShadow: isActive
                                    ? '0 8px 24px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.opacity = '0.9';
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform = isActive ? 'translateY(-3px)' : 'translateY(-2px)';
                                e.currentTarget.style.opacity = '1';
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                                    e.currentTarget.style.background = 'rgba(var(--hover-rgb, 229, 231, 235), 0.7)';
                                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                                    e.currentTarget.style.background = 'rgba(var(--hover-rgb, 229, 231, 235), 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(var(--hover-rgb, 229, 231, 235), 0.8)';
                                }
                            }}
                        >
                            {/* Shimmer effect for active button */}
                            {isActive && (
                                <span style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                                    animation: 'shimmer 3s infinite',
                                    pointerEvents: 'none',
                                }}></span>
                            )}

                            <span style={{
                                fontSize: '1.25rem',
                                filter: isActive ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none',
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                {category.icon}
                            </span>
                            <span style={{ position: 'relative', zIndex: 1 }}>
                                {category.title}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* FAQ List */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        border: '3px solid rgba(37, 99, 235, 0.2)',
                        borderTopColor: '#2563eb',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }}></div>
                </div>
            ) : faqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--hover)', borderRadius: '1rem', border: '2px dashed var(--hover)' }}>
                    <p style={{ color: 'var(--foreground)', opacity: 0.5, fontSize: '1rem', margin: 0 }}>
                        No FAQs available for this category yet.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            style={{
                                background: 'var(--background)',
                                borderRadius: '0.75rem',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid var(--hover)',
                                overflow: 'hidden',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 1.5rem',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <span style={{
                                    color: '#2563eb',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    flexShrink: 0,
                                    transition: 'transform 0.2s',
                                    transform: openFAQId === faq.id ? 'rotate(90deg)' : 'rotate(0deg)',
                                }}>
                                    ▸
                                </span>
                                <span style={{
                                    color: 'var(--foreground)',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                }}>
                                    {faq.question}
                                </span>
                            </button>

                            {openFAQId === faq.id && (
                                <div style={{
                                    padding: '0 1.5rem 1.5rem 3.5rem',
                                    borderTop: '1px solid var(--hover)',
                                    animation: 'slideDown 0.3s ease-out',
                                }}>
                                    <p style={{
                                        color: 'var(--foreground)',
                                        lineHeight: '1.75',
                                        marginTop: '1rem',
                                        opacity: 0.85,
                                        fontSize: '0.9375rem',
                                        whiteSpace: 'pre-wrap',
                                    }}>
                                        {faq.answer}
                                    </p>

                                    {faq.key_detail && (
                                        <div style={{
                                            marginTop: '1.25rem',
                                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
                                            borderLeft: '4px solid #2563eb',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '0 0.5rem 0.5rem 0',
                                            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <span style={{
                                                    color: '#2563eb',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem',
                                                    flexShrink: 0,
                                                }}>
                                                    🔑 Key Detail:
                                                </span>
                                                <span style={{
                                                    color: 'var(--foreground)',
                                                    fontSize: '0.875rem',
                                                    lineHeight: '1.6',
                                                    opacity: 0.9,
                                                }}>
                                                    {faq.key_detail}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {faq.image && (
                                        <div style={{ marginTop: '1.25rem' }}>
                                            <img
                                                src={faq.image}
                                                alt={faq.question}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '600px',
                                                    height: 'auto',
                                                    borderRadius: '0.5rem',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .faq-container {
          padding: clamp(0.75rem, 3vw, 1.5rem);
          background: linear-gradient(to bottom right, #eff6ff, #ffffff, #eef2ff);
          border-radius: 10px;
        }
        
        :global(html.dark) .faq-container {
          background: linear-gradient(to bottom right, #111827, #1e1b4b, #111827);
        }

        .faq-title {
          font-size: 1.875rem;
          font-weight: 700;
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        
        /* Mobile Optimizations */
        @media (max-width: 640px) {
          .faq-container {
            padding: 0.75rem !important;
          }
        }
        
        /* Tablet */
        @media (min-width: 641px) and (max-width: 1024px) {
          .faq-container {
            padding: 1rem !important;
          }
        }
        
        /* Desktop */
        @media (min-width: 1025px) {
          .faq-container {
            padding: 1.5rem !important;
          }
        }
      `}</style>
        </div>
    );
}
