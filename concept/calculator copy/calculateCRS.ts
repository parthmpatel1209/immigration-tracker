import { supabase } from "@/lib/supabase-server";

// In-memory cache (server-side only)
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedReference = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60 * 60 * 24 // 24 hours
): Promise<T> => {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttlSeconds * 1000) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
};

export const calculateCRS = async (input: any): Promise<number> => {
  const { hasSpouse, hasProvincialNomination = false } = input;

  const [pointsData, rules] = await Promise.all([
    getCachedReference("crs_points", async () => {
      const { data } = await supabase.from("crs_points_breakdown").select("*");
      return data || [];
    }),
    getCachedReference("crs_rules", async () => {
      const { data } = await supabase.from("crs_rules").select("*").single();
      return data;
    }),
  ]);

  const points = (factor: string, key: string, withSpouse = false) => {
    const row = pointsData.find(
      (r: any) => r.factor === factor && r.level_key === key
    );
    if (!row) return 0;
    return withSpouse ? row.points_with_spouse : row.points_no_spouse;
  };

  let core = 0;
  let spouse = 0;
  let transferability = 0;
  let additional = 0;

  // A. Core Human Capital
  core += points("age", ageToKey(input.age), hasSpouse);
  core += points("education", input.education, hasSpouse);
  core += clbToPoints(
    input.firstLanguageCLB,
    hasSpouse ? 32 : 34,
    hasSpouse ? 128 : 136
  );
  core += points(
    "canadian_work_experience",
    workYearsToKey(input.canadianWorkYears),
    hasSpouse
  );

  // B. Spouse Factors
  if (hasSpouse && input.spouseEducation && input.spouseFirstLanguageCLB) {
    spouse += points("education", input.spouseEducation, true);
    spouse += clbToPoints(input.spouseFirstLanguageCLB, 5, 20);
  }

  // C. Skill Transferability (max 100)
  const langMax = Math.max(...input.firstLanguageCLB);
  if (langMax >= 9) transferability += 50;
  else if (langMax >= 7) transferability += 25;

  if (input.canadianWorkYears >= 2) transferability += 50;
  else if (input.canadianWorkYears >= 1) transferability += 25;

  transferability = Math.min(transferability, 100);

  // D. Additional Points
  if (input.hasSiblingInCanada) additional += 15;
  if (input.hasFrenchNCLC7Plus)
    additional += input.firstLanguageCLB.some((s: number) => s >= 7) ? 50 : 25;
  if (input.hasCanadianEducationLong) additional += 30;
  else if (input.hasCanadianEducation) additional += 15;
  if (hasProvincialNomination) additional += 600;

  return Math.min(core + spouse + transferability + additional, 1200);
};

// Helpers (same as before)
const ageToKey = (age: number): string => {
  if (age < 18) return "17_or_less";
  if (age <= 29) return "20-29";
  if (age >= 45) return "45+";
  return age.toString();
};

const workYearsToKey = (years: number): string => {
  if (years === 0) return "none";
  if (years === 1) return "1_year";
  if (years === 2) return "2_years";
  if (years >= 5) return "5_plus";
  return years >= 3 ? "3_years" : "4_years";
};

const clbToPoints = (
  scores: number[],
  maxPerAbility: number,
  sectionMax: number
): number => {
  const pointsPerAbility = scores.map((clb) => {
    if (clb >= 10) return maxPerAbility;
    if (clb === 9) return Math.round(maxPerAbility * 0.91);
    if (clb === 8) return Math.round(maxPerAbility * 0.68);
    if (clb === 7) return Math.round(maxPerAbility * 0.5);
    return 0;
  });
  return Math.min(
    pointsPerAbility.reduce((a, b) => a + b, 0),
    sectionMax
  );
};
