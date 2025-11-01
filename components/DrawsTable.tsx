"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowUpDown, Calendar, Hash, Filter } from "lucide-react";
import CRSFilter from "./CRSFilter";
import DrawsTableContent from "./DrawsTableContent";
import styles from "./DrawsTable.module.css";

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

export default function DrawsTable() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [crsRange, setCrsRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "crs">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Detect dark mode
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

  // Fetch Draws
  useEffect(() => {
    const fetchDraws = async () => {
      const res = await fetch("/api/draws");
      const data: Draw[] = await res.json();
      setDraws(data);
    };
    fetchDraws();
  }, []);

  // Filtered & Sorted Draws
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

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedDraws = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSorted.slice(start, end);
  }, [filteredAndSorted, currentPage]);

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProgram, selectedProvince, crsRange, sortBy, sortOrder]);

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

  // Dynamic class selection for dark/light mode
  const themeStyles = {
    label: darkMode ? styles.labelDark : styles.labelLight,
    select: darkMode ? styles.selectDark : styles.selectLight,
    selectOption: darkMode ? styles.selectOptionDark : styles.selectOptionLight,
    sortButton: darkMode ? styles.sortButtonDark : styles.sortButtonLight,
    tableContainer: darkMode
      ? styles.tableContainerDark
      : styles.tableContainerLight,
    row: darkMode ? styles.rowDark : styles.rowLight,
    badge: darkMode ? styles.badgeDark : styles.badgeLight,
    province: darkMode ? styles.province : styles.provinceLight,
    invitations: darkMode ? styles.invitations : styles.invitationsLight,
    date: darkMode ? styles.dateDark : styles.dateLight,
    dateRelative: darkMode ? styles.dateRelativeDark : styles.dateRelativeLight,
    emptyCell: darkMode ? styles.emptyCellDark : styles.emptyCellLight,
    emptySvg: darkMode ? styles.emptySvgDark : styles.emptySvgLight,
    footer: darkMode ? styles.footerDark : styles.footerLight,
    paginationButton: darkMode
      ? styles.paginationButtonDark
      : styles.paginationButtonLight,
    pageNumber: darkMode ? styles.pageNumberDark : styles.pageNumberLight,
    pageNumberActive: darkMode
      ? styles.pageNumberActiveDark
      : styles.pageNumberActiveLight,
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>CRS Draw History</h2>
        <Filter className={styles.filterIcon} />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {/* Program Filter */}
        <div>
          <label className={`${styles.label} ${themeStyles.label}`}>
            Program
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className={`${styles.select} ${themeStyles.select}`}
          >
            {programs.map((p) => (
              <option key={p} value={p} className={themeStyles.selectOption}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Province Filter */}
        <div>
          <label className={`${styles.label} ${themeStyles.label}`}>
            Province
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className={`${styles.select} ${themeStyles.select}`}
          >
            {provinces.map((p) => (
              <option key={p} value={p} className={themeStyles.selectOption}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* CRS Range */}
        <div>
          <label className={`${styles.label} ${themeStyles.label}`}>
            CRS Range
          </label>
          <CRSFilter
            onRangeChange={setCrsRange}
            styles={{
              select: themeStyles.select,
              selectOption: themeStyles.selectOption,
            }}
          />
        </div>

        {/* Desktop Sort Buttons */}
        <div className={`${styles.sortButtons} hidden lg:flex`}>
          <button
            onClick={() => toggleSort("date")}
            className={`${styles.sortButton} ${themeStyles.sortButton}`}
          >
            <Calendar className={styles.sortIcon} />
            Date
            {sortBy === "date" && (
              <ArrowUpDown
                className={`${styles.arrowIcon} ${
                  sortOrder === "asc" ? styles.arrowIconAsc : ""
                }`}
              />
            )}
          </button>
          <button
            onClick={() => toggleSort("crs")}
            className={`${styles.sortButton} ${themeStyles.sortButton}`}
          >
            <Hash className={styles.sortIcon} />
            CRS
            {sortBy === "crs" && (
              <ArrowUpDown
                className={`${styles.arrowIcon} ${
                  sortOrder === "asc" ? styles.arrowIconAsc : ""
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sort */}
      <div className={`${styles.mobileSort} lg:hidden`}></div>

      {/* Table */}
      <DrawsTableContent
        draws={paginatedDraws}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
        themeStyles={{
          tableContainer: themeStyles.tableContainer,
          row: themeStyles.row,
          badge: themeStyles.badge,
          province: themeStyles.province,
          invitations: themeStyles.invitations,
          date: themeStyles.date,
          dateRelative: themeStyles.dateRelative,
          emptyCell: themeStyles.emptyCell,
          emptySvg: themeStyles.emptySvg,
        }}
      />

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${
            themeStyles.paginationButton
          } ${currentPage === 1 ? styles.paginationButtonDisabled : ""}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${styles.pageNumber} ${themeStyles.pageNumber} ${
              currentPage === page ? themeStyles.pageNumberActive : ""
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`${styles.paginationButton} ${
            themeStyles.paginationButton
          } ${
            currentPage === totalPages ? styles.paginationButtonDisabled : ""
          }`}
        >
          Next
        </button>
      </div>

      {/* Footer */}
      <div className={`${styles.footer} ${themeStyles.footer}`}>
        <p>
          Showing{" "}
          <strong>
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)}
          </strong>{" "}
          of <strong>{filteredAndSorted.length}</strong>
        </p>
        <p>Updated {dayjs().format("MMM D, YYYY [at] h:mm A")}</p>
      </div>
    </div>
  );
}
