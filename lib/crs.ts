// /lib/crs.ts
// Fully rewritten to match the DB schema and official CRS rules exactly.

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

// -------------------------------------------------------
// CLB Conversion
// -------------------------------------------------------
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

export function convertIeltsToCLB(
  benchmarks: any[],
  scores: any,
  testType: string = "IELTS General Training"
) {
  const result: Record<string, number | null> = {
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
  };

  const skills = ["listening", "reading", "writing", "speaking"] as const;

  for (const row of benchmarks) {
    if (row.test_name !== testType) continue;

    for (const skill of skills) {
      if (result[skill] !== null) continue;

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

// -------------------------------------------------------
// DB Lookup
// -------------------------------------------------------
export function getPointsFor(
  breakdown: BreakdownRow[],
  factor: string,
  levelKey: string,
  spouse: boolean
): number {
  if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
    console.warn(`Invalid or empty breakdown for factor: ${factor}, key: ${levelKey}`);
    return 0;
  }

  const row = breakdown.find((r) => r.factor === factor && r.level_key === levelKey);
  if (!row) {
    console.warn(
      `No row for factor="${factor}", key="${levelKey}". Available:`,
      breakdown.filter((r) => r.factor === factor).map((r) => r.level_key)
    );
    return 0;
  }
  return spouse ? row.points_with_spouse : row.points_no_spouse;
}

// -------------------------------------------------------
// 1. Age  (DB factor: "age")
// Keys: 17_or_less, 18, 19, 20_to_29, 30..44, 45_or_more
// -------------------------------------------------------
export function calculateAgePoints(
  breakdown: BreakdownRow[],
  age: number,
  spouse: boolean
): number {
  if (!Number.isInteger(age) || age < 0) return 0;

  let key: string;
  if (age <= 17)       key = "17_or_less";
  else if (age <= 19)  key = String(age);          // "18" | "19"
  else if (age <= 29)  key = "20_to_29";           // peak band
  else if (age <= 44)  key = String(age);           // "30".."44"
  else                 key = "45_or_more";

  return getPointsFor(breakdown, "age", key, spouse);
}

// -------------------------------------------------------
// 2. Education  (DB factor: "education")
// Keys: less_than_secondary, highschool, college_1_year, college_2_year,
//       bachelors_or_three_year, college_3_year, two_or_more, masters, phd
// Note: "bachelors" form value → "bachelors_or_three_year" DB key
//       "college_3_year" form value → "college_3_year" DB key (already correct)
// -------------------------------------------------------
function mapEducationKey(edu: string): string {
  switch (edu) {
    case "phd":            return "phd";
    case "masters":        return "masters";
    case "two_or_more":    return "two_or_more";
    case "bachelors":      return "bachelors_or_three_year";
    case "college_3_year": return "college_3_year";
    case "college_2_year": return "college_2_year";
    case "college_1_year": return "college_1_year";
    case "highschool":     return "highschool";
    default:               return "less_than_secondary";
  }
}

export function calculateEducationPoints(
  breakdown: BreakdownRow[],
  levelKey: string,
  spouse: boolean
): number {
  if (!levelKey || typeof levelKey !== "string") return 0;
  const dbKey = mapEducationKey(levelKey);
  return getPointsFor(breakdown, "education", dbKey, spouse);
}

// -------------------------------------------------------
// 3a. First / Spouse Language Points  (DB: "first_language" / "spouse_first_language")
// Keys per ability: less_than_clb4, clb4_or5, clb6, clb7, clb8, clb9, clb10_or_more
// -------------------------------------------------------
function getFirstLangKey(level: number): string {
  if (level >= 10) return "clb10_or_more";
  if (level === 9)  return "clb9";
  if (level === 8)  return "clb8";
  if (level === 7)  return "clb7";
  if (level === 6)  return "clb6";
  if (level >= 4)   return "clb4_or5";
  return "less_than_clb4";
}

// Spouse first language keys (DB factor: "spouse_first_language"):
// clb4_or_less, clb5_or6, clb7_or8, clb9_or_more
function getSpouseLangKey(level: number): string {
  if (level >= 9) return "clb9_or_more";
  if (level >= 7) return "clb7_or8";
  if (level >= 5) return "clb5_or6";
  return "clb4_or_less";
}

export function calculateLanguagePoints(
  breakdown: BreakdownRow[],
  clb: Record<string, number | null>,
  spouse: boolean,
  factor: string = "first_language"
): number {
  let total = 0;
  const isSpouseFactor = factor === "spouse_first_language";
  for (const skill of ["listening", "reading", "writing", "speaking"]) {
    const level = clb[skill] ?? 0;
    const key = isSpouseFactor ? getSpouseLangKey(level) : getFirstLangKey(level);
    total += getPointsFor(breakdown, factor, key, spouse);
  }
  return total;
}

// -------------------------------------------------------
// 3b. Second Language Points  (DB factor: "second_language")
// Keys per ability: clb4_or_less, clb5_or6, clb7_or8, clb9_or_more
// Max 6 pts/ability → max 24 pts single, 22 pts with spouse
// -------------------------------------------------------
export function calculateSecondLanguagePoints(
  breakdown: BreakdownRow[],
  clb: Record<string, number | null>,
  spouse: boolean
): number {
  let total = 0;
  for (const skill of ["listening", "reading", "writing", "speaking"]) {
    const level = clb[skill] ?? 0;
    let key = "clb4_or_less";
    if (level >= 9)      key = "clb9_or_more";
    else if (level >= 7) key = "clb7_or8";
    else if (level >= 5) key = "clb5_or6";
    total += getPointsFor(breakdown, "second_language", key, spouse);
  }
  // Cap: max 24 single, 22 with spouse
  return Math.min(total, spouse ? 22 : 24);
}

// -------------------------------------------------------
// 4. Canadian Work Experience  (DB factor: "canadian_work_experience")
// Keys: none, 1_year, 2_years, 3_years, 4_years, 5_plus
// -------------------------------------------------------
export function calculateCanadianWorkPoints(
  breakdown: BreakdownRow[],
  years: number,
  spouse: boolean
): number {
  let key = "none";
  if (years >= 5)      key = "5_plus";
  else if (years === 4) key = "4_years";
  else if (years === 3) key = "3_years";
  else if (years === 2) key = "2_years";
  else if (years === 1) key = "1_year";

  return getPointsFor(breakdown, "canadian_work_experience", key, spouse);
}

// -------------------------------------------------------
// 5. Spouse Education  (DB factor: "spouse_education")
// Keys: less_than_secondary, secondary, one_year, two_year,
//       bachelor_or_three_year, two_or_more_with_three_year,
//       masters_or_professional, phd
// -------------------------------------------------------
export function calculateSpouseEducationPoints(
  breakdown: BreakdownRow[],
  education: string
): number {
  if (!education) return 0;
  let key: string;
  switch (education) {
    case "phd":            key = "phd"; break;
    case "masters":        key = "masters_or_professional"; break;
    case "two_or_more":    key = "two_or_more_with_three_year"; break;
    case "bachelors":
    case "college_3_year": key = "bachelor_or_three_year"; break;
    case "college_2_year": key = "two_year"; break;
    case "college_1_year": key = "one_year"; break;
    case "highschool":     key = "secondary"; break;
    default:               key = "less_than_secondary"; break;
  }
  return getPointsFor(breakdown, "spouse_education", key, true);
}

export function calculateSpouseCanadianWorkPoints(
  breakdown: BreakdownRow[],
  years: number
): number {
  let key = "none_or_less_than1";
  if (years >= 5)      key = "5_or_more";
  else if (years === 4) key = "4_years";
  else if (years === 3) key = "3_years";
  else if (years === 2) key = "2_years";
  else if (years === 1) key = "1_year";
  return getPointsFor(breakdown, "spouse_canadian_work_experience", key, true);
}

// -------------------------------------------------------
// 6. Skill Transferability  (Max 100)
//
// DB factors and their keys:
//
// skill_transferability_education_language:
//   postsec_1yr_clb7_less9 (13), postsec_1yr_clb9_plus (25),
//   two_or_more_postsec_clb7_less9 (25), two_or_more_postsec_clb9_plus (50),
//   masters_prof_clb7_less9 (25), masters_prof_clb9_plus (50),
//   phd_clb7_less9 (25), phd_clb9_plus (50)
//
// skill_transferability_education_canadian_work:
//   postsec_1yr_cad_1yr (13), postsec_1yr_cad_2plus (25),
//   two_or_more_postsec_cad_1yr (25), two_or_more_postsec_cad_2plus (50),
//   masters_prof_cad_1yr (25), masters_prof_cad_2plus (50),
//   phd_cad_1yr (25), phd_cad_2plus (50)
//
// skill_transferability_foreign_work_language:
//   foreign_1or2_clb7_less9 (13), foreign_1or2_clb9_plus (25),
//   foreign_3plus_clb7_less9 (25), foreign_3plus_clb9_plus (50)
//
// skill_transferability_foreign_work_canadian_work:
//   foreign_1or2_cad_1yr (13), foreign_1or2_cad_2plus (25),
//   foreign_3plus_cad_1yr (25), foreign_3plus_cad_2plus (50)
//
// skill_transferability_certificate_language:
//   trade_clb5_less7 (25), trade_clb7_plus (50)
//
// Rule: Education subtotal (A+B) capped at 50.
//       Foreign work subtotal (C+D) capped at 50.
//       Certificate (E) is its own bucket, capped at 50.
//       Grand total capped at 100.
// -------------------------------------------------------

function getEduTransferabilityPrefix(edu: string): string | null {
  switch (edu) {
    case "phd":                       return "phd";
    case "masters":                   return "masters_prof";
    case "two_or_more":
    case "bachelors":
    case "college_3_year":
    case "college_2_year":
    case "college_1_year":            return "postsec_1yr";
    default:                          return null; // less than secondary / highschool = no transferability
  }
}

// Maps education to the correct DB prefix for education+language and education+canadian work
function getEduPrefix(edu: string): string | null {
  switch (edu) {
    case "phd":            return "phd";
    case "masters":        return "masters_prof";
    case "two_or_more":    return "two_or_more_postsec";
    case "bachelors":
    case "college_3_year": return "two_or_more_postsec"; // 3-year bachelor counts as two_or_more_postsec? 
    // Actually for skill transferability, "bachelor's or 3-yr" = postsec_1yr level per IRCC tables
    // The DB has: postsec_1yr and two_or_more_postsec (which covers Two+, Masters, PhD separately)
    // Official: Any post-secondary = postsec level. "Two or more" = higher band.
    // Bachelors = postsec_1yr in skill transferability (same points as any single degree)
    case "college_2_year":
    case "college_1_year": return "postsec_1yr";
    default:               return null;
  }
}

// Corrected mapping based on official CRS:
// - postsec_1yr: any 1 post-secondary credential (1yr, 2yr, 3yr bachelor, college_3_year)
// - two_or_more_postsec: two or more credentials (one must be 3+ years)
// - masters_prof: master's or professional degree
// - phd: doctoral degree
function getSkillEduPrefix(edu: string): string | null {
  switch (edu) {
    case "phd":            return "phd";
    case "masters":        return "masters_prof";
    case "two_or_more":    return "two_or_more_postsec";
    case "bachelors":
    case "college_3_year":
    case "college_2_year":
    case "college_1_year": return "postsec_1yr";
    default:               return null; // highschool or less = no transferability
  }
}

export function calculateSkillTransferability(
  breakdown: BreakdownRow[],
  clb: Record<string, number | null>,
  education: string,
  canadianYears: number,
  foreignYears: number,
  certificate: boolean
): number {
  const minCLB = Math.min(
    ...(["listening", "reading", "writing", "speaking"].map((s) => clb[s] ?? 0))
  );
  const allClb7 = minCLB >= 7;
  const allClb9 = minCLB >= 9;
  const allClb5 = minCLB >= 5;

  const eduPrefix = getSkillEduPrefix(education);

  // A. Education + Language
  let pointsA = 0;
  if (eduPrefix) {
    let langKey: string | null = null;
    if (allClb9)      langKey = `${eduPrefix}_clb9_plus`;
    else if (allClb7) langKey = `${eduPrefix}_clb7_less9`;
    if (langKey) {
      pointsA = getPointsFor(breakdown, "skill_transferability_education_language", langKey, false);
    }
  }

  // B. Education + Canadian Work
  let pointsB = 0;
  if (eduPrefix && canadianYears >= 1) {
    const cadSuffix = canadianYears >= 2 ? "cad_2plus" : "cad_1yr";
    const cadKey = `${eduPrefix}_${cadSuffix}`;
    pointsB = getPointsFor(breakdown, "skill_transferability_education_canadian_work", cadKey, false);
  }

  // C. Foreign Work + Language
  let pointsC = 0;
  if (foreignYears >= 1) {
    const fwPrefix = foreignYears >= 3 ? "foreign_3plus" : "foreign_1or2";
    let langKey: string | null = null;
    if (allClb9)      langKey = `${fwPrefix}_clb9_plus`;
    else if (allClb7) langKey = `${fwPrefix}_clb7_less9`;
    if (langKey) {
      pointsC = getPointsFor(breakdown, "skill_transferability_foreign_work_language", langKey, false);
    }
  }

  // D. Foreign Work + Canadian Work
  let pointsD = 0;
  if (foreignYears >= 1 && canadianYears >= 1) {
    const fwPrefix = foreignYears >= 3 ? "foreign_3plus" : "foreign_1or2";
    const cadSuffix = canadianYears >= 2 ? "cad_2plus" : "cad_1yr";
    const key = `${fwPrefix}_${cadSuffix}`;
    pointsD = getPointsFor(breakdown, "skill_transferability_foreign_work_canadian_work", key, false);
  }

  // E. Certificate of Qualification + Language
  let pointsE = 0;
  if (certificate) {
    let certKey: string | null = null;
    if (allClb7)      certKey = "trade_clb7_plus";
    else if (allClb5) certKey = "trade_clb5_less7";
    if (certKey) {
      pointsE = getPointsFor(breakdown, "skill_transferability_certificate_language", certKey, false);
    }
  }

  const educationSubtotal    = Math.min(50, pointsA + pointsB);
  const foreignWorkSubtotal  = Math.min(50, pointsC + pointsD);
  const certificateSubtotal  = Math.min(50, pointsE);

  return Math.min(100, educationSubtotal + foreignWorkSubtotal + certificateSubtotal);
}

// -------------------------------------------------------
// 7. Additional Points  (DB factor: "additional")
// Keys:
//   provincial_nomination (600)
//   sibling_canada (15)
//   studies_canada_1_or_2_years (15)
//   studies_canada_3_or_more_years (30)
//   french_nclc7_english_clb5_plus (50)
//   french_nclc7_english_clb4_or_less (25)
// -------------------------------------------------------
export function calculateAdditionalPoints(
  breakdown: BreakdownRow[],
  sibling: boolean,
  frenchCLB: Record<string, number | null> | null,
  englishCLB: Record<string, number | null>,
  educationInCanada: string,
  arrangedEmployment: string, // kept for signature compat but job offer pts removed Mar 25 2025
  nomination: boolean
): number {
  let total = 0;

  // Provincial nomination (600 pts)
  if (nomination) {
    total += getPointsFor(breakdown, "additional", "provincial_nomination", false);
  }

  // Sibling in Canada (15 pts)
  if (sibling) {
    total += getPointsFor(breakdown, "additional", "sibling_canada", false);
  }

  // Education in Canada
  if (educationInCanada === "1_or_2") {
    total += getPointsFor(breakdown, "additional", "studies_canada_1_or_2_years", false);
  } else if (educationInCanada === "3_or_more") {
    total += getPointsFor(breakdown, "additional", "studies_canada_3_or_more_years", false);
  }

  // French language bonus
  // Applies when second language is French (NCLC 7+) with or without English
  if (frenchCLB) {
    const frenchMin = Math.min(
      ...(["listening", "reading", "writing", "speaking"].map((s) => frenchCLB[s] ?? 0))
    );
    if (frenchMin >= 7) {
      const englishMin = Math.min(
        ...(["listening", "reading", "writing", "speaking"].map((s) => englishCLB[s] ?? 0))
      );
      const key = englishMin >= 5
        ? "french_nclc7_english_clb5_plus"
        : "french_nclc7_english_clb4_or_less";
      total += getPointsFor(breakdown, "additional", key, false);
    }
  }

  // NOTE: As of March 25, 2025, arranged employment (LMIA job offer) points are REMOVED.
  // arrangedEmployment parameter is kept for API compatibility but contributes 0 points.

  return Math.min(600, total);
}

// -------------------------------------------------------
// MAIN CALCULATION
// -------------------------------------------------------
export function calculateCRS({
  age,
  spouse,
  clb,
  spouseClb,
  education,
  spouseEducation,
  canadianWorkYears,
  foreignWorkYears,
  certificate,
  secondClb,
  sibling,
  educationInCanada,
  arrangedEmployment,
  nomination,
  breakdown,
}: {
  age: number;
  spouse: boolean;
  clb: any;
  spouseClb?: any;
  education: string;
  spouseEducation?: string;
  canadianWorkYears: number;
  foreignWorkYears: number;
  certificate: boolean;
  secondClb?: any;
  sibling: boolean;
  educationInCanada: string;
  arrangedEmployment: string;
  nomination: boolean;
  breakdown: BreakdownRow[];
}) {
  if (!breakdown || breakdown.length === 0) {
    return {
      agePoints: 0,
      educationPoints: 0,
      languagePoints: 0,
      secondLanguagePoints: 0,
      canadianWorkPoints: 0,
      spouseEducationPoints: 0,
      spouseLanguagePoints: 0,
      spouseCanadianWorkPoints: 0,
      skillTransferabilityPoints: 0,
      additionalPoints: 0,
      total: 0,
    };
  }

  // ── Core / Human Capital ──────────────────────────────
  const agePoints           = calculateAgePoints(breakdown, age, spouse);
  const educationPoints     = calculateEducationPoints(breakdown, education, spouse);
  const languagePoints      = calculateLanguagePoints(breakdown, clb, spouse, "first_language");
  const secondLanguagePoints = secondClb
    ? calculateSecondLanguagePoints(breakdown, secondClb, spouse)
    : 0;
  const canadianWorkPoints  = calculateCanadianWorkPoints(breakdown, canadianWorkYears, spouse);

  // ── Spouse Factors ───────────────────────────────────
  let spouseEducationPoints    = 0;
  let spouseLanguagePoints     = 0;
  let spouseCanadianWorkPoints = 0;

  if (spouse) {
    if (spouseEducation) {
      spouseEducationPoints = calculateSpouseEducationPoints(breakdown, spouseEducation);
    }
    if (spouseClb) {
      spouseLanguagePoints = calculateLanguagePoints(breakdown, spouseClb, true, "spouse_first_language");
    }
    // Spouse Canadian work is not in the form yet → 0
  }

  // ── Core total (capped) ───────────────────────────────
  const coreCap = spouse ? 460 : 500;
  const coreTotal = Math.min(
    coreCap,
    agePoints + educationPoints + languagePoints + secondLanguagePoints + canadianWorkPoints +
    spouseEducationPoints + spouseLanguagePoints + spouseCanadianWorkPoints
  );

  // ── Skill Transferability (Max 100) ───────────────────
  const skillTransferabilityPoints = calculateSkillTransferability(
    breakdown,
    clb,
    education,
    canadianWorkYears,
    foreignWorkYears,
    certificate
  );

  // ── Additional Points (Max 600) ───────────────────────
  // secondClb is used as the "French" CLB when the user enters French as their second language.
  // englishCLB is the applicant's first language CLB.
  const additionalPoints = calculateAdditionalPoints(
    breakdown,
    sibling,
    secondClb ?? null,
    clb,
    educationInCanada,
    arrangedEmployment,
    nomination
  );

  return {
    agePoints,
    educationPoints,
    languagePoints,
    secondLanguagePoints,
    canadianWorkPoints,
    spouseEducationPoints,
    spouseLanguagePoints,
    spouseCanadianWorkPoints,
    skillTransferabilityPoints,
    additionalPoints,
    total: coreTotal + skillTransferabilityPoints + additionalPoints,
  };
}
