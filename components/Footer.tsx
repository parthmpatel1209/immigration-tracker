"use client";

import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode with <html class="dark">
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className={`${styles.footer} ${isDark ? styles.dark : ""}`}>
      <div className={styles.container}>
        {/* Main Info */}
        <div className={styles.info}>
          <p className={styles.copyright}>
            © {currentYear} Canada Express Entry Tracker. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <nav className={styles.links}>
          <a href="/privacy" className={styles.link}>
            Privacy Policy
          </a>
          <a href="/terms" className={styles.link}>
            Terms of Use
          </a>
          <a href="/contact" className={styles.link}>
            Contact
          </a>
        </nav>

        {/* Made with love */}
        <p className={styles.love}>
          Made with{" "}
          <span role="img" aria-label="heart">
            love
          </span>{" "}
          in Canada for Canadian immigrants
        </p>
      </div>
    </footer>
  );
}
