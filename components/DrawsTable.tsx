"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArrowUpDown,
  Calendar,
  Users,
  Hash,
  MapPin,
  Filter,
} from "lucide-react";
import CRSFilter from "./CRSFilter";

dayjs.extend(relativeTime);

interface Draw {
  id: number;
  round: number;
  program: string;
  crs_cutoff: number;
  invitations: number;
  draw_date: string;
  draw_province: string | null;
}

export default function DrawsTablePage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [crsRange, setCrsRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "crs">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [darkMode, setDarkMode] = useState(false);

  // ───── Detect dark mode from <html class="dark"> ─────
  useEffect(() => {
    const checkDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ───── Fetch Draws ─────
  useEffect(() => {
    const fetchDraws = async () => {
      const res = await fetch("/api/draws");
      const data: Draw[] = await res.json();
      setDraws(data);
    };
    fetchDraws();
  }, []);

  // ───── Filtered & Sorted Draws ─────
  const filteredAndSorted = useMemo(() => {
    let list = [...draws];

    if (selectedProgram !== "All")
      list = list.filter((d) => d.program === selectedProgram);
    if (selectedProvince !== "All")
      list = list.filter((d) => d.draw_province === selectedProvince);
    if (crsRange)
      list = list.filter(
        (d) => d.crs_cutoff >= crsRange[0] && d.crs_cutoff <= crsRange[1]
      );

    if (sortBy === "crs") {
      list.sort((a, b) =>
        sortOrder === "asc"
          ? a.crs_cutoff - b.crs_cutoff
          : b.crs_cutoff - a.crs_cutoff
      );
    } else {
      list.sort((a, b) =>
        sortOrder === "asc"
          ? dayjs(a.draw_date).valueOf() - dayjs(b.draw_date).valueOf()
          : dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
      );
    }
    return list;
  }, [draws, selectedProgram, selectedProvince, crsRange, sortBy, sortOrder]);

  const programs = useMemo(
    () => ["All", ...Array.from(new Set(draws.map((d) => d.program)))],
    [draws]
  );

  const provinces = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          draws
            .map((d) => d.draw_province)
            .filter((p): p is string => !!p && p !== "")
        )
      ),
    ],
    [draws]
  );

  const toggleSort = (col: "date" | "crs") => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  // ───── Dynamic Styles ─────
  const styles = {
    text: darkMode ? "#f3f4f6" : "#111827",
    textMuted: darkMode ? "#9ca3af" : "#6b7280",
    textSecondary: darkMode ? "#d1d5db" : "#374151",
    bg: darkMode ? "#111827" : "white",
    bgHover: darkMode ? "#1f2937" : "#f9fafb",
    border: darkMode ? "#374151" : "#e5e7eb",
    inputBg: darkMode ? "#1f2937" : "white",
    inputBorder: darkMode ? "#4b5563" : "#d1d5db",
    buttonBg: darkMode ? "#374151" : "#f3f4f6",
    buttonHover: darkMode ? "#4b5563" : "#e5e7eb",
    badgeBg: darkMode ? "#312e81" : "#eef2ff",
    badgeText: darkMode ? "#c7d2fe" : "#4f46e5",
    headerGradient: "linear-gradient(to right, #4f46e5, #7c3aed)",
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        width: "100%",
        color: styles.text,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            background: styles.headerGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CRS Draw History
        </h2>
        <Filter style={{ width: "14px", height: "14px", color: "#6366f1" }} />
      </div>

      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* Program Filter */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: "500",
              color: styles.textSecondary,
              marginBottom: "0.25rem",
            }}
          >
            Program
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{
              width: "100%",
              padding: "0.375rem 0.75rem",
              fontSize: "0.875rem",
              border: `1px solid ${styles.inputBorder}`,
              borderRadius: "0.375rem",
              backgroundColor: styles.inputBg,
              color: styles.text,
            }}
          >
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Province Filter */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: "500",
              color: styles.textSecondary,
              marginBottom: "0.25rem",
            }}
          >
            Province
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            style={{
              width: "100%",
              padding: "0.375rem 0.75rem",
              fontSize: "0.875rem",
              border: `1px solid ${styles.inputBorder}`,
              borderRadius: "0.375rem",
              backgroundColor: styles.inputBg,
              color: styles.text,
            }}
          >
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* CRS Range */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: "500",
              color: styles.textSecondary,
              marginBottom: "0.25rem",
            }}
          >
            CRS Range
          </label>
          <div>
            <CRSFilter onRangeChange={setCrsRange} />
          </div>
        </div>

        {/* Desktop Sort Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "0.5rem",
          }}
          className="hidden lg:flex"
        >
          <button
            onClick={() => toggleSort("date")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.375rem 0.75rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              backgroundColor: styles.buttonBg,
              color: styles.textSecondary,
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = styles.buttonHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = styles.buttonBg)
            }
          >
            <Calendar style={{ width: "14px", height: "14px" }} />
            Date
            {sortBy === "date" && (
              <ArrowUpDown
                style={{
                  width: "12px",
                  height: "12px",
                  transform: sortOrder === "asc" ? "rotate(180deg)" : "",
                  transition: "transform 0.2s",
                }}
              />
            )}
          </button>
          <button
            onClick={() => toggleSort("crs")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.375rem 0.75rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              backgroundColor: styles.buttonBg,
              color: styles.textSecondary,
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = styles.buttonHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = styles.buttonBg)
            }
          >
            <Hash style={{ width: "14px", height: "14px" }} />
            CRS
            {sortBy === "crs" && (
              <ArrowUpDown
                style={{
                  width: "12px",
                  height: "12px",
                  transform: sortOrder === "asc" ? "rotate(180deg)" : "",
                  transition: "transform 0.2s",
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sort */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
        className="lg:hidden"
      >
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "crs")}
          style={{
            flex: 1,
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            border: `1px solid ${styles.inputBorder}`,
            borderRadius: "0.375rem",
            backgroundColor: styles.inputBg,
            color: styles.text,
          }}
        >
          <option value="date">Date</option>
          <option value="crs">CRS</option>
        </select>
        <button
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          style={{
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: "500",
            backgroundColor: styles.buttonBg,
            color: styles.textSecondary,
            borderRadius: "0.375rem",
            border: "none",
          }}
        >
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          border: `1px solid ${styles.border}`,
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          backgroundColor: styles.bg,
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "800px",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr
              style={{
                background: styles.headerGradient,
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <th
                onClick={() => toggleSort("date")}
                style={{
                  padding: "1rem 2rem",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <Hash style={{ width: "14px", height: "14px" }} />
                  Round
                  {sortBy === "date" && (
                    <ArrowUpDown
                      style={{
                        width: "12px",
                        height: "12px",
                        transform: sortOrder === "asc" ? "rotate(180deg)" : "",
                        transition: "transform 0.2s",
                      }}
                    />
                  )}
                </div>
              </th>
              <th style={{ padding: "1rem 2rem", textAlign: "left" }}>
                Program
              </th>
              <th style={{ padding: "1rem 2rem", textAlign: "left" }}>
                <MapPin
                  style={{
                    display: "inline",
                    width: "14px",
                    height: "14px",
                    marginRight: "0.25rem",
                  }}
                />
                Province
              </th>
              <th
                onClick={() => toggleSort("crs")}
                style={{
                  padding: "1rem 2rem",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  CRS Cut-off
                  {sortBy === "crs" && (
                    <ArrowUpDown
                      style={{
                        width: "12px",
                        height: "12px",
                        transform: sortOrder === "asc" ? "rotate(180deg)" : "",
                        transition: "transform 0.2s",
                      }}
                    />
                  )}
                </div>
              </th>
              <th style={{ padding: "1rem 2rem", textAlign: "left" }}>
                <Users
                  style={{
                    display: "inline",
                    width: "14px",
                    height: "14px",
                    marginRight: "0.25rem",
                  }}
                />
                Invites
              </th>
              <th style={{ padding: "1rem 2rem", textAlign: "left" }}>
                <Calendar
                  style={{
                    display: "inline",
                    width: "14px",
                    height: "14px",
                    marginRight: "0.25rem",
                  }}
                />
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((draw) => (
                <tr
                  key={draw.id}
                  style={{
                    borderBottom: `1px solid ${styles.border}`,
                    backgroundColor: styles.bg,
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = styles.bgHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = styles.bg)
                  }
                >
                  <td
                    style={{
                      padding: "1rem 2rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#4f46e5",
                    }}
                  >
                    #{draw.round}
                  </td>
                  <td style={{ padding: "1rem 2rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.125rem 0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: styles.badgeBg,
                        color: styles.badgeText,
                        borderRadius: "9999px",
                      }}
                    >
                      {draw.program}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem 2rem",
                      fontSize: "0.75rem",
                      color: styles.textMuted,
                    }}
                  >
                    {draw.draw_province || "—"}
                  </td>
                  <td
                    style={{
                      padding: "1rem 2rem",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "#7c3aed",
                    }}
                  >
                    {draw.crs_cutoff}
                  </td>
                  <td
                    style={{
                      padding: "1rem 2rem",
                      fontSize: "0.75rem",
                      color: styles.text,
                    }}
                  >
                    {draw.invitations.toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem 2rem", fontSize: "0.75rem" }}>
                    <div style={{ fontWeight: "500", color: styles.text }}>
                      {dayjs(draw.draw_date).format("MMM D, YYYY")}
                    </div>
                    <div
                      style={{ fontSize: "0.7rem", color: styles.textMuted }}
                    >
                      {dayjs(draw.draw_date).fromNow()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "3rem 2rem",
                    textAlign: "center",
                    color: styles.textMuted,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      style={{
                        width: "40px",
                        height: "40px",
                        marginBottom: "0.5rem",
                        color: darkMode ? "#4b5563" : "#d1d5db",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p style={{ fontWeight: "500" }}>No draws found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          fontSize: "0.75rem",
          color: styles.textMuted,
        }}
      >
        <p>
          Showing <strong>{filteredAndSorted.length}</strong> of{" "}
          <strong>{draws.length}</strong>
        </p>
        <p>Updated {dayjs().format("MMM D, YYYY [at] h:mm A")}</p>
      </div>
    </div>
  );
}
