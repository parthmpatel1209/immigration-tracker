// ImmigrationNews/NewsHeader.tsx
import styles from "./ImmigrationNews.module.css";

interface Props {
  showFilters: boolean;
  onToggleFilters: () => void;
  theme: any;
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  translating: boolean;
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

export function NewsHeader({ showFilters, onToggleFilters, theme, selectedLanguage, onLanguageChange, translating }: Props) {
  // Fallback so UI never crashes even if theme is undefined
  const safeTheme = theme ?? {
    border: "#e5e7eb",
    bgSecondary: "#f3f4f6",
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Immigration News</h1>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.newsLanguageSelector}>
          <div className={styles.newsLanguageLabel}>
            <span className={styles.newsTranslateText}>
              Translate to
            </span>
            {translating && (
              <span className={styles.newsTranslatingBadge}>
                (Translating...)
              </span>
            )}
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className={styles.newsLanguageDropdown}
            disabled={translating}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onToggleFilters}
          className={`${styles.filterToggleBtn} ${showFilters ? styles.filterToggleActive : ""
            }`}
          aria-label={showFilters ? "Hide filters" : "Show filters"}
          style={{
            borderColor: safeTheme.border,
          }}
        >
          <span
            className={styles.filterIconWrapper}
            style={{
              backgroundColor: showFilters
                ? "rgba(99,102,241,0.12)"
                : safeTheme.bgSecondary,
              borderColor: safeTheme.border,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.filterIconModern}
            >
              <path d="M4 4h16"></path>
              <path d="M6 8h12"></path>
              <path d="M8 12h8"></path>
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
}
