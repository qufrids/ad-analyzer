import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import PricingButton from "@/components/PricingButton";
import ProductShowcase from "@/components/landing/ProductShowcase";
import BeforeAfter from "@/components/landing/BeforeAfter";
import LandingFAQ from "@/components/landing/LandingFAQ";

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
      { text: "API access (coming soon)",   included: true },
    ],
  },
];

const STATS = [
  { stat: "10,000+", label: "Ads Analyzed"              },
  { stat: "87%",     label: "Average Score Improvement" },
  { stat: "<30 sec", label: "Average Analysis Time"     },
];

/* ─── HELPERS ─── */
function FeatureCard({ label, title, description, icon }: {
  label: string; title: string; description: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[12px] md:rounded-[16px] p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
            HERO
            Mobile: 96px top (56px nav + 40px space), 24px sides
            Desktop: pt-36 (144px)
        ══════════════════════════════ */}
        <section className="bg-white pt-24 md:pt-36 pb-14 md:pb-28 px-6 md:px-4" id="hero">
          <div className="max-w-4xl mx-auto text-center">

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#E0E7FF] rounded-full px-4 py-1.5 mb-5 md:mb-8">
                <span>✨</span>
                <span className="text-[13px] font-medium text-[#4F46E5]">Introducing AI-Powered Ad Analysis</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <h1 className="text-[34px] md:text-[56px] lg:text-[64px] font-bold text-[#0F172A] leading-[1.15] md:leading-[1.08] tracking-tight mb-4 md:mb-6">
                Stop Wasting Budget on<br />
                Ads That Don&apos;t Convert.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-[16px] md:text-[20px] text-[#64748B] leading-[1.6] mb-8 md:mb-10">
                Get a 0–100 performance score and actionable improvements for any ad creative in under
                30 seconds. Know exactly what to fix before you spend a dollar.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              {/* Stacked full-width on mobile, inline on md+ */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
                <Link
                  href="/signup"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation", minHeight: "52px" }}
                  className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] active:bg-[#4338CA] md:hover:bg-[#4338CA] text-white font-semibold text-[16px] px-7 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors duration-150 md:w-auto"
                >
                  Start for Free <Arrow />
                </Link>
                <a
                  href="#showcase"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation", minHeight: "52px" }}
                  className="inline-flex items-center justify-center gap-2 bg-white active:bg-[#F8FAFC] md:hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-[16px] px-7 rounded-[10px] border border-[#E2E8F0] transition-colors duration-150 md:w-auto"
                >
                  See how it works <Arrow />
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              {/* Stack vertically on mobile, row on desktop */}
              <div className="flex flex-col items-center gap-1.5 md:flex-row md:flex-wrap md:justify-center md:gap-x-5 md:gap-y-2 text-[14px] text-[#94A3B8]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#16A34A] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span>⚡ 7 free analyses</span>
                <span>⏱ Results in 30 seconds</span>
              </div>
            </ScrollReveal>

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
                <h2 className="text-[26px] md:text-[36px] lg:text-[42px] font-bold text-[#0F172A] leading-tight tracking-tight">
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
                <ScrollReveal key={f.label} delay={i * 0.04}>
                  <FeatureCard {...f} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ BEFORE / AFTER ══════════ */}
        <section className="bg-[#F8FAFC] py-16 md:py-24 px-6 md:px-4" id="before-after">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-8 md:mb-14">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">SEE THE DIFFERENCE</p>
                <h2 className="text-[26px] md:text-[36px] md:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
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
        <section className="bg-white py-12 md:py-24 px-6 md:px-4">
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

        {/* ══════════ PRICING ══════════ */}
        <section className="bg-[#F8FAFC] py-16 md:py-24 px-4" id="pricing">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10 md:mb-14">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">PRICING</p>
                <h2 className="text-[26px] md:text-[36px] md:text-[40px] font-bold text-[#0F172A] tracking-tight mb-3 leading-tight">
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
                    className={`relative bg-white rounded-[12px] md:rounded-[16px] p-6 md:p-8 flex flex-col h-full transition-all duration-200 ${plan.mobileOrder} ${
                      plan.highlight
                        ? "border-2 border-[#4F46E5] shadow-[0_4px_24px_rgba(79,70,229,0.15)]"
                        : "border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
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
                        <span className="text-[40px] md:text-[42px] font-bold text-[#0F172A] leading-none">{plan.price}</span>
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
                <h2 className="text-[26px] md:text-[36px] md:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
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
        <section className="bg-[#4F46E5] py-14 md:py-20 px-6 md:px-4 relative overflow-hidden">
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
              <p className="text-[15px] md:text-[18px] text-white/80 mb-7 md:mb-10 leading-relaxed">
                Join thousands of advertisers making data-driven creative decisions.
              </p>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4">
                <Link
                  href="/signup"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation", minHeight: "48px" }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#4F46E5] font-semibold text-[16px] px-7 rounded-[10px] active:bg-[#F8FAFC] md:hover:bg-[#F8FAFC] transition-colors duration-150 shadow-sm"
                >
                  Start for Free <Arrow />
                </Link>
                <a
                  href="#"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation", minHeight: "48px" }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold text-[16px] px-7 rounded-[10px] border border-white/30 active:bg-white/10 md:hover:bg-white/10 transition-colors duration-150"
                >
                  Book a demo <Arrow />
                </a>
              </div>
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
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A] mb-3 md:mb-4">Product</p>
                <ul>
                  {[
                    { label: "Features",   href: "#features" },
                    { label: "Pricing",    href: "#pricing"  },
                    { label: "Changelog",  href: "#"         },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.href} style={{ WebkitTapHighlightColor: "transparent" }} className="flex items-center h-10 text-[15px] text-[#64748B] md:hover:text-[#4F46E5] transition-colors duration-150">
                        {l.label}
                      </a>
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
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A] mb-3 md:mb-4">Resources</p>
                <ul>
                  {["Blog", "Help Center", "Documentation"].map((r) => (
                    <li key={r}>
                      <span className="flex items-center h-10 text-[15px] text-[#94A3B8] gap-2">
                        {r} <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">Soon</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A] mb-3 md:mb-4">Company</p>
                <ul>
                  {[
                    { label: "About",          href: "#"        },
                    { label: "Contact",        href: "#"        },
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
