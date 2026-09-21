"use client";

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Calendar,
} from "lucide-react";
import { Draw, categorizeProgram, formatProgramBadge } from "./";
import styles from "./CRSScore.module.css";

dayjs.extend(relativeTime);

interface DataTableProps {
    draws: Draw[];
    currentPage: number;
    itemsPerPage: number;
    sortBy: "date" | "crs" | "invitations";
    sortOrder: "asc" | "desc";
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
    onSortChange: (sortBy: "date" | "crs" | "invitations", sortOrder: "asc" | "desc") => void;
}

export default function DataTable({
    draws,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    onPageChange,
    onItemsPerPageChange,
    onSortChange,
}: DataTableProps) {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const totalPages = Math.ceil(draws.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedDraws = draws.slice(start, end);

    const handleSort = (column: "date" | "crs" | "invitations") => {
        if (sortBy === column) {
            onSortChange(column, sortOrder === "desc" ? "asc" : "desc");
        } else {
            onSortChange(column, "desc");
        }
    };

    const renderSortIcon = (column: "date" | "crs" | "invitations") => {
        if (sortBy !== column) {
            return <ArrowUpDown size={12} className={styles.sortArrow} />;
        }
        return sortOrder === "desc" ? (
            <ArrowDown size={12} className={styles.sortArrow} />
        ) : (
            <ArrowUp size={12} className={styles.sortArrow} />
        );
    };

    return (
        <div className={styles.tableSection}>
            {/* Table Control Header */}
            <div className={styles.tableHeaderRow}>
                <h3 className={styles.tableTitle}>
                    Draw Records <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>({draws.length} total)</span>
                </h3>
                <div className={styles.tableHeaderActions}>
                    <div className={styles.rowsPerPage}>
                        <span className={styles.rowsLabel}>Rows per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                onItemsPerPageChange(Number(e.target.value));
                                onPageChange(1);
                            }}
                            className={styles.rowsSelect}
                            aria-label="Rows per page"
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Desktop Institutional Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th
                                className={`${styles.th} ${styles.thSortable} ${sortBy === "date" ? styles.thActive : ""}`}
                                onClick={() => handleSort("date")}
                            >
                                <span className={styles.thContent}>
                                    Date {renderSortIcon("date")}
                                </span>
                            </th>
                            <th className={styles.th}>Program Stream</th>
                            <th className={styles.th}>Target Province</th>
                            <th
                                className={`${styles.th} ${styles.thRight} ${styles.thSortable} ${sortBy === "crs" ? styles.thActive : ""}`}
                                onClick={() => handleSort("crs")}
                            >
                                <span className={styles.thContent} style={{ justifyContent: "flex-end" }}>
                                    CRS Cutoff {renderSortIcon("crs")}
                                </span>
                            </th>
                            <th
                                className={`${styles.th} ${styles.thRight} ${styles.thSortable} ${sortBy === "invitations" ? styles.thActive : ""}`}
                                onClick={() => handleSort("invitations")}
                            >
                                <span className={styles.thContent} style={{ justifyContent: "flex-end" }}>
                                    Invitations {renderSortIcon("invitations")}
                                </span>
                            </th>
                            <th className={`${styles.th} ${styles.thRight}`}>vs Prev</th>
                            <th className={`${styles.th} ${styles.thCenter}`} style={{ width: "40px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDraws.length > 0 ? (
                            paginatedDraws.map((draw) => {
                                const isExpanded = expandedRowId === draw.id;
                                const category = categorizeProgram(draw.program);
                                return (
                                    <>
                                        <tr
                                            key={draw.id}
                                            onClick={() => setExpandedRowId(isExpanded ? null : draw.id)}
                                            className={`${styles.tr} ${isExpanded ? styles.trExpanded : ""}`}
                                        >
                                            <td className={styles.td}>
                                                <div className={styles.dateCell}>
                                                    <span className={styles.datePrimary}>
                                                        {dayjs(draw.draw_date).format("MMM D, YYYY")}
                                                    </span>
                                                    <span className={styles.dateSecondary}>
                                                        {dayjs(draw.draw_date).fromNow()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <span
                                                    className={`${styles.programBadge} ${styles[`badge${category}`]}`}
                                                    title={draw.program}
                                                >
                                                    {formatProgramBadge(draw.program)}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={styles.province}>
                                                    {draw.draw_province || "All Canada"}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdRight}`}>
                                                <span className={styles.crsScore}>
                                                    {draw.crs_cutoff || "—"}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdRight}`}>
                                                <span className={styles.invitations}>
                                                    {draw.invitations != null
                                                        ? /^\d+$/.test(draw.invitations)
                                                            ? Number(draw.invitations).toLocaleString()
                                                            : draw.invitations
                                                        : "—"}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdRight}`}>
                                                {draw.delta !== undefined ? (
                                                    <span
                                                        className={`${styles.deltaBadge} ${
                                                            draw.delta < 0
                                                                ? styles.txtDown
                                                                : draw.delta > 0
                                                                ? styles.txtUp
                                                                : styles.txtFlat
                                                        }`}
                                                    >
                                                        {draw.delta > 0 ? `▲ +${draw.delta}` : draw.delta < 0 ? `▼ ${draw.delta}` : "—"}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                            <td className={`${styles.td} ${styles.tdCenter}`}>
                                                {isExpanded ? (
                                                    <ChevronUp size={16} className={styles.chevronIcon} />
                                                ) : (
                                                    <ChevronDown size={16} className={styles.chevronIcon} />
                                                )}
                                            </td>
                                        </tr>

                                        {/* Desktop Dossier Drawer */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <tr className={styles.detailsRow}>
                                                    <td colSpan={7} className={styles.detailsCell}>
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                                            className={styles.detailsContainer}
                                                        >
                                                            <div className={styles.detailsGrid}>
                                                                <div className={styles.detailsInfoBlock}>
                                                                    <h4>Draw Intelligence</h4>
                                                                    <p>
                                                                        <strong>Round Number:</strong> #{draw.round || "—"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Announced Date:</strong>{" "}
                                                                        {dayjs(draw.draw_date).format("MMMM D, YYYY")} ({dayjs(draw.draw_date).fromNow()})
                                                                    </p>
                                                                    <p>
                                                                        <strong>Immigration Stream:</strong> {draw.program}
                                                                    </p>
                                                                    {draw.draw_province && (
                                                                        <p>
                                                                            <strong>Designated Province:</strong> {draw.draw_province}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className={styles.detailsInfoBlock}>
                                                                    <h4>Cutoff & Volume Metrics</h4>
                                                                    <p>
                                                                        <strong>CRS Minimum Cutoff:</strong> {draw.crs_cutoff || "—"} points
                                                                    </p>
                                                                    <p>
                                                                        <strong>Invitations Issued (ITAs):</strong>{" "}
                                                                        {draw.invitations != null
                                                                            ? Number(draw.invitations).toLocaleString()
                                                                            : "—"}
                                                                    </p>
                                                                    {draw.delta !== undefined && (
                                                                        <p>
                                                                            <strong>Cutoff Shift vs Previous:</strong>{" "}
                                                                            <span
                                                                                className={
                                                                                    draw.delta < 0
                                                                                        ? styles.txtDown
                                                                                        : draw.delta > 0
                                                                                        ? styles.txtUp
                                                                                        : styles.txtFlat
                                                                                }
                                                                                style={{ fontWeight: 700 }}
                                                                            >
                                                                                {draw.delta > 0 ? `+${draw.delta}` : draw.delta} points
                                                                            </span>
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className={styles.detailsActionsBlock}>
                                                                    <a
                                                                        href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={styles.irccButton}
                                                                    >
                                                                        Official IRCC Record <ExternalLink size={12} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className={styles.emptyRow}>
                                    <div className={styles.emptyState}>
                                        <Calendar className={styles.emptyIcon} />
                                        <p>No draws found matching the selected filter criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Native Mobile Card Feed (< 768px) */}
            <div className={styles.mobileCardsContainer}>
                {paginatedDraws.length > 0 ? (
                    paginatedDraws.map((draw) => {
                        const isExpanded = expandedRowId === draw.id;
                        const category = categorizeProgram(draw.program);
                        return (
                            <div
                                key={draw.id}
                                onClick={() => setExpandedRowId(isExpanded ? null : draw.id)}
                                className={`${styles.mobileCard} ${isExpanded ? styles.mobileCardExpanded : ""}`}
                            >
                                {/* Card Header */}
                                <div className={styles.mobileCardTop}>
                                    <div className={styles.mobileCardDateWrap}>
                                        <span className={styles.mobileCardDate}>
                                            {dayjs(draw.draw_date).format("MMM D, YYYY")}
                                        </span>
                                        <span className={styles.mobileCardAgo}>
                                            • {dayjs(draw.draw_date).fromNow()}
                                        </span>
                                    </div>
                                    <div className={styles.mobileCardBadgeWrap}>
                                        <span
                                            className={`${styles.programBadge} ${styles[`badge${category}`]}`}
                                            title={draw.program}
                                        >
                                            {formatProgramBadge(draw.program)}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Metrics */}
                                <div className={styles.mobileCardMiddle}>
                                    <div className={styles.mobileCardScoreCol}>
                                        <span className={styles.mobileCardScoreLabel}>CRS Cutoff</span>
                                        <div className={styles.mobileCardScoreRow}>
                                            <span className={styles.mobileCardScoreVal}>
                                                {draw.crs_cutoff || "—"}
                                            </span>
                                            {draw.delta !== undefined && (
                                                <span
                                                    className={`${styles.deltaBadge} ${
                                                        draw.delta < 0
                                                            ? styles.txtDown
                                                            : draw.delta > 0
                                                            ? styles.txtUp
                                                            : styles.txtFlat
                                                    }`}
                                                >
                                                    {draw.delta > 0 ? `▲ +${draw.delta}` : draw.delta < 0 ? `▼ ${draw.delta}` : "—"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.mobileCardInvCol}>
                                        <div className={styles.mobileCardInvVal}>
                                            {draw.invitations != null
                                                ? /^\d+$/.test(draw.invitations)
                                                    ? Number(draw.invitations).toLocaleString()
                                                    : draw.invitations
                                                : "—"}{" "}
                                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>ITAs</span>
                                        </div>
                                        <div className={styles.mobileCardProvince}>
                                            {draw.draw_province || "All Canada"}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Bottom Details Toggle */}
                                <div className={styles.mobileCardBottom}>
                                    <span>Round #{draw.round || "—"}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                        {isExpanded ? "Less" : "Details"}
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </span>
                                </div>

                                {/* Mobile Card Accordion Drawer */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: "easeInOut" }}
                                            className={styles.mobileCardDrawer}
                                        >
                                            <div className={styles.mobileDrawerRow}>
                                                <span>Immigration Stream</span>
                                                <span>{draw.program}</span>
                                            </div>
                                            <div className={styles.mobileDrawerRow}>
                                                <span>Target Province</span>
                                                <span>{draw.draw_province || "All Canada"}</span>
                                            </div>
                                            <div className={styles.mobileDrawerRow}>
                                                <span>Cutoff Shift</span>
                                                <span
                                                    className={
                                                        draw.delta && draw.delta < 0
                                                            ? styles.txtDown
                                                            : draw.delta && draw.delta > 0
                                                            ? styles.txtUp
                                                            : ""
                                                    }
                                                >
                                                    {draw.delta !== undefined ? (draw.delta > 0 ? `+${draw.delta}` : `${draw.delta}`) : "—"} pts
                                                </span>
                                            </div>
                                            <div style={{ marginTop: "0.75rem" }}>
                                                <a
                                                    href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.irccButton}
                                                    style={{ width: "100%", justifyContent: "center" }}
                                                >
                                                    Official IRCC Record <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.emptyState} style={{ padding: "2.5rem 1rem" }}>
                        <Calendar className={styles.emptyIcon} />
                        <p>No draws found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {draws.length > itemsPerPage && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={styles.paginationBtn}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                        Prev
                    </button>

                    <div className={styles.paginationPages}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                                if (page === 1 || page === totalPages) return true;
                                if (Math.abs(page - currentPage) <= 1) return true;
                                return false;
                            })
                            .map((page, index, array) => (
                                <div key={page} style={{ display: "inline-flex", alignItems: "center" }}>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span className={styles.paginationEllipsis}>...</span>
                                    )}
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`${styles.paginationPageBtn} ${
                                            currentPage === page ? styles.paginationPageBtnActive : ""
                                        }`}
                                    >
                                        {page}
                                    </button>
                                </div>
                            ))}
                    </div>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={styles.paginationBtn}
                        aria-label="Next page"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <div className={styles.paginationInfo}>
                Showing {start + 1} to {Math.min(end, draws.length)} of {draws.length} total draws
            </div>
        </div>
    );
}
