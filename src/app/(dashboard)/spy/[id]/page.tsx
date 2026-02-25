import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import SpyCopyButton from "./SpyCopyButton";

interface SpyResult {
  competitor_score: number;
  what_they_did_right: Array<{ element: string; why_it_works: string }>;
  what_they_did_wrong: Array<{ element: string; opportunity: string }>;
  their_strategy: {
    hook_type: string;
    emotional_trigger: string;
    value_proposition: string;
    target_audience_guess: string;
    estimated_budget_level: "low" | "medium" | "high";
  };
  how_to_beat_them: {
    strategy: string;
    better_hook: string;
    better_headline: string;
    better_cta: string;
    differentiation_angle: string;
    full_counter_ad: string;
  };
  stolen_ideas: string[];
}

function SectionLabel({
  index,
  label,
  color = "zinc",
}: {
  index: string;
  label: string;
  color?: "rose" | "amber" | "green" | "cyan" | "zinc";
}) {
  const colors = {
    rose:  "text-rose-400",
    amber: "text-amber-400",
    green: "text-green-400",
    cyan:  "text-cyan-400",
    zinc:  "text-zinc-500",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className={`text-[9px] font-mono tracking-[0.25em] ${colors[color]}`}>
        [ {index} ]
      </span>
      <h2 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">
        {label}
      </h2>
      <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.05]" />
    </div>
  );
}

const BUDGET_LABELS: Record<string, { label: string; color: string }> = {
  low:    { label: "Low Budget",    color: "text-zinc-400" },
  medium: { label: "Medium Budget", color: "text-amber-400" },
  high:   { label: "High Budget",   color: "text-green-400" },
};

