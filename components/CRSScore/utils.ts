import { ProgramCategory } from "./types";

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
