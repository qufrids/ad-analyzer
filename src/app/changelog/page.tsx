import type { Metadata } from "next";
import Link from "next/link";
import PublicPageLayout from "@/components/PublicPageLayout";

export const metadata: Metadata = {
  title: "Changelog — AdScore AI",
  description:
    "See what's new in AdScore AI — we're shipping new features every week.",
};

const UPDATES = [
  {
    date: "April 2026",
    tag: "NEW",
    tagColor: "#16A34A",
    tagBg: "#F0FDF4",
    title: "6 Dedicated Feature Sections on Landing Page",
    items: [
      "Each feature (Ad Analysis, AI Improver, A/B Compare, etc.) now has its own dedicated section with visual mockups.",
      "Navigation dropdowns now link directly to each feature section.",
      "Improved mobile experience across the entire landing page.",
    ],
  },
  {
    date: "March 2026",
    tag: "NEW",
    tagColor: "#16A34A",
    tagBg: "#F0FDF4",
    title: "Performance Tracker & Score Trends",
    items: [
      "Dashboard now shows a score trend chart for all your analyzed ads.",
      "See how your creative quality improves over time.",
      "Filter your history by platform, niche, and score range.",
    ],
  },
  {
    date: "March 2026",
    tag: "NEW",
    tagColor: "#16A34A",
    tagBg: "#F0FDF4",
    title: "URL to Ads Generator",
    items: [
      "Paste any Shopify, Amazon, or product URL.",
      "AdScore reads the page and generates complete ad copy for Meta, TikTok, Google, and Instagram.",
      "5+ hook variations per platform — paste-ready.",
    ],
  },
  {
    date: "February 2026",
    tag: "IMPROVED",
    tagColor: "#D97706",
    tagBg: "#FFFBEB",
    title: "Competitor Spy Improvements",
    items: [
      "Competitor analysis now includes counter-ad generation.",
      "Improved strategy decoding — clearer weakness identification.",
      "Added 'Your Product' context field for more targeted counter-ads.",
    ],
  },
  {
    date: "February 2026",
    tag: "NEW",
    tagColor: "#16A34A",
    tagBg: "#F0FDF4",
    title: "A/B Compare Feature",
    items: [
      "Upload two ad creatives and get a data-backed winner.",
      "Side-by-side dimension scoring with combined improvement recommendations.",
      "Available on Starter plan and above.",
    ],
  },
  {
    date: "January 2026",
    tag: "LAUNCH",
    tagColor: "#4F46E5",
    tagBg: "#EEF2FF",
    title: "AdScore AI Public Launch",
    items: [
      "AI-powered ad creative analysis with 6-dimension scoring.",
      "Claude Sonnet-powered analysis for any JPG, PNG, or WebP ad image.",
      "Platform-specific scoring for Meta, TikTok, and Google Ads.",
      "Free tier with 3 analyses — no credit card required.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PublicPageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] text-[#64748B] hover:text-[#4F46E5] transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] border border-[#E0E7FF] px-3 py-1 rounded-full mb-4">
            CHANGELOG
          </span>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#0F172A] leading-tight tracking-tight mb-4">
            What&apos;s new in AdScore AI
          </h1>
          <p className="text-[18px] text-[#64748B] leading-[1.7]">
            We ship new features and improvements every week. Here&apos;s what we&apos;ve been building.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {UPDATES.map((update, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-[#E2E8F0]">
              {/* Dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-[#4F46E5] rounded-full" />

              <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 md:p-6">
                {/* Date + tag */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[13px] font-medium text-[#94A3B8]">{update.date}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{ color: update.tagColor, background: update.tagBg }}
                  >
                    {update.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-[#0F172A] mb-3">{update.title}</h3>

                {/* Items */}
                <ul className="space-y-2">
                  {update.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <svg className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[14px] text-[#334155] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 border-t border-[#E2E8F0] pt-10 text-center">
          <p className="text-[15px] text-[#64748B] mb-4">
            Have a feature request? We&apos;d love to hear it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[8px] transition-colors duration-150"
          >
            Share feedback →
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
