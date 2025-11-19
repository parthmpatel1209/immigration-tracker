"use client";

import Tabs from "@/components/Tabs";
import DrawsTable from "@/components/DrawsTable";
import CRSFilter from "@/components/CRSFilter";
import ImmigrationNews from "@/components/ImmigrationNews/ImmigrationNews";
import PRPathways from "@/components/PRPathways";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawCardsGrid from "@/components/DrawCardsGrid";
import FAQs from "@/components/FAQs";
import Donate from "@/components/Donate";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  const tabs = [
    { label: "Latest Draw", content: <DrawCardsGrid /> },
    { label: "CRS Scores", content: <DrawsTable /> },

    { label: "News", content: <ImmigrationNews /> },
    { label: "PR Pathways", content: <PRPathways /> },
    { label: "FAQs", content: <FAQs /> },
    { label: "Support", content: <Donate /> },
    { label: "Contact Us", content: <ContactForm /> },
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

      {/* Footer */}
      <Footer />
    </main>
  );
}
