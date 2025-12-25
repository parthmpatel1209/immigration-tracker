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
    { label: "Latest Draw", content: <DrawCardsGrid onNavigateToTab={handleTabNavigation} /> },
    { label: "CRS Scores", content: <CRSScoresEnhanced /> },
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
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-all duration-500 pb-[80px] md:pb-0"
    >
      <Header />

      <section id="tabs-section" className="max-w-[1600px] mx-auto px-0 md:px-4 pb-8 mt-4 md:mt-8">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-transparent rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
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