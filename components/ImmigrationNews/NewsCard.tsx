// components/ImmigrationNews/NewsCard.tsx
import { useEffect, useRef } from "react";
import { Calendar, ExternalLink, X } from "lucide-react";
import styles from "./ImmigrationNews.module.css";
import { NewsItem, PROGRAM_COLORS } from "./types";

interface Props {
  item: NewsItem;
  index: number;
  darkMode: boolean;
  theme: any;
}

export function NewsCard({ item, index, darkMode, theme }: Props) {
  const touchStartX = useRef<number | null>(null);
  const isSwiping = useRef(false);
  const flipperRef = useRef<HTMLDivElement>(null);

  // Auto-flip only the very first card once
  useEffect(() => {
    if (index === 0 && flipperRef.current) {
      const timer = setTimeout(() => {
        flipperRef.current?.classList.remove(styles.autoFlip);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [index]);

  const badgeColor = (program?: string) => {
    const { light, dark } = program
      ? PROGRAM_COLORS[program] ?? PROGRAM_COLORS.default
      : PROGRAM_COLORS.default;
    return darkMode ? dark : light;
  };

  const getRelativeDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en", { month: "short", day: "numeric" });
  };

  const toggleFlip = (flipper: HTMLElement) => {
    flipper.classList.toggle(styles.flipped);
    flipper.classList.remove(styles.swipingLeft, styles.swipingRight);
  };

  // ────────────────────────────── TOUCH HANDLERS ──────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // If touch starts inside scrollable content → let browser scroll
    if (target.closest(`.${styles.content}`)) return;

    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 20) isSwiping.current = true;

    const flipper = e.currentTarget as HTMLElement;
    if (Math.abs(deltaX) > 30) {
      if (deltaX < 0) {
        flipper.classList.add(styles.swipingLeft);
        flipper.classList.remove(styles.swipingRight);
      } else {
        flipper.classList.add(styles.swipingRight);
        flipper.classList.remove(styles.swipingLeft);
      }
    }
  };

  const handleTouchEnd = () => {
    if (
      !isSwiping.current ||
      touchStartX.current === null ||
      !flipperRef.current
    ) {
      touchStartX.current = null;
      isSwiping.current = false;
      return;
    }

    // Very simple swipe-to-flip (you can fine-tune threshold if you want)
    const deltaX =
      touchStartX.current -
      (flipperRef.current.getBoundingClientRect().left + 50);
    if (Math.abs(deltaX) > 60) {
      if (deltaX > 0) flipperRef.current.classList.remove(styles.flipped);
      else flipperRef.current.classList.add(styles.flipped);
    }

    flipperRef.current.classList.remove(
      styles.swipingLeft,
      styles.swipingRight
    );
    touchStartX.current = null;
    isSwiping.current = false;
  };

  return (
    <article
      className={styles.card}
      style={{
        backgroundColor: theme.bgCard,
        borderColor: theme.border,
      }}
    >
      <div
        ref={flipperRef}
        className={`${styles.cardFlipper} ${
          index === 0 ? styles.autoFlip : ""
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          const target = e.target as HTMLElement;

          // Ignore clicks on links, buttons, or the close button itself
          if (target.closest("a, button")) return;

          // Don't trigger flip if we just finished a swipe
          if (isSwiping.current) {
            isSwiping.current = false;
            return;
          }

          // Toggle flip — works perfectly both ways (front to back AND back to front)
          const flipper = e.currentTarget as HTMLElement;
          flipper.classList.toggle(styles.flipped);
        }}
      >
        {/* ─────────────────────── FRONT ─────────────────────── */}
        <div className={styles.cardFront}>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className={styles.cardImage}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const ph = e.currentTarget.nextElementSibling as HTMLElement;
                if (ph) ph.style.display = "flex";
              }}
            />
          ) : null}

          {item.published_at && (
            <div className={styles.dateLabel}>
              {getRelativeDate(item.published_at)}
            </div>
          )}

          <div
            className={styles.imagePlaceholder}
            style={{ display: item.image_url ? "none" : "flex" }}
          >
            No Image
          </div>
        </div>

        {/* ─────────────────────── BACK ─────────────────────── */}
        <div
          className={styles.cardBack}
          style={
            {
              backgroundColor: theme.bgCard,
              color: theme.textPrimary,
              "--bg-card": theme.bgCard,
              "--text-primary": theme.textPrimary,
              "--text-secondary": theme.textSecondary,
              "--text-muted": theme.textMuted,
            } as React.CSSProperties
          }
        >
          {/* Scrollable content – NO manual touch/wheel handlers */}
          <div className={styles.content}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </div>

          <div className={styles.footer}>
            <div className={styles.meta}>
              {item.source && <span>{item.source}</span>}
              {item.published_at && (
                <>
                  {item.source && <span className={styles.dot}> • </span>}
                  <span className={styles.date}>
                    <Calendar size={12} />
                    {new Date(item.published_at).toLocaleDateString()}
                  </span>
                </>
              )}
              {item.program && (
                <>
                  onClick{" "}
                  {(item.source || item.published_at) && (
                    <span className={styles.dot}> • </span>
                  )}
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: darkMode
                        ? `${badgeColor(item.program)}20`
                        : `${badgeColor(item.program)}15`,
                      color: badgeColor(item.program),
                    }}
                  >
                    {item.program}
                  </span>
                </>
              )}
            </div>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.readMore}
                onClick={(e) => e.stopPropagation()}
              >
                Read more <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Close button (visible on mobile) */}
          <button
            className={styles.closeBack}
            onClick={(e) => {
              e.stopPropagation(); // Important: prevent flipper's onClick
              flipperRef.current?.classList.remove(styles.flipped);
            }}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
