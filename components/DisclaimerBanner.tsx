// components/DisclaimerBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import styles from "./DisclaimerBanner.module.css";

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("disclaimer-dismissed");
    const lastDismissed = dismissed ? parseInt(dismissed) : 0;
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (!dismissed || now - lastDismissed > thirtyDays) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("disclaimer-dismissed", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        <div className={styles.text}>
          <strong>Warning: Not official IRCC advice.</strong> Data is updated
          regularly but may occasionally be outdated/inaccurate.{" "}
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Always verify with IRCC →
          </a>
        </div>

        <button
          onClick={handleDismiss}
          className={styles.button}
          aria-label="Dismiss disclaimer"
        >
          Got it
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
