import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}

<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  crossOrigin="anonymous"
/>;
