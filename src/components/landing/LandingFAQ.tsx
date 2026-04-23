"use client";

import { useState } from "react";

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

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#E2E8F0]">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-6 group"
          >
            <span className="text-[18px] font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors duration-150">
              {faq.q}
            </span>
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                open === i
                  ? "bg-[#4F46E5] border-[#4F46E5] text-white rotate-45"
                  : "border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>
          <div
            className="overflow-hidden transition-[max-height] duration-300 ease-out"
            style={{ maxHeight: open === i ? "240px" : "0px" }}
          >
            <p className="pb-5 text-[16px] text-[#334155] leading-[1.7]">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
