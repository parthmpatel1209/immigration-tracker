"use client";
import { useEffect, useState } from "react";
import { PathwayCard } from "./PathwayCard";
import { ProvinceFilter } from "./ProvinceFilter";
import { Pathway } from "./types";
import styles from "./PRPathways.module.css";

export default function PRPathways() {
  const [list, setList] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const check = () =>
      setDarkMode(document.documentElement.classList.contains("dark"));

    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/pathways")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading pathways...</div>;
  if (!list.length)
    return <div className={styles.empty}>No pathways found.</div>;

  const provinces = ["All", ...new Set(list.map((p) => p.province))];
  const filtered =
    province === "All" ? list : list.filter((p) => p.province === province);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Canadian PR Pathways</h2>
        </header>

        <ProvinceFilter
          provinces={provinces}
          value={province}
          onChange={setProvince}
        />

        <div className={styles.grid}>
          {filtered.map((p) => (
            <PathwayCard key={p.id} pathway={p} darkMode={darkMode} />
          ))}
        </div>

        <footer className={styles.footer}>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{list.length}</strong> pathways
        </footer>
      </div>
    </div>
  );
}
