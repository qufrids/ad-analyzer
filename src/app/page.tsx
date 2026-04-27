import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import PricingButton from "@/components/PricingButton";
import ProductShowcase from "@/components/landing/ProductShowcase";
import BeforeAfter from "@/components/landing/BeforeAfter";
import LandingFAQ from "@/components/landing/LandingFAQ";
import FeatureSections from "@/components/landing/FeatureSections";

/* ─── JSON-LD ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdScore",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Ad Performance Intelligence Platform. Predict which ads will win before you spend money.",
  offers: [
    { "@type": "Offer", price: "0",  priceCurrency: "USD", name: "Free" },
    { "@type": "Offer", price: "19", priceCurrency: "USD", name: "Starter",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "19", priceCurrency: "USD", billingDuration: "P1M" } },
    { "@type": "Offer", price: "39", priceCurrency: "USD", name: "Pro",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "39", priceCurrency: "USD", billingDuration: "P1M" } },
    { "@type": "Offer", price: "79", priceCurrency: "USD", name: "Agency",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "79", priceCurrency: "USD", billingDuration: "P1M" } },
  ],
};

/* ─── DATA ─── */
/*
  Mobile pricing order: Pro → Starter → Agency → Free
  CSS order classes handle reordering without changing source order.
  Source: [Free=0, Starter=1, Pro=2, Agency=3]
  md:order-none resets back to source order on tablet/desktop.
*/
const PRICING = [
  {
    name: "Free", price: "$0", cadence: "forever",
    desc: "Try AdScore — no card needed.",
    highlight: false, tier: "free" as const,
    mobileOrder: "order-4 md:order-none",
    features: [
      { text: "3 ad analyses",               included: true  },
      { text: "1 AI ad improvement",          included: true  },
      { text: "Browse swipe file templates",  included: true  },
      { text: "A/B Compare",                  included: false },
      { text: "Competitor Spy",               included: false },
      { text: "URL to Ads generator",         included: false },
      { text: "Performance Tracker",          included: false },
    ],
  },
  {
    name: "Starter", price: "$19", cadence: "/month",
    desc: "For sellers testing and iterating creatives.",
    highlight: false, tier: "starter" as const,
    mobileOrder: "order-2 md:order-none",
    features: [
      { text: "50 analyses/month",           included: true  },
      { text: "10 AI improvements/month",    included: true  },
      { text: "5 A/B comparisons/month",     included: true  },
      { text: "Full swipe file + copy gen",  included: true  },
      { text: "Basic performance tracker",   included: true  },
      { text: "Competitor Spy",              included: false },
      { text: "URL to Ads generator",        included: false },
    ],
  },
  {
    name: "Pro", price: "$39", cadence: "/month",
    desc: "For marketers who ship consistently.",
    highlight: true, tier: "pro" as const,
    mobileOrder: "order-1 md:order-none",
    features: [
      { text: "200 analyses/month",         included: true },
      { text: "40 AI improvements/month",   included: true },
      { text: "20 A/B comparisons/month",   included: true },
      { text: "10 Competitor Spy/month",    included: true },
      { text: "5 URL to Ads/month",         included: true },
      { text: "Full swipe file + copy gen", included: true },
      { text: "Full tracker + export",      included: true },
    ],
  },
  {
    name: "Agency", price: "$79", cadence: "/month",
    desc: "For teams managing multiple brands.",
    highlight: false, tier: "agency" as const,
    mobileOrder: "order-3 md:order-none",
    features: [
      { text: "Unlimited analyses",         included: true },
      { text: "Unlimited improvements",     included: true },
      { text: "Unlimited A/B compare",      included: true },
      { text: "Unlimited Competitor Spy",   included: true },
      { text: "Unlimited URL to Ads",       included: true },
      { text: "Weekly email reports",       included: true },
      { text: "API access",                  included: true },
    ],
  },
];

