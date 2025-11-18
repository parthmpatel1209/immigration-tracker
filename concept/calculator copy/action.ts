// app/calculate/action.ts
"use server";

import { supabase } from "@/lib/supabase-server";

const cache = new Map<string, any>();
const getCached = async <T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> => {
  if (cache.has(key)) return cache.get(key);
  const data = await fetcher();
  cache.set(key, data);
  return data;
};

export async function simulatePathwaysAction(input: any) {
  const pointsData = await getCached("points", () =>
    supabase
      .from("crs_points_breakdown")
      .select("*")
      .then((r) => r.data || [])
  );
  const pathways = await getCached("pathways", () =>
    supabase
      .from("pr_pathways")
      .select("*")
      .eq("is_active", true)
      .then((r) => r.data || [])
  );

  const points = (factor: string, key: string, withSpouse = false) => {
    const row = pointsData.find(
      (r: any) => r.factor === factor && r.level_key === key
    );
    if (!row) return 0;
    return withSpouse ? row.points_with_spouse : row.points_no_spouse;
  };

  const ageToKey = (age: number) =>
    age < 18
      ? "17_or_less"
      : age <= 29
      ? "20-29"
      : age >= 45
      ? "45+"
      : age.toString();
  const workYearsToKey = (years: number) =>
    years === 0
      ? "none"
      : years === 1
      ? "1_year"
      : years === 2
      ? "2_years"
      : years >= 5
      ? "5_plus"
      : years >= 3
      ? "3_years"
      : "4_years";

  const clbToPoints = (scores: number[], maxPer: number, totalMax: number) => {
    const pts = scores.map((clb) =>
      clb >= 10
        ? maxPer
        : clb === 9
        ? Math.round(maxPer * 0.91)
        : clb === 8
        ? Math.round(maxPer * 0.68)
        : clb === 7
        ? Math.round(maxPer * 0.5)
        : 0
    );
    return Math.min(
      pts.reduce((a, b) => a + b, 0),
      totalMax
    );
  };

  let score = 0;
  const hasSpouse = input.hasSpouse;

  // Core
  score += points("age", ageToKey(input.age), hasSpouse);
  score += points("education", input.education, hasSpouse);
  score += clbToPoints(
    input.firstLanguageCLB,
    hasSpouse ? 32 : 34,
    hasSpouse ? 128 : 136
  );
  score += points(
    "canadian_work_experience",
    workYearsToKey(input.canadianWorkYears),
    hasSpouse
  );

  // Spouse
  if (hasSpouse && input.spouseEducation) {
    score += points("education", input.spouseEducation, true);
    score += clbToPoints(input.spouseFirstLanguageCLB || [0, 0, 0, 0], 5, 20);
  }

  // Transferability (simplified)
  const langMax = Math.max(...input.firstLanguageCLB);
  if (langMax >= 9) score += 50;
  else if (langMax >= 7) score += 25;
  if (input.canadianWorkYears >= 2) score += 50;
  else if (input.canadianWorkYears >= 1) score += 25;

  // Additional
  if (input.hasSiblingInCanada) score += 15;
  if (input.hasFrenchNCLC7Plus) score += 50;
  if (input.hasCanadianEducationLong) score += 30;
  else if (input.hasCanadianEducation) score += 15;
  if (input.hasValidJobOffer) score += 50; // or 200 if LMIA

  const crs_score = Math.min(score, 1200);

  const matches = pathways
    .filter((p: any) => crs_score >= (p.crs_cutoff || 0))
    .map((p: any) => {
      const buffer = crs_score - (p.crs_cutoff || 0);
      const chance =
        buffer >= 80
          ? "very_high"
          : buffer >= 50
          ? "high"
          : buffer >= 30
          ? "medium"
          : buffer >= 10
          ? "low"
          : "very_low";
      return {
        ...p,
        chance_next_6_months:
          input.hasFrenchNCLC7Plus && chance !== "very_high" ? "high" : chance,
        buffer,
      };
    })
    .sort(
      (a: any, b: any) =>
        "very_high high medium low very_low".indexOf(b.chance_next_6_months) -
        "indexOf"(a.chance_next_6_months)
    );

  return {
    crs_score,
    best_match: matches[0],
    matches,
    recommended_actions: [
      crs_score >= 500 ? "Extremely competitive!" : "Room to improve",
      input.hasFrenchNCLC7Plus
        ? "French bonus applied!"
        : "Learn French = +50 points",
    ],
  };
}
