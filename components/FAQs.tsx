"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Sparkles } from "lucide-react";
import styles from "./FAQs.module.css";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  official_source_url: string | null;
  display_order?: number;
}

/* -------------------------------------------------
   Helper: returns true when <html> has .dark
   ------------------------------------------------- */
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const sync = () => setIsDark(root.classList.contains("dark"));
    sync(); // initial

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/* ------------------------------------------------- */
export default function FAQs() {
  const isDark = useIsDarkMode(); // <-- NEW
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------
  // FETCH
  // -------------------------------------------------
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch("/api/faqs");
        if (!res.ok) throw new Error("Failed to load FAQs");
        const data: FAQ[] = await res.json();
        setFaqs(data);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  // -------------------------------------------------
  // LOADING
  // -------------------------------------------------
  if (loading) {
    return (
      <section
        className={`${styles["faq-container"]} ${isDark ? styles.dark : ""}`}
      >
        <div className={styles["faq-wrapper"]}>
          <header className={styles["faq-header"]}>
            <h1 className={styles["faq-title"]}>FAQs</h1>
            <p
              className={`${styles["faq-subtitle"]} ${
                isDark ? styles.dark : ""
              }`}
            >
              <Sparkles /> Official Canadian Immigration Answers
            </p>
          </header>

          <div className={styles["faq-list"]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`${styles["skeleton-card"]} ${
                  isDark ? styles.dark : ""
                }`}
              >
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------
  // ERROR
  // -------------------------------------------------
  if (error) {
    return (
      <section
        className={`${styles["error-container"]} ${isDark ? styles.dark : ""}`}
      >
        <div className={`${styles["error-box"]} ${isDark ? styles.dark : ""}`}>
          <div
            className={`${styles["error-icon"]} ${isDark ? styles.dark : ""}`}
          >
            !
          </div>
          <p className={isDark ? "text-red-300" : "text-red-700"}>{error}</p>
        </div>
      </section>
    );
  }

  // -------------------------------------------------
  // MAIN UI
  // -------------------------------------------------
  return (
    <section
      className={`${styles["faq-container"]} ${isDark ? styles.dark : ""}`}
    >
      <div className={styles["faq-wrapper"]}>
        <header className={styles["faq-header"]}>
          <h1 className={styles["faq-title"]}>FAQs</h1>
          <p
            className={`${styles["faq-subtitle"]} ${isDark ? styles.dark : ""}`}
          >
            <Sparkles /> Verified from Government of Canada & Provincial Sources
          </p>
        </header>

        <div className={styles["faq-list"]}>
          {faqs.map((faq, i) => (
            <article
              key={faq.id}
              className={`${styles["faq-card"]} ${
                openIndex === i ? styles.open : ""
              } ${isDark ? styles.dark : ""}`}
              onClick={() => toggle(i)}
            >
              <header className={styles["faq-question-header"]}>
                <h2
                  className={`${styles["faq-question"]} ${
                    isDark ? styles.dark : ""
                  }`}
                >
                  {faq.question}
                </h2>
                {openIndex === i ? (
                  <ChevronUp className={styles["faq-chevron"]} />
                ) : (
                  <ChevronDown className={styles["faq-chevron"]} />
                )}
              </header>

              {openIndex === i && (
                <div
                  className={`${styles["faq-answer"]} ${
                    isDark ? styles.dark : ""
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`${styles["faq-prose"]} ${
                      isDark ? styles.dark : ""
                    }`}
                  >
                    {faq.answer.split("\n").map((line, idx) => (
                      <p
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: line
                            .replace(/•/g, '<span class="bullet">•</span>')
                            .replace(/\|/g, '<span class="pipe">|</span>')
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    ))}
                  </div>

                  {faq.official_source_url && (
                    <a
                      href={faq.official_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles["faq-source-link"]} ${
                        isDark ? styles.dark : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink /> Official Source
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        <footer
          className={`${styles["faq-footer"]} ${isDark ? styles.dark : ""}`}
        >
          Last updated:{" "}
          {new Date().toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </footer>
      </div>
    </section>
  );
}