const STATS = [
  { stat: "10,000+", label: "Ads Analyzed"              },
  { stat: "87%",     label: "Average Score Improvement" },
  { stat: "<30 sec", label: "Average Analysis Time"     },
];

/* Maps each feature card label → its scroll-to anchor ID */
const FEATURE_IDS: Record<string, string> = {
  "DEEP ANALYSIS":           "feature-analysis",
  "AI IMPROVER":             "feature-improver",
  "PERFORMANCE TRACKING":    "feature-tracker",
  "A/B TESTING":             "feature-ab",
  "COMPETITOR INTELLIGENCE": "feature-competitor",
  "INSTANT GENERATION":      "feature-url",
};

/* ─── HELPERS ─── */
function FeatureCard({ label, title, description, icon }: {
  label: string; title: string; description: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="w-11 h-11 md:w-12 md:h-12 bg-[#EEF2FF] rounded-[10px] md:rounded-[12px] flex items-center justify-center text-[#4F46E5] mb-3 md:mb-5">
        {icon}
      </div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#4F46E5] mb-1.5 md:mb-2">{label}</p>
      <h3 className="text-[18px] font-bold text-[#0F172A] mb-2 leading-snug">{title}</h3>
      <p className="text-[15px] text-[#64748B] leading-[1.6]">{description}</p>
    </div>
  );
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <svg className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-[#CBD5E1] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function HeroScoreRow({ label, score, reason, color }: {
  label:  string;
  score:  number;
  reason: string;
  color:  "red" | "green";
}) {
  const red = color === "red";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11.5px] text-slate-500">{label}</span>
        <span className={`text-[11.5px] font-bold tabular-nums ${red ? "text-red-500" : "text-emerald-500"}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
        <div className={`h-full rounded-full ${red ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-[10.5px] text-slate-400 leading-tight">{reason}</p>
    </div>
  );
}

