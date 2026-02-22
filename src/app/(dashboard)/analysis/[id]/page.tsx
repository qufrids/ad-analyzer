import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ScoreRing from "./ScoreRing";
import ScoreBar from "./ScoreBar";
import DownloadPDF from "./DownloadPDF";

const SCORE_LABELS: Record<string, string> = {
  visual_impact: "Visual Impact",
  copy_effectiveness: "Copy Effectiveness",
  hook_strength: "Hook Strength",
  brand_consistency: "Brand Consistency",
  cta_clarity: "CTA Clarity",
  platform_fit: "Platform Fit",
};

function priorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    case "medium":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    case "low":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    default:
      return "text-gray-400 bg-gray-800 border-gray-700";
  }
}

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!analysis) notFound();

  // Generate signed URL for the image (bucket is private)
  let imageUrl = "";
  if (analysis.image_url) {
    const path = analysis.image_url.split("/ad-images/").pop();
    if (path) {
      const { data: signedData } = await supabase.storage
        .from("ad-images")
        .createSignedUrl(decodeURIComponent(path), 3600);
      if (signedData?.signedUrl) imageUrl = signedData.signedUrl;
    }
  }

  const result = analysis.analysis_result as {
    overall_score: number;
    summary: string;
    scores: Record<string, { score: number; feedback: string }>;
    strengths: string[];
    weaknesses: string[];
    recommendations: { priority: string; action: string }[];
    competitor_insight: string;
    predicted_ctr_range: string;
  };

  const overallScore = analysis.overall_score;

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-8 sm:pb-12">
      {/* Back link */}
      <Link
        href="/history"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to History
      </Link>

      {/* ========== HERO ========== */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-4 sm:p-6 min-h-[200px] sm:min-h-[300px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Ad creative"
                className="max-h-[280px] sm:max-h-[400px] w-auto rounded-lg object-contain"
              />
            ) : (
              <div className="text-gray-400 dark:text-gray-600">No image</div>
            )}
          </div>

          {/* Score + Summary */}
          <div className="p-5 sm:p-8 flex flex-col items-center justify-center text-center">
            <ScoreRing score={overallScore} />
            <div className="flex items-center gap-2 mt-5 mb-3">
              <span className="text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-0.5 rounded-full uppercase">
                {analysis.platform}
              </span>
              <span className="text-xs font-medium text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2.5 py-0.5 rounded-full capitalize">
                {analysis.niche}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-md">
              {result.summary}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
              {new Date(analysis.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ========== SCORE BREAKDOWN ========== */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Score Breakdown</h2>
        <div className="space-y-4">
          {Object.entries(SCORE_LABELS).map(([key, label]) => {
            const data = result.scores?.[key];
            if (!data) return null;
            return (
              <ScoreBar
                key={key}
                label={label}
                score={data.score}
                feedback={data.feedback}
              />
            );
          })}
        </div>
      </section>

      {/* ========== STRENGTHS & WEAKNESSES ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Strengths */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h2>
          <ul className="space-y-3">
            {result.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Weaknesses */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Weaknesses
          </h2>
          <ul className="space-y-3">
            {result.weaknesses?.map((w, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{w}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ========== RECOMMENDATIONS ========== */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Recommendations</h2>
        <div className="space-y-3">
          {result.recommendations
            ?.sort((a, b) => {
              const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
              return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
            })
            .map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 sm:gap-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4"
              >
                <span
                  className={`shrink-0 text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-full border uppercase ${priorityColor(
                    rec.priority
                  )}`}
                >
                  {rec.priority}
                </span>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{rec.action}</p>
              </div>
            ))}
        </div>
      </section>

      {/* ========== BONUS INSIGHTS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Competitor Insight */}
        <section className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/20 rounded-2xl p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Competitor Insight
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {result.competitor_insight}
          </p>
        </section>

        {/* Predicted CTR */}
        <section className="bg-gradient-to-br from-purple-600/5 to-pink-600/5 border border-purple-500/20 rounded-2xl p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Predicted CTR
          </h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {result.predicted_ctr_range}
          </p>
          <p className="text-xs text-gray-500">
            Estimated click-through rate based on creative quality
          </p>
        </section>
      </div>

      {/* ========== ACTIONS ========== */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
        <Link
          href="/analyze"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Analyze Another
        </Link>
        <DownloadPDF
          data={{
            platform: analysis.platform,
            niche: analysis.niche,
            overall_score: analysis.overall_score,
            created_at: analysis.created_at,
            result,
          }}
        />
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-medium rounded-lg cursor-not-allowed text-sm"
          title="Coming soon"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
