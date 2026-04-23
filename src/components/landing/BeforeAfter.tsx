"use client";

const BEFORE = {
  headline: "BUY OUR PRODUCT NOW!!!",
  body: "We have the best product on the market. Click below to buy it today. Don't miss out on this amazing deal.",
  cta: "Click Here",
  score: 32,
  issues: [
    "No clear value proposition",
    "Aggressive, all-caps tone",
    "No social proof or trust signals",
    "Weak, generic call-to-action",
  ],
};

const AFTER = {
  headline: "Transform Your Workflow in 5 Minutes",
  body: "Join 10,000+ professionals who cut their review time by 80%. See measurable results from day one.",
  cta: "Start Free Trial →",
  score: 91,
  improvements: [
    "Specific, benefit-driven headline",
    "Social proof with concrete numbers",
    "Clear value with measurable outcome",
    "Action-oriented CTA with low friction",
  ],
};

function ScoreCircle({ score, color }: { score: number; color: string }) {
  const circumference = 2 * Math.PI * 15.9;
  const offset = circumference * (1 - score / 100);
  return (
    <svg className="w-11 h-11 sm:w-[52px] sm:h-[52px]" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3.2" />
      <circle
        cx="18" cy="18" r="15.9" fill="none"
        stroke={color} strokeWidth="3.2"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
      <text x="18" y="21.5" textAnchor="middle" fill={color} fontSize="8" fontWeight="800">{score}</text>
    </svg>
  );
}

export default function BeforeAfter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
      {/* Before card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 sm:p-8 relative" style={{ borderTop: "2px solid #EF4444" }}>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] px-3 py-1 rounded-full">
            Before Analysis
          </span>
          <ScoreCircle score={32} color="#EF4444" />
        </div>

        {/* Mock ad */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
          <div className="w-full h-20 sm:h-24 bg-[#E2E8F0] rounded-lg flex items-center justify-center mb-3">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
            </svg>
          </div>
          <h4 className="text-[12px] sm:text-[13px] font-bold text-[#0F172A] uppercase mb-1.5">{BEFORE.headline}</h4>
          <p className="text-[12px] text-[#64748B] leading-relaxed mb-3">{BEFORE.body}</p>
          <div className="py-2 bg-[#94A3B8] text-white text-center rounded-lg text-[12px] font-semibold cursor-default">
            {BEFORE.cta}
          </div>
        </div>

        {/* Issues */}
        <div className="space-y-2 sm:space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#EF4444]">Issues Found</p>
          {BEFORE.issues.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-[13px] sm:text-[14px] text-[#334155]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* After card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 sm:p-8 relative" style={{ borderTop: "2px solid #16A34A" }}>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2 flex-wrap gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1 rounded-full">
              After AdScore AI
            </span>
            <span className="text-[11px] font-bold text-white bg-[#16A34A] px-2.5 py-1 rounded-full uppercase">WINNER</span>
          </div>
          <ScoreCircle score={91} color="#16A34A" />
        </div>

        {/* Mock ad */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
          <div className="w-full h-20 sm:h-24 bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-lg flex items-center justify-center mb-3">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
            </svg>
          </div>
          <h4 className="text-[12px] sm:text-[13px] font-bold text-[#0F172A] mb-1.5">{AFTER.headline}</h4>
          <p className="text-[12px] text-[#64748B] leading-relaxed mb-3">{AFTER.body}</p>
          <div className="py-2 bg-[#4F46E5] text-white text-center rounded-lg text-[12px] font-semibold cursor-default">
            {AFTER.cta}
          </div>
        </div>

        {/* Improvements */}
        <div className="space-y-2 sm:space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#16A34A]">Improvements Applied</p>
          {AFTER.improvements.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[13px] sm:text-[14px] text-[#334155]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
