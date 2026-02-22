import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import LandingScoreRing from "@/components/landing/LandingScoreRing";

/* ─────────── JSON-LD ─────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdScore",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Ad Performance Intelligence Platform. Predict which ads will win before you spend money.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      name: "Pro",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "29",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
    },
  ],
};

/* ─────────── DATA ─────────── */

const HERO_METRICS = [
  { label: "Hook Strength",    score: 91, hi: true  },
  { label: "CTA Clarity",      score: 78, hi: false },
  { label: "Visual Impact",    score: 88, hi: true  },
  { label: "Platform Fit",     score: 95, hi: true  },
];

const TRUST_ITEMS = [
  "6-dimension scoring framework",
  "Meta & TikTok optimized",
  "Analysis in < 30 seconds",
  "Built for performance teams",
  "Data-driven, not opinionated",
];

const CAPABILITIES = [
  {
    label: "01",
    title: "Performance Prediction Score",
    body:
      "A single 0–100 score that communicates how likely your ad is to perform above average — before you spend a dollar testing it.",
    detail: "CTR · ROAS · Confidence",
    color: "green",
  },
  {
    label: "02",
    title: "Hook Intelligence",
    body:
      "Evaluate the first 1–3 seconds that determine whether someone stops scrolling. Strong hooks drive 60–80% of ad performance.",
    detail: "Scroll-stop · Attention · Pattern interrupt",
    color: "blue",
  },
  {
    label: "03",
    title: "Creative Weakness Detection",
    body:
      "Identify exactly where your creative loses viewers — weak value props, confusing CTAs, poor visual hierarchy — before launch.",
    detail: "Copy · Structure · Clarity",
    color: "orange",
  },
  {
    label: "04",
    title: "Confidence Indicator",
    body:
      "Know how confident the analysis is and where variance exists. Scale decisions backed by probability, not gut feel.",
    detail: "Certainty · Range · Platform variance",
    color: "violet",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Upload your creative",
    body: "Drop in any static image ad. JPG, PNG, or WebP. No account needed for your first three.",
  },
  {
    step: "02",
    title: "AI predicts performance",
    body: "Our engine evaluates 6 dimensions in seconds — hook strength, copy, CTA, visual impact, brand fit, platform alignment.",
  },
  {
    step: "03",
    title: "Fix weak spots",
    body: "Receive prioritized, specific recommendations ranked by impact. Know exactly what to improve before you spend.",
  },
  {
    step: "04",
    title: "Scale winners confidently",
    body: "Launch with a data-backed confidence score. Stop guessing which creative deserves more budget.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We were launching 8 creatives a week blindly. AdScore cut our dud rate from 62% to under 20% in the first month. It\u2019s now required before any creative goes live.",
    name: "Sarah K.",
    role: "Media Buyer, DTC Fashion Brand",
  },
  {
    quote:
      "The hook strength analysis alone paid for itself. I can predict scroll-stop potential before we spend on testing. Our agency\u2019s creative QA time dropped by half.",
    name: "Marcus R.",
    role: "Performance Marketing Lead",
  },
  {
    quote:
      "Clients ask how we consistently launch strong creatives. AdScore is our pre-launch quality gate. It\u2019s the difference between confident scaling and expensive guessing.",
    name: "David L.",
    role: "Founder, Paid Media Agency",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    desc: "Start validating creatives today.",
    features: [
      "3 full analyses",
      "6-dimension scoring",
      "Actionable recommendations",
      "CTR predictions",
      "PDF export",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
    soon: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/month",
    desc: "For marketers who ship consistently.",
    features: [
      "Unlimited analyses",
      "Everything in Free",
      "Priority AI processing",
      "Full PDF reports",
      "Cancel anytime",
    ],
    cta: "Upgrade to Pro",
    href: "/signup",
    highlight: true,
    soon: false,
  },
  {
    name: "Agency",
    price: "$99",
    cadence: "/month",
    desc: "For teams managing multiple brands.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Client reporting",
      "A/B comparison mode",
      "API access",
    ],
    cta: "Coming Soon",
    href: "#",
    highlight: false,
    soon: true,
  },
  {
    name: "Performance",
    price: "$249",
    cadence: "/month",
    desc: "For agencies at scale.",
    features: [
      "Everything in Agency",
      "Custom scoring models",
      "Dedicated support",
      "Bulk analysis",
      "Priority roadmap",
    ],
    cta: "Coming Soon",
    href: "#",
    highlight: false,
    soon: true,
  },
];

