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

export default function Header() {
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

  // Generate icon positions once on mount
  const positions = useMemo(() => generatePositions(ICONS.length), []);

  return (
    <header className="__header__root">
      {/* ---------- FLOATING ICONS ---------- */}
      <div className="__header__floaters">
        {ICONS.map((icon, i) => {
          const pos = positions[i];
          const startOffset = Math.random() * 100; // Random starting point below screen

          return (
            <div
              key={i}
              className="__header__floater"
              style={
                {
                  top: pos?.top ?? "50%",
                  left: pos?.left ?? "50%",
                  "--duration": `${25 + i * 1.5}s`, // 25–40s cycle
                  "--start-y": `${startOffset}vh`, // Random entry point
                } as React.CSSProperties
              }
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={32}
                height={32}
                className="__header__icon"
                unoptimized
              />
            </div>
          );
        })}
      </div>
      {/* ---------- GLASS CARD ---------- */}
      <div className="__header__glass">
        <div className="__header__glow" />

        <h1 className="__header__title">Canada Express Entry Tracker</h1>

        <p className="__header__subtitle">
          Latest updates on CRS scores and immigration draws
        </p>
      </div>
      {/* ---------- SCOPED GLOBAL CSS ---------- */}
      <style jsx global>{`
        .__header__root {
          display: flex;
          justify-content: center;
          padding: 2rem 1rem 1.5rem;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .__header__floaters {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .__header__floater {
          position: absolute;
          width: 2rem;
          height: 2rem;
          animation: floatUp var(--duration, 20s) linear infinite;
          animation-delay: calc(
            -1 * var(--start-y, 0) / 100 * var(--duration, 20s)
          );
          transform: translateY(var(--start-y, 100vh));
        }

        @keyframes floatUp {
          from {
            transform: translateY(var(--start-y, 100vh));
          }
          to {
            transform: translateY(-100px); /* Exit just above top */
          }
        }

        /* ---------- ICON STYLES ---------- */
        .__header__icon {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          --icon-filter: grayscale(1) brightness(0.7);
          filter: var(--icon-filter) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          transition: filter 0.4s ease;
        }

        .dark .__header__icon {
          --icon-filter: brightness(0) invert(1);
        }

        /* ---------- GLASS CARD ---------- */
        .__header__glass {
          position: relative;
          text-align: center;
          padding: 1.75rem 2rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          max-width: 48rem;
          width: 100%;
          overflow: hidden;
          transition: all 0.4s ease;
          z-index: 2;
        }

        .dark .__header__glass {
          background: rgba(15, 23, 42, 0.45);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.38),
            0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .__header__glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          opacity: 0.15;
          filter: blur(20px);
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .__header__glass:hover .__header__glow {
          opacity: 0.25;
        }

        .__header__title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .dark .__header__title {
          background: linear-gradient(90deg, #60a5fa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .__header__flag {
          display: inline-block;
          margin-left: 0.5rem;
          font-size: 1.8rem;
          transform: translateY(4px);
        }

        .__header__subtitle {
          margin: 0.75rem 0 0;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          letter-spacing: 0.02em;
        }

        .dark .__header__subtitle {
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .__header__title {
            font-size: 1.9rem;
          }
          .__header__flag {
            font-size: 1.5rem;
          }
          .__header__glass {
            padding: 1.5rem 1.25rem;
          }
          .__header__floaters {
            transform: scale(0.8);
          }
        }
      `}</style>
    </header>
  );
}
