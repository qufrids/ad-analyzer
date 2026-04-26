import type { Metadata } from "next";
import Link from "next/link";
import PublicPageLayout from "@/components/PublicPageLayout";

export const metadata: Metadata = {
  title: "About — AdScore AI",
  description:
    "AdScore AI is an AI-powered ad creative analysis platform that helps e-commerce sellers and performance marketers make data-driven decisions about their ad creatives.",
};

export default function AboutPage() {
  return (
    <PublicPageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Back link */}
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
            ABOUT
          </span>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#0F172A] leading-tight tracking-tight mb-4">
            We&apos;re building the intelligence layer for ad creatives.
          </h1>
          <p className="text-[18px] text-[#64748B] leading-[1.7]">
            AdScore AI was built for one simple reason: too many advertisers are spending money on
            creative that was never going to work — and they had no way to know until they&apos;d
            already burned the budget.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px]">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#4F46E5] mb-3">OUR MISSION</p>
          <p className="text-[17px] text-[#0F172A] font-medium leading-[1.7]">
            &quot;Every advertiser deserves access to the kind of creative intelligence that was previously
            only available to big agencies with dedicated creative strategists.&quot;
          </p>
        </div>

        {/* What we do */}
        <div className="prose prose-slate max-w-none mb-12">
          <h2 className="text-[24px] font-bold text-[#0F172A] mb-4">What AdScore AI does</h2>
          <p className="text-[16px] text-[#334155] leading-[1.7] mb-4">
            AdScore AI is an AI-powered ad creative analysis platform. You upload any ad image — a
            Facebook ad, TikTok creative, Google banner, or product shot — and within 30 seconds you
            get a 0–100 performance score with a forensic breakdown across 6 proven dimensions:
            hook strength, copy effectiveness, CTA clarity, visual impact, brand consistency, and
            platform fit.
          </p>
          <p className="text-[16px] text-[#334155] leading-[1.7] mb-4">
            But we don&apos;t stop at scoring. The AI Improver rewrites your weak headlines, copy, and CTAs
            using proven frameworks — giving you 3 complete ad variations ready to launch. The Competitor
            Spy decodes any competitor&apos;s creative strategy and generates a counter-ad. The URL to Ads
            generator turns any product page into launch-ready ad copy for Meta, TikTok, and Google.
          </p>
          <p className="text-[16px] text-[#334155] leading-[1.7]">
            Everything is built around one goal: helping you make better creative decisions, faster —
            with data instead of gut feel.
          </p>
        </div>

        {/* Who it's for */}
        <div className="mb-12">
          <h2 className="text-[24px] font-bold text-[#0F172A] mb-6">Who AdScore AI is built for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Media Buyers",
                desc: "Pre-qualify every creative before it goes live. Reduce dud creative rate and protect your media budget.",
              },
              {
                title: "Performance Marketers",
                desc: "Replace gut-feel with data-backed creative decisions. Track quality over time and build a repeatable system.",
              },
              {
                title: "DTC & E-commerce Brands",
                desc: "Generate ads from product URLs, decode competitors, and build a library of high-scoring templates.",
              },
              {
                title: "Agencies",
                desc: "Set a quality standard across every client account. Analyze at scale and generate client-ready reports.",
              },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-white border border-[#E2E8F0] rounded-[12px]">
                <p className="text-[15px] font-semibold text-[#0F172A] mb-1.5">{item.title}</p>
                <p className="text-[14px] text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-[#E2E8F0] pt-10 text-center">
          <p className="text-[16px] text-[#64748B] mb-6">
            Have questions? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[15px] px-6 py-3 rounded-[8px] transition-colors duration-150"
            >
              Start free today →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F8FAFC] text-[#334155] font-medium text-[15px] px-6 py-3 rounded-[8px] border border-[#E2E8F0] transition-colors duration-150"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
