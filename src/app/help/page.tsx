import type { Metadata } from "next";
import Link from "next/link";
import PublicPageLayout from "@/components/PublicPageLayout";
import LandingFAQ from "@/components/landing/LandingFAQ";

export const metadata: Metadata = {
  title: "Help Center — AdScore AI",
  description:
    "Get answers to common questions about AdScore AI — how to analyze ads, understand your score, manage your subscription, and more.",
};

const QUICK_LINKS = [
  { title: "Analyze your first ad",         href: "/signup",   desc: "Upload any ad image and get a score in 30 seconds." },
  { title: "Understanding your score",      href: "/#faq",     desc: "What each dimension means and how scores are calculated." },
  { title: "Upgrade your plan",             href: "/#pricing", desc: "See all plans and what's included at each tier." },
  { title: "Manage your subscription",      href: "/settings", desc: "Billing portal, cancel, or change your plan." },
  { title: "Contact support",               href: "/contact",  desc: "Email us directly — we respond within 24 hours." },
];

const GUIDES = [
  {
    title: "Getting started",
    steps: [
      "Sign up for a free account at adspk.vercel.app/signup — no credit card required.",
      "From the dashboard, click 'New Analysis' in the sidebar.",
      "Upload any JPG, PNG, or WebP image of an ad (max 5MB).",
      "Select the platform (Meta, TikTok, Google) and your niche.",
      "Click 'Analyze' and wait about 30 seconds for your results.",
      "Review your 0-100 score, dimension breakdown, and recommendations.",
    ],
  },
  {
    title: "Understanding your score",
    steps: [
      "Scores range from 0–100. Above 80 = Excellent. 60–79 = Good. Below 60 = Needs Work.",
      "6 dimensions are scored: Hook Strength, Copy Effectiveness, CTA Clarity, Visual Impact, Brand Consistency, Platform Fit.",
      "Each dimension has specific feedback explaining why it scored the way it did.",
      "Recommendations are sorted by impact — fix the highest-impact issues first.",
      "Use the AI Improver to get rewritten versions of your copy with one click.",
    ],
  },
  {
    title: "Usage limits and tiers",
    steps: [
      "Free: 3 ad analyses and 1 AI improvement per month. No credit card needed.",
      "Starter ($19/mo): 50 analyses, 10 improvements, 5 A/B comparisons per month.",
      "Pro ($39/mo): 200 analyses, 40 improvements, 20 comparisons, Competitor Spy & URL Generator.",
      "Agency ($79/mo): Unlimited everything + weekly reports + API access.",
      "Usage resets on the 1st of each month. Upgrade anytime in Settings.",
    ],
  },
  {
    title: "Managing your subscription",
    steps: [
      "Go to Settings → Subscription to see your current plan.",
      "Click 'Manage Subscription' to access the Stripe billing portal.",
      "From the portal you can update your payment method, cancel, or view invoices.",
      "Cancellations take effect at the end of your current billing period.",
      "After cancellation, you&apos;ll keep access until the period ends, then revert to Free.",
    ],
  },
];

export default function HelpPage() {
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
            HELP CENTER
          </span>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#0F172A] leading-tight tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-[18px] text-[#64748B] leading-[1.7]">
            Find answers to common questions or reach out to our team.
          </p>
        </div>

        {/* Quick links */}
        <div className="mb-12">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-4">QUICK LINKS</p>
          <div className="grid grid-cols-1 gap-3">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.title}
                href={l.href}
                className="group flex items-start gap-4 p-4 bg-white border border-[#E2E8F0] rounded-[12px] hover:border-[#4F46E5] hover:shadow-[0_4px_12px_rgba(79,70,229,0.08)] transition-all duration-150"
              >
                <div className="w-8 h-8 bg-[#EEF2FF] rounded-[8px] flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors mb-0.5">{l.title}</p>
                  <p className="text-[13px] text-[#64748B]">{l.desc}</p>
                </div>
                <svg className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#4F46E5] shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Step-by-step guides */}
        <div className="mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-6">STEP-BY-STEP GUIDES</p>
          <div className="space-y-6">
            {GUIDES.map((g) => (
              <div key={g.title} className="bg-white border border-[#E2E8F0] rounded-[16px] p-6">
                <h3 className="text-[17px] font-bold text-[#0F172A] mb-4">{g.title}</h3>
                <ol className="space-y-2.5">
                  {g.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#EEF2FF] text-[#4F46E5] rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[14px] text-[#334155] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-6">FREQUENTLY ASKED QUESTIONS</p>
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] px-6 py-2">
            <LandingFAQ />
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-6 text-center">
          <p className="text-[16px] font-semibold text-[#0F172A] mb-2">Still have questions?</p>
          <p className="text-[14px] text-[#64748B] mb-4">
            Our team responds to every message within 24 hours, Monday–Friday.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[8px] transition-colors duration-150"
          >
            Contact support →
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
