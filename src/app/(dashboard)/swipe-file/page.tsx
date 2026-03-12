"use client";

import { useState, useRef } from "react";

const PLATFORMS = ["All", "Facebook", "TikTok", "Instagram", "Google"];

const PLATFORM_BADGE: Record<string, string> = {
  Facebook:
    "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20",
  TikTok:
    "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20",
  Instagram:
    "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20",
  Google:
    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20",
};

type Template = {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  framework: string;
  tag?: string;
};

const TEMPLATES: Template[] = [
  {
    id: "pas",
    name: "PAS Formula",
    description: "Problem → Agitate → Solution",
    platforms: ["Facebook", "Instagram", "Google"],
    framework: "PAS",
    tag: "High Performer 🔥",
  },
  {
    id: "aida",
    name: "AIDA Formula",
    description: "Attention → Interest → Desire → Action",
    platforms: ["Facebook", "TikTok", "Instagram"],
    framework: "AIDA",
  },
  {
    id: "bab",
    name: "Before-After-Bridge",
    description: "Show the transformation journey",
    platforms: ["Facebook", "Instagram"],
    framework: "BAB",
  },
  {
    id: "social-proof",
    name: "Social Proof Stack",
    description: "Lead with credibility and testimonials",
    platforms: ["Facebook", "Instagram"],
    framework: "Social Proof",
    tag: "High Performer 🔥",
  },
  {
    id: "pov",
    name: "The POV Format",
    description: "First-person story-style hook for short-form",
    platforms: ["TikTok", "Instagram"],
    framework: "POV",
    tag: "Viral Format 🔥",
  },
  {
    id: "pain-solution",
    name: "Pain-Solution Reveal",
    description: "Lead with pain, reveal the solution",
    platforms: ["Facebook", "Google"],
    framework: "Pain-Solution",
  },
  {
    id: "question-hook",
    name: "The Question Hook",
    description: "Open with a compelling question that stops the scroll",
    platforms: ["Facebook", "TikTok", "Google"],
    framework: "Question Hook",
  },
  {
    id: "curiosity-gap",
    name: "Curiosity Gap",
    description: "Tease information they need to click to get",
    platforms: ["TikTok", "Facebook"],
    framework: "Curiosity Gap",
  },
  {
    id: "bold-claim",
    name: "The Bold Claim",
    description: "Make a dramatic, provable claim right upfront",
    platforms: ["Facebook", "Google"],
    framework: "Bold Claim",
    tag: "High CTR 🚀",
  },
  {
    id: "story-arc",
    name: "The Story Arc",
    description: "Narrative-driven ad with a mini hero's journey",
    platforms: ["Facebook", "TikTok"],
    framework: "Story Arc",
  },
  {
    id: "fear-relief",
    name: "Fear + Relief",
    description: "Trigger a specific fear then offer the relief",
    platforms: ["Facebook", "Instagram"],
    framework: "Fear + Relief",
  },
  {
    id: "comparison",
    name: "The Comparison",
    description: "Us vs. them or old way vs. new way",
    platforms: ["Facebook", "Google"],
    framework: "Comparison",
  },
  {
    id: "scarcity-value",
    name: "Scarcity + Value Stack",
    description: "Stack value then add a limited-time urgency trigger",
    platforms: ["Facebook", "Instagram", "Google"],
    framework: "Scarcity",
  },
  {
    id: "transformation",
    name: "The Transformation",
    description: "Written before/after journey showing the result",
    platforms: ["Instagram", "TikTok"],
    framework: "Transformation",
  },
  {
    id: "authority",
    name: "Expert Authority",
    description: "Establish credibility, then convert",
    platforms: ["Facebook", "Google"],
    framework: "Authority",
  },
  {
    id: "objection-crusher",
    name: "Objection Crusher",
    description: "Address and destroy the #1 objection upfront",
    platforms: ["Facebook", "Google"],
    framework: "Objection Crusher",
  },
  {
    id: "numbers-hook",
    name: "The Numbers Hook",
    description: "Lead with a compelling statistic or specific number",
    platforms: ["Facebook", "TikTok", "Google"],
    framework: "Numbers Hook",
    tag: "High Performer 🔥",
  },
  {
    id: "testimonial-story",
    name: "Testimonial Story",
    description: "Third-person success story in the customer's voice",
    platforms: ["Facebook", "Instagram"],
    framework: "Testimonial Story",
  },
  {
    id: "challenge",
    name: "The Challenge",
    description: "Challenge your audience to take action or think differently",
    platforms: ["TikTok", "Instagram"],
    framework: "Challenge",
  },
  {
    id: "what-if",
    name: 'The "What If" Frame',
    description: "Open up possibility and imagination",
    platforms: ["Facebook", "TikTok"],
    framework: "What If",
  },
  {
    id: "bts",
    name: "Behind-the-Scenes",
    description: "Show authenticity through a process or making-of reveal",
    platforms: ["TikTok", "Instagram"],
    framework: "BTS",
  },
  {
    id: "direct-response",
    name: "Direct Response Classic",
    description: "Headline + bullet benefits + strong CTA formula",
    platforms: ["Google", "Facebook"],
    framework: "Direct Response",
  },
];

export default function SwipeFilePage() {
  const [activePlatform, setActivePlatform] = useState("All");
  const [selected, setSelected] = useState<Template | null>(null);
  const [platform, setPlatform] = useState("Facebook");
  const [product, setProduct] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copy, setCopy] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered =
    activePlatform === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.platforms.includes(activePlatform));

  function selectTemplate(t: Template) {
    setSelected(t);
    setPlatform(t.platforms[0]);
    setCopy("");
    setError("");
    setTimeout(
      () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100
    );
  }

  async function generate() {
    if (!selected || !product.trim()) return;
    setGenerating(true);
    setCopy("");
    setError("");
    try {
      const res = await fetch("/api/swipe-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: selected.name,
          framework: selected.framework,
          platform,
          productDescription: product,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCopy(data.copy);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/[0.06]">
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 tracking-wide">
            📂 Template Library
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Swipe File</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          22 proven ad frameworks. Pick a template, describe your product, get ready-to-use copy.
        </p>
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activePlatform === p
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTemplate(t)}
            className={`text-left p-4 rounded-xl border transition-all duration-150 ${
              selected?.id === t.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-500/30"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {t.name}
              </p>
              {t.tag && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {t.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t.description}</p>
            <div className="flex flex-wrap gap-1">
              {t.platforms.map((pl) => (
                <span
                  key={pl}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLATFORM_BADGE[pl]}`}
                >
                  {pl}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Generation panel */}
      {selected && (
        <div
          ref={panelRef}
          className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                {selected.framework} Framework
              </p>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selected.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selected.description}</p>
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setCopy("");
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selected.platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your product / offer
            </label>
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              rows={3}
              placeholder="e.g. A $47 online course that teaches freelancers how to land their first 3 clients in 30 days using cold DMs..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={generate}
            disabled={generating || !product.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate Ad Copy →"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {copy && (
            <div className="mt-5 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Generated Copy
                </p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {copy}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
