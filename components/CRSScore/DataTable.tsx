import { useState } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Award,
    MapPin,
    Target,
    Users,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    ExternalLink,
} from "lucide-react";
import { Draw, categorizeProgram } from "./";
import FilterDropdown from "./FilterDropdown";
import styles from "./CRSScore.module.css";

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

    return (
        <div className={styles.tableSection}>
            <div className={styles.tableHeaderRow}>
                <h3 className={styles.tableTitle}>
                    Draw History ({draws.length} results)
                </h3>
                <div className={styles.tableHeaderActions}>
                    <FilterDropdown
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={onSortChange}
                    />

                    <div className={styles.rowsPerPage}>
                        <span className={styles.rowsLabel}>Rows per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                onItemsPerPageChange(Number(e.target.value));
                                onPageChange(1);
                            }}
                            className={styles.rowsSelect}
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>
                                <Calendar className={styles.thIcon} />
                                Date
                            </th>
                            <th className={styles.th}>
                                <Award className={styles.thIcon} />
                                Program
                            </th>
                            <th className={styles.th}>
                                <MapPin className={styles.thIcon} />
                                Province
                            </th>
                            <th className={styles.th}>
                                <Target className={styles.thIcon} />
                                CRS
                            </th>
                            <th className={styles.th}>
                                <Users className={styles.thIcon} />
                                ITAs
                            </th>
                            <th className={styles.th}>
                                <Target className={styles.thIcon} />
                                vs Prev
                            </th>
                            <th className={styles.th}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDraws.length > 0 ? (
                            paginatedDraws.map((draw, index) => {
                                const isExpanded = expandedRowId === draw.id;
                                return (
                                    <>
                                        <tr
                                            key={draw.id}
                                            onClick={() => setExpandedRowId(isExpanded ? null : draw.id)}
                                            className={`${styles.tr} ${isExpanded ? styles.trExpanded : ""}`}
                                            style={{
                                                animationDelay: `${index * 0.02}s`,
                                            }}
                                        >
                                            <td className={styles.td} data-label="Date">
                                                <div className={styles.dateCell}>
                                                    <div className={styles.datePrimary}>
                                                        {dayjs(draw.draw_date).format("MMM D, YYYY")}
                                                    </div>
                                                    <div className={styles.dateSecondary}>
                                                        {dayjs(draw.draw_date).fromNow()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.td} data-label="Program">
                                                <span
                                                    className={`${styles.programBadge} ${styles[`badge${categorizeProgram(draw.program)}`]
                                                        }`}
                                                >
                                                    {draw.program}
                                                </span>
                                            </td>
                                            <td className={styles.td} data-label="Province">
                                                <span className={styles.province}>
                                                    {draw.draw_province || "All Canada"}
                                                </span>
                                            </td>
                                            <td className={styles.td} data-label="CRS Score">
                                                <span className={styles.crsScore}>
                                                    {draw.crs_cutoff || "N/A"}
                                                </span>
                                            </td>
                                            <td className={styles.td} data-label="Invitations">
                                                <span className={styles.invitations}>
                                                    {draw.invitations != null
                                                        ? /^\d+$/.test(draw.invitations)
                                                            ? Number(draw.invitations).toLocaleString()
                                                            : draw.invitations
                                                        : "N/A"}
                                                </span>
                                            </td>
                                            <td className={styles.td} data-label="vs Prev">
                                                {draw.delta !== undefined ? (
                                                    <span className={draw.delta > 0 ? styles.txtUp : draw.delta < 0 ? styles.txtDown : styles.txtFlat}>
                                                        {draw.delta > 0 ? "+" : ""}
                                                        {draw.delta === 0 ? "—" : draw.delta}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                            <td className={styles.td}>
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </td>
                                        </tr>

                                        {/* Expanded Details Row */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <tr className={styles.detailsRow}>
                                                    <td colSpan={7} className={styles.detailsCell}>
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={styles.detailsContainer}
                                                        >
                                                            <div className={styles.detailsGrid}>
                                                                <div className={styles.detailsInfoBlock}>
                                                                    <h4>Draw Breakdown</h4>
                                                                    <p>
                                                                        <strong>Draw Round:</strong> #{draw.round || "N/A"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Date Announced:</strong>{" "}
                                                                        {dayjs(draw.draw_date).format("MMMM DD, YYYY")} (
                                                                        {dayjs(draw.draw_date).fromNow()})
                                                                    </p>
                                                                    <p>
                                                                        <strong>Immigration Program:</strong> {draw.program}
                                                                    </p>
                                                                    {draw.draw_province && (
                                                                        <p>
                                                                            <strong>Targeting Province:</strong> {draw.draw_province}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className={styles.detailsInfoBlock}>
                                                                    <h4>Cutoff Details</h4>
                                                                    <p>
                                                                        <strong>CRS Cutoff Score:</strong> {draw.crs_cutoff || "N/A"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Total Invited Applicants:</strong>{" "}
                                                                        {draw.invitations != null
                                                                            ? Number(draw.invitations).toLocaleString()
                                                                            : "N/A"}
                                                                    </p>
                                                                    {draw.delta !== undefined && (
                                                                        <p>
                                                                            <strong>Cutoff Delta vs Prev:</strong>{" "}
                                                                            <span
                                                                                className={
                                                                                    draw.delta > 0
                                                                                        ? styles.txtUp
                                                                                        : draw.delta < 0
                                                                                        ? styles.txtDown
                                                                                        : ""
                                                                                }
                                                                            >
                                                                                {draw.delta > 0 ? "+" : ""}{draw.delta} points
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
                                                                        Official IRCC Page <ExternalLink size={12} />
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
                                        <p>No draws found for the selected filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {draws.length > itemsPerPage && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={styles.paginationBtn}
                    >
                        <ChevronLeft className={styles.paginationIcon} />
                        Previous
                    </button>

                    <div className={styles.paginationPages}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                                if (page === 1 || page === totalPages) return true;
                                if (Math.abs(page - currentPage) <= 1) return true;
                                return false;
                            })
                            .map((page, index, array) => (
                                <>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span key={`ellipsis-${page}`} className={styles.paginationEllipsis}>
                                            ...
                                        </span>
                                    )}
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`${styles.paginationPageBtn} ${currentPage === page ? styles.paginationPageBtnActive : ""
                                            }`}
                                    >
                                        {page}
                                    </button>
                                </>
                            ))}
                    </div>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={styles.paginationBtn}
                    >
                        Next
                        <ChevronRight className={styles.paginationIcon} />
                    </button>
                </div>
            )}

            <div className={styles.paginationInfo}>
                Showing {start + 1} to {Math.min(end, draws.length)} of {draws.length} results
            </div>
        </div>
    );
}
