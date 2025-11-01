"use client";

import Tabs from "@/components/Tabs";
import DrawsTable from "@/components/DrawsTable";
import CRSFilter from "@/components/CRSFilter";
import ImmigrationNews from "@/components/ImmigrationNews";
import PRPathways from "@/components/PRPathways";
import Header from "@/components/Header";
import DrawCardsGrid from "@/components/DrawCardsGrid";

export default function HomePage() {
  const tabs = [
    { label: "Latest Draw", content: <DrawCardsGrid /> },
    { label: "CRS Scores", content: <DrawsTable /> },
    { label: "Immigration News", content: <ImmigrationNews /> },
    { label: "PR Pathways by Province", content: <PRPathways /> },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <Tabs tabs={tabs} />
        </div>
      </div>
      <div></div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-6 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Canadian Immigration Tracker
      </footer>
    </main>
  );
}
