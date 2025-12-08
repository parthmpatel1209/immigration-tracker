// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import DisclaimerBanner from "@/components/DisclaimerBanner"; // We'll create this


const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Immigration Data Tracker",
  description: "Track Canadian PR draws and CRS scores",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4445802556511218"
        crossOrigin="anonymous"
      />

      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Dismissible Top Banner */}
        <DisclaimerBanner />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Permanent small footer notice (extra safety) */}


        <Analytics />
      </body>
    </html>
  );
}
