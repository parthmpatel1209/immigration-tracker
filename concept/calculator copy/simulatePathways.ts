import { supabase } from "@/lib/supabase-server";
import { calculateCRS } from "./calculateCRS";

// Reuse the same cache from calculateCRS.ts
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedReference = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60 * 60 * 24
): Promise<T> => {
  const cached = cache.get(key);
  const now = Date.now();
  if (cached && now - cached.timestamp < ttlSeconds * 1000) return cached.data;

  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
};

export const simulatePathways = async (input: any) => {
  const crs_score = await calculateCRS(input);

  const [pathways] = await Promise.all([
    getCachedReference("pathways", async () => {
      const { data } = await supabase
        .from("pr_pathways")
        .select("*")
        .eq("is_active", true);
      return data || [];
    }),
  ]);

  // ... rest of your logic (same as before)
  const matches = pathways
    .filter((p: any) => crs_score >= (p.crs_cutoff || 0))
    .map((p: any) => {
      const buffer = crs_score - (p.crs_cutoff || 0);
      let chance: string;
      if (buffer >= 80) chance = "very_high";
      else if (buffer >= 50) chance = "high";
      else if (buffer >= 30) chance = "medium";
      else if (buffer >= 10) chance = "low";
      else chance = "very_low";

      if (input.hasFrenchNCLC7Plus) {
        chance = chance === "very_high" ? "very_high" : "high";
      }

      return { ...p, chance_next_6_months: chance, buffer };
    })
    .sort((a: any, b: any) => {
      const order = { very_high: 5, high: 4, medium: 3, low: 2, very_low: 1 };
      return order[b.chance_next_6_months] - order[a.chance_next_6_months];
    });

  const best_match = matches[0];

  const recommended_actions = [
    crs_score >= 500 ? "Extremely competitive!" : "Room to improve",
    input.hasFrenchNCLC7Plus
      ? "Your French is a huge bonus!"
      : "Consider learning French (NCLC 7+ = +50 points)",
    best_match
      ? `Best match: ${best_match.province} – ${best_match.program}`
      : "Try getting a job offer or PNP",
  ];

  return { crs_score, matches, best_match, recommended_actions };
};