export default async function SpyResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: spy, error } = await supabase
    .from("spy_analyses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !spy) notFound();

  const result = spy.result as SpyResult;
  const { competitor_score, what_they_did_right, what_they_did_wrong, their_strategy, how_to_beat_them, stolen_ideas } = result;

  // Signed URL for the competitor image
  const storagePath = spy.image_url.split("/ad-images/").pop();
  let signedUrl = spy.image_url;
  if (storagePath) {
    const { data } = await supabase.storage
      .from("ad-images")
      .createSignedUrl(decodeURIComponent(storagePath), 3600);
    if (data?.signedUrl) signedUrl = data.signedUrl;
  }

  const scoreColor =
    competitor_score >= 70 ? "text-amber-400" :
    competitor_score >= 50 ? "text-orange-400" :
    "text-red-400";

  const budget = BUDGET_LABELS[their_strategy.estimated_budget_level] ?? BUDGET_LABELS.medium;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* ── Page Header ── */}
      <div>
        <Link
          href="/spy"
          className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition mb-3"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          New spy analysis
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono tracking-[0.25em] text-rose-400">[ INTELLIGENCE REPORT ]</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competitor Intel</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5 capitalize">
              {spy.platform.replace("_", " ")} · {spy.niche.replace("_", " ")}
              {spy.user_product && ` · Your product: "${spy.user_product}"`}
            </p>
          </div>

          {/* Threat level */}
          <div className="shrink-0 text-center px-4 py-3 bg-zinc-900 dark:bg-zinc-900 border border-white/[0.07] rounded-xl">
            <p className="text-[8px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-1">
              Threat Level
            </p>
            <p className={`text-3xl font-black leading-none ${scoreColor}`}>{competitor_score}</p>
            <p className="text-[8px] text-zinc-600 mt-0.5">/ 100</p>
          </div>
        </div>
      </div>

      {/* ── Competitor Ad ── */}
      <div className="relative rounded-2xl overflow-hidden border border-rose-500/20 shadow-lg shadow-rose-900/10">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-rose-500/30 via-rose-400/60 to-rose-500/30" />
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-rose-600/90 text-white rounded backdrop-blur-sm">
            Target Ad
          </span>
        </div>
        <img
          src={signedUrl}
          alt="Competitor ad"
          className="w-full max-h-72 object-cover"
        />
      </div>

      {/* ── Section 01: What They Did Right ── */}
      <section>
        <SectionLabel index="01" label="What They Did Right" color="green" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {what_they_did_right.map((item, i) => (
            <div
              key={i}
              className="bg-green-50/60 dark:bg-green-500/[0.05] border border-green-200 dark:border-green-500/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[12px] font-bold text-green-700 dark:text-green-400">{item.element}</p>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">{item.why_it_works}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 02: Vulnerabilities ── */}
      <section>
        <SectionLabel index="02" label="Where They're Vulnerable" color="rose" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {what_they_did_wrong.map((item, i) => (
            <div
              key={i}
              className="bg-rose-50/60 dark:bg-rose-500/[0.05] border border-rose-200 dark:border-rose-500/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-[12px] font-bold text-rose-700 dark:text-rose-400">{item.element}</p>
              </div>
              <div className="ml-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-500 dark:text-amber-400 mb-1">
                  Your opportunity
                </p>
                <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">{item.opportunity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 03: Strategy Decoded ── */}
      <section>
        <SectionLabel index="03" label="Their Strategy Decoded" color="zinc" />
        <div className="bg-zinc-900 border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            {[
              { label: "Hook Type",          value: their_strategy.hook_type },
              { label: "Emotional Trigger",  value: their_strategy.emotional_trigger },
              { label: "Value Proposition",  value: their_strategy.value_proposition },
              { label: "Target Audience",    value: their_strategy.target_audience_guess },
            ].map((row) => (
              <div key={row.label} className="p-4">
                <p className="text-[9px] font-mono text-zinc-500 tracking-[0.15em] uppercase mb-1.5">{row.label}</p>
                <p className="text-[13px] text-zinc-200 leading-snug">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-white/[0.05] flex items-center gap-2">
            <p className="text-[9px] font-mono text-zinc-500 tracking-[0.15em] uppercase">Production Budget</p>
            <span className="mx-2 text-zinc-700">·</span>
            <p className={`text-[12px] font-bold ${budget.color}`}>{budget.label}</p>
          </div>
        </div>
      </section>

      {/* ── Section 04: Your Battle Plan ── */}
      <section>
        <SectionLabel index="04" label="Your Battle Plan to Beat Them" color="cyan" />

        {/* Strategy overview */}
        <div className="mb-4 p-4 bg-cyan-50/60 dark:bg-cyan-500/[0.05] border border-cyan-200 dark:border-cyan-500/20 rounded-xl">
          <p className="text-[9px] font-mono text-cyan-600 dark:text-cyan-500 tracking-[0.15em] uppercase mb-1.5">Overall Strategy</p>
          <p className="text-[13px] text-gray-700 dark:text-zinc-300 leading-[1.7]">{how_to_beat_them.strategy}</p>
        </div>

        {/* Hook, Headline, CTA cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {[
            { label: "Better Hook",     value: how_to_beat_them.better_hook,     icon: "⚡" },
            { label: "Better Headline", value: how_to_beat_them.better_headline, icon: "✍️" },
            { label: "Better CTA",      value: how_to_beat_them.better_cta,      icon: "🎯" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-zinc-900 border border-white/[0.07] rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{card.icon}</span>
                  <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-cyan-400">{card.label}</p>
                </div>
                <SpyCopyButton text={card.value} />
              </div>
              <p className="text-[12px] text-zinc-200 leading-relaxed flex-1">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Differentiation angle */}
        <div className="mb-3 px-4 py-3 bg-zinc-900 border border-white/[0.07] rounded-xl flex items-start gap-3">
          <span className="text-[9px] font-mono tracking-[0.15em] text-zinc-500 uppercase mt-0.5 shrink-0">Differentiation</span>
          <p className="text-[12px] text-zinc-300 leading-relaxed">{how_to_beat_them.differentiation_angle}</p>
        </div>

        {/* Full counter-ad — expandable */}
        <details className="group bg-zinc-900 border border-cyan-500/20 rounded-xl overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-400/50 to-cyan-500/20" />
          <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-[0.15em] text-cyan-400 uppercase">Full Counter-Ad</span>
              <span className="text-[9px] text-zinc-600">· complete ready-to-use copy</span>
            </div>
            <div className="flex items-center gap-2">
              <SpyCopyButton text={how_to_beat_them.full_counter_ad} label="Copy All" />
              <svg className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="px-4 pb-4 border-t border-white/[0.06]">
            <pre className="mt-3 text-[12px] text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
              {how_to_beat_them.full_counter_ad}
            </pre>
          </div>
        </details>
      </section>

      {/* ── Section 05: Ideas Worth Stealing ── */}
      {stolen_ideas && stolen_ideas.length > 0 && (
        <section>
          <SectionLabel index="05" label="Ideas Worth Stealing" color="amber" />
          <div className="flex flex-wrap gap-2">
            {stolen_ideas.map((idea, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-amber-50/70 dark:bg-amber-500/[0.07] text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
              >
                <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.001z" />
                </svg>
                {idea}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/spy"
          className="flex-1 text-center py-3 px-5 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 text-sm font-semibold rounded-xl transition"
        >
          Spy on Another Ad
        </Link>
        <Link
          href="/analyze"
          className="flex-1 text-center py-3 px-5 bg-gradient-to-r from-rose-600 to-cyan-600 hover:from-rose-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Build Your Counter-Ad with AI Improver
        </Link>
      </div>
    </div>
  );
}
