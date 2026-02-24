import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ComparisonDimension {
  dimension: string;
  ad_a_score: number;
  ad_b_score: number;
  verdict: string;
}

interface ComparisonResult {
  winner: "A" | "B";
  confidence: number;
  summary: string;
  ad_a_score: number;
  ad_b_score: number;
  comparison: ComparisonDimension[];
  recommendation: string;
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-zinc-700" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
      />
      <text
        x="50%" y="52%"
        textAnchor="middle" dominantBaseline="middle"
        className="rotate-90"
        fill="white" fontSize={size / 4} fontWeight="900"
        style={{ transform: `rotate(90deg)`, transformOrigin: "50% 50%" }}
      >
        {score}
      </text>
    </svg>
  );
}

function ConfettiDots() {
  const dots = [
    { color: "#22c55e", x: -28, y: -32, delay: 0, rot: 45 },
    { color: "#3b82f6", x: 28, y: -38, delay: 0.1, rot: -30 },
    { color: "#f59e0b", x: -40, y: -12, delay: 0.05, rot: 60 },
    { color: "#a855f7", x: 42, y: -8, delay: 0.15, rot: -60 },
    { color: "#ec4899", x: -18, y: -44, delay: 0.08, rot: 90 },
    { color: "#06b6d4", x: 20, y: -42, delay: 0.12, rot: -45 },
    { color: "#f97316", x: -44, y: 8, delay: 0.06, rot: 120 },
    { color: "#22c55e", x: 46, y: 12, delay: 0.18, rot: -90 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden>
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-confetti-burst"
          style={{
            backgroundColor: d.color,
            top: "50%",
            left: "50%",
            "--tx": `${d.x}px`,
            "--ty": `${d.y}px`,
            "--rot": `${d.rot}deg`,
            animationDelay: `${d.delay}s`,
            animationFillMode: "both",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default async function CompareResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: comparison, error } = await supabase
    .from("comparisons")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !comparison) notFound();

  const result = comparison.result as ComparisonResult;
  const {
    winner,
    confidence,
    summary,
    ad_a_score,
    ad_b_score,
    comparison: dims,
    recommendation,
  } = result;

  // Generate a signed URL for images
  const getSignedUrl = async (url: string) => {
    const path = url.split("/ad-images/").pop();
    if (!path) return url;
    const { data } = await supabase.storage
      .from("ad-images")
      .createSignedUrl(decodeURIComponent(path), 3600);
    return data?.signedUrl ?? url;
  };

  const [signedUrlA, signedUrlB] = await Promise.all([
    getSignedUrl(comparison.image_a_url),
    getSignedUrl(comparison.image_b_url),
  ]);

  const confidenceColor =
    confidence >= 80 ? "text-green-400" : confidence >= 60 ? "text-amber-400" : "text-zinc-400";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/compare"
              className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New comparison
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">A/B Comparison Results</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {comparison.platform.replace("_", " ")} · {comparison.niche.replace("_", " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Confidence</p>
          <p className={`text-2xl font-black ${confidenceColor}`}>{confidence}%</p>
        </div>
      </div>

      {/* ── Side-by-side ads ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_40px_1fr] gap-4 items-stretch">

        {/* Ad A */}
        <div className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
          winner === "A"
            ? "border-green-500/50 shadow-xl shadow-green-500/10"
            : "border-gray-200 dark:border-zinc-700/50"
        }`}>
          {winner === "A" && (
            <>
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-green-500/40 via-green-400 to-green-500/40 z-10" />
              <ConfettiDots />
            </>
          )}

          {/* Winner / Loser badge */}
          <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
            winner === "A"
              ? "bg-green-500 text-white shadow-lg shadow-green-500/40"
              : "bg-zinc-800/80 text-zinc-400 backdrop-blur-sm"
          }`}>
            {winner === "A" && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2l2.582 5.236 5.778.84-4.18 4.07.987 5.754L10 15.27l-5.167 2.63.987-5.754-4.18-4.07 5.778-.84L10 2z" />
              </svg>
            )}
            {winner === "A" ? "Winner" : "Loser"}
          </div>

          {/* Score ring top-right */}
          <div className="absolute top-3 right-3 z-10">
            <ScoreRing score={ad_a_score} size={56} />
          </div>

          <img
            src={signedUrlA}
            alt="Ad A"
            className="w-full h-56 sm:h-64 object-cover"
          />

          <div className={`p-4 ${winner === "A" ? "bg-green-500/[0.04] dark:bg-green-500/[0.06]" : "bg-gray-50 dark:bg-zinc-900"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-widest ${winner === "A" ? "text-green-600 dark:text-green-400" : "text-zinc-500"}`}>
                Ad A
              </span>
              <span className={`text-lg font-black ${winner === "A" ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                {ad_a_score}<span className="text-xs font-normal opacity-50">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-2">
          <div className="flex-1 w-px bg-gray-200 dark:bg-zinc-700" />
          <span className="text-[11px] font-black text-gray-300 dark:text-zinc-600 tracking-widest">VS</span>
          <div className="flex-1 w-px bg-gray-200 dark:bg-zinc-700" />
        </div>
        <div className="sm:hidden flex items-center justify-center py-1">
          <span className="text-xs font-black text-gray-300 dark:text-zinc-600 tracking-widest px-4">VS</span>
        </div>

        {/* Ad B */}
        <div className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
          winner === "B"
            ? "border-green-500/50 shadow-xl shadow-green-500/10"
            : "border-gray-200 dark:border-zinc-700/50"
        }`}>
          {winner === "B" && (
            <>
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-green-500/40 via-green-400 to-green-500/40 z-10" />
              <ConfettiDots />
            </>
          )}

          <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
            winner === "B"
              ? "bg-green-500 text-white shadow-lg shadow-green-500/40"
              : "bg-zinc-800/80 text-zinc-400 backdrop-blur-sm"
          }`}>
            {winner === "B" && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2l2.582 5.236 5.778.84-4.18 4.07.987 5.754L10 15.27l-5.167 2.63.987-5.754-4.18-4.07 5.778-.84L10 2z" />
              </svg>
            )}
            {winner === "B" ? "Winner" : "Loser"}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <ScoreRing score={ad_b_score} size={56} />
          </div>

          <img
            src={signedUrlB}
            alt="Ad B"
            className="w-full h-56 sm:h-64 object-cover"
          />

          <div className={`p-4 ${winner === "B" ? "bg-green-500/[0.04] dark:bg-green-500/[0.06]" : "bg-gray-50 dark:bg-zinc-900"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-widest ${winner === "B" ? "text-green-600 dark:text-green-400" : "text-zinc-500"}`}>
                Ad B
              </span>
              <span className={`text-lg font-black ${winner === "B" ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                {ad_b_score}<span className="text-xs font-normal opacity-50">/100</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary card ── */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm dark:shadow-none">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2l2.582 5.236 5.778.84-4.18 4.07.987 5.754L10 15.27l-5.167 2.63.987-5.754-4.18-4.07 5.778-.84L10 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1.5">
              Why Ad {winner} Wins
            </p>
            <p className="text-[14px] text-gray-700 dark:text-zinc-300 leading-[1.7]">{summary}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">Winner</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">Ad {winner}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">Score Gap</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">+{Math.abs(ad_a_score - ad_b_score)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">Confidence</p>
            <p className={`text-xl font-black ${confidenceColor}`}>{confidence}%</p>
          </div>
        </div>
      </div>

      {/* ── Tug-of-war comparison table ── */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-gray-900 dark:text-white">Dimension Breakdown</h2>
          <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider">
            <span className="text-blue-500 dark:text-blue-400">Ad A</span>
            <span className="text-violet-500 dark:text-violet-400">Ad B</span>
          </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
          {dims.map((dim) => {
            const aWins = dim.ad_a_score >= dim.ad_b_score;
            const total = dim.ad_a_score + dim.ad_b_score || 1;
            const aPct = Math.round((dim.ad_a_score / total) * 100);
            const bPct = 100 - aPct;

            return (
              <div key={dim.dimension} className="px-5 py-4">
                {/* Dimension header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-semibold text-gray-700 dark:text-zinc-300">
                    {dim.dimension}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[13px] font-black ${aWins ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-zinc-600"}`}>
                      {dim.ad_a_score}
                    </span>
                    <span className="text-[9px] text-gray-300 dark:text-zinc-700">vs</span>
                    <span className={`text-[13px] font-black ${!aWins ? "text-violet-600 dark:text-violet-400" : "text-gray-300 dark:text-zinc-600"}`}>
                      {dim.ad_b_score}
                    </span>
                  </div>
                </div>

                {/* Tug-of-war bar */}
                <div className="flex items-center h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 gap-[2px] mb-2.5">
                  <div
                    className={`h-full rounded-l-full transition-all ${aWins ? "bg-blue-500" : "bg-blue-200 dark:bg-blue-900/40"}`}
                    style={{ width: `${aPct}%` }}
                  />
                  <div
                    className={`h-full rounded-r-full transition-all ${!aWins ? "bg-violet-500" : "bg-violet-200 dark:bg-violet-900/40"}`}
                    style={{ width: `${bPct}%` }}
                  />
                </div>

                {/* Verdict */}
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-relaxed">
                  {dim.verdict}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Best of Both recommendation ── */}
      <div className="bg-cyan-50/60 dark:bg-cyan-500/[0.05] border border-cyan-200 dark:border-cyan-500/25 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400/30 via-cyan-400/70 to-cyan-400/30" />
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-500 mb-1.5">
              Best of Both — How to Build the Perfect Ad
            </p>
            <p className="text-[14px] text-gray-700 dark:text-zinc-300 leading-[1.75]">{recommendation}</p>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/compare"
          className="flex-1 text-center py-3 px-5 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 text-sm font-semibold rounded-xl transition"
        >
          Compare Another Pair
        </Link>
        <Link
          href="/analyze"
          className="flex-1 text-center py-3 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Analyze & Improve Ad {winner}
        </Link>
      </div>
    </div>
  );
}
