// app/page.tsx or app/HomePage.tsx
"use client";

import Tabs from "@/components/Tabs";
import CRSScoresEnhanced from "@/components/CRSScoresEnhanced";
import CRSFilter from "@/components/CRSFilter";
import ImmigrationNews from "@/components/ImmigrationNews/ImmigrationNews";
import PRPathways from "@/components/pr-pathways/PRPathways";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawCardsGrid from "@/components/DrawCardsGrid";
//import FAQs from "@/components/FAQs";
import Donate from "@/components/Donate";
import ContactForm from "@/components/ContactForm";
import Calculator from "@/components/calculator/Calculator";
import ImmigrationFAQComponent from "@/components/ImmigrationFAQComponent";

export default function HomePage() {
  const tabs = [
    { label: "Latest Draw", content: <DrawCardsGrid /> },
    { label: "CRS Scores", content: <CRSScoresEnhanced /> },
    { label: "Calculator", content: <Calculator />, badge: "New" },
    { label: "What Is...?", content: <ImmigrationFAQComponent />, badge: "New" },
    { label: "News", content: <ImmigrationNews /> },
    { label: "PR Pathways", content: <PRPathways /> },
    //{ label: "FAQs", content: <FAQs /> },
    { label: "Support", content: <Donate /> },
    { label: "Contact", content: <ContactForm /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-all duration-500">
      {/* Header */}
      <Header />

      {/* Main Tabbed Content */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tabs tabs={tabs} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
