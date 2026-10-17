// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/Tabs";
import CRSScoresEnhanced from "@/components/CRSScoresEnhanced";
import CRSFilter from "@/components/CRSFilter";
import ImmigrationNews from "@/components/ImmigrationNews/ImmigrationNews";
import PRPathways from "@/components/pr-pathways/PRPathways";
import SiteHeader from "@/components/shell/SiteHeader";
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

  // Deep links: /#calculator, /#latest-draw … (also keeps the URL shareable)
  const slug = (label: string) =>
    label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      const i = tabs.findIndex((t) => slug(t.label) === h);
      if (i > -1) setActiveIndex(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = activeIndex === 0 ? "" : `#${slug(tabs[activeIndex].label)}`;
    if (window.location.hash !== h) {
      window.history.replaceState(null, "", window.location.pathname + h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleContactClick = () => {
    // Re-use logic for contact button in footer
    handleTabNavigation("Contact");
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <SiteHeader
        tabs={tabs}
        activeIndex={activeIndex}
        onTabChange={goTo}
        onAlerts={() => handleTabNavigation("Early Access")}
      />

      <section id="tabs-section" className="site-wrap">
        <Tabs tabs={tabs} activeIndex={activeIndex} />
      </section>

      <Footer onNavigateToContact={handleContactClick} onNavigate={(t) => { handleTabNavigation(t); }} />

      <MobileBottomNav
        tabs={tabs}
        activeIndex={activeIndex}
        onTabChange={setActiveIndex}
      />
    </div>
  );
}