/* ─── PAGE ─── */
export default function LandingPage() {
  return (
    <div
      className="overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter,'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif)" }}
    >
      {/* Scoped mobile tap-highlight removal */}
      <style>{`
        .lp a, .lp button { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 767px) { .lp a, .lp button { touch-action: manipulation; } }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="lp">
        <ClientNavbar />

        {/* ══════════════════════════════
            HERO — Before / After Ad Improver
        ══════════════════════════════ */}
        <section className="bg-white pt-20 md:pt-[116px] pb-16 md:pb-24 px-4 overflow-hidden" id="hero">
          <div className="max-w-[1280px] mx-auto">

            {/* ── Copy stack ── */}
            <div className="text-center mb-12 md:mb-16">

              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[15px] leading-none">✨</span>
                <span className="text-[13px] font-medium text-indigo-600 tracking-[0.01em]">
                  Ad Improver · powered by Claude
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[44px] md:text-[68px] lg:text-[76px] font-extrabold text-slate-900 tracking-[-0.04em] leading-[1.05] mb-5 md:mb-6">
                Drop in any ad.<br />
                Get back a{" "}
                <span className="text-[#5B4BFF]">better</span> one.
              </h1>

              {/* Subhead */}
              <p className="text-[17px] md:text-[19px] text-slate-600 max-w-[660px] mx-auto leading-[1.65] mb-8 md:mb-10">
                AdScore tells you why an ad will flop, then rewrites the copy and
                regenerates the creative — usually in the time it takes to refill your coffee.
              </p>

              {/* Buttons */}
              <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-3 mb-8 px-2">
                <Link
                  href="/analyze"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#5B4BFF] hover:bg-[#4A3AEE] active:scale-[0.97] text-white font-semibold text-[13px] sm:text-[15px] px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-[0_0_0_3px_rgba(91,75,255,0.18),0_2px_10px_rgba(91,75,255,0.32)] transition-all duration-150"
                >
                  Analyze free
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a
                  href="#before-after"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#EEF2FF] hover:bg-[#E0E7FF] active:scale-[0.97] text-[#4F46E5] font-semibold text-[13px] sm:text-[15px] px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full border border-[#C7D2FE] hover:border-[#A5B4FC] transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                  </svg>
                  Before/after
                </a>
              </div>

              {/* Trust strip */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[13.5px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-500 text-[15px] leading-none">⚡</span>
                  7 free analyses
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[15px] leading-none">🕒</span>
                  Results in 30 seconds
                </span>
              </div>
            </div>

            {/* ── Before / After Card ── */}
            <div className="bg-[#FAFAFB] border border-slate-200/70 rounded-3xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.04)] p-5 md:p-7 lg:p-9">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0">

                {/* ── LEFT: BEFORE ── */}
                <div className="flex flex-col sm:flex-row gap-4 md:pr-6">
                  {/* Bad ad mock — busy, dark, neon gradient */}
                  <div className="relative sm:w-[190px] h-[200px] sm:h-[240px] rounded-2xl overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a0040] via-[#0d2680] to-[#005f6b]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,240,0,0.25),transparent_60%)]" />
                    <div className="relative z-10 p-3.5 h-full flex flex-col">
                      <p className="text-[8px] font-black text-yellow-300 tracking-[0.18em] uppercase">⭐ MEGA SALE ⭐</p>
                      <p className="text-[17px] font-black text-white uppercase leading-tight mt-1.5">
                        BUY NOW!!!<br />70% OFF
                      </p>
                      <p className="text-[7.5px] text-cyan-300 mt-1 uppercase font-bold leading-snug">
                        USE CODE: SAVE70<br />TODAY ONLY!!!
                      </p>
                      <div className="flex-1 flex items-end pb-1">
                        <p className="text-[7px] text-white/40 leading-tight">
                          *Terms apply. Cannot combine.<br />Valid while supplies last.
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {["BUY", "SHOP", "NOW!"].map((t, i) => (
                          <div key={t} className={`flex-1 text-[7.5px] font-black text-center py-1.5 rounded uppercase ${
                            i === 0 ? "bg-yellow-400 text-black"
                            : i === 1 ? "bg-red-500 text-white"
                            : "bg-cyan-400 text-black"
                          }`}>{t}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BEFORE score section */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 mb-2.5">Before</p>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-[48px] font-black text-red-500 tracking-[-0.04em] tabular-nums leading-none">34</span>
                      <span className="text-[15px] text-slate-300 font-semibold">/100</span>
                    </div>
                    <div className="space-y-3.5">
                      <HeroScoreRow label="Hook strength"      score={22} reason="Generic opener, no curiosity"  color="red" />
                      <HeroScoreRow label="Copy effectiveness" score={41} reason="No specific benefit or proof"  color="red" />
                      <HeroScoreRow label="CTA clarity"        score={48} reason="3 competing calls-to-action"   color="red" />
                    </div>
                  </div>
                </div>

                {/* ── MIDDLE: Arrow divider ── */}
                <div className="relative flex md:flex-col items-center justify-center gap-3 md:gap-3.5 md:px-5">
                  {/* Vertical dashed rules on desktop */}
                  <div className="hidden md:block absolute inset-y-0 left-0 border-l border-dashed border-slate-200" />
                  <div className="hidden md:block absolute inset-y-0 right-0 border-r border-dashed border-slate-200" />
                  {/* Horizontal dashed rules on mobile */}
                  <div className="flex-1 md:hidden h-px border-t border-dashed border-slate-200" />
                  {/* Arrow button */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5B4BFF] to-[#8B5CF6] flex items-center justify-center shadow-[0_4px_20px_rgba(91,75,255,0.45)] shrink-0">
                    {/* → on desktop */}
                    <svg className="hidden md:block w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    {/* ↓ on mobile */}
                    <svg className="md:hidden w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="flex-1 md:hidden h-px border-t border-dashed border-slate-200" />
                  <p className="text-[11px] font-semibold text-[#5B4BFF] tracking-[0.04em]">AI · 24s</p>
                </div>

                {/* ── RIGHT: AFTER ── */}
                <div className="flex flex-col sm:flex-row gap-4 md:pl-6">
                  {/* Good ad mock — clean sneaker creative */}
                  <div className="relative sm:w-[190px] h-[200px] sm:h-[240px] rounded-2xl overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-rose-600" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none">
                      <span className="text-[110px]">👟</span>
                    </div>
                    <div className="relative z-10 p-4 h-full flex flex-col text-white">
                      <p className="text-[8.5px] font-bold tracking-[0.16em] uppercase text-orange-200">Performance Running</p>
                      <p className="text-[19px] font-black leading-tight mt-2">
                        Run further.<br />Pay less.
                      </p>
                      <p className="text-[9.5px] text-orange-100 mt-1.5 leading-snug">
                        Pro-grade cushioning.<br />Half the price.
                      </p>
                      <div className="flex-1 flex items-center">
                        <span className="text-[34px] font-black tracking-[-0.04em]">$79</span>
                      </div>
                      <div className="bg-white rounded-full py-2 text-center">
                        <span className="text-orange-600 text-[10.5px] font-black uppercase tracking-[0.1em]">SHOP NOW →</span>
                      </div>
                    </div>
                  </div>

                  {/* AFTER score section */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#5B4BFF] mb-2.5">
                      After · AdScore Rewrite
                    </p>
                    <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                      <span className="text-[48px] font-black text-emerald-500 tracking-[-0.04em] tabular-nums leading-none">89</span>
                      <span className="text-[15px] text-slate-300 font-semibold">/100</span>
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full self-center whitespace-nowrap">
                        +55 pts
                      </span>
                    </div>
                    <div className="space-y-3.5">
                      <HeroScoreRow label="Hook" score={92} reason="Specific outcome, clear benefit"  color="green" />
                      <HeroScoreRow label="Copy" score={87} reason="Social proof + price anchor"      color="green" />
                      <HeroScoreRow label="CTA"  score={90} reason="One clear, low-friction action"   color="green" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ══════════ PRODUCT SHOWCASE ══════════ */}
        <section className="bg-[#F8FAFC] py-16 md:py-24" id="showcase">
          <ScrollReveal>
            <ProductShowcase />
          </ScrollReveal>
        </section>

        {/* ══════════ FEATURE GRID ══════════ */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-4" id="features">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10 md:mb-16">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">FEATURES</p>
                <h2 className="text-[26px] md:text-[36px] lg:text-[40px] font-bold text-[#0F172A] leading-tight tracking-tight">
                  Everything you need to run winning ads.
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  label: "DEEP ANALYSIS", title: "6-Dimension Ad Scoring",
                  description: "Every ad is analyzed across hook strength, visual impact, copy effectiveness, CTA clarity, platform fit, and audience alignment. Get a forensic breakdown of what works and what doesn't.",
                  icon: <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                },
                {
                  label: "AI IMPROVER", title: "One-Click Ad Improvements",
                  description: "Don't just score your ads — fix them. Our AI rewrites your headlines, copy, and CTAs using proven frameworks. Get 3 complete ad variations ready to paste into your ad manager.",
                  icon: <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
                },
                {
                  label: "PERFORMANCE TRACKING", title: "Track Your Ad Score Over Time",
                  description: "Monitor how your creative quality improves. See score trends, track your best performers, and prove your strategy is working with data your whole team can understand.",
                  icon: <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                },
                {
                  label: "A/B TESTING", title: "Compare Creatives Head-to-Head",
                  description: "Upload two ads side by side. Our AI picks the winner across 6 dimensions and tells you exactly how to combine the best elements of both into a single dominant creative.",
                  icon: <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
                },
                {
                  label: "COMPETITOR INTELLIGENCE", title: "Reverse-Engineer Any Competitor",
                  description: "Upload a competitor's ad. Our AI decodes their strategy, finds their weaknesses, and writes you a counter-ad designed to beat them — using their own playbook against them.",
                  icon: <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                },
                {
                  label: "INSTANT GENERATION", title: "Ads from Any Product URL",
                  description: "Paste your Shopify, Amazon, or any product URL. Get complete ad copy for Facebook, TikTok, Instagram, and Google — with multiple hook variations ready to launch.",
                  icon: <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
                },
              ].map((f, i) => (
                /* No id here — IDs live on the FeatureSections deep-dive sections below */
                <ScrollReveal key={f.label} delay={i * 0.04}>
                  <FeatureCard {...f} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FEATURE DETAIL SECTIONS ══════════
            Each section is anchored to its nav link ID so clicking
            "Ad Analysis", "AI Improver", etc. in the Features dropdown
            scrolls directly to the relevant deep-dive section.        */}
        <FeatureSections />

        {/* ══════════ BEFORE / AFTER ══════════ */}
        <section className="bg-[#F8FAFC] py-16 md:py-24 px-6 md:px-4" id="before-after">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10 md:mb-14">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">SEE THE DIFFERENCE</p>
                <h2 className="text-[26px] md:text-[36px] lg:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
                  What AI optimization looks like.
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <BeforeAfter />
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════ SOCIAL PROOF STATS ══════════
            Mobile: stacked vertically, 40px numbers, narrow dividers
            Desktop: 3 columns with vertical dividers
        ══════════ */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col items-center md:grid md:grid-cols-3">
                {STATS.map((s, i) => (
                  <div key={s.label} className={`w-full md:w-auto ${i > 0 ? "md:border-l md:border-[#E2E8F0]" : ""}`}>
                    <div className="text-center py-8 md:py-4 md:px-8">
                      <p className="text-[40px] md:text-[52px] font-bold text-[#0F172A] leading-none mb-2 tracking-tight">
                        {s.stat}
                      </p>
                      <p className="text-[15px] md:text-[16px] text-[#64748B]">{s.label}</p>
                    </div>
                    {/* Narrow centered divider between stats — mobile only */}
                    {i < STATS.length - 1 && (
                      <div className="w-2/5 mx-auto h-px bg-[#E2E8F0] md:hidden" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════ FOR TEAMS ══════════ */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-4" id="for-teams">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10 md:mb-16">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">WHO IT&apos;S FOR</p>
                <h2 className="text-[26px] md:text-[36px] lg:text-[40px] font-bold text-[#0F172A] leading-tight tracking-tight">
                  Built for every performance team.
                </h2>
                <p className="text-[16px] md:text-[18px] text-[#64748B] mt-4 max-w-2xl mx-auto leading-relaxed">
                  Whether you&apos;re a media buyer, marketer, DTC brand, or agency — AdScore fits directly into how you work.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: "for-media-buyers",
                  badge: "MEDIA BUYERS",
                  headline: "Cut your dud creative rate before you spend",
                  description: "Pre-qualify every creative with a data-backed score before it touches your ad account. Know what will underperform — before it costs you.",
                  benefits: [
                    "Score creatives 0–100 before any media spend",
                    "Identify weak hooks that kill CTR at a glance",
                    "Reduce dud creative rate by 60%+ in month one",
                    "Prioritize budget behind proven creative winners",
                  ],
                },
                {
                  id: "for-marketers",
                  badge: "PERFORMANCE MARKETERS",
                  headline: "Replace gut-feel with data-backed creative decisions",
                  description: "Get platform-specific scoring, AI improvements, and trend tracking that turns creative quality from art into a repeatable system your team can scale.",
                  benefits: [
                    "Platform-specific scoring for Meta, TikTok & Google",
                    "AI rewrites weak copy and CTAs in one click",
                    "Track creative quality scores week-over-week",
                    "A/B testing with clear, data-driven winner logic",
                  ],
                },
                {
                  id: "for-dtc",
                  badge: "DTC BRANDS",
                  headline: "Spend less on testing. Scale winning creatives faster.",
                  description: "Built for Shopify, Amazon, and e-commerce. Generate ad copy from any product URL, decode competitor strategies, and build a library of proven templates.",
                  benefits: [
                    "Generate complete ad copy from any product URL",
                    "Decode competitor creatives and out-position them",
                    "Works with Shopify, Amazon, and any product store",
                    "Build a reusable library of high-scoring templates",
                  ],
                },
                {
                  id: "for-agencies",
                  badge: "AGENCIES",
                  headline: "A creative QA layer across every client you manage",
                  description: "Set a quality standard across every account. Analyze at scale, generate client-ready reports, and prove your creative strategy is working with real data.",
                  benefits: [
                    "Analyze unlimited creatives across all client accounts",
                    "Generate weekly automated creative performance reports",
                    "Prioritized improvement recommendations per brand",
                    "API access for custom workflows",
                  ],
                },
              ].map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.06}>
                  <div
                    id={p.id}
                    className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full"
                  >
                    {/* Audience badge */}
                    <span className="inline-flex self-start text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] border border-[#E0E7FF] px-3 py-1 rounded-full mb-5">
                      {p.badge}
                    </span>

                    <h3 className="text-[20px] md:text-[22px] font-bold text-[#0F172A] leading-snug mb-3">
                      {p.headline}
                    </h3>

                    <p className="text-[15px] text-[#64748B] leading-[1.6] mb-6">
                      {p.description}
                    </p>

                    <ul className="space-y-2.5 mb-7 flex-1">
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                          <svg className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[15px] text-[#334155] leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors group w-fit"
                    >
                      Start free today
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ PRICING ══════════ */}
        <section className="bg-[#F8FAFC] py-16 md:py-24 px-4" id="pricing">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10 md:mb-14">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">PRICING</p>
                <h2 className="text-[26px] md:text-[36px] lg:text-[40px] font-bold text-[#0F172A] tracking-tight mb-3 leading-tight">
                  Simple, transparent pricing.
                </h2>
                <p className="text-[16px] md:text-[18px] text-[#64748B]">Start free. Upgrade when you&apos;re ready.</p>
              </div>
            </ScrollReveal>

            {/* Grid: 1 col mobile (with CSS order), 2 col md, 4 col xl */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {PRICING.map((plan, i) => (
                <ScrollReveal key={plan.name} delay={i * 0.04}>
                  <div
                    className={`relative rounded-[16px] p-6 md:p-8 flex flex-col h-full transition-all duration-200 ${plan.mobileOrder} ${
                      plan.highlight
                        ? "bg-[#FAFAFE] border-2 border-[#4F46E5] shadow-[0_8px_32px_rgba(79,70,229,0.18)]"
                        : "bg-white border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-white bg-[#4F46E5] px-4 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    )}

                    <div className="mb-5">
                      <p className="text-[18px] font-bold text-[#0F172A] mb-1">{plan.name}</p>
                      <p className="text-[14px] text-[#64748B] mb-4">{plan.desc}</p>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-bold text-[#0F172A] leading-none ${plan.highlight ? "text-[44px] md:text-[50px]" : "text-[40px] md:text-[42px]"}`}>{plan.price}</span>
                        <span className="text-[15px] text-[#64748B]">{plan.cadence}</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f.text} className="flex items-start gap-2.5">
                          <Check ok={f.included} />
                          <span className={`text-[15px] leading-snug ${f.included ? "text-[#334155]" : "text-[#94A3B8]"}`}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <PricingButton tier={plan.tier} highlight={plan.highlight} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <p className="text-center text-[13px] text-[#64748B] mt-6 md:mt-8">
              All paid plans include a 3-day free trial. Cancel anytime.
            </p>
          </div>
        </section>

        {/* ══════════ FAQ ══════════ */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-4" id="faq">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-8 md:mb-12">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">FAQ</p>
                <h2 className="text-[26px] md:text-[36px] lg:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
                  Frequently asked questions.
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <LandingFAQ />
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════ CTA BANNER ══════════ */}
        <section className="bg-[#4F46E5] py-16 md:py-24 px-6 md:px-4 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-[26px] md:text-[36px] lg:text-[40px] font-bold text-white leading-[1.2] tracking-tight mb-4">
                Ready to stop guessing?
              </h2>
              <p className="text-[16px] md:text-[18px] text-white/80 mb-8 md:mb-10 leading-relaxed">
                Join thousands of advertisers making data-driven creative decisions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
                <Link
                  href="/signup"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#4F46E5] font-semibold text-[16px] px-7 py-3.5 rounded-[10px] hover:bg-[#F8FAFC] active:bg-[#F8FAFC] active:scale-[0.98] transition-all duration-200 shadow-sm w-full sm:w-auto"
                >
                  Start for Free <Arrow />
                </Link>
                <Link
                  href="/signup"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-[16px] px-7 py-3.5 rounded-[10px] border border-white/30 hover:bg-white/20 active:bg-white/20 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
                >
                  Book a demo <Arrow />
                </Link>
              </div>
              <p className="text-[13px] text-white/50">No credit card required · Cancel anytime</p>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 md:px-6 lg:px-8 pt-12 md:pt-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12">

              {/* Brand — centered on mobile, left on desktop */}
              <div className="text-center md:text-left">
                <Link href="/" className="inline-flex md:flex items-center gap-2.5 mb-4 justify-center md:justify-start">
                  <span className="w-8 h-8 bg-[#4F46E5] rounded-[8px] flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8.5 2L3.5 9H8L7 14L12.5 7H8.5Z" fill="white" />
                    </svg>
                  </span>
                  <span className="text-[16px] font-bold text-[#0F172A] tracking-tight">AdScore</span>
                </Link>
                <p className="text-[14px] text-[#64748B] leading-relaxed mb-5">
                  AI-powered ad creative analysis for performance teams who refuse to guess.
                </p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  {[
                    { label: "X / Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                    { label: "LinkedIn",    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                    { label: "YouTube",     path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                      className="w-8 h-8 flex items-center justify-center text-[#94A3B8] md:hover:text-[#4F46E5] transition-colors duration-150"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d={s.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Product */}
              <div>
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A] mb-4">Product</p>
                <ul>
                  {[
                    { label: "Features",   href: "#features"   },
                    { label: "Pricing",    href: "#pricing"    },
                    { label: "Changelog",  href: "/changelog"  },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} style={{ WebkitTapHighlightColor: "transparent" }} className="flex items-center h-10 text-[15px] text-[#64748B] md:hover:text-[#4F46E5] transition-colors duration-150">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <span className="flex items-center h-10 text-[15px] text-[#94A3B8] gap-2">
                      API <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">Soon</span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A] mb-4">Resources</p>
                <ul>
                  <li>
                    <Link href="/blog" style={{ WebkitTapHighlightColor: "transparent" }} className="flex items-center gap-2 h-10 text-[15px] text-[#64748B] md:hover:text-[#4F46E5] transition-colors duration-150">
                      Blog
                      <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">Soon</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" style={{ WebkitTapHighlightColor: "transparent" }} className="flex items-center h-10 text-[15px] text-[#64748B] md:hover:text-[#4F46E5] transition-colors duration-150">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" style={{ WebkitTapHighlightColor: "transparent" }} className="flex items-center gap-2 h-10 text-[15px] text-[#64748B] md:hover:text-[#4F46E5] transition-colors duration-150">
                      Documentation
                      <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">Soon</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A] mb-4">Company</p>
                <ul>
                  {[
                    { label: "About",          href: "/about"   },
                    { label: "Contact",        href: "/contact" },
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms",          href: "/terms"   },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} style={{ WebkitTapHighlightColor: "transparent" }} className="flex items-center h-10 text-[15px] text-[#64748B] md:hover:text-[#4F46E5] transition-colors duration-150">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-6 text-center">
              <p className="text-[13px] text-[#94A3B8]">© 2026 AdScore. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
