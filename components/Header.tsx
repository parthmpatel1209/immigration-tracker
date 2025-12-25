// components/Header.tsx
"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

/* ---------- ALL ICONS ---------- */
import BearIcon from "@/icons/bear.png";
import MooseIcon from "@/icons/moose.png";
import CanadaIcon from "@/icons/canada.png";
import CnTowerIcon from "@/icons/cntower.png";
import FlagIcon from "@/icons/flag.png";
import IcehockeyIcon from "@/icons/icehockey.png";
import MapleIcon from "@/icons/maple.png";
import BeaverIcon from "@/icons/beaver.png";
import AeroplanIcon from "@/icons/aeroplane.png";
import ImmigrationIcon from "@/icons/immigrationofficer.png";
import PassportIcon from "@/icons/passport.png";

const ICONS = [
  { src: BearIcon, alt: "Bear" },
  { src: MooseIcon, alt: "Moose" },
  { src: CanadaIcon, alt: "Canada" },
  { src: CnTowerIcon, alt: "CN Tower" },
  { src: FlagIcon, alt: "Flag" },
  { src: IcehockeyIcon, alt: "Ice Hockey" },
  { src: MapleIcon, alt: "Maple" },
  { src: BeaverIcon, alt: "Beaver" },
  { src: AeroplanIcon, alt: "Aeroplan" },
  { src: ImmigrationIcon, alt: "Immigration Officer" },
  { src: PassportIcon, alt: "Passport" },
] as const;

/* -------------------------------------------------
   POSITIONING LOGIC – spread out + minimum distance
   ------------------------------------------------- */
const MIN_GAP_PERCENT = 9; // ~90px on 1000px screen

function generatePositions(count: number) {
  const positions: { top: string; left: string }[] = [];

  const tryPlace = (attempts = 0): void => {
    if (attempts > 1000) return; // safety

    const top = Math.random() * 80 + 10; // 10% → 90%
    const left = Math.random() * 100;

    const tooClose = positions.some((p) => {
      const dx = left - parseFloat(p.left);
      const dy = top - parseFloat(p.top);
      return Math.hypot(dx, dy) < MIN_GAP_PERCENT;
    });

    if (!tooClose) {
      positions.push({ top: `${top}%`, left: `${left}%` });
    } else {
      tryPlace(attempts + 1);
    }
  };

  // Place all icons
  for (let i = 0; i < count; i++) {
    tryPlace();
  }

  return positions;
}

import styles from "./Header.module.css";

export default function Header() {
  const [positions, setPositions] = useState<{ top: string; left: string; startOffset: string }[]>([]);
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode with Tabs (detects class="dark" on <html>)
  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsDark(root.classList.contains("dark"));
    check();

    const observer = new MutationObserver(check);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Generate icon positions only on client
  useEffect(() => {
    const newPositions = generatePositions(ICONS.length).map(pos => ({
      ...pos,
      startOffset: `${Math.random() * 100}vh`
    }));
    setPositions(newPositions);
  }, []);

  return (
    <header className={styles.root}>
      {/* ---------- FLOATING ICONS ---------- */}
      <div className={styles.floaters}>
        {positions.map((pos, i) => {
          const icon = ICONS[i];
          return (
            <div
              key={i}
              className={styles.floater}
              style={
                {
                  top: pos.top,
                  left: pos.left,
                  "--duration": `${25 + i * 1.5}s`, // 25–40s cycle
                  "--start-y": pos.startOffset, // Random entry point
                } as React.CSSProperties
              }
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={32}
                height={32}
                className={styles.icon}
                unoptimized
              />
            </div>
          );
        })}
      </div>
      {/* ---------- GLASS CARD ---------- */}
      <div className={styles.glass}>
        <div className={styles.glow} />

        <h1 className={styles.title}>Canada Immigration Data Tracker</h1>

        <p className={styles.subtitle}>
          Latest updates on CRS scores and immigration draws
        </p>
      </div>
    </header>
  );
}
