// components/calculator/PathwayCard.tsx
export default function PathwayCard({
  pathway,
  isBest = false,
}: {
  pathway: any;
  isBest?: boolean;
}) {
  const chanceColor =
    {
      very_high: "bg-green-500",
      high: "bg-emerald-500",
      medium: "bg-yellow-500",
      low: "bg-orange-500",
      very_low: "bg-red-500",
    }[pathway.chance_next_6_months] || "bg-gray-500";

  // Safe access — no crash if result not ready
  const currentResult =
    (typeof window !== "undefined" && (window as any).__CALC_RESULT__) || null;
  const buffer = currentResult
    ? currentResult.crs_score - pathway.crs_cutoff
    : 0;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 ${
        isBest ? "border-green-500" : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold">{pathway.name}</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {pathway.province} • {pathway.stream}
          </p>
        </div>
        {isBest && (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Best
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Cutoff</p>
          <p className="font-bold text-lg">{pathway.crs_cutoff}</p>
        </div>
        <div>
          <p className="text-gray-500">Your Buffer</p>
          <p className="font-bold text-lg text-green-600">
            {buffer > 0 ? `+${buffer}` : buffer}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Chance in next 6 months</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`${chanceColor} h-full transition-all`}
              style={{
                width:
                  pathway.chance_next_6_months === "very_high"
                    ? "100%"
                    : pathway.chance_next_6_months === "high"
                    ? "80%"
                    : pathway.chance_next_6_months === "medium"
                    ? "60%"
                    : pathway.chance_next_6_months === "low"
                    ? "40%"
                    : "20%",
              }}
            />
          </div>
          <span className="font-bold capitalize">
            {pathway.chance_next_6_months.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
