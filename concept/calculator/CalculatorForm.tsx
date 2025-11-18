// components/calculator/CalculatorForm.tsx
"use client";

import { useState } from "react";
import { simulatePathwaysAction } from "@/app/api/calculator/action";

export default function CalculatorForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: 29,
    education: "bachelors",
    listening: 8,
    reading: 8,
    writing: 7.5,
    speaking: 7.5,
    hasFrench: false,
    frenchAll7Plus: false,
    canadianWork: 0,
    hasSpouse: false,
    spouseEducation: "bachelors",
    spouseCLB: 7,
    hasJobOffer: false,
    hasCanadianStudy: false,
    hasSibling: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const input = {
      age: formData.age,
      education: formData.education,
      firstLanguageCLB: [
        formData.listening,
        formData.reading,
        formData.writing,
        formData.speaking,
      ],
      hasFrenchNCLC7Plus: formData.hasFrench && formData.frenchAll7Plus,
      canadianWorkYears: formData.canadianWork,
      hasSpouse: formData.hasSpouse,
      spouseEducation: formData.hasSpouse
        ? formData.spouseEducation
        : undefined,
      spouseFirstLanguageCLB: formData.hasSpouse
        ? Array(4).fill(formData.spouseCLB)
        : undefined,
      hasValidJobOffer: formData.hasJobOffer,
      hasCanadianEducation: formData.hasCanadianStudy,
      hasCanadianEducationLong: formData.hasCanadianStudy,
      hasSiblingInCanada: formData.hasSibling,
    };

    const result = await simulatePathwaysAction(input);

    window.__CALC_RESULT__ = result;
    setLoading(false);
    window.dispatchEvent(new Event("calc-updated"));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Your Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            min="18"
            max="55"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: +e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Education Level
          </label>
          <select
            value={formData.education}
            onChange={(e) =>
              setFormData({ ...formData, education: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="secondary">High School</option>
            <option value="one_year">1-year Diploma</option>
            <option value="two_year">2-year Diploma</option>
            <option value="bachelors">Bachelor’s Degree</option>
            <option value="masters">Master’s Degree</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        {/* English Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Listening</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={formData.listening}
              onChange={(e) =>
                setFormData({ ...formData, listening: +e.target.value })
              }
              className="w-full px-3 py-2 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reading</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={formData.reading}
              onChange={(e) =>
                setFormData({ ...formData, reading: +e.target.value })
              }
              className="w-full px-3 py-2 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Writing</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={formData.writing}
              onChange={(e) =>
                setFormData({ ...formData, writing: +e.target.value })
              }
              className="w-full px-3 py-2 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Speaking</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={formData.speaking}
              onChange={(e) =>
                setFormData({ ...formData, speaking: +e.target.value })
              }
              className="w-full px-3 py-2 rounded border"
            />
          </div>
        </div>

        {/* Quick bonuses */}
        <div className="space-y-4 pt-4 border-t dark:border-gray-700">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.hasFrench}
              onChange={(e) =>
                setFormData({ ...formData, hasFrench: e.target.checked })
              }
            />
            <span>I have French (NCLC 7+ in all 4)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.hasJobOffer}
              onChange={(e) =>
                setFormData({ ...formData, hasJobOffer: e.target.checked })
              }
            />
            <span>Valid job offer in Canada</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.hasCanadianStudy}
              onChange={(e) =>
                setFormData({ ...formData, hasCanadianStudy: e.target.checked })
              }
            />
            <span>Studied in Canada (1+ year)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.hasSibling}
              onChange={(e) =>
                setFormData({ ...formData, hasSibling: e.target.checked })
              }
            />
            <span>Sibling in Canada (citizen/PR)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-70"
        >
          {loading ? "Calculating..." : "Calculate My Score"}
        </button>
      </form>
    </div>
  );
}