const FAQS = [
  {
    q: "What types of ads can I analyze?",
    a: "Any static image ad — JPG, PNG, or WebP. We support Meta (Facebook/Instagram), TikTok, and Google Ads. Video analysis is on our roadmap.",
  },
  {
    q: "How is the score calculated?",
    a: "We evaluate 6 proven dimensions that correlate with ad performance: hook strength, copy effectiveness, CTA clarity, visual impact, brand consistency, and platform fit. Each dimension is scored 0–100.",
  },
  {
    q: "Who is this built for?",
    a: "Media buyers, performance marketers, DTC brands, and agencies running paid social. Anyone spending on ads who wants to reduce wasted creative budget.",
  },
  {
    q: "What do I get with 3 free analyses?",
    a: "Everything — full scoring, strengths, weaknesses, prioritized recommendations, competitor insights, CTR predictions, and a PDF export. No features held back.",
  },
  {
    q: "How does this differ from just asking ChatGPT?",
    a: "AdScore uses a structured, purpose-built scoring framework with platform-specific benchmarks, niche-aware context, and 6 validated performance dimensions — not free-form opinion.",
  },
  {
    q: "Is my creative data secure?",
    a: "Yes. Images are stored in your private, encrypted storage. Only you can access them. Delete your account anytime to remove all data.",
  },
];

/* ─────────── HELPERS ─────────── */

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-400 dark:text-zinc-500 mb-4">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.06]">
      {children}
    </h2>
  );
}

/* MetricBar lives inside the intentionally-dark product mock card */
function MetricBar({ label, score, hi }: { label: string; score: number; hi: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-zinc-400">{label}</span>
        <span className={`text-[11px] font-bold ${hi ? "text-green-400" : "text-yellow-400"}`}>
          {score}
        </span>
      </div>
      <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: hi ? "#22C55E" : "#EAB308" }}
        />
      </div>
    </div>
  );
}

const capColor: Record<string, string> = {
  green:  "text-green-600  dark:text-green-400  bg-green-50  dark:bg-green-500/10  border-green-200  dark:border-green-500/20",
  blue:   "text-blue-600   dark:text-blue-400   bg-blue-50   dark:bg-blue-500/10   border-blue-200   dark:border-blue-500/20",
  orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20",
  violet: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
};

