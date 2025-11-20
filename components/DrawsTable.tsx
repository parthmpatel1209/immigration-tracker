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
  round: string;
  program: string;
  crs_cutoff: string;
  invitations: string;
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
  const [showFilters, setShowFilters] = useState(false); // This controls filter visibility
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

    if (crsRange) {
      const [min, max] = crsRange;
      list = list.filter((d) => {
        const score = Number(d.crs_cutoff);
        return !isNaN(score) && score >= min && score <= max;
      });
    }

    // Sorting
    if (sortBy === "crs") {
      list.sort((a, b) => {
        const aScore = Number(a.crs_cutoff);
        const bScore = Number(b.crs_cutoff);
        // Handle possible NaN (rare, but safe)
        if (isNaN(aScore) && isNaN(bScore)) return 0;
        if (isNaN(aScore)) return 1;
        if (isNaN(bScore)) return -1;

        return sortOrder === "asc" ? aScore - bScore : bScore - aScore;
      });
    } else {
      // Date sorting (already safe)
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
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`${styles.filterToggleBtn} ${
            showFilters ? styles.filterToggleActive : ""
          }`}
          aria-label={showFilters ? "Hide filters" : "Show filters"}
        >
          <Filter className={styles.filterIcon} />
          <span className={styles.filterToggleText}>
            {showFilters ? "Hide" : "Show"} Filters
          </span>
        </button>
      </div>

      {/* Filters — Only visible when showFilters is true */}
      <div
        className={`${styles.filtersWrapper} ${
          showFilters ? styles.filtersVisible : styles.filtersHidden
        }`}
      >
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
        darkMode={darkMode}
      />

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        {/* Previous */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`
            ${styles.modernBtn} ${styles.modernBtnPrevNext}
            ${currentPage === 1 ? styles.modernBtnDisabled : ""}
            ${darkMode ? styles.modernBtnDark : styles.modernBtnLight}
          `}
        >
          <svg
            className={styles.modernBtnIcon}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.1 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Previous
        </button>

        {/* Page numbers */}
        <div className={styles.pageList}>
          {(() => {
            const pages: (number | "ellipsis")[] = [];
            pages.push(1);
            if (currentPage > 4) pages.push("ellipsis");
            const start = Math.max(2, currentPage - 2);
            const end = Math.min(totalPages - 1, currentPage + 2);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 3) pages.push("ellipsis");
            if (totalPages > 1) pages.push(totalPages);

            const uniq: (number | "ellipsis")[] = [];
            pages.forEach((p) => {
              if (!uniq.includes(p)) uniq.push(p);
            });
            return uniq;
          })().map((item, idx) => {
            if (item === "ellipsis") {
              return (
                <span key={`ell-${idx}`} className={styles.modernEllipsis}>
                  …
                </span>
              );
            }
            return (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                className={`
                  ${styles.modernBtn} ${styles.modernBtnPage}
                  ${
                    currentPage === item
                      ? darkMode
                        ? styles.modernBtnActiveDark
                        : styles.modernBtnActiveLight
                      : ""
                  }
                  ${darkMode ? styles.modernBtnDark : styles.modernBtnLight}
                `}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`
            ${styles.modernBtn} ${styles.modernBtnPrevNext}
            ${currentPage === totalPages ? styles.modernBtnDisabled : ""}
            ${darkMode ? styles.modernBtnDark : styles.modernBtnLight}
          `}
        >
          Next
          <svg
            className={styles.modernBtnIcon}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
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
