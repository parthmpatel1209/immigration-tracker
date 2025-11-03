"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Footer.module.css";
import Policy from "./Policy";
import Terms from "./Terms";

type ModalType = "policy" | "terms" | null;

export default function Footer() {
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
          {/* Copyright */}
          <div className={styles.info}>
            <p className={styles.copyright}>
              © {currentYear} Canada Express Entry Tracker. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className={styles.links}>
            <button
              onClick={() => setModal("policy")}
              className={styles.linkButton} // ← use the new class
              aria-label="View Privacy Policy"
            >
              Privacy Policy
            </button>

            <button
              onClick={() => setModal("terms")}
              className={styles.linkButton} // ← same class
              aria-label="View Terms of Use"
            >
              Terms of Use
            </button>

            <button
              onClick={() => setModal("terms")}
              className={styles.linkButton} // ← same class
              aria-label="View Terms of Use"
            >
              Contact
            </button>
          </nav>

          {/* Made with love */}
          <p className={styles.love}>
            Made with{" "}
            <span role="img" aria-label="heart">
              Heart
            </span>{" "}
            in Canada for Canadian immigrants
          </p>
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
              {modal === "policy" ? "Privacy Policy" : "Terms of Use"}
            </h2>

            {/* Content */}
            <div className={styles.policyContent}>
              {modal === "policy" ? <Policy /> : <Terms />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
