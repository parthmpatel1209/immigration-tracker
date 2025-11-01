"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Filter } from "lucide-react";

interface Pathway {
  id: number;
  province: string;
  program: string;
  summary?: string;
  url?: string;
}

// ───── Color Map for Programs ─────
const PROGRAM_COLORS: Record<
  string,
  { lightBg: string; lightText: string; darkBg: string; darkText: string }
> = {
  "Express Entry": {
    lightBg: "#e0e7ff",
    lightText: "#4338ca",
    darkBg: "#312e81",
    darkText: "#c7d2fe",
  },
  PNP: {
    lightBg: "#d1fae5",
    lightText: "#065f46",
    darkBg: "#064e3b",
    darkText: "#a7f3d0",
  },
  CEC: {
    lightBg: "#e9d5ff",
    lightText: "#6b21a8",
    darkBg: "#4c1d95",
    darkText: "#e9d5ff",
  },
  FSW: {
    lightBg: "#fef3c7",
    lightText: "#92400e",
    darkBg: "#78350f",
    darkText: "#fde68a",
  },
  default: {
    lightBg: "#e5e7eb",
    lightText: "#374151",
    darkBg: "#374151",
    darkText: "#d1d5db",
  },
};

// Detect dark mode from <html class="dark">
const isDarkMode = () => document.documentElement.classList.contains("dark");

export default function PRPathways() {
  const [list, setList] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState<string>("All");
  const [darkMode, setDarkMode] = useState(isDarkMode());

  // Sync dark mode with Tabs toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(isDarkMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchPathways = async () => {
      try {
        const res = await fetch("/api/pathways");
        const data = await res.json();
        if (mounted) setList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch pathways:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPathways();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          color: darkMode ? "#d1d5db" : "#374151",
          fontSize: "0.875rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        Loading pathways...
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          color: darkMode ? "#9ca3af" : "#6b7280",
          fontSize: "0.875rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        No pathways found.
      </div>
    );
  }

  const provinces = [
    "All",
    ...Array.from(new Set(list.map((p) => p.province))),
  ];
  const filtered =
    province === "All" ? list : list.filter((p) => p.province === province);

  // Get badge style
  const getBadgeStyle = (program: string) => {
    const colors = PROGRAM_COLORS[program] || PROGRAM_COLORS.default;
    return darkMode
      ? { backgroundColor: colors.darkBg, color: colors.darkText }
      : { backgroundColor: colors.lightBg, color: colors.lightText };
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            background: "linear-gradient(to right, #4f46e5, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PR Pathways by Province
        </h2>
        <Filter style={{ width: "14px", height: "14px", color: "#6366f1" }} />
      </div>

      {/* Province Filter */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: "500",
            color: darkMode ? "#d1d5db" : "#374151",
            marginBottom: "0.5rem",
          }}
        >
          Filter by Province
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
            border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
            borderRadius: "0.375rem",
            backgroundColor: darkMode ? "#1f2937" : "white",
            color: darkMode ? "#f3f4f6" : "#111827",
          }}
        >
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Pathways List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
              borderRadius: "0.5rem",
              padding: "1.5rem",
              backgroundColor: darkMode ? "#1f2937" : "white",
              transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0,0,0,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")
            }
          >
            {/* Province + Program */}
            <div style={{ marginBottom: "0.5rem" }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: darkMode ? "#f3f4f6" : "#111827",
                  display: "inline",
                }}
              >
                {p.province}
              </h3>
              <span
                style={{
                  ...getBadgeStyle(p.program),
                  marginLeft: "0.5rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: "500",
                }}
              >
                {p.program}
              </span>
            </div>

            {/* Summary */}
            {p.summary && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: darkMode ? "#9ca3af" : "#6b7280",
                  marginBottom: "0.75rem",
                  lineHeight: "1.5",
                }}
              >
                {p.summary}
              </p>
            )}

            {/* Learn More */}
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.875rem",
                  color: "#4f46e5",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Learn more
                <ExternalLink style={{ width: "14px", height: "14px" }} />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: darkMode ? "#9ca3af" : "#6b7280",
        }}
      >
        Showing <strong>{filtered.length}</strong> of{" "}
        <strong>{list.length}</strong> pathways
      </div>
    </div>
  );
}
