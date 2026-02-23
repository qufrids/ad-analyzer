"use client";

import { useState, useRef } from "react";

/* ─── Types ─────────────────────────────────────── */
interface Headline {
  text: string;
  why_it_works: string;
}
interface BodyCopy {
  short: string;
  medium: string;
  long: string;
}
interface Hook {
  type: "question" | "statistic" | "bold_claim" | "pain_point" | "curiosity";
  text: string;
}
interface CreativeDirection {
  visual_improvements: string;
  color_psychology: string;
  text_overlay: string;
  format_suggestions: string;
}
interface AdTemplate {
  framework: string;
  name: string;
  copy: string;
}
interface TargetingSuggestions {
  primary_audience: string;
  interests: string[];
  lookalike_strategy: string;
  retargeting_angle: string;
}
interface ImprovementResult {
  headlines: Headline[];
  body_copy: BodyCopy;
  cta_options: string[];
  hooks: Hook[];
  creative_direction: CreativeDirection;
  ad_templates: AdTemplate[];
  targeting_suggestions: TargetingSuggestions;
}

interface Props {
  analysisId: string;
  existingResult: ImprovementResult | null;
  improvementsRemaining: number;
  isPro: boolean;
}

/* ─── Hook badge colors ──────────────────────────── */
const HOOK_COLORS: Record<string, string> = {
  question:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  statistic:  "bg-green-500/10 text-green-400 border-green-500/20",
  bold_claim: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  pain_point: "bg-red-500/10 text-red-400 border-red-500/20",
  curiosity:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const HOOK_LABEL: Record<string, string> = {
  question:   "Question",
  statistic:  "Statistic",
  bold_claim: "Bold Claim",
  pain_point: "Pain Point",
  curiosity:  "Curiosity",
};

/* ─── CopyButton ─────────────────────────────────── */
function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all duration-200 ${
        copied
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
      } ${className}`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 animate-copy-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ─── Section wrapper ────────────────────────────── */
function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-7 animate-sparkle-pop">
      <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white mb-5">
        <span className="text-blue-500 dark:text-blue-400">{icon}</span>
        {label}
      </h3>
      {children}
    </div>
  );
}

/* ─── Skeleton loader ────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-gray-200 dark:bg-gray-800 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 mt-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-7 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function AdImprover({ analysisId, existingResult, improvementsRemaining, isPro }: Props) {
  const [result, setResult] = useState<ImprovementResult | null>(existingResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bodyCopyTab, setBodyCopyTab] = useState<"short" | "medium" | "long">("medium");
  const [openTemplate, setOpenTemplate] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const canGenerate = isPro || improvementsRemaining > 0;

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data.result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function buildCopyAll(r: ImprovementResult): string {
    const lines: string[] = [
      "=== IMPROVED AD COPY PACKAGE ===",
      "",
      "── HEADLINES ──",
      ...r.headlines.map((h, i) => `${i + 1}. ${h.text}`),
      "",
      "── BODY COPY (Medium) ──",
      r.body_copy.medium,
      "",
      "── CTA OPTIONS ──",
      ...r.cta_options.map((c, i) => `${i + 1}. ${c}`),
      "",
      "── HOOKS ──",
      ...r.hooks.map((h) => `[${h.type.toUpperCase()}] ${h.text}`),
      "",
      "── AD FRAMEWORKS ──",
      ...r.ad_templates.map((t) => `\n${t.name}:\n${t.copy}`),
    ];
    return lines.join("\n");
  }

  return (
    <div className="mt-8 sm:mt-12">
      {/* ── Generate button ── */}
      {!result && (
        <div className="flex flex-col items-center text-center py-8 px-4">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-medium text-purple-500 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI Ad Improver
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Get AI-Powered Copy Improvements
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 text-sm leading-relaxed">
            Claude will analyze your ad and generate optimized headlines, body copy, CTAs, hooks, creative direction, proven frameworks, and targeting suggestions.
          </p>

          {canGenerate ? (
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {loading ? "Generating..." : "✨ Generate Improved Ad Copy"}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 max-w-sm">
                <p className="font-medium text-gray-900 dark:text-white mb-1">No improvement credits left</p>
                <p>Upgrade to Pro for unlimited AI improvements on all your ads.</p>
              </div>
              <a
                href="/settings"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg text-sm transition"
              >
                Upgrade to Pro — $29/mo
              </a>
            </div>
          )}

          {!isPro && canGenerate && (
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
              {improvementsRemaining} free improvement{improvementsRemaining !== 1 ? "s" : ""} remaining
            </p>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && <LoadingSkeleton />}

      {/* ── Results ── */}
      {result && !loading && (
        <div ref={resultsRef} className="space-y-5">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                AI Improvement Package
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Ready-to-use copy generated for your ad</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CopyButton text={buildCopyAll(result)} className="px-3.5 py-1.5 text-sm" />
              {canGenerate && (
                <button
                  onClick={generate}
                  className="inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              )}
            </div>
          </div>

          {/* A — Headlines */}
          <Section
            label="Improved Headlines"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            <div className="space-y-4">
              {result.headlines.map((h, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug flex-1">
                      {h.text}
                    </p>
                    <CopyButton text={h.text} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    <span className="text-green-600 dark:text-green-400 font-medium">Why it works: </span>
                    {h.why_it_works}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* B — Body Copy */}
          <Section
            label="Body Copy"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
              </svg>
            }
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
              {(["short", "medium", "long"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBodyCopyTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 capitalize ${
                    bodyCopyTab === tab
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 whitespace-pre-wrap">
                  {result.body_copy[bodyCopyTab]}
                </p>
                <CopyButton text={result.body_copy[bodyCopyTab]} />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {result.body_copy[bodyCopyTab].length} characters
              </p>
            </div>
          </Section>

          {/* C — CTA Options */}
          <Section
            label="CTA Options"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              {result.cta_options.map((cta, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-full px-4 py-2 transition-all cursor-default"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{cta}</span>
                  <CopyButton text={cta} />
                </div>
              ))}
            </div>
          </Section>

          {/* D — Hooks */}
          <Section
            label="Hook Ideas"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          >
            <div className="space-y-3">
              {result.hooks.map((hook, i) => (
                <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5">
                  <span
                    className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border uppercase ${
                      HOOK_COLORS[hook.type] ?? "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {HOOK_LABEL[hook.type] ?? hook.type}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-snug">{hook.text}</p>
                  <CopyButton text={hook.text} />
                </div>
              ))}
            </div>
          </Section>

          {/* E — Creative Direction */}
          <Section
            label="Creative Direction"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "visual_improvements" as const, label: "Visual Improvements", color: "text-blue-500 dark:text-blue-400" },
                { key: "color_psychology" as const, label: "Color Psychology", color: "text-pink-500 dark:text-pink-400" },
                { key: "text_overlay" as const, label: "Text Overlay", color: "text-orange-500 dark:text-orange-400" },
                { key: "format_suggestions" as const, label: "Format Suggestions", color: "text-green-500 dark:text-green-400" },
              ].map(({ key, label, color }) => (
                <div key={key} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color}`}>{label}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.creative_direction[key]}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* F — Ad Templates (Accordion) */}
          <Section
            label="Ready-to-Use Ad Frameworks"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <div className="space-y-2">
              {result.ad_templates.map((tmpl, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenTemplate(openTemplate === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        {tmpl.framework}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tmpl.name}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openTemplate === i ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openTemplate === i && (
                    <div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap flex-1">
                          {tmpl.copy}
                        </p>
                        <CopyButton text={tmpl.copy} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* G — Targeting Suggestions */}
          <Section
            label="Targeting Suggestions"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Primary Audience</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  {result.targeting_suggestions.primary_audience}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Interest Targeting</p>
                <div className="flex flex-wrap gap-2">
                  {result.targeting_suggestions.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wide mb-2">Lookalike Strategy</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.targeting_suggestions.lookalike_strategy}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-xs font-semibold text-orange-500 dark:text-orange-400 uppercase tracking-wide mb-2">Retargeting Angle</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.targeting_suggestions.retargeting_angle}
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Error when regenerating */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
