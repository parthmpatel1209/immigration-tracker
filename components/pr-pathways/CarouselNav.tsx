import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./PRPathways.module.css";

interface CarouselNavProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export function CarouselNav({
  currentSlide,
  totalSlides = 3,
  onPrev,
  onNext,
  onGoTo,
}: CarouselNavProps) {
  return (
    <>
      <button
        onClick={onPrev}
        className={`${styles.navButton} ${styles.left}`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={onNext}
        className={`${styles.navButton} ${styles.right}`}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className={styles.trackContainer}>
        <div className={styles.track}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => onGoTo(i)}
              className={`${styles.trackSegment} ${
                currentSlide === i ? styles.active : ""
              }`}
              aria-label={`Go to slide ${i + 1}`}
            >
              <div className={styles.trackFill} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
