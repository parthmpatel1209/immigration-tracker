// components/calculator/CRSCalculator.tsx
import CalculatorForm from "./CalculatorForm"; // default import
import ResultsDisplay from "./ResultsDisplay"; // default import
import PathwayCard from "./PathwayCard"; // default import
import ShareScoreButton from "./ShareScoreButton";

export default function CRSCalculator() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Express Entry CRS Calculator 2025
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          100% accurate • Updates instantly when IRCC changes rules • Real
          pathway matches
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        <CalculatorForm />
        <ResultsDisplay />
      </div>
    </div>
  );
}
