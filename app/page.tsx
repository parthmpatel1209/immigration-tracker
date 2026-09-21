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
import MobileBottomNav from "@/components/MobileBottomNav";
import MoreHub from "@/components/MoreHub";
import MyJourney from "@/components/MyJourney/MyJourney";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [crsInitialViewMode, setCrsInitialViewMode] = useState<"table" | "analytics">("table");

  // Helper to find tab index by name and switch
  const handleTabNavigation = (tabName: string, subView?: string) => {
    const index = tabs.findIndex((t) => t.label === tabName || (t.label.includes(tabName)));
    if (index !== -1) {
      setActiveIndex(index);
      if (tabName === "CRS Scores") {
        setCrsInitialViewMode(subView === "analytics" ? "analytics" : "table");
      }
      const tabsSection = document.getElementById("tabs-section");
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const tabs = [
    { label: "Home", content: <Home onNavigateToTab={handleTabNavigation} /> },
    { label: "Latest Draw", content: <DrawCardsGrid onNavigateToTab={handleTabNavigation} /> },
    { label: "CRS Scores", content: <CRSScoresEnhanced onNavigateToTab={handleTabNavigation} initialViewMode={crsInitialViewMode} /> },
    { label: "Calculator", content: <Calculator />, badge: "Popular" },
    { label: "News", content: <ImmigrationNews /> },
    { label: "My Journey", content: <MyJourney /> },
    { label: "More", content: <MoreHub onNavigateToTab={handleTabNavigation} /> },
    // Hidden tabs for direct navigation
    { label: "PR Pathways", content: <PRPathways />, hidden: true },
    { label: "What Is...?", content: <ImmigrationFAQComponent />, hidden: true },
    { label: "Early Access", content: <WaitlistForm />, hidden: true },
    { label: "Support", content: <Donate />, hidden: true },
    { label: "Contact", content: <ContactForm />, hidden: true },
  ];

  const handleContactClick = () => {
    // Re-use logic for contact button in footer
    handleTabNavigation("Contact");
  };

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-[95px] md:pb-0 pt-0"
    >
      <Header />

      <section id="tabs-section" className="max-w-[1540px] mx-auto px-2 md:px-6 pb-12 mt-2 md:mt-4">
        <div className="bg-white/95 dark:bg-[#0f172a]/95 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 overflow-hidden backdrop-blur-md">
          <Tabs
            tabs={tabs}
            activeIndex={activeIndex}
            onTabChange={setActiveIndex}
            hideHeaderOnMobile={true}
          />
        </div>
      </section>

      <Footer onNavigateToContact={handleContactClick} />

      <MobileBottomNav
        tabs={tabs}
        activeIndex={activeIndex}
        onTabChange={setActiveIndex}
      />
    </main>
  );
}