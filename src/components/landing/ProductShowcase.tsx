"use client";

import { useState } from "react";

const TABS = [
  { id: "analysis", label: "Ad Analysis",   icon: "📊" },
  { id: "improver", label: "AI Improver",   icon: "✨" },
  { id: "compare",  label: "A/B Compare",   icon: "⚔️" },
  { id: "platform", label: "Full Platform", icon: "🔍" },
];

const DIMENSIONS = [
  { label: "Hook Strength",      score: 82 },
  { label: "Copy Effectiveness", score: 91 },
  { label: "CTA Clarity",        score: 85 },
  { label: "Visual Impact",      score: 93 },
  { label: "Brand Consistency",  score: 88 },
  { label: "Platform Fit",       score: 96 },
];

function scoreColor(s: number) {
  if (s >= 80) return "#16A34A";
  if (s >= 60) return "#F59E0B";
  return "#EF4444";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="w-28 sm:w-36 text-[11px] sm:text-[12px] text-[#64748B] shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
      </div>
      <span className="w-6 text-right text-[11px] sm:text-[12px] font-semibold text-[#0F172A]">{score}</span>
    </div>
  );
}

function AnalysisMockup() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <div className="shrink-0 w-full sm:w-44">
          <div className="w-full sm:w-44 h-24 sm:h-32 bg-[#F1F5F9] rounded-lg flex items-center justify-center mb-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-1.5 hidden sm:block">
            <div className="h-2 w-full bg-[#E2E8F0] rounded" />
            <div className="h-2 w-3/4 bg-[#E2E8F0] rounded" />
            <div className="h-2 w-5/6 bg-[#E2E8F0] rounded" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5] mb-0.5">Overall Score</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] sm:text-[40px] font-black text-[#16A34A] leading-none">94</span>
                <span className="text-[14px] sm:text-[16px] text-[#94A3B8]">/100</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded-full">Excellent</span>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14">
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3.2" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#16A34A" strokeWidth="3.2" strokeDasharray="94 6" strokeDashoffset="25" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-2.5">
            {DIMENSIONS.map((d) => <ScoreBar key={d.label} label={d.label} score={d.score} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImproverMockup() {
  const items = [
    { before: '"BUY NOW!!!"',                 after: '"Transform in 5 Min"'     },
    { before: '"Best product out there"',     after: '"10,000+ teams, 3× ROI"'  },
    { before: '"Click here"',                 after: '"Start Free Trial →"'      },
  ];
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 max-w-3xl mx-auto">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider">Original</span>
            <span className="text-[20px] sm:text-[24px] font-black text-[#EF4444]">32</span>
          </div>
          {items.map((it) => (
            <div key={it.before} className="text-[11px] sm:text-[12px] text-[#7F1D1D] bg-white/60 rounded px-2 py-1 sm:px-2.5 sm:py-1.5 mb-1.5 sm:mb-2 line-through opacity-70 truncate">
              {it.before}
            </div>
          ))}
        </div>
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider">Improved</span>
            <span className="text-[20px] sm:text-[24px] font-black text-[#16A34A]">91</span>
          </div>
          {items.map((it) => (
            <div key={it.after} className="text-[11px] sm:text-[12px] text-[#14532D] bg-white/60 rounded px-2 py-1 sm:px-2.5 sm:py-1.5 mb-1.5 sm:mb-2 truncate">
              {it.after}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 sm:px-4 sm:py-2.5">
        <svg className="w-4 h-4 text-[#4F46E5] shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <span className="text-[11px] sm:text-[12px] text-[#334155]">Score jumped <strong>+59 points</strong> after AI improvements.</span>
      </div>
    </div>
  );
}

function CompareMockup() {
  const dims = [
    { label: "Hook",   a: 65, b: 91 },
    { label: "Copy",   a: 70, b: 85 },
    { label: "CTA",    a: 58, b: 93 },
    { label: "Visual", a: 74, b: 88 },
  ];
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 max-w-3xl mx-auto">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="border border-[#E2E8F0] rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 sm:mb-3">Creative A</p>
          <div className="h-16 sm:h-20 bg-[#F1F5F9] rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] sm:text-[28px] font-black text-[#F59E0B]">67</span>
            <span className="text-[11px] text-[#94A3B8]">/100</span>
          </div>
        </div>
        <div className="border-2 border-[#16A34A] rounded-xl p-3 sm:p-4 relative">
          <span className="absolute -top-3 left-2 text-[9px] sm:text-[10px] font-bold text-white bg-[#16A34A] px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">🏆 Winner</span>
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 sm:mb-3">Creative B</p>
          <div className="h-16 sm:h-20 bg-[#F0FDF4] rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#86EFAC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] sm:text-[28px] font-black text-[#16A34A]">89</span>
            <span className="text-[11px] text-[#94A3B8]">/100</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 sm:space-y-2.5">
        {dims.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-10 sm:w-16 text-[11px] sm:text-[12px] text-[#64748B] shrink-0">{d.label}</span>
            <div className="flex-1 flex items-center gap-1.5">
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${d.a}%` }} />
              </div>
              <span className="text-[10px] w-5 text-[#94A3B8]">{d.a}</span>
            </div>
            <svg className="w-3 h-3 text-[#94A3B8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="flex-1 flex items-center gap-1.5">
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${d.b}%` }} />
              </div>
              <span className="text-[10px] w-5 text-[#334155] font-medium">{d.b}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformMockup() {
  const analyses = [
    { label: "Fashion Summer Ad",  score: 94, platform: "Meta",   date: "Jan 12" },
    { label: "Sale Banner",        score: 89, platform: "TikTok", date: "Jan 11" },
    { label: "New Collection",     score: 73, platform: "Google", date: "Jan 10" },
    { label: "Product Launch",     score: 61, platform: "Meta",   date: "Jan 09" },
  ];
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { label: "Analyzed", value: "24" },
          { label: "Avg Score", value: "87" },
          { label: "Best",      value: "96" },
        ].map((s) => (
          <div key={s.label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[18px] sm:text-[22px] font-black text-[#0F172A]">{s.value}</p>
            <p className="text-[10px] sm:text-[11px] text-[#64748B]">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] sm:text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 sm:mb-3">Recent Analyses</p>
      <div className="space-y-1.5 sm:space-y-2">
        {analyses.map((a) => (
          <div key={a.label} className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 border-b border-[#F1F5F9] last:border-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#F1F5F9] rounded-lg shrink-0 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>
            <span className="flex-1 text-[11px] sm:text-[13px] text-[#334155] truncate">{a.label}</span>
            <span className="text-[10px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded hidden sm:inline">{a.platform}</span>
            <span
              className="text-[12px] sm:text-[13px] font-bold w-7 text-right shrink-0"
              style={{ color: scoreColor(a.score) }}
            >
              {a.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5] mb-3">PRODUCT TOUR</p>
        <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#0F172A] leading-tight tracking-tight">
          How performance teams go from<br className="hidden sm:block" /> guessing to scaling.
        </h2>
      </div>

      {/* Tabs — horizontal scroll on mobile, centered wrap on desktop */}
      <div
        className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto sm:overflow-visible sm:justify-center sm:flex-wrap [&::-webkit-scrollbar]:hidden pb-1 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-[8px] text-[13px] sm:text-[14px] font-medium border transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
                : "bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Browser mockup — no perspective tilt on mobile */}
      <div className="bg-white rounded-[12px] sm:rounded-[16px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Browser chrome */}
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#16A34A]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-[#E2E8F0] rounded-md px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-[12px] text-[#94A3B8] w-full max-w-[220px] sm:max-w-[340px] text-center select-none truncate">
              adscore.ai/dashboard
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 bg-[#F8FAFC] min-h-[280px] sm:min-h-[380px]">
          {activeTab === "analysis" && <AnalysisMockup />}
          {activeTab === "improver" && <ImproverMockup />}
          {activeTab === "compare"  && <CompareMockup  />}
          {activeTab === "platform" && <PlatformMockup />}
        </div>
      </div>
    </div>
  );
}
