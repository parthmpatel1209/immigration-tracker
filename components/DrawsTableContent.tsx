"use client";

import { ArrowUpDown, Calendar, Users, Hash, MapPin } from "lucide-react";
import dayjs from "dayjs";
import styles from "./DrawsTable.module.css"; // Import CSS module

interface Draw {
  id: number;
  round: number;
  program: string;
  crs_cutoff: number;
  invitations: number;
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
}

export default function DrawsTableContent({
  draws,
  sortBy,
  sortOrder,
  toggleSort,
  themeStyles,
}: DrawsTableContentProps) {
  return (
    <div className={`${styles.tableContainer} ${themeStyles.tableContainer}`}>
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
              <tr key={draw.id} className={`${styles.row} ${themeStyles.row}`}>
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
  );
}
