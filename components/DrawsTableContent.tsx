"use client";

import { ArrowUpDown, Calendar, Users, Hash, MapPin } from "lucide-react";
import dayjs from "dayjs";
import styles from "./DrawsTable.module.css";

interface Draw {
  id: number;
  round: string;
  program: string;
  crs_cutoff: string;
  invitations: string;
  draw_date: string;
  draw_province: string | null;
}

interface DrawsTableContentProps {
  draws: Draw[];
  sortBy: "date" | "crs";
  sortOrder: "asc" | "desc";
  toggleSort: (col: "date" | "crs") => void;
  themeStyles: {
    tableContainer: string;
    row: string;
    badge: string;
    province: string;
    invitations: string;
    date: string;
    dateRelative: string;
    emptyCell: string;
    emptySvg: string;
  };
  darkMode: boolean;
}

export default function DrawsTableContent({
  draws,
  sortBy,
  sortOrder,
  toggleSort,
  themeStyles,
  darkMode,
}: DrawsTableContentProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className={styles.desktopOnly}>
        <div
          className={`${styles.tableContainer} ${themeStyles.tableContainer}`}
        >
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th
                  onClick={() => toggleSort("date")}
                  className={`${styles.th} ${styles.thSortable}`}
                >
                  <div className={styles.thContent}>
                    <Hash className={styles.sortIcon} />
                    Round
                    {sortBy === "date" && (
                      <ArrowUpDown
                        className={`${styles.arrowIcon} ${
                          sortOrder === "asc" ? styles.arrowIconAsc : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th className={styles.th}>Program</th>
                <th className={styles.th}>
                  <MapPin className={styles.sortIcon} />
                  Province
                </th>
                <th
                  onClick={() => toggleSort("crs")}
                  className={`${styles.th} ${styles.thSortable}`}
                >
                  <div className={styles.thContent}>
                    CRS Cut-off
                    {sortBy === "crs" && (
                      <ArrowUpDown
                        className={`${styles.arrowIcon} ${
                          sortOrder === "asc" ? styles.arrowIconAsc : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th className={styles.th}>
                  <Users className={styles.sortIcon} />
                  Invites
                </th>
                <th className={styles.th}>
                  <Calendar className={styles.sortIcon} />
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {draws.length > 0 ? (
                draws.map((draw) => (
                  <tr
                    key={draw.id}
                    className={`${styles.row} ${themeStyles.row}`}
                  >
                    <td className={`${styles.cell} ${styles.round}`}>
                      #{draw.round}
                    </td>
                    <td className={styles.cell}>
                      <span className={`${styles.badge} ${themeStyles.badge}`}>
                        {draw.program}
                      </span>
                    </td>
                    <td
                      className={`${styles.cell} ${styles.province} ${themeStyles.province}`}
                    >
                      {draw.draw_province || "—"}
                    </td>
                    <td className={`${styles.cell} ${styles.crs}`}>
                      {draw.crs_cutoff != null ? draw.crs_cutoff : "N/A"}
                    </td>
                    <td className={`${styles.cell} ${themeStyles.invitations}`}>
                      {draw.invitations.toLocaleString()}
                    </td>
                    <td className={styles.cell}>
                      <div className={`${styles.date} ${themeStyles.date}`}>
                        {dayjs(draw.draw_date).format("MMM D, YYYY")}
                      </div>
                      <div
                        className={`${styles.dateRelative} ${themeStyles.dateRelative}`}
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
                    className={`${styles.emptyCell} ${themeStyles.emptyCell}`}
                  >
                    <div className={styles.emptyContent}>
                      <svg
                        className={`${styles.emptySvg} ${themeStyles.emptySvg}`}
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
                      <p className={styles.emptyText}>No draws found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileOnly}>
        <div className="px-2">
          {draws.length > 0 ? (
            draws.map((draw) => (
              <div
                key={draw.id}
                className={`
          ${styles.mobileCard}
          ${darkMode ? styles.mobileCardDark : styles.mobileCardLight}
        `}
              >
                {/* Header: Round + Program */}
                <div className="flex justify-between items-start mb-4">
                  <div className={styles.mobileRound}>#{draw.round}</div>
                  <span
                    className={`
              ${styles.mobileBadge}
              ${darkMode ? styles.mobileBadgeDark : styles.mobileBadgeLight}
            `}
                  >
                    {draw.program}
                  </span>
                </div>

                {/* Info Rows */}
                <div className={styles.mobileRow}>
                  <MapPin className={styles.mobileIcon} />
                  <span className={styles.mobileLabel}>Province</span>
                  <span className={styles.mobileValue}>
                    {draw.draw_province || "All Canada"}
                  </span>
                </div>

                <div className={styles.mobileRow}>
                  <Hash className={styles.mobileIcon} />
                  <span className={styles.mobileLabel}>CRS Cut-off</span>
                  <span className={styles.mobileValue}>
                    <strong>{draw.crs_cutoff ?? "N/A"}</strong>
                  </span>
                </div>

                <div className={styles.mobileRow}>
                  <Users className={styles.mobileIcon} />
                  <span className={styles.mobileLabel}>Invitations</span>
                  <span className={styles.mobileValue}>
                    {draw.invitations.toLocaleString()}
                  </span>
                </div>

                <div className={styles.mobileRow}>
                  <Calendar className={styles.mobileIcon} />
                  <div>
                    <div className={styles.mobileDatePrimary}>
                      {dayjs(draw.draw_date).format("MMM D, YYYY")}
                    </div>
                    <div className={styles.mobileDateRelative}>
                      {dayjs(draw.draw_date).fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.mobileEmpty}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="font-medium">No draws found</p>
            </div>
          )}
        </div>{" "}
      </div>
    </>
  );
}
