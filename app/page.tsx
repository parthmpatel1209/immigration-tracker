// app/page.tsx
"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs";
import CRSScoresEnhanced from "@/components/CRSScoresEnhanced";
import CRSFilter from "@/components/CRSFilter";
import ImmigrationNews from "@/components/ImmigrationNews/ImmigrationNews";
import PRPathways from "@/components/pr-pathways/PRPathways";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawCardsGrid from "@/components/DrawCardsGrid";
import Donate from "@/components/Donate";
import ContactForm from "@/components/ContactForm";
import Calculator from "@/components/calculator/Calculator";
import ImmigrationFAQComponent from "@/components/ImmigrationFAQComponent";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import Home from "@/components/Home";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper to find tab index by name and switch
  const handleTabNavigation = (tabName: string) => {
    const index = tabs.findIndex((t) => t.label === tabName || (t.label.includes(tabName)));
    if (index !== -1) {
      setActiveIndex(index);
      const tabsSection = document.getElementById("tabs-section");
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const tabs = [
    { label: "Home", content: <Home onNavigateToTab={handleTabNavigation} /> },
    { label: "Latest Draw", content: <DrawCardsGrid /> },
    { label: "CRS Scores", content: <CRSScoresEnhanced /> },
    { label: "Calculator", content: <Calculator />, badge: "New" },
    { label: "What Is...?", content: <ImmigrationFAQComponent />, badge: "New" },
    { label: "News", content: <ImmigrationNews /> },
    { label: "PR Pathways", content: <PRPathways /> },
    {
      label: "Early Access",
      content: <WaitlistForm />,
      badge: "Free",
    },
    { label: "Support", content: <Donate /> },
    { label: "Contact", content: <ContactForm /> },
  ];

  const handleContactClick = () => {
    // Re-use logic for contact button in footer
    handleTabNavigation("Contact");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-all duration-500">
      <Header />

      <section id="tabs-section" className="max-w-7xl mx-auto px-4 pb-16">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tabs
            tabs={tabs}
            activeIndex={activeIndex}
            onTabChange={setActiveIndex}
          />
        </div>
      </section>

      <Footer onNavigateToContact={handleContactClick} />
    </main>
  );
}