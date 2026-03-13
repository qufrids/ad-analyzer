import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ScoreRing from "./ScoreRing";
import DownloadPDF from "./DownloadPDF";
import AdImprover from "./AdImprover";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface AR {
  overall_score?: number;
  score_grade?: string;
  percentile?: string;
  summary?: string;
  first_impression?: {
    score?: number;
    stop_scroll_rating?: string;
    estimated_thumb_stop_rate?: string;
    first_3_seconds?: string;
    pattern_interrupt?: string;
    feedback?: string;
  };
  headline_analysis?: {
    score?: number;
    detected_headline?: string;
    headline_type?: string;
    clarity?: number;
    specificity?: number;
    emotional_pull?: number;
    power_words_used?: string[];
    power_words_missing?: string[];
    character_count?: number | null;
    platform_length_fit?: string;
    feedback?: string;
  };
  visual_design?: {
    score?: number;
    layout_type?: string;
    color_analysis?: {
      dominant_colors?: string[];
      contrast_level?: string;
      color_harmony?: string;
      brand_consistency?: number | string;
      platform_color_fit?: string;
      feedback?: string;
    };
    typography?: {
      font_style?: string;
      readability?: number;
      text_hierarchy?: string;
      text_to_image_ratio?: string;
      platform_text_compliance?: string;
      feedback?: string;
    };
    composition?: {
      balance?: string;
      focal_point?: string;
      white_space?: string;
      visual_flow?: string;
      feedback?: string;
    };
    image_quality?: {
      resolution?: string;
      lighting?: string;
      professionalism?: number;
      feedback?: string;
    };
    overall_feedback?: string;
  };
  copy_analysis?: {
    score?: number;
    detected_body_copy?: string;
    copy_length?: string;
    readability_level?: string;
    tone?: string;
    persuasion_techniques?: string[];
    persuasion_techniques_missing?: string[];
    value_proposition?: {
      detected?: boolean | string;
      clarity?: number;
      what_it_is?: string;
      feedback?: string;
    };
    social_proof?: {
      present?: boolean | string;
      type?: string;
      strength?: string;
      feedback?: string;
    };
    urgency_scarcity?: {
      present?: boolean | string;
      type?: string;
      effectiveness?: number;
      feedback?: string;
    };
    overall_feedback?: string;
  };
  cta_analysis?: {
    score?: number;
    detected_cta?: string;
    cta_type?: string;
    visibility?: number;
    action_clarity?: number;
    urgency_level?: number;
    value_in_cta?: boolean | string;
    cta_color_contrast?: string;
    platform_cta_fit?: string;
    better_cta_options?: string[];
    feedback?: string;
  };
  hook_analysis?: {
    score?: number;
    hook_type?: string;
    hook_strength?: string;
    scroll_stop_power?: number;
    emotional_trigger?: string;
    pattern_interrupt_score?: number;
    better_hook_approaches?: string[];
    feedback?: string;
  };
  platform_optimization?: {
    score?: number;
    platform?: string;
    dimension_compliance?: string;
    safe_zones?: string;
    native_feel?: number;
    format_recommendation?: string;
    placement_fit?: { feed?: number; stories?: number; reels?: number; explore?: number };
    platform_specific_tips?: string[];
    feedback?: string;
  };
  audience_alignment?: {
    score?: number;
    apparent_target?: string;
    age_group_fit?: string;
    gender_skew?: string;
    income_level_signal?: string;
    cultural_relevance?: string;
    pain_point_addressed?: string;
    desire_triggered?: string;
    feedback?: string;
  };
  brand_analysis?: {
    score?: number;
    brand_name_visible?: boolean | string;
    logo_visible?: boolean | string;
    brand_recognition?: string;
    brand_trust_signals?: string[];
    brand_consistency?: string;
    feedback?: string;
  };
  competitive_position?: {
    differentiation?: number;
    what_competitors_do_better?: string;
    unique_advantage?: string;
    market_saturation_risk?: string;
  };
  performance_predictions?: {
    estimated_ctr_range?: string;
    estimated_ctr_rating?: string;
    estimated_engagement_rate?: string;
    estimated_conversion_potential?: string;
    estimated_cpm_efficiency?: string;
    fatigue_risk?: string;
    estimated_effective_lifespan?: string;
    scaling_potential?: string;
  };
  strengths?: string[];
  critical_issues?: string[];
  weaknesses?: string[];
  recommendations?: Array<{
    priority: string;
    category?: string;
    action: string;
    expected_impact?: string;
  }>;
  quick_wins?: string[];
  testing_suggestions?: Array<{
    test_name?: string;
    hypothesis?: string;
    variant_a?: string;
    variant_b?: string;
  }>;
  // Legacy fields
  scores?: Record<string, { score: number; feedback: string }>;
  competitor_insight?: string;
  predicted_ctr_range?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function sc(n?: number): string {
  if (n === undefined || n === null) return "text-zinc-400";
  if (n >= 75) return "text-green-400";
  if (n >= 60) return "text-yellow-400";
  if (n >= 40) return "text-orange-400";
  return "text-red-400";
}

function sb(n?: number): string {
  if (n === undefined || n === null) return "bg-zinc-800 border-zinc-700 text-zinc-400";
  if (n >= 75) return "bg-green-400/10 border-green-400/20 text-green-400";
  if (n >= 60) return "bg-yellow-400/10 border-yellow-400/20 text-yellow-400";
  if (n >= 40) return "bg-orange-400/10 border-orange-400/20 text-orange-400";
  return "bg-red-400/10 border-red-400/20 text-red-400";
}

function bc(n?: number): string {
  if (n === undefined || n === null) return "#52525b";
  if (n >= 75) return "#22c55e";
  if (n >= 60) return "#eab308";
  if (n >= 40) return "#f97316";
  return "#ef4444";
}

function pc(p: string): string {
  switch (p) {
    case "critical": return "bg-red-400/10 border-red-400/20 text-red-400";
    case "high":     return "bg-orange-400/10 border-orange-400/20 text-orange-400";
    case "medium":   return "bg-yellow-400/10 border-yellow-400/20 text-yellow-400";
    case "low":      return "bg-blue-400/10 border-blue-400/20 text-blue-400";
    default:         return "bg-zinc-700/50 border-zinc-600/50 text-zinc-400";
  }
}

function gradeColor(grade?: string): string {
  if (!grade) return "bg-zinc-800 border-zinc-700 text-zinc-400";
  if (grade.startsWith("A")) return "bg-green-400/10 border-green-400/30 text-green-400";
  if (grade.startsWith("B")) return "bg-emerald-400/10 border-emerald-400/30 text-emerald-400";
  if (grade.startsWith("C")) return "bg-yellow-400/10 border-yellow-400/30 text-yellow-400";
  if (grade === "D") return "bg-orange-400/10 border-orange-400/30 text-orange-400";
  return "bg-red-400/10 border-red-400/30 text-red-400";
}

function ratingColor(r?: string): string {
  if (!r) return "text-zinc-400";
  const low = r.toLowerCase();
  if (low.includes("high") || low.includes("strong") || low.includes("above") || low.includes("well above") || low.includes("low cost")) return "text-green-400";
  if (low.includes("medium") || low.includes("average") || low.includes("moderate")) return "text-yellow-400";
  return "text-red-400";
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT HELPERS
───────────────────────────────────────────────────────────────────────────── */
function MiniBar({ score, label }: { score?: number; label: string }) {
  return (
    <div className="flex-1 min-w-[70px]">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</span>
        <span className={`text-[11px] font-bold ${sc(score)}`}>{score ?? "—"}</span>
      </div>
      <div className="h-[5px] bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score ?? 0}%`, background: bc(score) }} />
      </div>
    </div>
  );
}

function Pill({ text, color = "neutral" }: { text: string; color?: "green" | "red" | "orange" | "yellow" | "blue" | "purple" | "cyan" | "neutral" }) {
  const map: Record<string, string> = {
    green:   "bg-green-400/10  border-green-400/25  text-green-400",
    red:     "bg-red-400/10    border-red-400/25    text-red-400",
    orange:  "bg-orange-400/10 border-orange-400/25 text-orange-400",
    yellow:  "bg-yellow-400/10 border-yellow-400/25 text-yellow-400",
    blue:    "bg-blue-400/10   border-blue-400/25   text-blue-400",
    purple:  "bg-purple-400/10 border-purple-400/25 text-purple-400",
    cyan:    "bg-cyan-400/10   border-cyan-400/25   text-cyan-400",
    neutral: "bg-zinc-800      border-zinc-700      text-zinc-400",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-medium ${map[color]}`}>
      {text}
    </span>
  );
}

function FeedbackBox({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="p-4 bg-zinc-800/40 border border-zinc-700/50 rounded-xl">
      <p className="text-[13px] text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}

function QuoteBox({ text, label }: { text?: string; label?: string }) {
  if (!text || text.toLowerCase().includes("no ") && text.length < 30) return null;
  return (
    <div className="p-4 bg-zinc-800/60 border-l-2 border-cyan-500/40 rounded-r-xl rounded-l-sm">
      {label && <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">{label}</p>}
      <p className="text-[13px] text-zinc-200 italic leading-relaxed">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

function Section({
  title,
  score,
  open = false,
  children,
}: {
  title: string;
  score?: number;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-800/40 transition-colors list-none select-none">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-semibold text-white">{title}</h2>
          {score !== undefined && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${sb(score)}`}>{score}</span>
          )}
        </div>
        <svg
          className="w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 group-open:rotate-180"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-5 pb-6 space-y-4 border-t border-zinc-800">
        <div className="pt-4 space-y-4">{children}</div>
      </div>
    </details>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-zinc-800/30 border border-zinc-700/40 rounded-xl space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{title}</p>
      {children}
    </div>
  );
}

