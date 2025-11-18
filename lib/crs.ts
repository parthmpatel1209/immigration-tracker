// /lib/crs.ts

// Define interfaces for type safety
export interface BreakdownRow {
  idx?: number;
  id?: string;
  factor: string;
  level_key: string;
  level_label?: string;
  points_with_spouse: number;
  points_no_spouse: number;
  created_at?: string;
}

export interface LanguagePointsRow {
  clb_level: number;
  points_with_spouse: number;
  points_no_spouse: number;
}

// Convert IELTS scores to CLB levels
// Helper: parse "8.0–9.0" → { min: 8.0, max: 9.0 } or single → { min: 7.0, max: 7.0 }
function parseScore(score: string): { min: number; max: number } | null {
  if (!score) return null;
  const trimmed = score.trim();
  if (trimmed.includes("–")) {
    const [minStr, maxStr] = trimmed.split("–").map((s) => s.trim());
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    if (isNaN(min) || isNaN(max)) return null;
    return { min, max };
  } else {
    const val = parseFloat(trimmed);
    return isNaN(val) ? null : { min: val, max: val };
  }
}

export function convertIeltsToCLB(benchmarks: any[], scores: any) {
  const result: Record<string, number | null> = {
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
  };

  const skills = ["listening", "reading", "writing", "speaking"] as const;

  for (const row of benchmarks) {
    if (row.test_name !== "IELTS General Training") continue;

    for (const skill of skills) {
      if (result[skill] !== null) continue; // Already matched

      const inputScore = parseFloat(scores[skill]);
      if (isNaN(inputScore)) continue;

      const range = parseScore(row[skill]);
      if (!range) continue;

      if (inputScore >= range.min && inputScore <= range.max) {
        result[skill] = row.clb_level;
      }
    }
  }

  return result;
}

// CRS points table lookup
export function getPointsFor(
  breakdown: BreakdownRow[],
  factor: string,
  levelKey: string,
  spouse: boolean
): number {
  if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
    console.warn(
      `Invalid or empty breakdown array for factor: ${factor}, levelKey: ${levelKey}`
    );
    return 0;
  }

  const row = breakdown.find(
    (r) => r.factor === factor && r.level_key === levelKey
  );
  if (!row) {
    console.warn(
      `No matching row for factor: ${factor}, levelKey: ${levelKey}`,
      `Available keys for ${factor}:`,
      breakdown.filter((r) => r.factor === factor).map((r) => r.level_key)
    );
    return 0;
  }
  return spouse ? row.points_with_spouse : row.points_no_spouse;
}

export function calculateAgePoints(
  breakdown: BreakdownRow[],
  age: number,
  spouse: boolean
): number {
  if (!Number.isInteger(age) || age < 0) {
    console.warn(`Invalid age: ${age}`);
    return 0;
  }

  let levelKey: string;
  if (age <= 17) levelKey = "17_or_less";
  else if (age >= 45) levelKey = "45+";
  else if (age >= 20 && age <= 29) levelKey = "20-29";
  else levelKey = String(age); // Fallback for specific ages (e.g., 30, 31, 32, etc.)

  return getPointsFor(breakdown, "age", levelKey, spouse);
}

export function calculateEducationPoints(
  breakdown: BreakdownRow[],
  levelKey: string,
  spouse: boolean
): number {
  if (!levelKey || typeof levelKey !== "string") {
    console.warn(`Invalid education levelKey: ${levelKey}`);
    return 0;
  }

  return getPointsFor(breakdown, "education", levelKey, spouse);
}

// Language points mapping
const LANGUAGE_POINTS: Record<number, number> = {
  4: 6,
  5: 6,
  6: 9,
  7: 17,
  8: 23,
  9: 31,
  10: 34,
};

export function calculateLanguagePoints(clb: any, spouse: boolean): number {
  let total = 0;
  for (const skill of ["listening", "reading", "writing", "speaking"]) {
    const level = clb[skill];
    if (!level || !LANGUAGE_POINTS[level]) continue;
    total += LANGUAGE_POINTS[level];
  }
  return total;
}

// Combine all into CRS score
export function calculateCRS({
  age,
  spouse,
  clb,
  education,
  breakdown,
}: {
  age: number;
  spouse: boolean;
  clb: any;
  education: string;
  breakdown: BreakdownRow[];
}) {
  if (!breakdown || breakdown.length === 0) {
    console.warn("Breakdown data is empty or invalid");
    return { agePoints: 0, educationPoints: 0, languagePoints: 0, total: 0 };
  }

  const agePoints = calculateAgePoints(breakdown, age, spouse);
  const educationPoints = calculateEducationPoints(
    breakdown,
    education,
    spouse
  );
  const languagePoints = calculateLanguagePoints(clb, spouse);

  return {
    agePoints,
    educationPoints,
    languagePoints,
    total: agePoints + educationPoints + languagePoints,
  };
}