/* ─────────── PAGE ─────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-slate-900 dark:text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ClientNavbar />

      {/* ══════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════ */}
      <section className="relative pt-16 overflow-hidden">
        {/* Very subtle green radial — barely visible in light mode */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.025] dark:opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse at 50% 0%, #22C55E 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">

            {/* ── LEFT: Copy ── */}
            <div>
              <ScrollReveal>
                {/* Premium trust badge — editorial quality */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-emerald-100 dark:border-white/[0.08] bg-emerald-50 dark:bg-white/[0.03]">
                  <svg className="w-3 h-3 text-emerald-500 dark:text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[12px] font-medium text-emerald-700 dark:text-zinc-400">
                    Trusted by 500+ performance teams
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-[-0.02em] leading-[1.02] text-slate-900 dark:text-white">
                  Know Which Ads
                  <br />
                  Will Win —{" "}
                  <span className="text-green-600 dark:text-green-400">Before</span>
                  <br />
                  You Spend.
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <p className="mt-7 text-[17px] text-slate-500 dark:text-zinc-400 leading-[1.75] max-w-lg">
                  Upload your creative. Our AI predicts performance, surfaces weak
                  spots, and tells you exactly what to improve — in under 30
                  seconds.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.22}>
                <div className="mt-9 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-[15px] rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-100 transition-colors shadow-sm"
                  >
                    Analyze My Ad
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-white/[0.1] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/[0.2] font-medium text-[15px] rounded-xl transition-colors"
                  >
                    See Example Analysis
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.28}>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                  {["No credit card required", "3 free analyses", "Results in 30 seconds"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-zinc-500">
                      <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {t}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* ── RIGHT: Product Mock (always dark — intentional product screenshot) ── */}
            <ScrollReveal delay={0.18} className="w-full">
              <div className="relative">
                {/* Subtle glow behind card */}
                <div
                  aria-hidden
                  className="absolute -inset-6 rounded-3xl opacity-10 dark:opacity-20 blur-2xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, #22C55E 0%, transparent 70%)" }}
                />

                <div className="relative bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/60">
                  {/* Window chrome */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono ml-1">Summer_Campaign_V4.jpg</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
                      <span className="text-[10px] text-zinc-500">Analysis complete</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-2">Performance Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[52px] font-black text-white leading-none">84</span>
                          <span className="text-zinc-500 text-sm">/100</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-[11px] text-zinc-400">Top 28% for Meta E-commerce</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-3 py-2 bg-green-500/[0.08] border border-green-500/[0.15] rounded-xl">
                          <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-zinc-500">Est. CTR</p>
                          <p className="text-xl font-black text-green-400 leading-tight">2.8–4.1%</p>
                        </div>
                        <p className="text-[9px] text-zinc-600 mt-1.5">Above avg for niche</p>
                      </div>
                    </div>

                    <div className="bg-zinc-800/60 border border-white/[0.05] rounded-xl h-[88px] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/20 to-transparent" />
                      <div className="absolute bottom-2 left-2.5">
                        <span className="text-[9px] font-semibold text-zinc-600 bg-zinc-800/80 px-1.5 py-0.5 rounded uppercase tracking-wider">Sponsored</span>
                      </div>
                      <div className="text-center px-8 relative">
                        <div className="h-2 bg-white/[0.12] rounded-full w-36 mb-2 mx-auto" />
                        <div className="h-1.5 bg-white/[0.07] rounded-full w-28 mb-1.5 mx-auto" />
                        <div className="h-1.5 bg-white/[0.07] rounded-full w-20 mx-auto" />
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {HERO_METRICS.map((m) => (
                        <MetricBar key={m.label} {...m} />
                      ))}
                    </div>

                    <div className="bg-zinc-800/50 border border-white/[0.05] rounded-xl p-3.5">
                      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-1">Top Recommendation</p>
                      <p className="text-[12px] text-zinc-300 leading-relaxed">
                        Headline is strong. Tighten the CTA from &ldquo;Learn More&rdquo; to a specific outcome — could push CTR above 4%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 2  TRUST BAR
      ══════════════════════════════════════ */}
      <div className="border-y border-slate-100 dark:border-white/[0.05] bg-white dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {TRUST_ITEMS.map((t) => (
              <span key={t} className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-zinc-500">
                <svg className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          § 3  PROBLEM
      ══════════════════════════════════════ */}
      <section className="py-24 sm:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-start">

            <ScrollReveal>
              <Overline>The Problem</Overline>
              <SectionHeading>
                Most Ads Fail
                <br />
                Before They
                <br />
                Even Launch.
              </SectionHeading>
              <p className="mt-6 text-slate-500 dark:text-zinc-400 text-[17px] leading-[1.75] max-w-md">
                The creative testing cycle is broken. Teams spend money to find out
                what doesn&rsquo;t work. By then, budget is gone and confidence is low.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { stat: "$37B", label: "Wasted on underperforming ads yearly" },
                  { stat: "67%",  label: "Ads fail in the first 3 seconds" },
                  { stat: "3.2×", label: "Higher ROAS with pre-launch validation" },
                ].map((s) => (
                  <div key={s.stat}>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{s.stat}</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <div className="space-y-0">
              {[
                {
                  num: "01",
                  title: "Guessing which creative will win",
                  body: "Creative decisions rely on intuition. There is no data. The team debates, picks one, launches — and prays.",
                },
                {
                  num: "02",
                  title: "Discovering failure after you've spent",
                  body: "Most performance marketers find out a creative is weak after $2,000–$10,000 in test spend. Too late.",
                },
                {
                  num: "03",
                  title: "Slow testing cycles killing momentum",
                  body: "Each failed creative costs 5–14 days. At agency scale, that compounds into months of wasted velocity.",
                },
                {
                  num: "04",
                  title: "Scaling without confidence",
                  body: "Scaling an unvalidated creative is a gamble. The budget multiplies, and so does the risk of a dud.",
                },
              ].map((p, i) => (
                <ScrollReveal key={p.num} delay={i * 0.07}>
                  <div className="flex gap-5 py-6 border-b border-slate-100 dark:border-white/[0.05] group">
                    <span className="text-[11px] font-mono text-slate-300 dark:text-zinc-600 pt-0.5 shrink-0 w-6">
                      {p.num}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-slate-900 dark:text-white mb-1.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 4  PRODUCT INTELLIGENCE
      ══════════════════════════════════════ */}
      <section id="features" className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16 sm:mb-20">
              <Overline>Product Intelligence</Overline>
              <SectionHeading>
                What You Get From
                <br />
                Every Analysis
              </SectionHeading>
              <p className="mt-5 text-slate-500 dark:text-zinc-400 text-[17px] leading-[1.75]">
                Not vague AI feedback. Structured, prioritized intelligence built
                around what actually drives ad performance.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((c, i) => (
              <ScrollReveal key={c.label} delay={i * 0.07}>
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/[0.07] rounded-xl p-6 h-full shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:border-slate-200 dark:hover:border-white/[0.13] transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono text-slate-300 dark:text-zinc-600">{c.label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${capColor[c.color]}`}>
                      {c.color === "green"  ? "Core"         :
                       c.color === "blue"   ? "Intelligence" :
                       c.color === "orange" ? "Detection"    : "Confidence"}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed mb-5">{c.body}</p>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-300 dark:text-zinc-600">
                    {c.detail}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 5  AD COMPARISON
      ══════════════════════════════════════ */}
      <section className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-16">
              <div>
                <Overline>Creative Comparison</Overline>
                <SectionHeading>
                  Find the Winner
                  <br />
                  Before You Spend.
                </SectionHeading>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] text-[11px] text-slate-500 dark:text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Coming to Pro
                </span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_64px_1fr] gap-4 items-stretch">

            {/* Ad A — LOSER (always dark — product screenshot) */}
            <ScrollReveal delay={0.05}>
              <div className="bg-zinc-900 border border-white/[0.07] rounded-xl overflow-hidden h-full shadow-lg shadow-black/10 dark:shadow-none">
                <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-mono">Creative_A.jpg</span>
                  <LandingScoreRing score={38} size={44} />
                </div>
                <div className="p-5 space-y-5">
                  <div className="bg-zinc-800/50 border border-white/[0.04] rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center px-6">
                      <div className="h-2 bg-white/[0.08] rounded w-28 mb-2 mx-auto" />
                      <div className="h-1.5 bg-white/[0.05] rounded w-20 mb-1 mx-auto" />
                      <div className="h-5 bg-white/[0.06] rounded w-16 mx-auto mt-2" />
                    </div>
                    <div className="absolute bottom-1.5 left-2.5">
                      <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Sponsored</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Hook Strength", score: 29 },
                      { label: "CTA Clarity",   score: 41 },
                      { label: "Visual Impact", score: 38 },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-zinc-500">{m.label}</span>
                          <span className="text-[11px] font-bold text-red-400">{m.score}</span>
                        </div>
                        <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-red-500/60" style={{ width: `${m.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      "Generic headline — no specific benefit",
                      "No social proof or credibility",
                      "CTA too vague to drive action",
                    ].map((issue) => (
                      <div key={issue} className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-red-400/60 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-[12px] text-zinc-600">{issue}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/[0.05] grid grid-cols-3 text-center gap-2">
                    {[{ label: "Est. CTR", val: "0.7%" }, { label: "Hook", val: "Weak" }, { label: "Confidence", val: "Low" }].map((s) => (
                      <div key={s.label}>
                        <p className="text-[9px] uppercase tracking-wider text-zinc-600 mb-0.5">{s.label}</p>
                        <p className="text-sm font-bold text-red-400">{s.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* VS divider */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-3 py-8">
              <div className="flex-1 w-px bg-slate-200 dark:bg-white/[0.05]" />
              <span className="text-[11px] font-black text-slate-300 dark:text-zinc-600 tracking-widest">VS</span>
              <div className="flex-1 w-px bg-slate-200 dark:bg-white/[0.05]" />
            </div>
            <div className="lg:hidden flex items-center justify-center py-2">
              <span className="text-[11px] font-black text-slate-300 dark:text-zinc-600 tracking-widest px-4">VS</span>
            </div>

            {/* Ad B — WINNER (always dark — product screenshot) */}
            <ScrollReveal delay={0.12}>
              <div className="bg-zinc-900 border border-green-500/[0.18] rounded-xl overflow-hidden h-full relative shadow-lg shadow-black/10 dark:shadow-none">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-green-500/40 via-green-400/60 to-green-500/40" />
                <div className="px-5 py-3.5 border-b border-green-500/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-zinc-500 font-mono">Creative_B.jpg</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-black text-green-400 bg-green-500/10 border border-green-500/20 rounded uppercase tracking-widest">Winner</span>
                  </div>
                  <LandingScoreRing score={91} size={44} />
                </div>
                <div className="p-5 space-y-5">
                  <div className="bg-green-500/[0.04] border border-green-500/[0.08] rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center px-6">
                      <div className="h-2 bg-white/[0.18] rounded w-36 mb-2 mx-auto" />
                      <div className="h-1.5 bg-white/[0.10] rounded w-28 mb-1 mx-auto" />
                      <div className="h-5 bg-green-500/30 rounded w-20 mx-auto mt-2" />
                    </div>
                    <div className="absolute bottom-1.5 left-2.5">
                      <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Sponsored</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Hook Strength", score: 94 },
                      { label: "CTA Clarity",   score: 88 },
                      { label: "Visual Impact", score: 91 },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-zinc-400">{m.label}</span>
                          <span className="text-[11px] font-bold text-green-400">{m.score}</span>
                        </div>
                        <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${m.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      "Specific headline with clear outcome",
                      "12,000+ customers social proof",
                      "Urgency-driven CTA with value",
                    ].map((s) => (
                      <div key={s} className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[12px] text-zinc-400">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/[0.05] grid grid-cols-3 text-center gap-2">
                    {[{ label: "Est. CTR", val: "3.6%" }, { label: "Hook", val: "Strong" }, { label: "Confidence", val: "High" }].map((s) => (
                      <div key={s.label}>
                        <p className="text-[9px] uppercase tracking-wider text-zinc-600 mb-0.5">{s.label}</p>
                        <p className="text-sm font-bold text-green-400">{s.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Insight strip */}
          <ScrollReveal delay={0.15}>
            <div className="mt-5 p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/[0.07] rounded-xl shadow-sm dark:shadow-none flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="shrink-0">
                <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-400 dark:text-zinc-500 mb-1">
                  Why Creative B Wins
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">+53</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">points on Hook Strength</span>
                  <span className="text-slate-200 dark:text-zinc-700 mx-1">·</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">+47</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">points on CTA Clarity</span>
                </div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-slate-100 dark:bg-white/[0.06]" />
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Creative B leads with a specific, outcome-driven hook and substantive social proof.
                These two factors account for the majority of the 53-point gap in performance prediction.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 6  WORKFLOW
      ══════════════════════════════════════ */}
      <section id="workflow" className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-xl mb-16">
              <Overline>Workflow</Overline>
              <SectionHeading>
                From Upload to
                <br />
                Confident Launch
              </SectionHeading>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
            <div
              aria-hidden
              className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent"
            />

            {WORKFLOW.map((w, i) => (
              <ScrollReveal key={w.step} delay={i * 0.08}>
                <div className="relative p-6 lg:p-8 group">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-center mb-5 relative z-10 group-hover:border-green-200 dark:group-hover:border-green-500/30 group-hover:bg-green-50 dark:group-hover:bg-green-500/[0.06] transition-all">
                    <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 font-mono group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {w.step}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-2.5 leading-snug">
                    {w.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed">{w.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 7  TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Overline>Testimonials</Overline>
              <SectionHeading>What Performance Teams Say</SectionHeading>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.08}>
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/[0.07] rounded-xl p-7 h-full shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:border-slate-200 dark:hover:border-white/[0.12] transition-all duration-200 flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} className="w-3.5 h-3.5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-[14px] text-slate-600 dark:text-zinc-300 leading-[1.75] flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 8  PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Overline>Pricing</Overline>
              <SectionHeading>Start Free. Scale When Ready.</SectionHeading>
              <p className="mt-5 text-slate-500 dark:text-zinc-400 text-[16px] max-w-md mx-auto leading-[1.75]">
                No contracts. No hidden fees. Cancel anytime.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 0.07}>
                <div
                  className={`relative rounded-xl overflow-hidden h-full flex flex-col ${
                    p.highlight
                      ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl shadow-slate-900/20 dark:shadow-none"
                      : p.soon
                      ? "bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/[0.05]"
                      : "bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/[0.07] shadow-sm dark:shadow-none"
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-green-400/60 via-green-300 to-green-400/60" />
                  )}
                  {p.soon && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[9px] font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider px-2 py-0.5 border border-slate-200 dark:border-white/[0.06] rounded">
                        Soon
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className={`text-[13px] font-semibold mb-4 ${
                      p.highlight ? "text-slate-400 dark:text-zinc-600" : "text-slate-500 dark:text-zinc-400"
                    }`}>
                      {p.name}
                    </h3>

                    <div className="flex items-baseline gap-1 mb-2">
                      <span className={`text-4xl font-black tracking-tight ${
                        p.highlight ? "text-white dark:text-zinc-900" : p.soon ? "text-slate-300 dark:text-zinc-600" : "text-slate-900 dark:text-white"
                      }`}>
                        {p.price}
                      </span>
                      <span className={`text-sm ${
                        p.highlight ? "text-slate-400 dark:text-zinc-500" : "text-slate-400 dark:text-zinc-600"
                      }`}>
                        {p.cadence}
                      </span>
                    </div>

                    <p className={`text-[12px] mb-7 ${
                      p.highlight ? "text-slate-400 dark:text-zinc-500" : "text-slate-400 dark:text-zinc-600"
                    }`}>
                      {p.desc}
                    </p>

                    <ul className="space-y-2.5 flex-1 mb-8">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <svg
                            className={`w-4 h-4 shrink-0 ${
                              p.highlight
                                ? "text-green-400 dark:text-green-500"
                                : p.soon
                                ? "text-slate-300 dark:text-zinc-700"
                                : "text-green-500 dark:text-green-400"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-[13px] ${
                            p.highlight
                              ? "text-slate-300 dark:text-zinc-700"
                              : p.soon
                              ? "text-slate-400 dark:text-zinc-600"
                              : "text-slate-600 dark:text-zinc-300"
                          }`}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {p.soon ? (
                      <button
                        disabled
                        className="w-full py-2.5 border border-slate-200 dark:border-white/[0.06] rounded-lg text-slate-400 dark:text-zinc-600 text-[13px] font-semibold cursor-not-allowed"
                      >
                        {p.cta}
                      </button>
                    ) : (
                      <Link
                        href={p.href}
                        className={`block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                          p.highlight
                            ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                            : "bg-slate-900 dark:bg-white/[0.06] text-white hover:bg-slate-800 dark:hover:bg-white/[0.10] border border-slate-800 dark:border-white/[0.08]"
                        }`}
                      >
                        {p.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 9  FAQ
      ══════════════════════════════════════ */}
      <section className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Overline>FAQ</Overline>
              <SectionHeading>Common Questions</SectionHeading>
            </div>
          </ScrollReveal>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 0.04}>
                <details className="group py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <span className="text-[15px] font-semibold text-slate-900 dark:text-white group-open:text-green-600 dark:group-open:text-green-400 transition-colors">
                      {faq.q}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400 dark:text-zinc-600 shrink-0 group-open:rotate-180 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[14px] text-slate-500 dark:text-zinc-400 leading-[1.75] pr-8">
                    {faq.a}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 10  FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-24 sm:py-36 border-t border-slate-100 dark:border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 opacity-[0.02] dark:opacity-[0.035]"
            style={{ background: "radial-gradient(ellipse at 50% 50%, #22C55E, transparent 70%)" }}
          />
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-black tracking-[-0.02em] leading-[1.04] text-slate-900 dark:text-white relative">
              Stop Guessing.
              <br />
              Start Launching Winners.
            </h2>
            <p className="mt-6 text-slate-500 dark:text-zinc-400 text-[17px] max-w-lg mx-auto leading-[1.75]">
              Join performance marketers who validate creatives before spending budget.
              Your first 3 analyses are completely free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-[15px] rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-100 transition-colors shadow-sm"
              >
                Analyze Your First Ad
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <p className="mt-5 text-[12px] text-slate-400 dark:text-zinc-600">
              No credit card · 3 free analyses · Results in 30 seconds
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          § 11  FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-slate-100 dark:border-white/[0.05] bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect width="22" height="22" rx="5" fill="#22C55E" />
                  <path d="M11.5 4L5 12h6.5L10 18l7-10H10.5L11.5 4z" fill="white" strokeLinejoin="round" />
                </svg>
                <span className="text-[14px] font-bold text-slate-900 dark:text-white">AdScore</span>
              </Link>
              <p className="text-[13px] text-slate-400 dark:text-zinc-600 leading-relaxed max-w-[200px]">
                Ad Performance Intelligence Platform for serious marketers.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-widest mb-5">
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Analyze", href: "/analyze" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How It Works", href: "#workflow" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-widest mb-5">
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Blog", href: "#" },
                  { label: "Help Center", href: "#" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-widest mb-5">
                Legal
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Privacy", href: "#" },
                  { label: "Terms", href: "#" },
                  { label: "Contact", href: "#" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-slate-100 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-slate-400 dark:text-zinc-700">
              &copy; {new Date().getFullYear()} AdScore. All rights reserved.
            </p>
            <p className="text-[12px] text-slate-400 dark:text-zinc-700">
              Built for performance marketers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
