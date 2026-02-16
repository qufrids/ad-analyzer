import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import LandingScoreRing from "@/components/landing/LandingScoreRing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdScore",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Predict ad performance before you spend. AI-powered creative analysis for media buyers and performance marketers.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro", priceSpecification: { "@type": "UnitPriceSpecification", price: "29", priceCurrency: "USD", billingDuration: "P1M" } },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "500", bestRating: "5" },
};

/* ── DATA ── */

const PAIN_POINTS = [
  {
    stat: "$37B",
    label: "wasted on underperforming ads each year",
    detail: "Brands launch creatives without data, burning budget on ads destined to fail.",
  },
  {
    stat: "67%",
    label: "of ads fail in the first 3 seconds",
    detail: "Without strong hooks and clear messaging, most ads never reach the viewer.",
  },
  {
    stat: "3.2x",
    label: "higher ROAS with pre-launch analysis",
    detail: "Teams that validate creatives before launch consistently outperform those that don\u2019t.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Upload Your Creative",
    desc: "Drop in your static ad image. We support Meta, TikTok, Google, and more.",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    num: "02",
    title: "AI Predicts Performance",
    desc: "Our model evaluates hook strength, copy clarity, CTA effectiveness, and platform fit in seconds.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    num: "03",
    title: "Improve Before Launch",
    desc: "Get specific, actionable changes that increase CTR likelihood and reduce wasted spend.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

const FEATURES = [
  {
    badge: "Core",
    title: "Performance Prediction Score",
    desc: "A single 0\u2013100 score that communicates how likely your ad is to perform above average. Built from patterns across thousands of high-performing creatives.",
    points: ["CTR likelihood assessment", "Platform-specific benchmarking", "Confidence level indicator"],
    color: "blue",
  },
  {
    badge: "Intelligence",
    title: "Hook & Attention Analysis",
    desc: "Evaluate the first-impression elements that determine whether someone stops scrolling or keeps going. The hook is everything in paid media.",
    points: ["Scroll-stopping potential", "Visual hierarchy clarity", "Emotional trigger detection"],
    color: "violet",
  },
  {
    badge: "Actionable",
    title: "Specific Improvement Roadmap",
    desc: "Not vague suggestions. Prioritized, specific changes ranked by impact so you know exactly what to fix first to improve performance.",
    points: ["Priority-ranked recommendations", "Copy and CTA rewrites", "Competitor positioning insights"],
    color: "emerald",
  },
];

const COMPARISON = [
  { feature: "Time to insight", us: "< 30 seconds", them: "30\u201360 min manual review" },
  { feature: "Scoring methodology", us: "6-dimension AI framework", them: "Subjective opinion" },
  { feature: "Hook analysis", us: "check", them: "cross" },
  { feature: "CTA optimization", us: "check", them: "cross" },
  { feature: "Prioritized recommendations", us: "check", them: "cross" },
  { feature: "Platform-specific insights", us: "check", them: "Limited" },
  { feature: "Cost", us: "Free / $29 mo", them: "$50+/hr or $99+/mo" },
];

const FAQS = [
  { q: "What types of ads can I analyze?", a: "Any static image ad \u2014 JPG, PNG, or WebP. We support Facebook, Instagram, TikTok, and Google Ads creatives. Video analysis is on our roadmap." },
  { q: "How accurate is the performance prediction?", a: "Our scoring framework is built around proven paid media principles \u2014 hook strength, copy clarity, CTA effectiveness, visual hierarchy, and platform fit. It correlates with real-world CTR patterns." },
  { q: "Who is this built for?", a: "Media buyers, performance marketers, DTC brands, and agencies running paid social. Anyone spending on ads who wants to reduce wasted budget." },
  { q: "What do I get with the free plan?", a: "3 full analyses with complete scoring, strengths, weaknesses, prioritized recommendations, competitor insights, and CTR predictions. Nothing held back." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your Settings page anytime. You keep Pro access until the end of your billing period." },
  { q: "Do you store my ad images?", a: "Images are stored securely in your private storage. Only you can access them. Delete your account and all data is removed." },
];

/* ── HELPERS ── */

function CellIcon({ type }: { type: string }) {
  if (type === "check") return <svg className="w-5 h-5 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
  if (type === "cross") return <svg className="w-5 h-5 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
  return <span className="text-sm text-gray-500">{type}</span>;
}

function FeatureColor(color: string) {
  const map: Record<string, { badge: string; border: string; dot: string }> = {
    blue: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", border: "border-blue-500/10 hover:border-blue-500/25", dot: "bg-blue-400" },
    violet: { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", border: "border-violet-500/10 hover:border-violet-500/25", dot: "bg-violet-400" },
    emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", border: "border-emerald-500/10 hover:border-emerald-500/25", dot: "bg-emerald-400" },
  };
  return map[color] || map.blue;
}

/* ── PAGE ── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ClientNavbar />

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24 relative">
          <div className="text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13px] text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-subtle" />
                Built for performance marketers
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.08] tracking-tight text-white">
                Predict Winning Ads
                <br />
                <span className="text-gray-500">Before You Spend.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
                Upload your ad creative. Get a performance prediction score, hook analysis, and specific improvements to increase CTR &mdash; in under 30 seconds.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-[15px] rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                  Analyze My Ad Free &rarr;
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-3.5 border border-white/[0.1] hover:border-white/[0.2] text-gray-300 hover:text-white font-medium text-[15px] rounded-lg transition-colors"
                >
                  See How It Works
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Designed for Meta &amp; TikTok ads
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Results in 30 seconds
                </span>
              </div>
            </ScrollReveal>

            {/* Hero preview card */}
            <ScrollReveal delay={0.5}>
              <div className="mt-14 max-w-2xl mx-auto">
                <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">Summer_Sale_V3.jpg</p>
                        <p className="text-xs text-gray-500">Meta &middot; E-commerce &middot; 1200x628</p>
                      </div>
                    </div>
                    <LandingScoreRing score={84} size={52} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Hook Strength", score: 91, color: "text-green-400" },
                      { label: "CTA Clarity", score: 78, color: "text-yellow-400" },
                      { label: "Platform Fit", score: 85, color: "text-green-400" },
                    ].map((m) => (
                      <div key={m.label} className="bg-[#0A0A0F] rounded-lg px-3 py-2.5 text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{m.label}</p>
                        <p className={`text-lg font-bold ${m.color}`}>{m.score}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-500/[0.06] border border-blue-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="text-xs text-blue-300">
                      <span className="font-semibold">Predicted CTR: 2.8\u20134.1%</span>
                      <span className="text-blue-400/60"> &mdash; Above average for Meta e-commerce</span>
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===================== PAIN POINTS ===================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wider">The problem</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight">
                Most Ads Fail Before They Start
              </h2>
              <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                Without pre-launch validation, you&apos;re spending money to discover what doesn&apos;t work.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAIN_POINTS.map((p, i) => (
              <ScrollReveal key={p.stat} delay={i * 0.1}>
                <div className="bg-[#111116] border border-red-500/[0.08] rounded-2xl p-6 h-full hover:border-red-500/[0.18] transition-colors">
                  <p className="text-3xl sm:text-4xl font-extrabold text-red-400 mb-2">{p.stat}</p>
                  <p className="text-white font-semibold text-[15px] mb-2">{p.label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how-it-works" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">Process</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight">
                From Upload to Insight in 30 Seconds
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 h-full hover:border-white/[0.12] transition-colors">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
                      {step.num}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES / 3 PILLARS ===================== */}
      <section id="features" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">Capabilities</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight">
                What You Get From Every Analysis
              </h2>
              <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                Not vague AI feedback. Specific, prioritized insights built around what actually moves ad performance.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const c = FeatureColor(f.color);
              return (
                <ScrollReveal key={f.title} delay={i * 0.1}>
                  <div className={`bg-[#111116] border ${c.border} rounded-2xl p-6 h-full transition-colors`}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border mb-5 ${c.badge}`}>
                      {f.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">{f.desc}</p>
                    <ul className="space-y-2.5">
                      {f.points.map((p) => (
                        <li key={p} className="flex items-center gap-2.5 text-sm text-gray-300">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== BEFORE vs AFTER ===================== */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">Results</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight">
                Find Weak Creatives Before They Cost You
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BEFORE */}
            <ScrollReveal delay={0.1}>
              <div className="bg-[#111116] border border-red-500/[0.1] rounded-2xl overflow-hidden h-full">
                <div className="h-0.5 bg-red-500/40" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                      Before Analysis
                    </span>
                    <LandingScoreRing score={38} size={48} />
                  </div>

                  <div className="bg-[#0A0A0F] border border-white/[0.04] rounded-xl p-4 mb-5">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">Sponsored &middot; Meta</span>
                    <div className="w-full h-20 bg-gray-800/30 rounded-lg my-3 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-white font-bold text-sm">Buy Our Product Now</h4>
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed">We sell the best products. Click here to buy.</p>
                    <button className="mt-2.5 w-full py-1.5 bg-gray-800 text-gray-500 text-xs font-medium rounded cursor-default">Click Here</button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {[
                      "Generic headline \u2014 no clear value",
                      "Weak hook \u2014 low scroll-stop potential",
                      "Vague CTA \u2014 no urgency or specificity",
                      "No social proof or credibility",
                    ].map((issue) => (
                      <div key={issue} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-500 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3.5 text-center">
                    <div><p className="text-[10px] text-gray-600 uppercase">Est. CTR</p><p className="text-sm font-bold text-red-400">0.8%</p></div>
                    <div><p className="text-[10px] text-gray-600 uppercase">Hook</p><p className="text-sm font-bold text-red-400">Weak</p></div>
                    <div><p className="text-[10px] text-gray-600 uppercase">Confidence</p><p className="text-sm font-bold text-red-400">Low</p></div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* AFTER */}
            <ScrollReveal delay={0.2}>
              <div className="bg-[#111116] border border-green-500/[0.1] rounded-2xl overflow-hidden h-full">
                <div className="h-0.5 bg-green-500/40" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                      After Optimization
                    </span>
                    <LandingScoreRing score={91} size={48} />
                  </div>

                  <div className="bg-[#0A0A0F] border border-white/[0.04] rounded-xl p-4 mb-5">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">Sponsored &middot; Meta</span>
                    <div className="w-full h-20 bg-blue-500/[0.04] rounded-lg my-3 flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-white font-bold text-sm">Cut Your Skincare Routine to 2 Minutes</h4>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">Join 12,000+ customers who simplified their routine. Dermatologist-approved.</p>
                    <button className="mt-2.5 w-full py-1.5 bg-blue-500 text-white text-xs font-bold rounded cursor-default">Shop Now \u2014 Free Shipping &rarr;</button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {[
                      "Benefit-driven headline with specificity",
                      "Strong hook \u2014 high scroll-stop potential",
                      "Clear CTA with urgency and value",
                      "Social proof with concrete numbers",
                    ].map((imp) => (
                      <div key={imp} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{imp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3.5 text-center">
                    <div><p className="text-[10px] text-gray-600 uppercase">Est. CTR</p><p className="text-sm font-bold text-green-400">3.4%</p></div>
                    <div><p className="text-[10px] text-gray-600 uppercase">Hook</p><p className="text-sm font-bold text-green-400">Strong</p></div>
                    <div><p className="text-[10px] text-gray-600 uppercase">Confidence</p><p className="text-sm font-bold text-green-400">High</p></div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===================== COMPARISON TABLE ===================== */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight">
                Why AdScore
              </h2>
              <p className="mt-4 text-gray-400 max-w-md mx-auto">
                Faster, more specific, and more affordable than alternatives.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-[#111116] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[440px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-4 text-left text-gray-500 font-medium text-xs uppercase tracking-wider w-[40%]"></th>
                      <th className="px-5 py-4 text-center w-[30%]">
                        <span className="font-semibold text-white text-[13px]">AdScore</span>
                      </th>
                      <th className="px-5 py-4 text-center text-gray-500 font-medium text-[13px] w-[30%]">Alternatives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={i < COMPARISON.length - 1 ? "border-b border-white/[0.04]" : ""}>
                        <td className="px-5 py-3.5 text-gray-400 font-medium text-[13px]">{row.feature}</td>
                        <td className="px-5 py-3.5 text-center bg-blue-500/[0.02] text-white font-medium text-[13px]">
                          <CellIcon type={row.us} />
                        </td>
                        <td className="px-5 py-3.5 text-center text-gray-500 text-[13px]"><CellIcon type={row.them} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== CREDIBILITY ===================== */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-sm font-medium text-blue-400 mb-4 uppercase tracking-wider">Methodology</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                Built on Real Paid Media Principles
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
                Our scoring framework is derived from patterns across thousands of high-performing ad creatives. Every dimension we evaluate &mdash; hook strength, copy clarity, CTA effectiveness, visual impact, brand consistency, and platform fit &mdash; is grounded in what actually drives CTR and conversion.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { num: "6", label: "Scoring dimensions" },
                  { num: "< 30s", label: "Analysis time" },
                  { num: "100+", label: "Ad patterns analyzed" },
                  { num: "4", label: "Platforms supported" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0A0A0F] rounded-xl px-4 py-4">
                    <p className="text-xl font-bold text-white">{s.num}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section id="pricing" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">Pricing</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight">
                Start Free. Scale When Ready.
              </h2>
              <p className="mt-4 text-gray-400">No hidden fees. Cancel anytime.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {/* Free */}
            <ScrollReveal delay={0.05}>
              <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 h-full">
                <h3 className="text-base font-bold text-white">Free</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-extrabold text-white">$0</span>
                  <span className="text-gray-500 ml-1 text-sm">/forever</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {["3 ad analyses", "Full 6-dimension scoring", "Actionable recommendations", "CTR predictions"].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block w-full text-center py-2.5 border border-white/[0.08] hover:border-white/[0.16] rounded-lg text-gray-300 hover:text-white font-medium text-sm transition-colors">
                  Get Started
                </Link>
              </div>
            </ScrollReveal>

            {/* Pro */}
            <ScrollReveal delay={0.1}>
              <div className="relative h-full">
                <div className="absolute -inset-px bg-blue-500/10 rounded-2xl blur-sm" />
                <div className="relative bg-[#111116] border border-blue-500/20 rounded-2xl p-6 h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-500 rounded-full text-[11px] font-semibold text-white">
                    Most Popular
                  </div>
                  <h3 className="text-base font-bold text-white">Pro</h3>
                  <div className="mt-4 mb-5">
                    <span className="text-3xl font-extrabold text-white">$29</span>
                    <span className="text-gray-500 ml-1 text-sm">/month</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {["Unlimited analyses", "Everything in Free", "Priority processing", "PDF report downloads", "Cancel anytime"].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block w-full text-center py-2.5 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium text-sm transition-colors">
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Agency */}
            <ScrollReveal delay={0.15}>
              <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 h-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gray-700 rounded-full text-[11px] font-medium text-gray-300">
                  Coming Soon
                </div>
                <h3 className="text-base font-bold text-white">Agency</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-extrabold text-white">$99</span>
                  <span className="text-gray-500 ml-1 text-sm">/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {["Everything in Pro", "Team collaboration", "Client reporting", "A/B comparison mode", "API access"].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button disabled className="block w-full text-center py-2.5 border border-white/[0.06] rounded-lg text-gray-600 font-medium text-sm cursor-not-allowed">
                  Notify Me
                </button>
              </div>
            </ScrollReveal>

            {/* Performance */}
            <ScrollReveal delay={0.2}>
              <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 h-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gray-700 rounded-full text-[11px] font-medium text-gray-300">
                  Coming Soon
                </div>
                <h3 className="text-base font-bold text-white">Performance</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-extrabold text-white">$249</span>
                  <span className="text-gray-500 ml-1 text-sm">/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {["Everything in Agency", "Custom scoring models", "Dedicated support", "Bulk analysis", "Priority roadmap access"].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button disabled className="block w-full text-center py-2.5 border border-white/[0.06] rounded-lg text-gray-600 font-medium text-sm cursor-not-allowed">
                  Notify Me
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section id="faq" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 0.05}>
                <details className="group bg-[#111116] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] text-white font-medium list-none">
                    {faq.q}
                    <svg className="w-4 h-4 text-gray-600 shrink-0 ml-4 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight relative">
              Stop Guessing.<br />Start Predicting.
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Join media buyers who validate creatives before spending budget. Your first 3 analyses are free.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-8 px-8 py-3.5 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-semibold text-[15px] transition-colors shadow-lg shadow-blue-500/20"
            >
              Predict My Ad Performance &rarr;
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/[0.04] bg-[#08080D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">AdScore</span>
              </Link>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">Predict ad performance<br />before you spend.</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[{ label: "Analyze", href: "/analyze" }, { label: "Pricing", href: "#pricing" }, { label: "How it Works", href: "#how-it-works" }, { label: "Dashboard", href: "/dashboard" }].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {[{ label: "FAQ", href: "#faq" }, { label: "Blog", href: "#" }, { label: "Help Center", href: "#" }].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[{ label: "About", href: "#" }, { label: "Contact", href: "#" }, { label: "Privacy", href: "#" }, { label: "Terms", href: "#" }].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} AdScore. All rights reserved.</p>
            <p className="text-xs text-gray-700">Built for performance marketers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
