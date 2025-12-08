"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Footer.module.css";
import Policy from "./Policy";
import Terms from "./Terms";
import Accessibility from "./Accessibility";

type ModalType = "policy" | "terms" | "accessibility" | null;

interface FooterProps {
  onNavigateToContact?: () => void;
}

export default function Footer({ onNavigateToContact }: FooterProps) {
  const [isDark, setIsDark] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  /* ---------- Dark-mode sync ---------- */
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /* ---------- Focus trap ---------- */
  useEffect(() => {
    if (!modal) return;

    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0] as HTMLElement;
    const last = focusable?.[focusable.length - 1] as HTMLElement;

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handler);
    first?.focus();

    return () => document.removeEventListener("keydown", handler);
  }, [modal]);

  const currentYear = new Date().getFullYear();
  const closeModal = () => setModal(null);

  return (
    <>
      {/* ------------------- FOOTER ------------------- */}
      <footer className={`${styles.footer} ${isDark ? styles.dark : ""}`}>
        <div className={styles.container}>

          {/* Navigation Links - Centered & One Line */}
          <nav className={styles.navBar}>
            <button onClick={() => setModal("policy")} className={styles.linkButton}>
              Privacy Policy
            </button>
            <span className={styles.separator}>•</span>
            <button onClick={() => setModal("terms")} className={styles.linkButton}>
              Terms of Use
            </button>
            <span className={styles.separator}>•</span>
            <button onClick={() => setModal("accessibility")} className={styles.linkButton}>
              Accessibility Statement
            </button>
            <span className={styles.separator}>•</span>
            <button onClick={onNavigateToContact} className={styles.linkButton}>
              Contact
            </button>
          </nav>

          {/* Meta Info: Copyright & Love */}
          <div className={styles.metaInfo}>
            <p className={styles.copyright}>
              © {currentYear} Canada Immigration Data Tracker.
            </p>
            <span className="hidden sm:inline mx-2 opacity-50">|</span>
            <p className={styles.love}>
              Made with ❤️ in Canada
            </p>
          </div>

          {/* Disclaimer */}
          <div className={styles.disclaimerSection}>
            <div className={styles.disclaimerLabel}>⚠️ Disclaimer</div>
            <div className={styles.disclaimerText}>
              This website is NOT affiliated with IRCC. All data is for informational purposes only and may be outdated.
              Verify all details at <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">IRCC</a> and consult an RCIC or lawyer before making immigration decisions.
            </div>
          </div>
        </div>
      </footer>

      {/* ------------------- MODAL ------------------- */}
      {modal && (
        <div
          className={styles.policyOverlay}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className={styles.policyModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Title */}
            <h2 id="modal-title" className="text-2xl font-bold mb-4 px-6 pt-10">
              {modal === "policy"
                ? "Privacy Policy"
                : modal === "terms"
                  ? "Terms of Use"
                  : "Accessibility Statement"}
            </h2>

            {/* Content */}
            <div className={styles.policyContent}>
              {modal === "policy" ? (
                <Policy />
              ) : modal === "terms" ? (
                <Terms />
              ) : (
                <Accessibility />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
