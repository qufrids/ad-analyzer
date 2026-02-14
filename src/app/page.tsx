import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import LandingScoreRing from "@/components/landing/LandingScoreRing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdScore AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Upload your ad creative and get instant AI analysis with scores and actionable recommendations.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro", priceSpecification: { "@type": "UnitPriceSpecification", price: "29", priceCurrency: "USD", billingDuration: "P1M" } },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "500", bestRating: "5" },
};

const PROBLEM_STATS = [
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    stat: "$37B",
    title: "Wasted on underperforming ads yearly",
    desc: "Brands lose billions on creatives that fail to convert",
  },
  {
    icon: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
    stat: "67%",
    title: "Ads fail in the first 3 seconds",
    desc: "Most ads lose viewers before delivering their message",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    stat: "2+ hrs",
    title: "Manual review per creative",
    desc: "Traditional ad review is slow and subjective",
  },
];

const HOW_STEPS = [
  {
    num: "1",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    title: "Upload Your Ad",
    desc: "Drag & drop your image or paste a link",
  },
  {
    num: "2",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    title: "AI Analysis",
    desc: "Our AI analyzes hook strength, clarity, CTA effectiveness, and value proposition",
  },
  {
    num: "3",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Get Your Score",
    desc: "Receive a detailed score with actionable insights to improve your campaign",
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

const FAQS = [
  { q: "What types of ads can I analyze?", a: "Any static image ad — JPG, PNG, or WebP. We support Facebook, Instagram, TikTok, and Google Ads. Video analysis is coming soon." },
  { q: "How accurate is the AI analysis?", a: "Powered by Claude, one of the most advanced AI models. It evaluates across 6 proven dimensions that correlate with ad performance." },
  { q: "What do I get with 3 free analyses?", a: "Everything — full scoring, strengths, weaknesses, recommendations, competitor insights, and CTR predictions. No features held back." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your Settings page anytime. You keep Pro access until the end of your billing period." },
  { q: "How is this different from ChatGPT?", a: "AdScore AI uses a purpose-built framework with structured scoring, platform-specific best practices, and niche-aware benchmarks." },
  { q: "Do you store my ad images?", a: "Images are stored securely in your private bucket. Only you can access them. Delete your account and all data anytime." },
];

function CellValue({ value }: { value: string }) {
  if (value === "check") return <svg className="w-5 h-5 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
  if (value === "cross") return <svg className="w-5 h-5 text-red-400/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
  if (value === "dash") return <span className="text-gray-700 block text-center">—</span>;
  return <span>{value}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ClientNavbar />

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden pt-16">
        {/* Radial glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#06F5DC]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24 relative">
          <div className="text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13px] text-gray-400">
                <span className="text-sm">✨</span>
                AI-Powered Ad Analysis
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold leading-[1.08] tracking-tight">
                Stop Wasting Budget on
                <br />
                <span className="text-[#06F5DC]">Ads That Don&apos;t Convert</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Get a 0-100 score and actionable improvements for any ad in under 30 seconds.{" "}
                <span className="text-white font-semibold">Know exactly what to fix before you spend a dollar.</span>
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#06F5DC] to-[#8b5cf6] text-white font-semibold text-[15px] rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#06F5DC]/10"
                >
                  ✨ Analyze Your First Ad Free &rarr;
                </Link>
                <Link
                  href="#pricing"
                  className="w-full sm:w-auto px-7 py-3.5 border border-white/[0.15] hover:border-white/[0.3] text-white font-medium text-[15px] rounded-full transition-colors"
                >
                  ▷ View Pricing
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#06F5DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#06F5DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  3 free analyses
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#06F5DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Results in 30 seconds
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===================== THE PROBLEM ===================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                The <span className="text-red-400">Problem</span> With Ad Creatives Today
              </h2>
              <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                Without data-driven insights, you&apos;re guessing which ads will perform.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEM_STATS.map((s, i) => (
              <ScrollReveal key={s.stat} delay={i * 0.1}>
                <div className="bg-[#111827] border border-red-500/[0.12] rounded-2xl p-6 h-full hover:border-red-500/[0.25] transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-red-500/[0.08] flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                    </svg>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-red-400 mb-2">{s.stat}</p>
                  <p className="text-white font-semibold text-[15px] mb-1.5">{s.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
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
              <div className="inline-flex items-center px-3 py-1 mb-5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-gray-400 uppercase tracking-wider font-medium">
                Process
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                How <span className="text-[#06F5DC]">AdScore AI</span> Works
              </h2>
              <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                Get your ad analyzed in three simple steps.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div className="bg-[#111827] border border-[#06F5DC]/[0.08] rounded-2xl p-6 h-full hover:border-[#06F5DC]/[0.2] transition-colors relative">
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#06F5DC]/[0.1] to-[#8b5cf6]/[0.1] flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-[#06F5DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                    </svg>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#06F5DC] text-[#0B1120] text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BEFORE vs AFTER ===================== */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                See the{" "}
                <span className="relative inline-block">
                  Difference
                  <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06F5DC] to-[#8b5cf6] rounded-full" />
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BEFORE */}
            <ScrollReveal delay={0.1}>
              <div className="bg-[#111827] border border-red-500/[0.15] rounded-2xl overflow-hidden h-full">
                <div className="h-1 bg-red-500" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                      Before Optimization
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Ad Score</span>
                      <LandingScoreRing score={45} size={56} />
                    </div>
                  </div>

                  {/* Mock ad */}
                  <div className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-4 mb-5">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">Sponsored</span>
                    <div className="w-full h-24 bg-gray-800/40 rounded-lg my-3 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-white font-bold text-sm uppercase">Buy Our Product Now</h4>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                      We sell the best products. Click here to buy. Great prices available.
                    </p>
                    <button className="mt-3 w-full py-2 bg-gray-700 text-gray-400 text-xs font-medium rounded cursor-default">
                      Click Here
                    </button>
                  </div>

                  {/* Issues */}
                  <div className="space-y-2.5 mb-5">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Issues Found</p>
                    {[
                      "Generic headline lacks specificity",
                      "No value proposition or benefits",
                      "Weak call-to-action",
                      "Missing emotional triggers",
                    ].map((issue) => (
                      <div key={issue} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-gray-400 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats bar */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                    {[
                      { label: "Estimated CTR", value: "0.8%", color: "text-red-400" },
                      { label: "Engagement", value: "Low", color: "text-red-400" },
                      { label: "Conversion", value: "1.2%", color: "text-red-400" },
                    ].map((st) => (
                      <div key={st.label} className="text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">{st.label}</p>
                        <p className={`text-sm font-bold ${st.color}`}>{st.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* AFTER */}
            <ScrollReveal delay={0.2}>
              <div className="bg-[#111827] border border-green-500/[0.15] rounded-2xl overflow-hidden h-full">
                <div className="h-1 bg-gradient-to-r from-[#06F5DC] to-green-400" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                      After Optimization
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Ad Score</span>
                      <LandingScoreRing score={92} size={56} />
                    </div>
                  </div>

                  {/* Improved mock ad */}
                  <div className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-4 mb-5">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">Sponsored</span>
                    <div className="w-full h-24 bg-gradient-to-br from-[#06F5DC]/[0.08] to-[#8b5cf6]/[0.08] rounded-lg my-3 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#06F5DC]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-white font-bold text-sm">Transform Your Workflow in 5 Minutes</h4>
                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                      Join 50,000+ professionals saving 10+ hours weekly. AI-powered automation that learns your style.
                    </p>
                    <button className="mt-3 w-full py-2 bg-gradient-to-r from-[#06F5DC] to-[#06F5DC]/80 text-[#0B1120] text-xs font-bold rounded cursor-default">
                      Start Free Trial &rarr;
                    </button>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-2.5 mb-5">
                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Improvements Applied</p>
                    {[
                      "Specific, benefit-driven headline",
                      "Social proof with concrete numbers",
                      "Clear value proposition",
                      "Action-oriented CTA with urgency",
                    ].map((imp) => (
                      <div key={imp} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{imp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats bar */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                    {[
                      { label: "Estimated CTR", value: "3.2%", color: "text-green-400" },
                      { label: "Engagement", value: "High", color: "text-green-400" },
                      { label: "Conversion", value: "4.8%", color: "text-green-400" },
                    ].map((st) => (
                      <div key={st.label} className="text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">{st.label}</p>
                        <p className={`text-sm font-bold ${st.color}`}>{st.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===================== COMPARISON TABLE ===================== */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Why Choose <span className="text-[#06F5DC]">AdScore AI</span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-md mx-auto">
                See how we compare to the alternatives.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[540px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-4 text-left text-gray-500 font-medium text-xs uppercase tracking-wider w-[28%]">Feature</th>
                      <th className="px-5 py-4 text-center w-[24%]">
                        <div className="border-t-2 border-[#06F5DC] -mt-4 pt-3">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#06F5DC] to-[#8b5cf6] rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                              Recommended
                            </span>
                            <span className="font-semibold text-white text-[13px]">AdScore AI</span>
                          </div>
                        </div>
                      </th>
                      <th className="px-5 py-4 text-center text-gray-500 font-medium text-[13px] w-[24%]">Manual Review</th>
                      <th className="px-5 py-4 text-center text-gray-500 font-medium text-[13px] w-[24%]">Other Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={i < COMPARISON.length - 1 ? "border-b border-white/[0.04]" : ""}>
                        <td className="px-5 py-3.5 text-gray-400 font-medium text-[13px]">{row.feature}</td>
                        <td className="px-5 py-3.5 text-center bg-[#06F5DC]/[0.02] text-white font-medium text-[13px]">
                          <CellValue value={row.us} />
                        </td>
                        <td className="px-5 py-3.5 text-center text-gray-500 text-[13px]"><CellValue value={row.manual} /></td>
                        <td className="px-5 py-3.5 text-center text-gray-500 text-[13px]"><CellValue value={row.others} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section id="pricing" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Simple Pricing</h2>
              <p className="mt-4 text-gray-400">Start free. Upgrade when you need more.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 sm:p-8 h-full">
                <h3 className="text-lg font-bold text-white">Free</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-gray-500 ml-1.5 text-sm">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["3 ad analyses", "Full 6-dimension scoring", "Strengths & weaknesses", "Actionable recommendations", "Competitor insights"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block w-full text-center py-3 border border-white/[0.1] hover:border-white/[0.2] rounded-lg text-gray-300 hover:text-white font-medium text-sm transition-colors">
                  Get Started
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="relative h-full">
                <div className="absolute -inset-px bg-gradient-to-b from-[#06F5DC]/20 via-[#8b5cf6]/10 to-transparent rounded-2xl blur-sm" />
                <div className="relative bg-[#111827] border border-[#06F5DC]/20 rounded-2xl p-6 sm:p-8 h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#06F5DC] to-[#8b5cf6] rounded-full text-xs font-semibold text-white">
                    Most Popular
                  </div>
                  <h3 className="text-lg font-bold text-white">Pro</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-extrabold text-white">$29</span>
                    <span className="text-gray-500 ml-1.5 text-sm">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {["Unlimited analyses", "Everything in Free", "Priority AI processing", "PDF report downloads", "CTR predictions", "Cancel anytime"].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-[#06F5DC] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block w-full text-center py-3 bg-gradient-to-r from-[#06F5DC] to-[#8b5cf6] hover:opacity-90 rounded-lg text-white font-medium text-sm transition-opacity shadow-lg shadow-[#06F5DC]/10">
                    Upgrade to Pro &rarr;
                  </Link>
                </div>
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">FAQ</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 0.05}>
                <details className="group bg-[#111827] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#06F5DC]/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight relative">
              Ready to Make Every Ad <span className="text-[#06F5DC]">Count?</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Join hundreds of sellers who stopped guessing and started optimizing.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-8 px-8 py-3.5 bg-gradient-to-r from-[#06F5DC] to-[#8b5cf6] hover:opacity-90 rounded-full text-white font-semibold text-[15px] transition-opacity shadow-lg shadow-[#06F5DC]/10"
            >
              ✨ Get Started Free &rarr;
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/[0.04] bg-[#050510]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#06F5DC] to-[#8b5cf6] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">AdScore AI</span>
              </Link>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">AI-Powered Ad Creative Analysis</p>
              <div className="flex items-center gap-3">
                <a href="#" className="text-gray-700 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#" className="text-gray-700 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="#" className="text-gray-700 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
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
                {[{ label: "FAQ", href: "#faq" }, { label: "Blog", href: "#" }, { label: "Help Center", href: "#" }, { label: "API", href: "#" }].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[{ label: "About", href: "#" }, { label: "Contact", href: "#" }, { label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} AdScore AI. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
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
