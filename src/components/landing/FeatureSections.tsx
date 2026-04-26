import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

/* ─── Score colour helper ─── */
function sc(s: number) {
  if (s >= 80) return "#16A34A";
  if (s >= 60) return "#F59E0B";
  return "#EF4444";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-[12px] text-[#64748B] shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: sc(score) }} />
      </div>
      <span className="w-7 text-right text-[12px] font-semibold" style={{ color: sc(score) }}>{score}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP VISUALS
══════════════════════════════════════════ */

function AnalysisVisual() {
  const dims = [
    { label: "Hook Strength",      score: 82 },
    { label: "Copy Effectiveness", score: 91 },
    { label: "CTA Clarity",        score: 85 },
    { label: "Visual Impact",      score: 93 },
    { label: "Brand Consistency",  score: 88 },
    { label: "Platform Fit",       score: 96 },
  ];
  const circumference = 2 * Math.PI * 38;
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Score header */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#16A34A" strokeWidth="8"
              strokeDasharray={`${circumference * 0.94} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-black text-[#16A34A] leading-none">94</span>
            <span className="text-[11px] text-[#94A3B8]">/100</span>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5] mb-1">Overall Score</p>
          <p className="text-[22px] font-bold text-[#0F172A] leading-tight">Excellent</p>
          <p className="text-[13px] text-[#64748B] mt-1">Top 8% of analyzed ads</p>
          <span className="inline-block mt-2 text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full">
            Ready to scale ✓
          </span>
        </div>
      </div>
      {/* Dimension bars */}
      <div className="space-y-2.5 pt-4 border-t border-[#F1F5F9]">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">6-Dimension Breakdown</p>
        {dims.map((d) => <ScoreBar key={d.label} label={d.label} score={d.score} />)}
      </div>
    </div>
  );
}

function ImproverVisual() {
  const rewrites = [
    { before: '"BUY OUR PRODUCT NOW!!!"',          after: '"Transform Your Results in 5 Minutes"' },
    { before: '"Best product on the market"',      after: '"Join 10,000+ teams seeing 3× ROAS"'   },
    { before: '"Click here to learn more"',        after: '"Start Your Free Trial →"'              },
    { before: '"Limited time offer — act fast!"',  after: '"Free to start · Cancel anytime"'       },
  ];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="flex border-b border-[#E2E8F0]">
        <div className="flex-1 bg-[#FEF2F2] px-4 py-3 border-r border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">Original</span>
            <span className="text-[20px] font-black text-[#EF4444]">34</span>
          </div>
        </div>
        <div className="flex-1 bg-[#F0FDF4] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider">AI Improved</span>
            <span className="text-[20px] font-black text-[#16A34A]">91</span>
          </div>
        </div>
      </div>

      {/* Rewrites */}
      <div>
        {rewrites.map((r, i) => (
          <div key={i} className={`flex ${i < rewrites.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}>
            <div className="flex-1 px-4 py-3 border-r border-[#F1F5F9] bg-[#FAFAFA]">
              <p className="text-[12px] text-[#94A3B8] line-through leading-relaxed">{r.before}</p>
            </div>
            <div className="flex-1 px-4 py-3">
              <p className="text-[12px] text-[#334155] font-medium leading-relaxed">{r.after}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Score jump */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#F0FDF4] border-t border-[#BBF7D0]">
        <svg className="w-4 h-4 text-[#16A34A] shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <p className="text-[12px] text-[#15803D] font-semibold">Score jumped +57 points. 3 variations generated and ready to launch.</p>
      </div>
    </div>
  );
}

function TrackerVisual() {
  const weeks = [
    { label: "W1", score: 58 },
    { label: "W2", score: 64 },
    { label: "W3", score: 71 },
    { label: "W4", score: 79 },
    { label: "W5", score: 85 },
    { label: "W6", score: 91 },
  ];
  const maxScore = 100;
  const recent = [
    { name: "Summer Sale Hero",   score: 94, delta: "+12", platform: "Meta"   },
    { name: "Hook Test v3",       score: 88, delta: "+6",  platform: "TikTok" },
    { name: "Retargeting Banner", score: 79, delta: "+4",  platform: "Google" },
    { name: "Cold Audience Ad",   score: 73, delta: "+8",  platform: "Meta"   },
  ];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Avg Score",    value: "79" },
          { label: "Improvement",  value: "+33" },
          { label: "Ads Tracked",  value: "24"  },
        ].map((s) => (
          <div key={s.label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-center">
            <p className="text-[20px] font-black text-[#0F172A]">{s.value}</p>
            <p className="text-[10px] text-[#64748B]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Score Trend — Last 6 Weeks</p>
        <div className="flex items-end justify-between gap-2 h-20">
          {weeks.map((w) => {
            const h = Math.round((w.score / maxScore) * 100);
            return (
              <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold" style={{ color: sc(w.score) }}>{w.score}</span>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{ height: `${h * 0.6}px`, backgroundColor: sc(w.score), opacity: 0.85 }}
                />
                <span className="text-[9px] text-[#94A3B8]">{w.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent analyses */}
      <div className="border-t border-[#F1F5F9] pt-4">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Recent Analyses</p>
        <div className="space-y-2">
          {recent.map((r) => (
            <div key={r.name} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#F1F5F9] rounded-lg shrink-0 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              </div>
              <span className="flex-1 text-[12px] text-[#334155] truncate">{r.name}</span>
              <span className="text-[10px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded hidden sm:inline">{r.platform}</span>
              <span className="text-[11px] font-semibold text-[#16A34A]">{r.delta}</span>
              <span className="text-[13px] font-bold w-7 text-right" style={{ color: sc(r.score) }}>{r.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ABVisual() {
  const dims = [
    { label: "Hook",   a: 62, b: 91 },
    { label: "Copy",   a: 68, b: 87 },
    { label: "CTA",    a: 55, b: 94 },
    { label: "Visual", a: 74, b: 89 },
  ];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Two ad cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="border border-[#E2E8F0] rounded-xl p-4">
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Creative A</p>
          <div className="h-20 bg-[#F1F5F9] rounded-lg flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-black text-[#F59E0B]">65</span>
            <span className="text-[11px] text-[#94A3B8]">/100</span>
          </div>
        </div>
        <div className="border-2 border-[#16A34A] rounded-xl p-4 relative">
          <span className="absolute -top-3 left-3 text-[10px] font-bold text-white bg-[#16A34A] px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
            🏆 Winner
          </span>
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Creative B</p>
          <div className="h-20 bg-[#F0FDF4] rounded-lg flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-[#86EFAC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-black text-[#16A34A]">90</span>
            <span className="text-[11px] text-[#94A3B8]">/100</span>
          </div>
        </div>
      </div>

      {/* Dimension comparison */}
      <div className="space-y-2.5 pt-4 border-t border-[#F1F5F9]">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Dimension Breakdown</p>
        {dims.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-10 text-[11px] text-[#64748B] shrink-0">{d.label}</span>
            <div className="flex-1 flex items-center gap-1">
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${d.a}%` }} />
              </div>
              <span className="text-[10px] w-5 text-[#94A3B8]">{d.a}</span>
            </div>
            <svg className="w-3 h-3 text-[#CBD5E1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="flex-1 flex items-center gap-1">
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${d.b}%` }} />
              </div>
              <span className="text-[10px] w-5 text-[#334155] font-semibold">{d.b}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-[#EEF2FF] rounded-xl">
        <p className="text-[12px] text-[#4F46E5] font-medium">
          💡 <strong>AI Recommendation:</strong> Keep Creative B&apos;s hook and CTA. Replace its visual with Creative A&apos;s.
        </p>
      </div>
    </div>
  );
}

function CompetitorVisual() {
  const competitorDims = [
    { label: "Hook",     score: 71 },
    { label: "Copy",     score: 64 },
    { label: "CTA",      score: 48 },
    { label: "Platform", score: 79 },
  ];
  return (
    <div className="space-y-4">
      {/* Competitor card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider bg-[#F1F5F9] px-2.5 py-1 rounded-full">
            Competitor Ad
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-black text-[#F59E0B]">67</span>
            <span className="text-[11px] text-[#94A3B8]">/100</span>
          </div>
        </div>
        <div className="w-full h-20 bg-[#F1F5F9] rounded-xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
          </svg>
        </div>
        <div className="space-y-2">
          {competitorDims.map((d) => <ScoreBar key={d.label} label={d.label} score={d.score} />)}
        </div>
      </div>

      {/* Decoded insights */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <p className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider mb-3">Strategy Decoded</p>
        <div className="space-y-2 mb-4">
          {[
            { icon: "🎯", label: "Targeting",  text: "Cold traffic, broad 25–44" },
            { icon: "📣", label: "Angle",      text: "Fear-based: \"Stop wasting money\"" },
            { icon: "⚠️", label: "Weakness",   text: "CTA is vague, no urgency or proof" },
          ].map((i) => (
            <div key={i.label} className="flex items-start gap-2.5">
              <span className="text-[14px] mt-0.5">{i.icon}</span>
              <span className="text-[12px] text-[#334155]"><strong className="text-[#0F172A]">{i.label}:</strong> {i.text}</span>
            </div>
          ))}
        </div>
        <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
          <p className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider mb-1">Your Counter-Ad</p>
          <p className="text-[12px] text-[#15803D]">Generated with social proof + clear CTA — score: <strong>92/100</strong></p>
        </div>
      </div>
    </div>
  );
}

function URLVisual() {
  const platforms = [
    {
      name: "Facebook / Instagram",
      color: "#1877F2",
      headline: "Stop Guessing. Start Scaling.",
      body: "Join 10,000+ advertisers who know exactly which creatives will convert — before spending a dollar.",
      cta: "Start Free →",
    },
    {
      name: "TikTok",
      color: "#010101",
      headline: "POV: your ads finally work",
      body: "AdScore tells you what's wrong with your creative in 30 seconds. 94/100 score. ✓",
      cta: "Try for Free",
    },
    {
      name: "Google Ads",
      color: "#4285F4",
      headline: "AI-Powered Ad Analysis | AdScore",
      body: "Get a 0–100 score on any ad creative. Spot weak hooks, CTAs, and copy before you spend.",
      cta: "Analyze Free",
    },
  ];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* URL input */}
      <div className="px-5 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Product URL</p>
        <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-[#94A3B8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-[12px] text-[#334155] flex-1 truncate">shopify.com/products/ad-analyzer-pro</span>
          <span className="text-[11px] font-semibold text-white bg-[#4F46E5] px-3 py-1.5 rounded-lg shrink-0">Generate →</span>
        </div>
      </div>

      {/* Platform outputs */}
      <div className="divide-y divide-[#F1F5F9]">
        {platforms.map((p) => (
          <div key={p.name} className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[11px] font-semibold text-[#64748B]">{p.name}</span>
            </div>
            <p className="text-[13px] font-semibold text-[#0F172A] mb-0.5">{p.headline}</p>
            <p className="text-[11px] text-[#64748B] leading-relaxed mb-2">{p.body}</p>
            <span className="inline-block text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-full">{p.cta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LAYOUT WRAPPER
══════════════════════════════════════════ */

function FeatureSection({
  id, bg, badge, headline, description, benefits, cta, visual, reverse = false,
}: {
  id:          string;
  bg:          string;
  badge:       string;
  headline:    string;
  description: string;
  benefits:    string[];
  cta:         string;
  visual:      React.ReactNode;
  reverse?:    boolean;
}) {
  return (
    <section
      id={id}
      className="py-16 md:py-24 px-6 md:px-4 scroll-mt-16 md:scroll-mt-[72px]"
      style={{ background: bg }}
    >
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>

            {/* Text */}
            <div className="flex-1 w-full">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] border border-[#E0E7FF] px-3 py-1 rounded-full mb-5">
                {badge}
              </span>
              <h2 className="text-[26px] md:text-[32px] lg:text-[36px] font-bold text-[#0F172A] leading-tight tracking-tight mb-4">
                {headline}
              </h2>
              <p className="text-[16px] text-[#64748B] leading-[1.7] mb-7">
                {description}
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[15px] text-[#334155] leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#4338CA] text-white font-semibold text-[15px] px-6 py-3 rounded-[8px] transition-colors duration-150"
              >
                {cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Visual */}
            <div className="flex-1 w-full">{visual}</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   EXPORT — all 6 feature sections
══════════════════════════════════════════ */
export default function FeatureSections() {
  return (
    <>
      <FeatureSection
        id="feature-analysis"
        bg="#ffffff"
        badge="AD ANALYSIS"
        headline="Know exactly what's wrong with your ad before you spend."
        description="Every ad you upload gets a 0–100 performance score plus a forensic breakdown across 6 dimensions proven to correlate with real-world CTR and ROAS. No guessing. No opinion. Just data."
        benefits={[
          "Full score in under 30 seconds — faster than a coffee break",
          "6-dimension breakdown: hook, copy, CTA, visual, brand, platform fit",
          "Platform-specific benchmarks calibrated for Meta, TikTok & Google",
          "Prioritized list of what to fix first, ranked by impact",
          "Export the full report as a PDF to share with your team",
        ]}
        cta="Analyze your first ad free"
        visual={<AnalysisVisual />}
        reverse={false}
      />

      <FeatureSection
        id="feature-improver"
        bg="#F8FAFC"
        badge="AI IMPROVER"
        headline="Don't just score your ads — fix them in one click."
        description="AdScore doesn't just tell you what's wrong — it rewrites it. Headlines, body copy, and CTAs are rebuilt using proven copywriting frameworks (AIDA, PAS, and more). Get 3 complete ad variations, paste-ready."
        benefits={[
          "One-click AI rewrites for headline, copy, and CTA",
          "3 complete ad variations per analysis — pick your favourite",
          "AIDA, PAS, and hook-based frameworks applied automatically",
          "Rewrites are platform-aware (different tone for TikTok vs Google)",
          "Paste directly into Meta Ads Manager, TikTok Ads, or Google",
        ]}
        cta="Try the AI Improver"
        visual={<ImproverVisual />}
        reverse={true}
      />

      <FeatureSection
        id="feature-tracker"
        bg="#ffffff"
        badge="PERFORMANCE TRACKER"
        headline="See your creative quality improve week over week."
        description="Most teams have no idea if their creative quality is trending up or down. AdScore tracks every ad you analyze, shows your score history, and makes it easy to prove your strategy is working."
        benefits={[
          "Score history for every ad you've ever analyzed",
          "Weekly trend chart per platform and campaign type",
          "Identify your highest-scoring creative patterns and replicate them",
          "Top performer library — a searchable archive of your best-scoring ads",
          "Export data as CSV for client reports or internal dashboards",
        ]}
        cta="Track your creatives"
        visual={<TrackerVisual />}
        reverse={false}
      />

      <FeatureSection
        id="feature-ab"
        bg="#F8FAFC"
        badge="A/B COMPARE"
        headline="Stop guessing which creative wins. Know for certain."
        description="Upload two ads and AdScore evaluates both across all 6 dimensions, picks a data-backed winner, and tells you exactly which elements to combine — so your next creative starts from a stronger baseline."
        benefits={[
          "Side-by-side scoring for any two creatives",
          "Dimension-level winner: which ad wins hook, copy, CTA, visual separately",
          "\"Combine the best of both\" recommendation — specific and actionable",
          "Saves money on split testing by pre-qualifying before media spend",
          "Works across platforms — compare a Meta ad against a TikTok version",
        ]}
        cta="Compare two creatives"
        visual={<ABVisual />}
        reverse={true}
      />

      <FeatureSection
        id="feature-competitor"
        bg="#ffffff"
        badge="COMPETITOR SPY"
        headline="Decode any competitor's creative strategy in seconds."
        description="Upload a competitor's ad and AdScore reverse-engineers their entire strategy: what they're optimizing for, where their weaknesses are, and exactly what you need to do to out-position them. Then it writes your counter-ad."
        benefits={[
          "Full 6-dimension analysis of any competitor creative",
          "Strategy decoding: what angle, audience, and emotion they're targeting",
          "Weakness detection: where their ad falls short (and where you win)",
          "AI-generated counter-ad designed to beat them head-to-head",
          "Build a swipe file of competitor intelligence over time",
        ]}
        cta="Spy on a competitor"
        visual={<CompetitorVisual />}
        reverse={false}
      />

      <FeatureSection
        id="feature-url"
        bg="#F8FAFC"
        badge="URL TO ADS"
        headline="Paste a product URL. Get launch-ready ad copy."
        description="AdScore reads your product page — description, benefits, pricing, tone — and writes complete, platform-specific ad copy for Meta, TikTok, Google, and Instagram. Multiple hook variations included."
        benefits={[
          "Works with any Shopify, Amazon, WooCommerce, or product URL",
          "Platform-specific copy: different tone and format per channel",
          "5+ hook variations per platform (curiosity, social proof, FOMO, benefit)",
          "Full ad copy: headline, primary text, description, and CTA",
          "Ready to paste into any ad manager — no editing required",
        ]}
        cta="Generate ads from URL"
        visual={<URLVisual />}
        reverse={true}
      />
    </>
  );
}
