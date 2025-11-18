// components/calculator/ResultsDisplay.tsx  ← FINAL FIXED VERSION
"use client";

import { useEffect, useState } from "react";
import PathwayCard from "./PathwayCard";
import ShareScoreButton from "./ShareScoreButton";

export default function ResultsDisplay() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const update = () => {
      const latest = (window as any).__CALC_RESULT__;
      setResult(latest || null);
    };
    update();
    window.addEventListener("calc-updated", update);
    return () => window.removeEventListener("calc-updated", update);
  }, []);

  if (!result) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
        <p className="text-xl text-gray-500">
          Fill the form → see your real chances instantly
        </p>
      </div>
    );
  }

  const { crs_score, best_match, matches, recommended_actions } = result;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
        <p className="text-2xl mb-2">Your CRS Score</p>
        <p className="text-6xl font-bold">{crs_score}</p>
        <p className="text-lg mt-4 opacity-90">
          {crs_score >= 500
            ? "Extremely competitive"
            : crs_score >= 470
            ? "Strong"
            : "Room to improve"}
        </p>
      </div>

      {best_match && (
        <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-500 rounded-2xl p-6">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300 text-center mb-3">
            Best Match Right Now
          </p>
          <PathwayCard pathway={best_match} isBest />
        </div>
      )}

      {matches && matches.length > 1 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Other Possible Pathways</h3>
          <div className="grid gap-4">
            {matches.slice(1, 6).map((p: any) => (
              <PathwayCard key={p.pathway_id} pathway={p} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl p-6">
        <h4 className="font-bold text-lg mb-3">Quick Tips for You</h4>
        <ul className="space-y-2">
          {recommended_actions?.map((tip: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-600">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      <ShareScoreButton score={crs_score} bestMatch={best_match?.name} />
    </div>
  );
}
