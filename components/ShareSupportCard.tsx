"use client";

import { useState, useEffect } from "react";
import styles from "./ShareSupportCard.module.css";

export default function ShareSupportCard() {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://immigration-tracker.vercel.app/";

  const shareData = {
    title: "Canadian Immigration Tracker",
    text: "Check out this free Canadian immigration tracker — helps you stay updated on CRS scores and PNP draws.",
    url: siteUrl,
  };

  // Safely detect dark mode on client only
  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(siteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Share & Support
      </h3>

      <p className={styles.text}>
        Can’t donate right now? <strong>Sharing helps just as much!</strong>
        <br />
        Spread the word on Reddit, WhatsApp, or with friends applying to Canada.
      </p>

      <div className={styles.buttonGroup}>
        <button onClick={handleShare} className={styles.shareButton}>
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share This Tool
        </button>

        <button
          onClick={handleCopy}
          className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
        >
          {copied ? (
            <>
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 8a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V9a1 1 0 00-1-1H6z" />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