function BoolCheck({ val, label }: { val?: boolean | string; label: string }) {
  const isTrue = val === true || val === "true";
  return (
    <div className="flex items-center gap-2">
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${isTrue ? "bg-green-400/20" : "bg-red-400/20"}`}>
        {isTrue
          ? <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          : <svg className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        }
      </span>
      <span className={`text-[12px] ${isTrue ? "text-zinc-300" : "text-zinc-500"}`}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!analysis) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status")
    .eq("id", user.id)
    .single();

  const tier = profile?.subscription_tier ?? "free";
  const isPro = ["starter", "pro", "agency"].includes(tier);
  const improvementsRemaining = isPro ? 40 : 1;

  // Signed URL for ad image
  let imageUrl = "";
  if (analysis.image_url) {
    const path = analysis.image_url.split("/ad-images/").pop();
    if (path) {
      const { data: sd } = await supabase.storage.from("ad-images").createSignedUrl(decodeURIComponent(path), 3600);
      if (sd?.signedUrl) imageUrl = sd.signedUrl;
    }
  }

  // Signed URLs for improved images
  let improvedImageUrls: string[] = [];
  if (analysis.improved_image_urls && Array.isArray(analysis.improved_image_urls)) {
    const signed = await Promise.all(
      (analysis.improved_image_urls as string[]).map(async (p) => {
        const { data } = await supabase.storage.from("ad-images").createSignedUrl(decodeURIComponent(p), 3600);
        return data?.signedUrl ?? "";
      })
    );
    improvedImageUrls = signed.filter(Boolean);
  }
  if (improvedImageUrls.length === 0 && analysis.improved_image_url) {
    const path = (analysis.improved_image_url as string).split("/ad-images/").pop();
    if (path) {
      const { data: sd } = await supabase.storage.from("ad-images").createSignedUrl(decodeURIComponent(path), 3600);
      if (sd?.signedUrl) improvedImageUrls = [sd.signedUrl];
    }
  }

  const r = (analysis.analysis_result ?? {}) as AR;
  const overallScore = analysis.overall_score ?? r.overall_score ?? 0;

  // Derived counts for the alert bar
  const criticalCount = r.recommendations?.filter((x) => x.priority === "critical").length ?? 0;
  const highCount     = r.recommendations?.filter((x) => x.priority === "high").length ?? 0;
  const quickWinCount = r.quick_wins?.length ?? 0;

  // Sort recommendations: critical → high → medium → low
  const sortedRecs = [...(r.recommendations ?? [])].sort((a, b) => {
    const ord: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return (ord[a.priority] ?? 4) - (ord[b.priority] ?? 4);
  });

  // Legacy ScoreBar keys for backward compat
  const legacyScores = r.scores;
  const SCORE_LABELS: Record<string, string> = {
    visual_impact: "Visual Impact",
    copy_effectiveness: "Copy Effectiveness",
    hook_strength: "Hook Strength",
    brand_consistency: "Brand Consistency",
    cta_clarity: "CTA Clarity",
    platform_fit: "Platform Fit",
  };

  const isNewFormat = !!(r.headline_analysis || r.visual_design || r.hook_analysis);

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">

      {/* Back */}
      <Link href="/history" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to History
      </Link>

      {/* ══════════════════════════════════════════════════════════════════════
          SCORE OVERVIEW — always visible
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">

          {/* Image panel */}
          <div className="bg-zinc-800/50 flex items-center justify-center p-5 min-h-[220px] lg:min-h-[280px] border-b lg:border-b-0 lg:border-r border-zinc-800">
            {imageUrl ? (
              <img src={imageUrl} alt="Ad creative" className="max-h-[260px] w-auto rounded-lg object-contain" />
            ) : (
              <div className="text-zinc-600 text-sm">No image available</div>
            )}
          </div>

          {/* Score + summary */}
          <div className="p-6 flex flex-col gap-5">
            {/* Top row: ring + grade + percentile */}
            <div className="flex items-center gap-5 flex-wrap">
              <ScoreRing score={overallScore} />
              <div className="space-y-2">
                {r.score_grade && (
                  <span className={`inline-block text-2xl font-black px-3 py-1 rounded-xl border ${gradeColor(r.score_grade)}`}>
                    {r.score_grade}
                  </span>
                )}
                {r.percentile && (
                  <p className="text-[12px] text-zinc-400">{r.percentile}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Pill text={analysis.platform} color="blue" />
                  <Pill text={analysis.niche} color="purple" />
                  <Pill text={new Date(analysis.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} color="neutral" />
                </div>
              </div>
            </div>

            {/* Quick prediction stats */}
            {r.performance_predictions && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {r.performance_predictions.estimated_ctr_range && (
                  <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Est. CTR</p>
                    <p className="text-[15px] font-bold text-green-400">{r.performance_predictions.estimated_ctr_range}</p>
                  </div>
                )}
                {r.performance_predictions.estimated_engagement_rate && (
                  <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Engagement</p>
                    <p className={`text-[15px] font-bold ${ratingColor(r.performance_predictions.estimated_engagement_rate)}`}>
                      {r.performance_predictions.estimated_engagement_rate}
                    </p>
                  </div>
                )}
                {r.performance_predictions.scaling_potential && (
                  <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Scale Potential</p>
                    <p className={`text-[15px] font-bold ${ratingColor(r.performance_predictions.scaling_potential)}`}>
                      {r.performance_predictions.scaling_potential}
                    </p>
                  </div>
                )}
                {r.performance_predictions.estimated_effective_lifespan && (
                  <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Ad Lifespan</p>
                    <p className="text-[13px] font-bold text-zinc-300">{r.performance_predictions.estimated_effective_lifespan}</p>
                  </div>
                )}
                {/* Legacy CTR */}
                {!r.performance_predictions.estimated_ctr_range && r.predicted_ctr_range && (
                  <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Est. CTR</p>
                    <p className="text-[15px] font-bold text-green-400">{r.predicted_ctr_range}</p>
                  </div>
                )}
              </div>
            )}
            {/* Legacy CTR if no predictions object */}
            {!r.performance_predictions && r.predicted_ctr_range && (
              <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 inline-flex flex-col items-start">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Est. CTR</p>
                <p className="text-[15px] font-bold text-green-400">{r.predicted_ctr_range}</p>
              </div>
            )}

            {/* Summary */}
            {r.summary && (
              <p className="text-[14px] text-zinc-300 leading-relaxed">{r.summary}</p>
            )}

            {/* Issue count tags */}
            {(criticalCount > 0 || highCount > 0 || quickWinCount > 0) && (
              <div className="flex flex-wrap gap-2">
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-[12px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {criticalCount} Critical Issue{criticalCount !== 1 ? "s" : ""}
                  </span>
                )}
                {highCount > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400 text-[12px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    {highCount} High Priority
                  </span>
                )}
                {quickWinCount > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-[12px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {quickWinCount} Quick Win{quickWinCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ACTION PLAN — always visible
      ══════════════════════════════════════════════════════════════════════ */}
      {(sortedRecs.length > 0 || (r.quick_wins && r.quick_wins.length > 0)) && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <h2 className="text-[15px] font-semibold text-white">Action Plan</h2>

          {/* Quick Wins */}
          {r.quick_wins && r.quick_wins.length > 0 && (
            <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-green-400 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Wins — Fix these in 5 minutes
              </p>
              <ul className="space-y-2">
                {r.quick_wins.map((qw, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-green-400/15 border border-green-400/25 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-green-400">{i + 1}</span>
                    <span className="text-[13px] text-zinc-200">{qw}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {sortedRecs.length > 0 && (
            <div className="space-y-2.5">
              {sortedRecs.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-zinc-800/40 border border-zinc-700/50 rounded-xl">
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${pc(rec.priority)}`}>
                    {rec.priority}
                  </span>
                  <div className="min-w-0 flex-1">
                    {rec.category && (
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider mr-2">[{rec.category}]</span>
                    )}
                    <span className="text-[13px] text-zinc-200">{rec.action}</span>
                    {rec.expected_impact && (
                      <p className="text-[11px] text-zinc-500 mt-1">→ {rec.expected_impact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STRENGTHS & ISSUES — always visible
      ══════════════════════════════════════════════════════════════════════ */}
      {((r.strengths && r.strengths.length > 0) || (r.critical_issues && r.critical_issues.length > 0) || (r.weaknesses && r.weaknesses.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          {r.strengths && r.strengths.length > 0 && (
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Strengths
              </h2>
              <ul className="space-y-2.5">
                {r.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-green-400/5 border border-green-400/10 rounded-xl">
                    <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[13px] text-zinc-300 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Critical issues or legacy weaknesses */}
          {((r.critical_issues && r.critical_issues.length > 0) || (r.weaknesses && r.weaknesses.length > 0)) && (
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Critical Issues
              </h2>
              <ul className="space-y-2.5">
                {(r.critical_issues ?? r.weaknesses ?? []).map((w, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-red-400/5 border border-red-400/10 rounded-xl">
                    <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-[13px] text-zinc-300 leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DETAILED SECTIONS — collapsible
      ══════════════════════════════════════════════════════════════════════ */}

      {/* § 1 — FIRST IMPRESSION & HOOK */}
      {(r.first_impression || r.hook_analysis) && (
        <Section title="First Impression & Hook" score={r.first_impression?.score ?? r.hook_analysis?.score} open>
          {r.first_impression && (
            <>
              <div className="flex flex-wrap gap-3 items-center">
                {r.first_impression.stop_scroll_rating && (
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Scroll Stop</span>
                    <Pill
                      text={r.first_impression.stop_scroll_rating}
                      color={r.first_impression.stop_scroll_rating === "Strong" ? "green" : r.first_impression.stop_scroll_rating === "Moderate" ? "yellow" : "red"}
                    />
                  </div>
                )}
                {r.first_impression.estimated_thumb_stop_rate && (
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Thumb Stop Rate</span>
                    <span className="text-[15px] font-bold text-green-400">{r.first_impression.estimated_thumb_stop_rate}</span>
                  </div>
                )}
                {r.first_impression.score !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Score</span>
                    <span className={`text-[22px] font-black ${sc(r.first_impression.score)}`}>{r.first_impression.score}</span>
                  </div>
                )}
              </div>
              {r.first_impression.first_3_seconds && (
                <SubSection title="First 3 Seconds">
                  <p className="text-[13px] text-zinc-300 leading-relaxed">{r.first_impression.first_3_seconds}</p>
                </SubSection>
              )}
              {r.first_impression.pattern_interrupt && (
                <SubSection title="Pattern Interrupt">
                  <p className="text-[13px] text-zinc-300 leading-relaxed">{r.first_impression.pattern_interrupt}</p>
                </SubSection>
              )}
              <FeedbackBox text={r.first_impression.feedback} />
            </>
          )}

          {r.hook_analysis && (
            <>
              <div className="pt-2 border-t border-zinc-800 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Hook Analysis</p>
                <div className="flex flex-wrap gap-3">
                  {r.hook_analysis.hook_type && <Pill text={r.hook_analysis.hook_type} color="purple" />}
                  {r.hook_analysis.hook_strength && (
                    <Pill
                      text={r.hook_analysis.hook_strength}
                      color={r.hook_analysis.hook_strength === "Strong" ? "green" : r.hook_analysis.hook_strength === "Moderate" ? "yellow" : "red"}
                    />
                  )}
                  {r.hook_analysis.emotional_trigger && <Pill text={r.hook_analysis.emotional_trigger} color="orange" />}
                </div>
                <div className="flex flex-wrap gap-4">
                  <MiniBar score={r.hook_analysis.scroll_stop_power} label="Scroll Stop Power" />
                  <MiniBar score={r.hook_analysis.pattern_interrupt_score} label="Pattern Interrupt" />
                </div>
                {r.hook_analysis.better_hook_approaches && r.hook_analysis.better_hook_approaches.length > 0 && (
                  <SubSection title="Better Hook Approaches">
                    <ul className="space-y-2">
                      {r.hook_analysis.better_hook_approaches.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold text-[11px] shrink-0 mt-0.5">→</span>
                          <span className="text-[13px] text-zinc-300">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </SubSection>
                )}
                <FeedbackBox text={r.hook_analysis.feedback} />
              </div>
            </>
          )}
        </Section>
      )}

      {/* § 2 — HEADLINE ANALYSIS */}
      {r.headline_analysis && (
        <Section title="Headline Analysis" score={r.headline_analysis.score} open>
          <QuoteBox text={r.headline_analysis.detected_headline} label="Detected Headline" />
          <div className="flex flex-wrap gap-2">
            {r.headline_analysis.headline_type && <Pill text={r.headline_analysis.headline_type} color="blue" />}
            {r.headline_analysis.platform_length_fit && (
              <Pill
                text={r.headline_analysis.platform_length_fit}
                color={r.headline_analysis.platform_length_fit === "Optimal" ? "green" : "orange"}
              />
            )}
            {r.headline_analysis.character_count != null && (
              <Pill text={`${r.headline_analysis.character_count} chars`} color="neutral" />
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <MiniBar score={r.headline_analysis.clarity} label="Clarity" />
            <MiniBar score={r.headline_analysis.specificity} label="Specificity" />
            <MiniBar score={r.headline_analysis.emotional_pull} label="Emotional Pull" />
          </div>
          {(r.headline_analysis.power_words_used && r.headline_analysis.power_words_used.length > 0) && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Power Words Used</p>
              <div className="flex flex-wrap gap-1.5">
                {r.headline_analysis.power_words_used.map((w, i) => <Pill key={i} text={w} color="green" />)}
              </div>
            </div>
          )}
          {(r.headline_analysis.power_words_missing && r.headline_analysis.power_words_missing.length > 0) && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Missing Power Words</p>
              <div className="flex flex-wrap gap-1.5">
                {r.headline_analysis.power_words_missing.map((w, i) => <Pill key={i} text={w} color="neutral" />)}
              </div>
            </div>
          )}
          <FeedbackBox text={r.headline_analysis.feedback} />
        </Section>
      )}

      {/* § 3 — VISUAL DESIGN */}
      {r.visual_design && (
        <Section title="Visual Design" score={r.visual_design.score}>
          {r.visual_design.layout_type && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Layout</span>
              <Pill text={r.visual_design.layout_type} color="blue" />
            </div>
          )}

          {r.visual_design.color_analysis && (
            <SubSection title="Color Analysis">
              {r.visual_design.color_analysis.dominant_colors && r.visual_design.color_analysis.dominant_colors.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Dominant Colors:</span>
                  {r.visual_design.color_analysis.dominant_colors.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-zinc-700 border border-zinc-600 rounded text-[11px] text-zinc-300">{c}</span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {r.visual_design.color_analysis.contrast_level && <Pill text={`Contrast: ${r.visual_design.color_analysis.contrast_level}`} color="neutral" />}
                {r.visual_design.color_analysis.color_harmony && <Pill text={r.visual_design.color_analysis.color_harmony} color="purple" />}
              </div>
              {r.visual_design.color_analysis.platform_color_fit && (
                <p className="text-[12px] text-zinc-400">{r.visual_design.color_analysis.platform_color_fit}</p>
              )}
              <FeedbackBox text={r.visual_design.color_analysis.feedback} />
            </SubSection>
          )}

          {r.visual_design.typography && (
            <SubSection title="Typography">
              <div className="flex flex-wrap gap-2">
                {r.visual_design.typography.font_style && <Pill text={r.visual_design.typography.font_style} color="blue" />}
                {r.visual_design.typography.text_hierarchy && <Pill text={`Hierarchy: ${r.visual_design.typography.text_hierarchy}`} color="neutral" />}
                {r.visual_design.typography.platform_text_compliance && (
                  <Pill
                    text={r.visual_design.typography.platform_text_compliance}
                    color={r.visual_design.typography.platform_text_compliance.toLowerCase().includes("compliant") && !r.visual_design.typography.platform_text_compliance.toLowerCase().includes("non") ? "green" : "orange"}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {r.visual_design.typography.readability !== undefined && (
                  <MiniBar score={r.visual_design.typography.readability} label="Readability" />
                )}
              </div>
              {r.visual_design.typography.text_to_image_ratio && (
                <p className="text-[12px] text-zinc-400">Text coverage: {r.visual_design.typography.text_to_image_ratio}</p>
              )}
              <FeedbackBox text={r.visual_design.typography.feedback} />
            </SubSection>
          )}

          {r.visual_design.composition && (
            <SubSection title="Composition">
              <div className="flex flex-wrap gap-2">
                {r.visual_design.composition.balance && <Pill text={r.visual_design.composition.balance} color="neutral" />}
                {r.visual_design.composition.white_space && <Pill text={`Space: ${r.visual_design.composition.white_space}`} color="neutral" />}
              </div>
              {r.visual_design.composition.focal_point && (
                <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Focal point:</span> {r.visual_design.composition.focal_point}</p>
              )}
              {r.visual_design.composition.visual_flow && (
                <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Visual flow:</span> {r.visual_design.composition.visual_flow}</p>
              )}
              <FeedbackBox text={r.visual_design.composition.feedback} />
            </SubSection>
          )}

          {r.visual_design.image_quality && (
            <SubSection title="Image Quality">
              <div className="flex flex-wrap gap-2">
                {r.visual_design.image_quality.resolution && <Pill text={`Resolution: ${r.visual_design.image_quality.resolution}`} color={r.visual_design.image_quality.resolution === "High" ? "green" : r.visual_design.image_quality.resolution === "Medium" ? "yellow" : "red"} />}
                {r.visual_design.image_quality.lighting && <Pill text={r.visual_design.image_quality.lighting} color="neutral" />}
              </div>
              {r.visual_design.image_quality.professionalism !== undefined && (
                <MiniBar score={r.visual_design.image_quality.professionalism} label="Professionalism" />
              )}
              <FeedbackBox text={r.visual_design.image_quality.feedback} />
            </SubSection>
          )}

          {r.visual_design.overall_feedback && <FeedbackBox text={r.visual_design.overall_feedback} />}
        </Section>
      )}

      {/* § 4 — AD COPY */}
      {r.copy_analysis && (
        <Section title="Ad Copy" score={r.copy_analysis.score}>
          <QuoteBox text={r.copy_analysis.detected_body_copy} label="Detected Body Copy" />
          <div className="flex flex-wrap gap-2">
            {r.copy_analysis.tone && <Pill text={r.copy_analysis.tone} color="blue" />}
            {r.copy_analysis.copy_length && <Pill text={r.copy_analysis.copy_length} color={r.copy_analysis.copy_length === "Optimal" ? "green" : "orange"} />}
            {r.copy_analysis.readability_level && <Pill text={r.copy_analysis.readability_level} color="neutral" />}
          </div>

          {(r.copy_analysis.persuasion_techniques && r.copy_analysis.persuasion_techniques.length > 0) && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Persuasion Techniques Used</p>
              <div className="flex flex-wrap gap-1.5">
                {r.copy_analysis.persuasion_techniques.map((t, i) => <Pill key={i} text={t} color="green" />)}
              </div>
            </div>
          )}
          {(r.copy_analysis.persuasion_techniques_missing && r.copy_analysis.persuasion_techniques_missing.length > 0) && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Missing Techniques</p>
              <div className="flex flex-wrap gap-1.5">
                {r.copy_analysis.persuasion_techniques_missing.map((t, i) => <Pill key={i} text={t} color="red" />)}
              </div>
            </div>
          )}

          {r.copy_analysis.value_proposition && (
            <SubSection title="Value Proposition">
              <BoolCheck val={r.copy_analysis.value_proposition.detected} label="Value proposition present" />
              {typeof r.copy_analysis.value_proposition.clarity === "number" && (
                <MiniBar score={r.copy_analysis.value_proposition.clarity} label="Clarity" />
              )}
              {r.copy_analysis.value_proposition.what_it_is && (
                <p className="text-[12px] text-zinc-400 italic">&ldquo;{r.copy_analysis.value_proposition.what_it_is}&rdquo;</p>
              )}
              {r.copy_analysis.value_proposition.feedback && <FeedbackBox text={r.copy_analysis.value_proposition.feedback} />}
            </SubSection>
          )}

          {r.copy_analysis.social_proof && (
            <SubSection title="Social Proof">
              <BoolCheck val={r.copy_analysis.social_proof.present} label="Social proof present" />
              <div className="flex flex-wrap gap-2">
                {r.copy_analysis.social_proof.type && <Pill text={`Type: ${r.copy_analysis.social_proof.type}`} color="neutral" />}
                {r.copy_analysis.social_proof.strength && (
                  <Pill
                    text={r.copy_analysis.social_proof.strength}
                    color={r.copy_analysis.social_proof.strength === "Strong" ? "green" : r.copy_analysis.social_proof.strength === "Moderate" ? "yellow" : "red"}
                  />
                )}
              </div>
              {r.copy_analysis.social_proof.feedback && <FeedbackBox text={r.copy_analysis.social_proof.feedback} />}
            </SubSection>
          )}

          {r.copy_analysis.urgency_scarcity && (
            <SubSection title="Urgency & Scarcity">
              <BoolCheck val={r.copy_analysis.urgency_scarcity.present} label="Urgency / scarcity present" />
              {r.copy_analysis.urgency_scarcity.type && <Pill text={r.copy_analysis.urgency_scarcity.type} color="orange" />}
              {r.copy_analysis.urgency_scarcity.effectiveness !== undefined && (
                <MiniBar score={r.copy_analysis.urgency_scarcity.effectiveness} label="Effectiveness" />
              )}
              {r.copy_analysis.urgency_scarcity.feedback && <FeedbackBox text={r.copy_analysis.urgency_scarcity.feedback} />}
            </SubSection>
          )}

          {r.copy_analysis.overall_feedback && <FeedbackBox text={r.copy_analysis.overall_feedback} />}
        </Section>
      )}

      {/* § 5 — CTA ANALYSIS */}
      {r.cta_analysis && (
        <Section title="Call to Action" score={r.cta_analysis.score}>
          {r.cta_analysis.detected_cta && (
            <div className="p-4 bg-zinc-800/60 border border-cyan-500/25 rounded-xl">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Detected CTA</p>
              <p className="text-[16px] font-bold text-white">{r.cta_analysis.detected_cta}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {r.cta_analysis.cta_type && <Pill text={r.cta_analysis.cta_type} color="blue" />}
            {r.cta_analysis.value_in_cta !== undefined && (
              <Pill
                text={String(r.cta_analysis.value_in_cta) === "true" ? "Value in CTA ✓" : "No value in CTA"}
                color={String(r.cta_analysis.value_in_cta) === "true" ? "green" : "red"}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <MiniBar score={r.cta_analysis.visibility} label="Visibility" />
            <MiniBar score={r.cta_analysis.action_clarity} label="Action Clarity" />
            <MiniBar score={r.cta_analysis.urgency_level} label="Urgency" />
          </div>
          {r.cta_analysis.cta_color_contrast && (
            <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Color contrast:</span> {r.cta_analysis.cta_color_contrast}</p>
          )}
          {r.cta_analysis.platform_cta_fit && (
            <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Platform fit:</span> {r.cta_analysis.platform_cta_fit}</p>
          )}
          {r.cta_analysis.better_cta_options && r.cta_analysis.better_cta_options.length > 0 && (
            <SubSection title="Better CTA Options">
              <div className="space-y-2">
                {r.cta_analysis.better_cta_options.map((cta, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-zinc-700/40 border border-zinc-600/40 rounded-lg">
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">Try this</span>
                    <span className="text-[13px] text-zinc-200 font-medium">{cta}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          )}
          <FeedbackBox text={r.cta_analysis.feedback} />
        </Section>
      )}

      {/* § 6 — PLATFORM OPTIMIZATION */}
      {r.platform_optimization && (
        <Section title="Platform Optimization" score={r.platform_optimization.score}>
          <div className="flex flex-wrap gap-2">
            {r.platform_optimization.platform && <Pill text={r.platform_optimization.platform} color="blue" />}
            {r.platform_optimization.dimension_compliance && (
              <Pill
                text={r.platform_optimization.dimension_compliance.toLowerCase().includes("correct") || r.platform_optimization.dimension_compliance.toLowerCase().includes("compliant") ? "Dimensions ✓" : r.platform_optimization.dimension_compliance}
                color="neutral"
              />
            )}
            {r.platform_optimization.safe_zones && <Pill text={`Safe zones: ${r.platform_optimization.safe_zones.substring(0, 30)}`} color="neutral" />}
          </div>
          <div className="flex flex-wrap gap-4">
            {r.platform_optimization.native_feel !== undefined && (
              <MiniBar score={r.platform_optimization.native_feel} label="Native Feel" />
            )}
          </div>
          {r.platform_optimization.format_recommendation && (
            <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Format Recommendation</p>
              <p className="text-[13px] text-zinc-300">{r.platform_optimization.format_recommendation}</p>
            </div>
          )}
          {r.platform_optimization.placement_fit && (
            <SubSection title="Placement Suitability">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["feed", "stories", "reels", "explore"] as const).map((pl) => {
                  const val = r.platform_optimization?.placement_fit?.[pl];
                  if (val === undefined) return null;
                  return (
                    <div key={pl} className="text-center">
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">{pl}</p>
                      <span className={`text-[20px] font-black ${sc(val)}`}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </SubSection>
          )}
          {r.platform_optimization.platform_specific_tips && r.platform_optimization.platform_specific_tips.length > 0 && (
            <SubSection title="Platform Tips">
              <ul className="space-y-2">
                {r.platform_optimization.platform_specific_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold text-[11px] shrink-0">•</span>
                    <span className="text-[13px] text-zinc-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </SubSection>
          )}
          <FeedbackBox text={r.platform_optimization.feedback} />
        </Section>
      )}

      {/* § 7 — AUDIENCE & BRAND */}
      {(r.audience_alignment || r.brand_analysis) && (
        <Section title="Audience & Brand" score={r.audience_alignment?.score ?? r.brand_analysis?.score}>
          {r.audience_alignment && (
            <SubSection title="Audience Alignment">
              {r.audience_alignment.apparent_target && (
                <p className="text-[13px] text-zinc-300"><span className="text-zinc-500 text-[11px] uppercase tracking-widest">Target: </span>{r.audience_alignment.apparent_target}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {r.audience_alignment.age_group_fit && <Pill text={`Age: ${r.audience_alignment.age_group_fit}`} color="neutral" />}
                {r.audience_alignment.gender_skew && <Pill text={r.audience_alignment.gender_skew} color="neutral" />}
                {r.audience_alignment.income_level_signal && <Pill text={r.audience_alignment.income_level_signal} color="neutral" />}
              </div>
              {r.audience_alignment.pain_point_addressed && (
                <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Pain point:</span> {r.audience_alignment.pain_point_addressed}</p>
              )}
              {r.audience_alignment.desire_triggered && (
                <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Desire:</span> {r.audience_alignment.desire_triggered}</p>
              )}
              <FeedbackBox text={r.audience_alignment.feedback} />
            </SubSection>
          )}

          {r.brand_analysis && (
            <SubSection title="Brand Analysis">
              <div className="space-y-1.5">
                <BoolCheck val={r.brand_analysis.brand_name_visible} label="Brand name visible" />
                <BoolCheck val={r.brand_analysis.logo_visible} label="Logo visible" />
              </div>
              {r.brand_analysis.brand_recognition && (
                <p className="text-[12px] text-zinc-400"><span className="text-zinc-500">Recognition:</span> {r.brand_analysis.brand_recognition}</p>
              )}
              {r.brand_analysis.brand_trust_signals && r.brand_analysis.brand_trust_signals.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Trust Signals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.brand_analysis.brand_trust_signals.map((s, i) => <Pill key={i} text={s} color="green" />)}
                  </div>
                </div>
              )}
              <FeedbackBox text={r.brand_analysis.feedback} />
            </SubSection>
          )}
        </Section>
      )}

      {/* § 8 — PERFORMANCE PREDICTIONS */}
      {r.performance_predictions && (
        <Section title="Performance Predictions">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {r.performance_predictions.estimated_ctr_range && (
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Est. CTR</p>
                <p className="text-[17px] font-bold text-green-400">{r.performance_predictions.estimated_ctr_range}</p>
                {r.performance_predictions.estimated_ctr_rating && (
                  <p className={`text-[10px] mt-0.5 ${ratingColor(r.performance_predictions.estimated_ctr_rating)}`}>{r.performance_predictions.estimated_ctr_rating}</p>
                )}
              </div>
            )}
            {r.performance_predictions.estimated_engagement_rate && (
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Engagement</p>
                <p className={`text-[17px] font-bold ${ratingColor(r.performance_predictions.estimated_engagement_rate)}`}>{r.performance_predictions.estimated_engagement_rate}</p>
              </div>
            )}
            {r.performance_predictions.estimated_conversion_potential && (
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Conversion</p>
                <p className={`text-[17px] font-bold ${ratingColor(r.performance_predictions.estimated_conversion_potential)}`}>{r.performance_predictions.estimated_conversion_potential}</p>
              </div>
            )}
            {r.performance_predictions.estimated_cpm_efficiency && (
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">CPM Efficiency</p>
                <p className={`text-[13px] font-bold ${ratingColor(r.performance_predictions.estimated_cpm_efficiency)}`}>{r.performance_predictions.estimated_cpm_efficiency}</p>
              </div>
            )}
            {r.performance_predictions.fatigue_risk && (
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Fatigue Risk</p>
                <p className={`text-[17px] font-bold ${r.performance_predictions.fatigue_risk === "Low" ? "text-green-400" : r.performance_predictions.fatigue_risk === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{r.performance_predictions.fatigue_risk}</p>
              </div>
            )}
            {r.performance_predictions.scaling_potential && (
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-center">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Scaling Potential</p>
                <p className={`text-[17px] font-bold ${ratingColor(r.performance_predictions.scaling_potential)}`}>{r.performance_predictions.scaling_potential}</p>
              </div>
            )}
          </div>
          {r.performance_predictions.estimated_effective_lifespan && (
            <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Estimated Lifespan</p>
              <p className="text-[13px] font-bold text-zinc-200">{r.performance_predictions.estimated_effective_lifespan}</p>
            </div>
          )}
        </Section>
      )}

      {/* § 9 — COMPETITIVE POSITION */}
      {r.competitive_position && (
        <Section title="Competitive Position">
          {r.competitive_position.differentiation !== undefined && (
            <MiniBar score={r.competitive_position.differentiation} label="Differentiation Score" />
          )}
          {r.competitive_position.market_saturation_risk && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Market Saturation Risk</span>
              <Pill
                text={r.competitive_position.market_saturation_risk}
                color={r.competitive_position.market_saturation_risk === "Low" ? "green" : r.competitive_position.market_saturation_risk === "Medium" ? "yellow" : "red"}
              />
            </div>
          )}
          {r.competitive_position.what_competitors_do_better && (
            <SubSection title="What Competitors Do Better">
              <p className="text-[13px] text-zinc-300 leading-relaxed">{r.competitive_position.what_competitors_do_better}</p>
            </SubSection>
          )}
          {r.competitive_position.unique_advantage && (
            <SubSection title="Your Unique Advantage">
              <p className="text-[13px] text-zinc-300 leading-relaxed">{r.competitive_position.unique_advantage}</p>
            </SubSection>
          )}
          {/* Legacy competitor insight */}
          {!r.competitive_position.what_competitors_do_better && r.competitor_insight && (
            <FeedbackBox text={r.competitor_insight} />
          )}
        </Section>
      )}
      {/* Legacy competitor insight standalone */}
      {!r.competitive_position && r.competitor_insight && (
        <Section title="Competitor Insight">
          <FeedbackBox text={r.competitor_insight} />
        </Section>
      )}

      {/* § 10 — A/B TESTING IDEAS */}
      {r.testing_suggestions && r.testing_suggestions.length > 0 && (
        <Section title="A/B Testing Ideas">
          <div className="space-y-3">
            {r.testing_suggestions.map((t, i) => (
              <div key={i} className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-[14px] font-semibold text-white">{t.test_name ?? `Test ${i + 1}`}</p>
                  <Pill text="Try This Test" color="cyan" />
                </div>
                {t.hypothesis && (
                  <p className="text-[12px] text-zinc-400 italic">{t.hypothesis}</p>
                )}
                {(t.variant_a || t.variant_b) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Variant A (Current)</p>
                      <p className="text-[12px] text-zinc-300">{t.variant_a}</p>
                    </div>
                    <div className="p-3 bg-cyan-400/5 border border-cyan-400/20 rounded-lg">
                      <p className="text-[9px] text-cyan-500 uppercase tracking-widest mb-1">Variant B (Test)</p>
                      <p className="text-[12px] text-zinc-300">{t.variant_b}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LEGACY SCORE BARS (backward compat for old analyses)
      ══════════════════════════════════════════════════════════════════════ */}
      {!isNewFormat && legacyScores && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-[15px] font-semibold text-white mb-5">Score Breakdown</h2>
          <div className="space-y-5">
            {Object.entries(SCORE_LABELS).map(([key, label]) => {
              const data = legacyScores[key];
              if (!data) return null;
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] text-zinc-300">{label}</span>
                    <span className={`text-[13px] font-bold ${sc(data.score)}`}>{data.score}</span>
                  </div>
                  <div className="h-[6px] bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${data.score}%`, background: bc(data.score) }} />
                  </div>
                  {data.feedback && <p className="text-[12px] text-zinc-500">{data.feedback}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ACTION BUTTONS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href={`/compare?from=${analysis.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-200 font-medium rounded-xl transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Compare with Another Ad
        </Link>
        <Link
          href="/spy"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-200 font-medium rounded-xl transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Spy on Competitor
        </Link>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-200 font-medium rounded-xl transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Analyze Another Ad
        </Link>
        <DownloadPDF
          data={{
            platform: analysis.platform,
            niche: analysis.niche,
            overall_score: analysis.overall_score,
            created_at: analysis.created_at,
            result: r,
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          AI IMPROVER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-zinc-800 pt-8">
        <AdImprover
          analysisId={analysis.id}
          existingResult={analysis.improvement_result ?? null}
          existingImprovedImageUrls={improvedImageUrls}
          improvementsRemaining={improvementsRemaining}
          isPro={isPro}
          originalImageUrl={imageUrl}
          originalScore={overallScore}
        />
      </div>
    </div>
  );
}
