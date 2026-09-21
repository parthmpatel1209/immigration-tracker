import dayjs from "dayjs";
import { Draw, ProgramCategory } from "./types";

export function NA(value: any, fallback = "N/A"): string {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }
    return String(value);
}

export function categorizeProgram(program: string): ProgramCategory {
    const lowerProgram = program.toLowerCase();

    // 1. Explicitly check for CEC/Canadian Experience
    if (
        lowerProgram.includes("canadian experience") ||
        lowerProgram.includes("cec")
    ) {
        return "CEC";
    }

    // 2. Explicitly check for PNP/Provincial Nominee
    if (
        lowerProgram.includes("provincial nominee") ||
        lowerProgram.includes("pnp")
    ) {
        return "PNP";
    }

    // 3. Express Entry Category Based
    if (lowerProgram.includes("express entry")) {
        return "CategoryBased";
    }

    // 4. Non-Express Entry (AAIP, OINP, Skilled Worker, etc.)
    return "NonEE";
}

export function getRange(scores: number[]) {
    if (scores.length === 0) return null;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return { min, max };
}

/**
 * Intelligent formatter for program badges to prevent text overflow on mobile/desktop.
 * Strips redundant prefixes (e.g. "Express Entry - ") and versioning tags,
 * while mapping long occupational and provincial stream descriptions to concise badges.
 */
export function formatProgramBadge(program: string): string {
    if (!program) return "General";

    let clean = program.trim();

    // 1. Remove redundant leading "Express Entry - " or "Express Entry: "
    clean = clean.replace(/^Express Entry\s*[:-]\s*/i, "");

    // 2. Remove trailing administrative version tags like ", 2026-Version 1", "(Version 1)"
    clean = clean.replace(/[,]?\s*(\d{4}-)?Version\s*\d+/gi, "");
    clean = clean.replace(/\(Version\s*\d+\)/gi, "");

    // 3. Simplify common category-based draw strings
    if (/french language proficiency/i.test(clean)) {
        return "French Proficiency";
    }
    if (/healthcare/i.test(clean) && clean.length > 25) {
        return clean.includes("Early Childhood") ? "Healthcare & Childcare" : "Healthcare Occupations";
    }
    if (/stem occupations/i.test(clean)) {
        return "STEM Occupations";
    }
    if (/trade occupations/i.test(clean)) {
        return "Trade Occupations";
    }
    if (/agriculture/i.test(clean)) {
        return "Agriculture & Agri-Food";
    }
    if (/transport/i.test(clean)) {
        return "Transport Occupations";
    }
    if (/physicians with canadian work experience/i.test(clean)) {
        return "Physicians in Canada";
    }

    // 4. Simplify long provincial employer job offer / stream strings
    if (clean.includes("Employer Job Offer:")) {
        clean = clean.replace(/^Employer Job Offer:\s*/i, "OINP: ");
    }
    if (clean.startsWith("Alberta Express Entry")) {
        clean = clean.replace(/^Alberta Express Entry\s*–\s*/i, "AAIP: ");
    }
    if (clean.startsWith("Quebec PSTQ")) {
        clean = clean.replace(/^Quebec PSTQ\s*-\s*All 4 streams.*/i, "Quebec PSTQ (All Streams)");
        clean = clean.replace(/^Quebec PSTQ\s*-\s*All 4 Streams.*/i, "Quebec PSTQ (All Streams)");
    }
    if (clean.includes("BCPNP - Skills Immigration (Care:")) {
        return "BCPNP - Care & Build";
    }
    if (clean.includes("MPNP - Skilled Worker in Manitoba (Post-secondary")) {
        return "MPNP - Skilled Worker";
    }

    // Trim any dangling parens or dashes
    clean = clean.replace(/\s*-\s*$/, "").replace(/\(\s*\)$/, "").trim();

    // If still over 40 chars, truncate cleanly with ellipsis
    if (clean.length > 40) {
        return clean.substring(0, 38).trim() + "…";
    }

    return clean;
}

// Badge colors for draw cards
export const BADGE_COLORS: Record<
    string,
    { light: { bg: string; text: string }; dark: { bg: string; text: string } }
> = {
    CEC: {
        light: { bg: "rgba(153, 27, 27, 0.08)", text: "#991b1b" },
        dark: { bg: "rgba(252, 165, 165, 0.15)", text: "#fca5a5" },
    },
    PNP: {
        light: { bg: "rgba(6, 95, 70, 0.08)", text: "#065f46" },
        dark: { bg: "rgba(52, 211, 153, 0.15)", text: "#34d399" },
    },
    CategoryBased: {
        light: { bg: "rgba(30, 64, 175, 0.08)", text: "#1e40af" },
        dark: { bg: "rgba(96, 165, 250, 0.15)", text: "#60a5fa" },
    },
    NonEE: {
        light: { bg: "rgba(71, 85, 105, 0.08)", text: "#334155" },
        dark: { bg: "rgba(148, 163, 184, 0.15)", text: "#cbd5e1" },
    },
    default: {
        light: { bg: "#f8fafc", text: "#64748b" },
        dark: { bg: "#1e293b", text: "#94a3b8" },
    },
};

export function computeDeltas(rawDraws: Draw[]): Draw[] {
    // Sort oldest first to calculate changes progressively
    const chronDraws = [...rawDraws].sort(
        (a, b) => dayjs(a.draw_date).valueOf() - dayjs(b.draw_date).valueOf()
    );

    const lastCrsByCategory: Record<string, number> = {};

    const drawsWithDelta = chronDraws.map((d) => {
        const category = categorizeProgram(d.program);
        const currentCrs = Number(d.crs_cutoff);
        let delta = 0;

        if (!isNaN(currentCrs) && d.crs_cutoff != null) {
            const lastCrs = lastCrsByCategory[category];
            if (lastCrs !== undefined) {
                delta = currentCrs - lastCrs;
            }
            lastCrsByCategory[category] = currentCrs;
        }

        return {
            ...d,
            delta,
        };
    });

    // Return sorted newest first
    return drawsWithDelta.sort(
        (a, b) => dayjs(b.draw_date).valueOf() - dayjs(a.draw_date).valueOf()
    );
}
