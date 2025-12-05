import { ProgramCategory } from "./types";

export function NA(value: any, fallback = "N/A"): string {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }
    return String(value);
}

export function categorizeProgram(program: string): ProgramCategory {
    const lowerProgram = program.toLowerCase();
    if (
        lowerProgram.includes("canadian experience") ||
        lowerProgram.includes("cec")
    ) {
        return "CEC";
    } else if (
        lowerProgram.includes("provincial nominee") ||
        lowerProgram.includes("pnp")
    ) {
        return "PNP";
    }
    return "Others";
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
    "Express Entry": {
        light: { bg: "#e0e7ff", text: "#4338ca" },
        dark: { bg: "#4338ca", text: "#c7d2fe" },
    },
    CEC: {
        light: { bg: "#dbeafe", text: "#1e40af" },
        dark: { bg: "#1e40af", text: "#bfdbfe" },
    },
    PNP: {
        light: { bg: "#d1fae5", text: "#065f46" },
        dark: { bg: "#065f46", text: "#a7f3d0" },
    },
    FSW: {
        light: { bg: "#fef3c7", text: "#92400e" },
        dark: { bg: "#78350f", text: "#fde68a" },
    },
    default: {
        light: { bg: "#e5e7eb", text: "#374151" },
        dark: { bg: "#374151", text: "#d1d5db" },
    },
};
