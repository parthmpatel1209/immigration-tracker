"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Footer.module.css";
import Policy from "./Policy";
import Terms from "./Terms";
import Accessibility from "./Accessibility";
import { Instagram, Facebook, Mail } from "lucide-react";
import MapleMark from "./shell/MapleMark";

type ModalType = "policy" | "terms" | "accessibility" | null;

interface FooterProps {
  onNavigateToContact?: () => void;
  onNavigate?: (tab: string) => void;
}

const EXPLORE: [string, string][] = [
  ["Latest draws", "Latest Draw"],
  ["CRS scores", "CRS Scores"],
  ["CRS calculator", "Calculator"],
  ["PR pathways", "PR Pathways"],
  ["News", "News"],
  ["Plain-English guides", "What Is...?"],
];

export default function Footer({ onNavigateToContact, onNavigate }: FooterProps) {
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
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.brandCol}>
              <div className={styles.brand}>
                <span className={styles.brandMark}><MapleMark size={16} /></span>
                <span className={styles.brandName}>Immigration Data Tracker</span>
              </div>
              <p className={styles.blurb}>
                An independent, free tool that turns public IRCC data into clear draws, cut-offs and
                pathways &mdash; built in Canada, for people coming to Canada.
              </p>
            </div>

            <nav className={styles.col} aria-label="Explore">
              <h3>Explore</h3>
              {EXPLORE.map(([label, tab]) => (
                <button key={tab} onClick={() => onNavigate?.(tab)} className={styles.linkButton}>
                  {label}
                </button>
              ))}
            </nav>

            <nav className={styles.col} aria-label="Legal">
              <h3>Legal</h3>
              <button onClick={() => setModal("policy")} className={styles.linkButton}>Privacy policy</button>
              <button onClick={() => setModal("terms")} className={styles.linkButton}>Terms of use</button>
              <button onClick={() => setModal("accessibility")} className={styles.linkButton}>Accessibility</button>
              <button onClick={onNavigateToContact} className={styles.linkButton}>Contact</button>
            </nav>

            <div className={styles.col}>
              <h3>Follow</h3>
              <a href="https://www.instagram.com/immigtrackerca/" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                <Instagram size={14} /> Instagram
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584209194080" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                <Facebook size={14} /> Facebook
              </a>
              <a href="mailto:immigrationdatacanada@gmail.com" className={styles.linkButton}>
                <Mail size={14} /> Email us
              </a>
            </div>
          </div>

          <div className={styles.notice}>
            <span className={styles.noticeLabel}>Notice</span>
            <p>
              This site is not affiliated with Immigration, Refugees and Citizenship Canada (IRCC). Data is compiled
              from public IRCC releases for information only. Verify requirements at{" "}
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer">
                canada.ca
              </a>{" "}
              and consult a licensed RCIC or immigration lawyer before making legal decisions.
            </p>
          </div>

          <div className={styles.bottom}>
            <span>&copy; {currentYear} Canada Immigration Data Tracker</span>
            <span>Made in Canada</span>
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
