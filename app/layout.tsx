// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Immigration Tracker",
  description: "Track Canadian PR draws and CRS scores",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/*PNG favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4445802556511218"
        crossOrigin="anonymous"
      />

      <body className={`${inter.variable} antialiased`}>
        <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
          <span className="flex flex-wrap items-center justify-center gap-x-1.5 leading-snug">
            <strong className="font-bold">⚠️ Not official IRCC advice.</strong>
            <span>
              {" • "}Data is updated regularly but may occasionally be
              outdated/inaccurate.{" • "}
            </span>
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-700 font-semibold"
            >
              Verify with IRCC
            </a>
          </span>
        </div>

        {/* Main Content */}
        <main className="pt-1">{children}</main>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
