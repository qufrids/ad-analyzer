import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import BeforeAfter from "@/components/landing/BeforeAfter";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdScore AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Upload your ad creative and get instant AI analysis with scores, specific feedback, and actionable recommendations.",
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "500",
    bestRating: "5",
  },
};

const PLATFORMS = [
  "Facebook Ads",
  "Instagram",
  "TikTok",
  "Google Ads",
  "Shopify",
  "Amazon",
];

const STEPS = [
  {
    num: "01",
    title: "Upload your ad creative",
    desc: "Drag and drop any image — JPG, PNG, or WebP up to 5MB.",
  },
  {
    num: "02",
    title: "AI analyzes 6 key dimensions",
    desc: "Visual impact, copy, hook, brand consistency, CTA, and platform fit.",
  },
  {
    num: "03",
    title: "Get instant recommendations",
    desc: "Actionable fixes prioritized by impact, with competitor insights.",
  },
];

const FEATURES = [
  {
    title: "6-Dimension Analysis",
    desc: "Scored 1-100 across visual impact, copy, hook, brand, CTA, and platform fit.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Platform-Specific Tips",
    desc: "Recommendations tailored for Facebook, Instagram, TikTok, or Google Ads.",
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    title: "CTR Prediction",
    desc: "Estimated click-through rate range before you spend a single dollar.",
    icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
  },
  {
    title: "Competitor Insights",
    desc: "Learn what top performers in your niche do differently.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    title: "Instant Results",
    desc: "Full analysis in under 30 seconds. No waiting, no scheduling.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Export Reports",
    desc: "Download PDF reports to share with your team or clients.",
    icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

const COMPARISON = [
  { feature: "Analysis Speed", us: "< 30 seconds", manual: "30-60 min", others: "2-5 min" },
  { feature: "Accuracy", us: "AI + 6 dimensions", manual: "Subjective", others: "Basic metrics" },
  { feature: "Actionable Insights", us: "check", manual: "cross", others: "dash" },
  { feature: "Hook Analysis", us: "check", manual: "dash", others: "cross" },
  { feature: "CTA Optimization", us: "check", manual: "dash", others: "cross" },
  { feature: "Platform Support", us: "check", manual: "check", others: "dash" },
  { feature: "Price", us: "Free / $29 mo", manual: "$50+/hour", others: "$99+/mo" },
];

const TESTIMONIALS = [
  {
    quote: "Saved me $2,000 in the first week. I was running ads with a terrible CTA and didn't even realize it.",
    name: "Sarah M.",
    role: "Shopify Store Owner",
  },
  {
    quote: "The platform-specific tips are gold. My TikTok CTR went from 0.4% to 1.8% after following the recommendations.",
    name: "James K.",
    role: "DTC Brand Founder",
  },
  {
    quote: "I used to spend hours guessing what was wrong with my creatives. Now I know in 30 seconds.",
    name: "Priya R.",
    role: "E-commerce Marketer",
  },
];

const FAQS = [
  {
    q: "What types of ads can I analyze?",
    a: "Any static image ad — JPG, PNG, or WebP. We support Facebook, Instagram, TikTok, and Google Ads. Video analysis is coming soon.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Powered by Claude, one of the most advanced AI models. It evaluates across 6 proven dimensions that correlate with ad performance.",
  },
  {
    q: "What do I get with 3 free analyses?",
    a: "Everything — full scoring, strengths, weaknesses, recommendations, competitor insights, and CTR predictions. No features held back.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your Settings page anytime. You keep Pro access until the end of your billing period.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "AdScore AI uses a purpose-built framework with structured scoring, platform-specific best practices, and niche-aware benchmarks — not generic paragraphs.",
  },
  {
    q: "Do you store my ad images?",
    a: "Images are stored securely in your private bucket. Only you can access them. Delete your account and all data anytime.",
  },
];

function CellValue({ value }: { value: string }) {
  if (value === "check")
    return (
      <svg className="w-5 h-5 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  if (value === "cross")
    return (
      <svg className="w-5 h-5 text-red-400/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  if (value === "dash") return <span className="text-neutral-700 block text-center">—</span>;
  return <span>{value}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white noise-overlay relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ClientNavbar />

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden pt-16">
        {/* Grid pattern */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-blue-600/8 via-violet-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24 relative">
          <div className="text-center">
            {/* Pill badge */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13px] text-neutral-400">
                <span className="text-sm">✨</span>
                AI-Powered Ad Analysis
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl mx-auto">
                Your Ads Are Losing Money.{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  We&apos;ll Tell You Why.
                </span>
              </h1>
            </ScrollReveal>

            {/* Subheading */}
            <ScrollReveal delay={0.2}>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
                Upload any ad creative and get instant AI analysis with scores,
                specific feedback, and actionable recommendations.
              </p>
            </ScrollReveal>

            {/* Buttons */}
            <ScrollReveal delay={0.3}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-lg font-semibold text-[15px] transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                >
                  Analyze Your Ad Free &rarr;
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-3.5 border border-white/[0.1] hover:border-white/[0.2] rounded-lg font-medium text-neutral-300 hover:text-white text-[15px] transition-all duration-200"
                >
                  See How It Works
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust line */}
            <ScrollReveal delay={0.4}>
              <p className="mt-6 text-xs text-neutral-600">
                Trusted by 500+ e-commerce sellers &bull; No credit card required
              </p>
            </ScrollReveal>
          </div>

          {/* ---- Hero mockup ---- */}
          <ScrollReveal delay={0.5}>
            <div className="mt-14 sm:mt-20 relative">
              {/* Glow behind */}
              <div className="absolute -inset-6 bg-gradient-to-b from-blue-600/5 to-violet-600/5 rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-8 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                  {[
                    { label: "Overall Score", value: "84", color: "text-green-400" },
                    { label: "Hook Strength", value: "91", color: "text-green-400" },
                    { label: "CTA Clarity", value: "67", color: "text-amber-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                      <p className="text-[10px] text-neutral-600 uppercase tracking-widest">{s.label}</p>
                      <p className={`text-3xl font-bold mt-1.5 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Visual Impact", pct: 88 },
                    { label: "Copy Effectiveness", pct: 72 },
                    { label: "Platform Fit", pct: 95 },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-neutral-500">{bar.label}</span>
                        <span className="text-xs text-neutral-400 font-medium">{bar.pct}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar.pct >= 80 ? "bg-green-400" : "bg-amber-400"}`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { text: "Strong hook", type: "good" },
                    { text: "Clear branding", type: "good" },
                    { text: "Weak CTA", type: "warn" },
                    { text: "Fix: Add urgency", type: "bad" },
                  ].map((tag) => (
                    <span
                      key={tag.text}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        tag.type === "good"
                          ? "border border-green-500/20 bg-green-500/5 text-green-400"
                          : tag.type === "warn"
                          ? "border border-amber-500/20 bg-amber-500/5 text-amber-400"
                          : "border border-red-500/20 bg-red-500/5 text-red-400"
                      }`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================== SOCIAL PROOF BAR ============================== */}
      <section className="border-y border-white/[0.04] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
              <span className="text-xs text-neutral-600 uppercase tracking-widest shrink-0">
                Works with
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 sm:ml-8">
                {PLATFORMS.map((p) => (
                  <span key={p} className="text-sm text-neutral-500 font-medium whitespace-nowrap">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================== BEFORE vs AFTER ============================== */}
      <section className="py-20 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                See the{" "}
                <span className="relative">
                  Difference
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                </span>
              </h2>
              <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                Real examples of how AI analysis transforms ad performance.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <BeforeAfter />
          </ScrollReveal>
        </div>
      </section>

      {/* ============================== HOW IT WORKS ============================== */}
      <section id="how-it-works" className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                From upload to actionable insights in under 30 seconds.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {STEPS.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 0.12}>
                <div className="text-center relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm font-mono text-neutral-400 mb-5">
                    {s.num}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FEATURES ============================== */}
      <section className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Everything You Need
              </h2>
              <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                Go beyond vanity metrics. Understand exactly what makes an ad convert.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.08}>
                <div className="group bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/15 to-violet-600/15 border border-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/5 transition-shadow duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== COMPARISON TABLE ============================== */}
      <section className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  AdScore AI
                </span>
              </h2>
              <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                See how we compare to the alternatives.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[540px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-4 text-left text-neutral-600 font-medium text-xs uppercase tracking-wider w-[28%]">
                        Feature
                      </th>
                      <th className="px-5 py-4 text-center bg-gradient-to-b from-blue-600/5 to-transparent w-[24%]">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                            Recommended
                          </span>
                          <span className="font-semibold text-white text-[13px]">AdScore AI</span>
                        </div>
                      </th>
                      <th className="px-5 py-4 text-center text-neutral-500 font-medium text-[13px] w-[24%]">
                        Manual Review
                      </th>
                      <th className="px-5 py-4 text-center text-neutral-500 font-medium text-[13px] w-[24%]">
                        Other Tools
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={i < COMPARISON.length - 1 ? "border-b border-white/[0.04]" : ""}
                      >
                        <td className="px-5 py-3.5 text-neutral-400 font-medium text-[13px]">{row.feature}</td>
                        <td className="px-5 py-3.5 text-center bg-blue-600/[0.03] text-white font-medium text-[13px]">
                          <CellValue value={row.us} />
                        </td>
                        <td className="px-5 py-3.5 text-center text-neutral-500 text-[13px]">
                          <CellValue value={row.manual} />
                        </td>
                        <td className="px-5 py-3.5 text-center text-neutral-500 text-[13px]">
                          <CellValue value={row.others} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                What Sellers Are Saying
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-[11px] font-semibold text-neutral-400">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-neutral-600">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== PRICING ============================== */}
      <section id="pricing" className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Simple Pricing
              </h2>
              <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                Start free. Upgrade when you need more.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 h-full">
                <h3 className="text-lg font-semibold text-white">Free</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-neutral-600 ml-1.5 text-sm">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "3 ad analyses",
                    "Full 6-dimension scoring",
                    "Strengths & weaknesses",
                    "Actionable recommendations",
                    "Competitor insights",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-400">
                      <svg className="w-4 h-4 text-neutral-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 border border-white/[0.08] hover:border-white/[0.15] rounded-lg text-neutral-300 hover:text-white font-medium text-sm transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </ScrollReveal>

            {/* Pro */}
            <ScrollReveal delay={0.2}>
              <div className="relative h-full">
                {/* Glow */}
                <div className="absolute -inset-px bg-gradient-to-b from-blue-600/20 via-violet-600/10 to-transparent rounded-2xl blur-sm" />
                <div className="relative bg-[#0a0a0a] border border-blue-500/20 rounded-2xl p-6 sm:p-8 h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full text-xs font-semibold text-white">
                    Most Popular
                  </div>
                  <h3 className="text-lg font-semibold text-white">Pro</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold text-white">$29</span>
                    <span className="text-neutral-600 ml-1.5 text-sm">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited analyses",
                      "Everything in Free",
                      "Priority AI processing",
                      "PDF report downloads",
                      "CTR predictions",
                      "Cancel anytime",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                        <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-lg text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-600/20"
                  >
                    Upgrade to Pro &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <p className="text-center mt-8 text-xs text-neutral-600">
              95% of users upgrade after their first analysis
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================== FAQ ============================== */}
      <section id="faq" className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">FAQ</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 0.06}>
                <details className="group bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/[0.1] transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] text-white font-medium list-none">
                    {faq.q}
                    <svg className="w-4 h-4 text-neutral-600 shrink-0 ml-4 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FINAL CTA ============================== */}
      <section className="py-20 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight relative">
              Ready to Make Every Ad{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Count?</span>
            </h2>
            <p className="mt-4 text-neutral-500 max-w-lg mx-auto">
              Join hundreds of sellers who stopped guessing and started optimizing.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-8 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-lg font-semibold text-[15px] transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
            >
              Get Started Free &rarr;
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="border-t border-white/[0.04] bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">AdScore AI</span>
              </Link>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                AI-Powered Ad Creative Analysis
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="text-neutral-700 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-700 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-700 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Analyze", href: "/analyze" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How it Works", href: "#how-it-works" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "FAQ", href: "#faq" },
                  { label: "Blog", href: "#" },
                  { label: "Help Center", href: "#" },
                  { label: "API", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-700">
              &copy; {new Date().getFullYear()} AdScore AI. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-neutral-700">
              Built with AI
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
