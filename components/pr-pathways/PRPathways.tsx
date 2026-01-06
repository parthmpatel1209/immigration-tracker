"use client";
import { useEffect, useState, useMemo } from "react";
import { PathwayCard } from "./PathwayCard";
import { Pathway } from "./types";
import styles from "./PRPathways.module.css";
import { Search, Filter, TrendingUp, MapPin, FileText, X } from "lucide-react";

export default function PRPathways() {
  const [list, setList] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Enhanced filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"province" | "program" | "popular">("province");

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
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load pathways");
        return r.json();
      })
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Extract unique values for filters
  const provinces = useMemo(
    () => ["All", ...new Set(list.map((p) => p.province))],
    [list]
  );

  const programs = useMemo(
    () => ["All", ...new Set(list.map((p) => p.program))],
    [list]
  );

  const statuses = useMemo(
    () => ["All", ...new Set(list.map((p) => p.status))],
    [list]
  );

  // Advanced filtering logic
  const filteredPathways = useMemo(() => {
    let result = [...list];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.province.toLowerCase().includes(query) ||
          p.program.toLowerCase().includes(query) ||
          p.summary?.toLowerCase().includes(query) ||
          p.key_requirements?.toLowerCase().includes(query)
      );
    }

    // Apply province filter
    if (selectedProvince !== "All") {
      result = result.filter((p) => p.province === selectedProvince);
    }

    // Apply program filter
    if (selectedProgram !== "All") {
      result = result.filter((p) => p.program === selectedProgram);
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      result = result.filter((p) => p.status === selectedStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "province") {
        return a.province.localeCompare(b.province);
      } else if (sortBy === "program") {
        return a.program.localeCompare(b.program);
      }
      return 0;
    });

    return result;
  }, [list, searchQuery, selectedProvince, selectedProgram, selectedStatus, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: list.length,
      provinces: new Set(list.map((p) => p.province)).size,
      programs: new Set(list.map((p) => p.program)).size,
      active: list.filter((p) => p.status?.toLowerCase().includes("open") || p.status?.toLowerCase().includes("active")).length,
    };
  }, [list]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProvince("All");
    setSelectedProgram("All");
    setSelectedStatus("All");
  };

  const hasActiveFilters =
    searchQuery || selectedProvince !== "All" || selectedProgram !== "All" || selectedStatus !== "All";

  if (loading) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading Canadian PR Pathways...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3 className={styles.errorTitle}>Unable to Load Pathways</h3>
            <p className={styles.errorMessage}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className={styles.container}>
          <div className={styles.empty}>No pathways found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={styles.container}>
        {/* Enhanced Header with Breadcrumbs */}
        <header className={styles.header}>
          <div className={styles.breadcrumbs}>
            <span className={styles.breadcrumb}>Home</span>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={`${styles.breadcrumb} ${styles.breadcrumbActive}`}>
              PR Pathways
            </span>
          </div>
          <h1 className={styles.title}>Canadian PR Pathways</h1>
          <p className={styles.subtitle}>
            Explore immigration pathways across Canada. Find the right program for your profile.
          </p>

          {/* Statistics Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FileText size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.total}</div>
                <div className={styles.statLabel}>Total Pathways</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <MapPin size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>13</div>
                <div className={styles.statLabel}>Provinces/Territories</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.programs}</div>
                <div className={styles.statLabel}>Program Types</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Filter size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.active}</div>
                <div className={styles.statLabel}>Currently Active</div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>
              <Filter size={20} />
              Filter & Search
            </h3>
            {hasActiveFilters && (
              <button className={styles.clearFilters} onClick={clearFilters}>
                <X size={16} />
                Clear All
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search pathways, provinces, or requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search pathways"
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Grid */}
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="province-filter">
                <MapPin size={16} />
                Province/Territory
              </label>
              <select
                id="province-filter"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className={styles.filterSelect}
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p} {p === "All" && `(${list.length})`}
                    {p !== "All" && `(${list.filter((pathway) => pathway.province === p).length})`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="program-filter">
                <FileText size={16} />
                Program Type
              </label>
              <select
                id="program-filter"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className={styles.filterSelect}
              >
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p} {p === "All" && `(${list.length})`}
                    {p !== "All" && `(${list.filter((pathway) => pathway.program === p).length})`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="status-filter">
                <TrendingUp size={16} />
                Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.filterSelect}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s} {s === "All" && `(${list.length})`}
                    {s !== "All" && `(${list.filter((pathway) => pathway.status === s).length})`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="sort-filter">
                <TrendingUp size={16} />
                Sort By
              </label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.filterSelect}
              >
                <option value="province">Province (A-Z)</option>
                <option value="program">Program Type</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            {filteredPathways.length === list.length ? (
              <>
                Showing all <strong>{filteredPathways.length}</strong> pathways
              </>
            ) : (
              <>
                Found <strong>{filteredPathways.length}</strong> of <strong>{list.length}</strong> pathways
              </>
            )}
          </p>
        </div>

        {/* Pathways Grid */}
        {filteredPathways.length > 0 ? (
          <div className={styles.grid}>
            {filteredPathways.map((p) => (
              <PathwayCard key={p.id} pathway={p} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3 className={styles.noResultsTitle}>No pathways match your criteria</h3>
            <p className={styles.noResultsText}>
              Try adjusting your filters or search query
            </p>
            <button className={styles.clearFiltersButton} onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerDisclaimer}>
            <strong>Note:</strong> Immigration pathways and requirements are subject to change.
            Always verify information on official government websites.
          </p>
        </footer>
      </div>
    </div>
  );
}
