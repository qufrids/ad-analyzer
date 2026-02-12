import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://adscore.ai";

export const metadata: Metadata = {
  title: {
    default: "AdScore AI — AI-Powered Ad Creative Analyzer for E-commerce",
    template: "%s | AdScore AI",
  },
  description:
    "Upload your ad creative and get instant AI analysis with scores, specific feedback, and actionable recommendations. Built for Shopify, Amazon, and e-commerce sellers.",
  keywords: [
    "ad creative analysis",
    "ai ad analyzer",
    "facebook ads analyzer",
    "ad score",
    "ad creative feedback",
    "ecommerce ads",
    "tiktok ad analysis",
    "google ads analyzer",
    "ad performance",
    "ctr prediction",
  ],
  authors: [{ name: "AdScore AI" }],
  creator: "AdScore AI",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AdScore AI",
    title: "AdScore AI — AI-Powered Ad Creative Analyzer for E-commerce",
    description:
      "Upload your ad creative and get instant AI analysis with scores, specific feedback, and actionable recommendations. Built for Shopify, Amazon, and e-commerce sellers.",
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "AdScore AI — AI-Powered Ad Creative Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdScore AI — AI-Powered Ad Creative Analyzer for E-commerce",
    description:
      "Upload your ad creative and get instant AI analysis with scores, specific feedback, and actionable recommendations.",
    images: [`${siteUrl}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
