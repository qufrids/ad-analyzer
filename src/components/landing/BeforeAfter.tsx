"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingScoreRing from "./LandingScoreRing";

const BEFORE = {
  headline: "BUY OUR PRODUCT NOW!!!",
  body: "We have the best product on the market. Click below to buy it today. Don't miss out on this amazing deal.",
  cta: "Click Here",
  issues: [
    "Generic headline with no value proposition",
    "Aggressive, all-caps messaging",
    "No social proof or credibility",
    "Weak, uninspired call-to-action",
  ],
};

const AFTER = {
  headline: "Transform Your Workflow in 5 Minutes",
  body: "Join 10,000+ professionals who cut their review time by 80%. See measurable results from day one.",
  cta: "Start Free Trial →",
  improvements: [
    "Specific, benefit-driven headline",
    "Social proof with concrete numbers",
    "Clear value proposition",
    "Action-oriented CTA with urgency",
  ],
};

export default function BeforeAfter() {
  const [active, setActive] = useState<"before" | "after">("before");

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center mb-10">
        <div className="inline-flex items-center bg-white/[0.03] border border-white/[0.06] rounded-full p-1">
          <button
            onClick={() => setActive("before")}
            className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              active === "before"
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {active === "before" && (
              <motion.div
                layoutId="toggle-bg"
                className="absolute inset-0 bg-red-500/15 border border-red-500/20 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">Before</span>
          </button>
          <button
            onClick={() => setActive("after")}
            className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              active === "after"
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {active === "after" && (
              <motion.div
                layoutId="toggle-bg"
                className="absolute inset-0 bg-green-500/15 border border-green-500/20 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">After</span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-2xl mx-auto relative">
        {/* Glow */}
        <div
          className={`absolute -inset-4 rounded-3xl blur-2xl transition-colors duration-700 ${
            active === "before" ? "bg-red-500/5" : "bg-green-500/5"
          }`}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-white/[0.02] backdrop-blur-sm border rounded-2xl p-6 sm:p-8 ${
              active === "before"
                ? "border-red-500/20"
                : "border-green-500/20"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  active === "before"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20"
                }`}
              >
                {active === "before" ? "Before Analysis" : "After AdScore AI"}
              </span>
              <LandingScoreRing
                score={active === "before" ? 45 : 92}
                size={64}
              />
            </div>

            {/* Mock ad */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mb-6">
              <div
                className={`w-full h-32 rounded-lg flex items-center justify-center mb-4 ${
                  active === "before"
                    ? "bg-neutral-800/50"
                    : "bg-gradient-to-br from-blue-600/10 to-violet-600/10"
                }`}
              >
                <svg
                  className={`w-10 h-10 ${active === "before" ? "text-neutral-700" : "text-blue-500/50"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4
                className={`font-bold text-sm ${
                  active === "before" ? "text-neutral-300 uppercase" : "text-white"
                }`}
              >
                {active === "before" ? BEFORE.headline : AFTER.headline}
              </h4>
              <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
                {active === "before" ? BEFORE.body : AFTER.body}
              </p>
              <button
                className={`mt-4 w-full py-2.5 text-xs font-semibold rounded-lg cursor-default transition-none ${
                  active === "before"
                    ? "bg-neutral-700 text-neutral-400"
                    : "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                }`}
              >
                {active === "before" ? BEFORE.cta : AFTER.cta}
              </button>
            </div>

            {/* Issues / Improvements */}
            <div className="space-y-3">
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  active === "before" ? "text-red-400" : "text-green-400"
                }`}
              >
                {active === "before" ? "Issues Found" : "Improvements Applied"}
              </p>
              {(active === "before" ? BEFORE.issues : AFTER.improvements).map(
                (item) => (
                  <div key={item} className="flex items-start gap-3">
                    {active === "before" ? (
                      <svg
                        className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-green-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    <span className="text-neutral-400 text-sm">{item}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
