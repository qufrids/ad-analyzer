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
  description:
    "Upload your ad creative and get instant AI analysis with scores, specific feedback, and actionable recommendations. Built for Shopify, Amazon, and e-commerce sellers.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description: "3 ad analyses with full scoring and recommendations",
    },
    {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      name: "Pro",
      description: "Unlimited analyses, priority processing, PDF reports",
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

const STEPS = [
  {
    step: "01",
    title: "Upload Your Ad",
    desc: "Drag and drop your ad creative — JPG, PNG, or WebP up to 5MB.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Add Context",
    desc: "Tell us the platform, niche, and target audience for tailored analysis.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Get Instant Results",
    desc: "Receive a detailed breakdown with scores, fixes, and competitor insights.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "6-Dimension Scoring",
    desc: "Visual impact, copy effectiveness, hook strength, brand consistency, CTA clarity, and platform fit — scored 1 to 100.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Platform-Specific Tips",
    desc: "Get recommendations optimized for Facebook, Instagram, TikTok, or Google Ads — not generic advice.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Competitor Insights",
    desc: "Learn what top-performing ads in your niche are doing differently — and how to beat them.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "CTR Predictions",
    desc: "Get an estimated click-through rate range based on your creative quality before you spend a penny.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
];

const COMPARISON_ROWS = [
  { feature: "Analysis Speed", us: "< 30 seconds", manual: "30-60 minutes", others: "2-5 minutes" },
  { feature: "Accuracy", us: "AI + 6 dimensions", manual: "Subjective opinions", others: "Basic metrics only" },
  { feature: "Actionable Insights", us: "check", manual: "cross", others: "dash" },
  { feature: "Hook Analysis", us: "check", manual: "dash", others: "cross" },
  { feature: "CTA Optimization", us: "check", manual: "dash", others: "cross" },
  { feature: "Multi-Platform", us: "check", manual: "check", others: "dash" },
  { feature: "Cost Efficiency", us: "Free / $29 mo", manual: "$50+/hour", others: "$99+/mo" },
];

const FAQS = [
  {
    q: "What types of ads can I analyze?",
    a: "Any static image ad — JPG, PNG, or WebP. We support Facebook, Instagram, TikTok, and Google Ads formats. Video analysis is coming soon.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Our analysis is powered by Claude, one of the most advanced AI models. It evaluates your creative across 6 proven dimensions that correlate with ad performance. While no tool can guarantee results, our users report significantly better CTRs after implementing our recommendations.",
  },
  {
    q: "What do I get with 3 free analyses?",
    a: "Everything — full 6-dimension scoring, strengths and weaknesses, prioritized recommendations, competitor insights, and CTR predictions. No features are held back.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes, cancel anytime from your Settings page. You'll keep Pro access until the end of your billing period. No questions asked.",
  },
  {
    q: "How is this different from asking ChatGPT to review my ad?",
    a: "AdScore AI uses a purpose-built analysis framework with structured scoring, platform-specific best practices, and niche-aware competitor benchmarks. You get consistent, actionable output — not a generic paragraph.",
  },
  {
    q: "Do you store my ad images?",
    a: "Images are stored securely in your private storage bucket. Only you can access them. You can delete your account and all data at any time from Settings.",
  },
];

function ComparisonCell({ value }: { value: string }) {
  if (value === "check") {
    return (
      <svg className="w-5 h-5 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (value === "cross") {
    return (
      <svg className="w-5 h-5 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  if (value === "dash") {
    return <span className="text-gray-600 block text-center">—</span>;
  }
  return <span>{value}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ========== NAV ========== */}
      <ClientNavbar />

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-gradient-shift pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Trusted by 500+ e-commerce sellers
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Stop Guessing.{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Know Exactly Why
              </span>{" "}
              Your Ads Fail.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI-powered ad creative analysis that tells you what to fix, in seconds.
              Get scored across 6 dimensions with actionable recommendations — before you waste another dollar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold text-base transition shadow-lg shadow-blue-600/20"
              >
                Analyze Your First Ad Free &rarr;
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 border border-gray-700 hover:border-gray-600 rounded-lg font-medium text-gray-300 hover:text-white text-base transition"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-10 sm:mt-16 max-w-4xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-blue-900/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Overall Score", value: "84", color: "text-green-400" },
                  { label: "Hook Strength", value: "91", color: "text-green-400" },
                  { label: "CTA Clarity", value: "67", color: "text-orange-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: "Visual Impact", pct: 88, color: "bg-green-400" },
                  { label: "Copy Effectiveness", pct: 72, color: "bg-orange-400" },
                  { label: "Platform Fit", pct: 95, color: "bg-green-400" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">{bar.label}</span>
                      <span className="text-sm text-gray-300 font-medium">{bar.pct}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full border border-green-400/20 bg-green-400/10 text-green-400">Strong hook</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-green-400/20 bg-green-400/10 text-green-400">Clear branding</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-orange-400/20 bg-orange-400/10 text-orange-400">Weak CTA</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-red-400/20 bg-red-400/10 text-red-400">Fix: Add urgency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BEFORE vs AFTER ========== */}
      <section className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">
                See the Difference{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Analysis
                </span>{" "}
                Makes
              </h2>
              <p className="mt-3 text-gray-400 max-w-lg mx-auto">
                Real examples of how AdScore AI transforms ad performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* BEFORE card */}
              <div className="bg-gray-900 border border-gray-800 border-t-2 border-t-red-400 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
                    Before
                  </span>
                  <LandingScoreRing score={45} size={72} />
                </div>

                {/* Mock ad */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-5 mb-5">
                  <div className="w-full h-28 sm:h-32 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold text-sm uppercase">BUY OUR PRODUCT NOW!!!</h4>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                    We have the best product on the market. Click below to buy it today. Don&apos;t miss out.
                  </p>
                  <button className="mt-3 w-full py-2 bg-gray-600 text-gray-300 text-xs font-medium rounded cursor-default">
                    Click Here
                  </button>
                </div>

                {/* Issues */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Issues Found</p>
                  {[
                    "Generic headline with no value proposition",
                    "Aggressive, all-caps CTA",
                    "No social proof or urgency",
                    "Missing emotional triggers",
                  ].map((issue) => (
                    <div key={issue} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-400 text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AFTER card */}
              <div className="bg-gray-900 border border-gray-800 border-t-2 border-t-green-400 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-semibold uppercase tracking-wider">
                    After AdScore AI
                  </span>
                  <LandingScoreRing score={92} size={72} />
                </div>

                {/* Improved mock ad */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-5 mb-5">
                  <div className="w-full h-28 sm:h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold text-sm">Transform Your Workflow in 5 Minutes</h4>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    Join 10,000+ professionals who cut their review time by 80%. See results from day one.
                  </p>
                  <button className="mt-3 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded cursor-default">
                    Start Free Trial &rarr;
                  </button>
                </div>

                {/* Improvements */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Improvements Applied</p>
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
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">
                How It Works
              </h2>
              <p className="mt-3 text-gray-400 max-w-lg mx-auto">
                From upload to actionable insights in under 30 seconds.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="relative group">
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 h-full hover:border-gray-700 transition">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                      {s.icon}
                    </div>
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Step {s.step}</span>
                    <h3 className="text-xl font-semibold text-white mt-2 mb-2">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Win at Ads
                </span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-lg mx-auto">
                Go beyond vanity metrics. Understand exactly what makes an ad convert.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AdScore AI
                </span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-lg mx-auto">
                See how we compare to the alternatives.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 sm:px-6 py-4 text-left text-gray-500 font-medium w-1/4">Feature</th>
                      <th className="px-4 sm:px-6 py-4 text-center bg-blue-600/5 w-1/4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                            Recommended
                          </span>
                          <span className="font-semibold text-white">AdScore AI</span>
                        </div>
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-center text-gray-400 font-medium w-1/4">Manual Review</th>
                      <th className="px-4 sm:px-6 py-4 text-center text-gray-400 font-medium w-1/4">Other Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={i < COMPARISON_ROWS.length - 1 ? "border-b border-gray-800/50" : ""}
                      >
                        <td className="px-4 sm:px-6 py-3.5 text-gray-300 font-medium">{row.feature}</td>
                        <td className="px-4 sm:px-6 py-3.5 text-center bg-blue-600/5 text-white font-medium">
                          <ComparisonCell value={row.us} />
                        </td>
                        <td className="px-4 sm:px-6 py-3.5 text-center text-gray-400">
                          <ComparisonCell value={row.manual} />
                        </td>
                        <td className="px-4 sm:px-6 py-3.5 text-center text-gray-400">
                          <ComparisonCell value={row.others} />
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

      {/* ========== SOCIAL PROOF ========== */}
      <section className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">What Sellers Are Saying</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Saved me $2,000 in the first week. I was running ads with a terrible CTA and didn't even realize it.",
                  name: "Sarah M.",
                  role: "Shopify Store Owner",
                },
                {
                  quote: "The platform-specific tips are gold. My TikTok ads went from 0.4% CTR to 1.8% after following the recommendations.",
                  name: "James K.",
                  role: "DTC Brand Founder",
                },
                {
                  quote: "I used to spend hours guessing what was wrong with my creatives. Now I know in 30 seconds. Total game changer.",
                  name: "Priya R.",
                  role: "E-commerce Marketer",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="mt-3 text-gray-400">Start free. Upgrade when you need more.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-white">Free</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-500 ml-1">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "3 ad analyses",
                    "Full 6-dimension scoring",
                    "Strengths & weaknesses",
                    "Actionable recommendations",
                    "Competitor insights",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white font-medium text-sm transition"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-gradient-to-b from-blue-600/5 to-purple-600/5 border border-blue-500/30 rounded-2xl p-6 sm:p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
                <h3 className="text-lg font-semibold text-white">Pro</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-gray-500 ml-1">/month</span>
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
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium text-sm transition shadow-lg shadow-blue-600/20"
                >
                  Start Pro &rarr;
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-gray-900 border border-gray-800 rounded-xl"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-4 sm:px-6 py-4 text-white font-medium text-sm list-none">
                    {faq.q}
                    <svg className="w-5 h-5 text-gray-500 shrink-0 ml-3 sm:ml-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-16 sm:py-24 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Make Every Ad{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Count?</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Join hundreds of sellers who stopped guessing and started optimizing. Your first 3 analyses are free.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-8 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold text-base transition shadow-lg shadow-blue-600/20"
            >
              Get Started Free &rarr;
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-gray-800/50 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AdScore AI
                </span>
              </Link>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                AI-Powered Ad Creative Analysis. Stop guessing, start optimizing.
              </p>
              <div className="flex items-center gap-3">
                {/* Twitter/X */}
                <a href="#" className="text-gray-600 hover:text-white transition" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="text-gray-600 hover:text-white transition" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" className="text-gray-600 hover:text-white transition" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Analyze", href: "/analyze" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How it Works", href: "#how-it-works" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "FAQ", href: "#faq" },
                  { label: "Blog", href: "#", badge: "Soon" },
                  { label: "Help Center", href: "#", badge: "Soon" },
                  { label: "API", href: "#", badge: "Soon" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition inline-flex items-center gap-1.5">
                      {link.label}
                      {link.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-medium">{link.badge}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} AdScore AI. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Made with AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
