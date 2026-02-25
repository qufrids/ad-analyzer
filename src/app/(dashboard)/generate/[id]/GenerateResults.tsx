"use client";

import { useState } from "react";

interface AdVariation {
  variation_name: string;
  hook: string;
  headline: string;
  body: string;
  cta: string;
  full_ad: string;
}

interface AdPlatform {
  platform: string;
  ad_variations: AdVariation[];
}

interface TargetAudience {
  primary: string;
  interests: string[];
  age_range: string;
  pain_points: string[];
}

interface GenerateResult {
  product_summary: string;
  ads: AdPlatform[];
  hashtag_suggestions: string[];
  target_audience: TargetAudience;
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  instagram: "text-pink-400 border-pink-500/30 bg-pink-500/10",
  tiktok: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  "google ads": "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

const VARIATION_COLORS: Record<string, string> = {
  "Hook: Pain Point": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Hook: Social Proof": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Hook: Curiosity": "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
        copied
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border-white/[0.08] hover:border-white/[0.15]"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function AdVariationCard({ variation }: { variation: AdVariation }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(variation.full_ad);
  const varColor = VARIATION_COLORS[variation.variation_name] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  return (
    <div className="rounded-xl border border-white/[0.07] bg-zinc-900/50 overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${varColor}`}>
          {variation.variation_name}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditing(!editing); if (!editing) setEditText(variation.full_ad); }}
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
              editing
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {editing ? "Cancel" : "Edit"}
          </button>
          <CopyButton text={editing ? editText : variation.full_ad} label="Copy Full Ad" />
        </div>
      </div>

      {/* Inline editor */}
      {editing ? (
        <div className="p-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={10}
            className="w-full bg-zinc-800/80 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-200 font-mono resize-y focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
          />
          <div className="flex justify-end mt-2">
            <CopyButton text={editText} label="Copy Edited Ad" />
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <Field label="Hook" value={variation.hook} />
          <Field label="Headline" value={variation.headline} />
          <Field label="Body" value={variation.body} />
          <Field label="CTA" value={variation.cta} highlight />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">{label}</span>
      <p className={`text-sm leading-relaxed ${highlight ? "text-indigo-400 font-semibold" : "text-zinc-300"}`}>
        {value}
      </p>
    </div>
  );
}

export default function GenerateResults({
  result,
  productUrl,
  productInfo,
}: {
  result: GenerateResult;
  productUrl: string;
  productInfo: { product_name: string; fetch_success?: boolean };
}) {
  const platforms = result.ads ?? [];
  const [activeTab, setActiveTab] = useState(platforms[0]?.platform ?? "");

  const activePlatformData = platforms.find(
    (p) => p.platform.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Product summary */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-zinc-200">{productInfo.product_name}</h3>
              {productInfo.fetch_success === false && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  URL not scraped
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{result.product_summary}</p>
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 mt-2 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {productUrl.length > 60 ? productUrl.slice(0, 60) + "…" : productUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Platform tabs */}
      {platforms.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {platforms.map((p) => {
            const key = p.platform.toLowerCase();
            const colorClass = PLATFORM_COLORS[key] ?? "text-zinc-400 border-zinc-500/30 bg-zinc-500/10";
            const isActive = activeTab.toLowerCase() === key;
            return (
              <button
                key={p.platform}
                onClick={() => setActiveTab(p.platform)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  isActive
                    ? colorClass
                    : "text-zinc-500 border-white/[0.06] bg-white/[0.03] hover:text-zinc-300 hover:bg-white/[0.06]"
                }`}
              >
                {p.platform}
              </button>
            );
          })}
        </div>
      )}

      {/* Ad variations */}
      {activePlatformData && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-200">
            {activePlatformData.platform} — {activePlatformData.ad_variations.length} Variations
          </h2>
          {activePlatformData.ad_variations.map((v, i) => (
            <AdVariationCard key={i} variation={v} />
          ))}
        </div>
      )}

      {/* Hashtags */}
      {result.hashtag_suggestions?.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Hashtag Suggestions
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.hashtag_suggestions.map((tag, i) => (
              <HashtagPill key={i} tag={tag} />
            ))}
          </div>
        </div>
      )}

      {/* Target audience */}
      {result.target_audience && (
        <div className="rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Target Audience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Primary</span>
              <p className="text-sm text-zinc-300">{result.target_audience.primary}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Age Range</span>
              <p className="text-sm text-zinc-300">{result.target_audience.age_range}</p>
            </div>
            {result.target_audience.interests?.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.target_audience.interests.map((int, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.target_audience.pain_points?.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Pain Points</span>
                <ul className="space-y-1">
                  {result.target_audience.pain_points.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm text-zinc-400">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate another CTA */}
      <div className="flex justify-center pt-2">
        <a
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Another
        </a>
      </div>
    </div>
  );
}

function HashtagPill({ tag }: { tag: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={copy}
      className={`text-[12px] font-medium px-3 py-1 rounded-full border transition-all ${
        copied
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/15"
      }`}
    >
      {copied ? "✓ Copied" : tag}
    </button>
  );
}
