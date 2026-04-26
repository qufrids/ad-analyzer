import type { Metadata } from "next";
import Link from "next/link";
import PublicPageLayout from "@/components/PublicPageLayout";

export const metadata: Metadata = {
  title: "Blog — AdScore AI",
  description:
    "Tips on running better ads, creative strategy, and making data-driven decisions — coming soon from AdScore AI.",
};

export default function BlogPage() {
  const topics = [
    "How to write hooks that stop the scroll",
    "6-dimension scoring: what each metric really measures",
    "Why 80% of ad spend is wasted on creative — and how to fix it",
    "Platform-specific creative strategies: Meta vs TikTok vs Google",
    "A/B testing with data: stop guessing which ad wins",
    "How to decode competitor creatives (and outperform them)",
  ];

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

        {/* Coming soon */}
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[#EEF2FF] rounded-[16px] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] border border-[#E0E7FF] px-3 py-1 rounded-full mb-4">
            COMING SOON
          </span>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#0F172A] leading-tight tracking-tight mb-4">
            The AdScore Blog
          </h1>
          <p className="text-[17px] text-[#64748B] leading-[1.7] max-w-xl mx-auto mb-8">
            Tips on running better ads, creative strategy, performance marketing, and making
            data-driven decisions. We&apos;re writing it now — check back soon.
          </p>
        </div>

        {/* Upcoming topics */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-6 md:p-8 mb-10">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#4F46E5] mb-4">
            WHAT WE&apos;RE WRITING
          </p>
          <ul className="space-y-3">
            {topics.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#CBD5E1] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[15px] text-[#334155]">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[15px] px-6 py-3 rounded-[8px] transition-colors duration-150"
          >
            Start using AdScore for free →
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
