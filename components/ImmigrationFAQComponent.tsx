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
        gap: '0.75rem',
        marginBottom: '2rem',
        padding: '0.5rem 0.25rem 1rem 0.25rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }} className="no-scrollbar">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-btn ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <span className="shimmer"></span>
              )}
              <span className="category-icon">
                {category.icon}
              </span>
              <span className="category-title">
                {category.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
          <div className="spinner"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="empty-state">
          <p>No FAQs available for this category yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq) => (
            <div key={faq.id} className={`faq-card ${openFAQId === faq.id ? 'open' : ''}`}>
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="faq-question-btn"
              >
                <span className={`faq-chevron ${openFAQId === faq.id ? 'rotated' : ''}`}>
                  ▸
                </span>
                <span className="faq-question-text">
                  {faq.question}
                </span>
              </button>

              {openFAQId === faq.id && (
                <div className="faq-answer-container">
                  <p className="faq-answer-text">
                    {faq.answer}
                  </p>

                  {faq.key_detail && (
                    <div className="key-detail-box">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span className="key-detail-icon">
                          🔑 Key Detail:
                        </span>
                        <span className="key-detail-text">
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
                        className="faq-image"
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

        /* Category Buttons */
        .category-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #4b5563;
          border: 1px solid rgba(229, 231, 235, 1);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :global(html.dark) .category-btn {
          background: rgba(31, 41, 55, 0.6);
          color: #9ca3af;
          border-color: rgba(75, 85, 99, 0.6);
        }

        .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(37, 99, 235, 0.4);
          color: #1f2937;
        }

        :global(html.dark) .category-btn:hover {
          background: rgba(31, 41, 55, 0.9);
          border-color: rgba(99, 102, 241, 0.5);
          color: #f3f4f6;
        }

        .category-btn.active {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }

        :global(html.dark) .category-btn.active {
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          color: white;
        }

        .category-icon {
          font-size: 1.25rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }

        /* FAQ Cards */
        .faq-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        :global(html.dark) .faq-card {
          background: #1f2937;
          border-color: #374151;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        .faq-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.1);
          border-color: #93c5fd;
        }

        :global(html.dark) .faq-card:hover {
          border-color: #6366f1;
          box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.4);
        }

        .faq-card.open {
          border-color: #3b82f6;
          box-shadow: 0 10px 20px -3px rgba(37, 99, 235, 0.15);
        }
        
        :global(html.dark) .faq-card.open {
          border-color: #6366f1;
          box-shadow: 0 10px 20px -3px rgba(99, 102, 241, 0.2);
        }

        .faq-question-btn {
          width: 100%;
          padding: 1.25rem 1.5rem;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: background-color 0.2s;
        }

        .faq-question-btn:hover {
          background-color: #f9fafb;
        }

        :global(html.dark) .faq-question-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .faq-chevron {
          color: #2563eb;
          font-size: 1.25rem;
          font-weight: 600;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        :global(html.dark) .faq-chevron {
          color: #818cf8;
        }

        .faq-chevron.rotated {
          transform: rotate(90deg);
        }

        .faq-question-text {
          color: #111827;
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.5;
        }

        :global(html.dark) .faq-question-text {
          color: #f3f4f6;
        }

        .faq-answer-container {
          padding: 0 1.5rem 1.5rem 3.75rem;
          border-top: 1px solid #f3f4f6;
          animation: slideDown 0.3s ease-out;
        }

        :global(html.dark) .faq-answer-container {
          border-top-color: #374151;
        }

        .faq-answer-text {
          color: #4b5563;
          line-height: 1.75;
          margin-top: 1rem;
          font-size: 0.95rem;
          white-space: pre-wrap;
        }

        :global(html.dark) .faq-answer-text {
          color: #d1d5db;
        }

        .key-detail-box {
          marginTop: 1.25rem;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%);
          border-left: 4px solid #2563eb;
          padding: 1rem 1.25rem;
          border-radius: 0 0.5rem 0.5rem 0;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
          margin-top: 1.25rem;
        }
        
        :global(html.dark) .key-detail-box {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%);
          border-left-color: #6366f1;
        }

        .key-detail-icon {
          color: #2563eb;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
        }
        
        :global(html.dark) .key-detail-icon {
          color: #818cf8;
        }

        .key-detail-text {
          color: #1f2937;
          font-size: 0.875rem;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        :global(html.dark) .key-detail-text {
          color: #e5e7eb;
        }

        .faq-image {
          width: 100%;
          max-width: 600px;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(243, 244, 246, 0.5);
          border-radius: 1rem;
          border: 2px dashed #e5e7eb;
        }
        
        :global(html.dark) .empty-state {
          background: rgba(31, 41, 55, 0.5);
          border-color: #374151;
        }
        
        .empty-state p {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
        }
        
        :global(html.dark) .empty-state p {
          color: #9ca3af;
        }
        
        .spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid rgba(37, 99, 235, 0.2);
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
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
