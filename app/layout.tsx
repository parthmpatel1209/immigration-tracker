// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import DisclaimerBanner from "@/components/DisclaimerBanner";

const sans = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  adjustFontFallback: false,
  display: "swap",
});
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Canada Immigration Data Tracker — Express Entry draws & CRS scores",
    template: "%s · Immigration Data Tracker",
  },
  description:
    "Live Express Entry draw results, CRS cut-offs, a free CRS calculator, PNP quotas and PR pathways for Canada — compiled from public IRCC data.",
  other: {
    "google-adsense-account": "ca-pub-4445802556511218",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1116" },
  ],
};

/** Runs before paint so the saved / system theme is applied with no flash. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body
        className="antialiased"
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4445802556511218"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <DisclaimerBanner />

        <main>{children}</main>

        <Analytics />
      </body>
    </html>
  );
}
