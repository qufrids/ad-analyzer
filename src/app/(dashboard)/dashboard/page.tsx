import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ScoreChart, { ChartPoint } from "@/components/dashboard/ScoreChart";

/* ── Helpers ── */
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 border-green-200 dark:border-green-400/20"
      : score >= 40
      ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20"
      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border-red-200 dark:border-red-400/20";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-6 text-right">{score}</span>
    </div>
  );
}

function TrendArrow({ value }: { value: number }) {
  if (value === 0) return <span className="text-gray-400 text-xs">—</span>;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d={up ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
      </svg>
      {Math.abs(value)}%
    </span>
  );
}

/* ── Page ── */
export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: allAnalyses, count: totalCount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("analyses")
      .select("id, overall_score, platform, niche, created_at, image_url", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  const analyses = allAnalyses ?? [];
  const totalAnalyses = totalCount ?? 0;

  // Generate signed URLs for the 10 most recent analyses
  const recent = [...analyses].reverse().slice(0, 10);
  const signedUrls: Record<string, string> = {};
  for (const a of recent.filter((a) => a.image_url)) {
    const path = a.image_url.split("/ad-images/").pop();
    if (!path) continue;
    const { data } = await supabase.storage
      .from("ad-images")
      .createSignedUrl(decodeURIComponent(path), 3600);
    if (data?.signedUrl) signedUrls[a.id] = data.signedUrl;
  }

  /* ── Chart data ── */
  const chartData: ChartPoint[] = analyses.map((a) => ({
    id: a.id,
    score: a.overall_score,
    platform: a.platform,
    niche: a.niche,
    date: new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullDate: new Date(a.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  }));

  /* ── Stats ── */
  const avgScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((s, a) => s + a.overall_score, 0) / analyses.length)
      : 0;

  const bestAnalysis = analyses.length > 0
    ? analyses.reduce((best, a) => (a.overall_score > best.overall_score ? a : best), analyses[0])
    : null;

  const firstScore = analyses.length > 0 ? analyses[0].overall_score : null;
  const latestScore = analyses.length > 0 ? analyses[analyses.length - 1].overall_score : null;
  const improvement =
    firstScore !== null && latestScore !== null && firstScore > 0
      ? Math.round(((latestScore - firstScore) / firstScore) * 100)
      : null;

  // Last-month comparison for avg score
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const lastMonthAnalyses = analyses.filter((a) => new Date(a.created_at) < oneMonthAgo);
  const lastMonthAvg =
    lastMonthAnalyses.length > 0
      ? Math.round(lastMonthAnalyses.reduce((s, a) => s + a.overall_score, 0) / lastMonthAnalyses.length)
      : null;
  const avgTrend = lastMonthAvg !== null && avgScore > 0 ? avgScore - lastMonthAvg : 0;

  const creditsDisplay =
    profile?.subscription_status === "active"
      ? "Unlimited"
      : `${profile?.credits_remaining ?? 0} / 3`;
  const userName = profile?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

      {/* ── Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s how your ad performance is tracking over time.
          </p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition text-sm shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Analysis
        </Link>
      </div>

      {/* ── Your Progress ── */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Your Progress</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ad score trend over time</p>
          </div>
          {analyses.length >= 2 && (
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                ≥70 Strong
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                40–70
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                &lt;40 Weak
              </span>
            </div>
          )}
        </div>
        <ScoreChart data={chartData} height={220} />
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Average Score */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Avg Score</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2">
            {totalAnalyses > 0 ? avgScore : "—"}
          </p>
          {lastMonthAvg !== null && totalAnalyses > 0 ? (
            <TrendArrow value={avgTrend} />
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-600">vs last month</p>
          )}
        </div>

        {/* Total Analyses */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Total Analyses</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2">{totalAnalyses}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {creditsDisplay === "Unlimited" ? "Pro plan" : `${creditsDisplay} credits`}
          </p>
        </div>

        {/* Best Score */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Best Score</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2">
            {bestAnalysis ? bestAnalysis.overall_score : "—"}
          </p>
          {bestAnalysis ? (
            <Link
              href={`/analysis/${bestAnalysis.id}`}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View ad
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-600">No data yet</p>
          )}
        </div>

        {/* Improvement */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Improvement</p>
          {improvement !== null ? (
            <>
              <p className={`text-3xl font-black leading-none mb-2 ${improvement >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                {improvement >= 0 ? "+" : ""}{improvement}%
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600">First → latest ad</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2">—</p>
              <p className="text-xs text-gray-400 dark:text-gray-600">Need 2+ analyses</p>
            </>
          )}
        </div>

      </div>

      {/* ── Recent Analyses ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Analyses</h2>
          {totalAnalyses > 0 && (
            <Link href="/history" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-1">No analyses yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Upload your first ad creative and get AI-powered insights.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition"
            >
              Create your first analysis
            </Link>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[56px_1fr_100px_100px_110px_120px] gap-4 px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/40">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Ad</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Platform · Niche</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Score</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider hidden lg:block">Trend</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Date</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Actions</span>
            </div>

            {/* Rows */}
            {recent.map((analysis, idx) => (
              <div
                key={analysis.id}
                className={`grid grid-cols-1 sm:grid-cols-[56px_1fr_100px_100px_110px_120px] gap-4 px-5 py-4 items-center hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition ${
                  idx < recent.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="hidden sm:block">
                  <div className="w-12 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0">
                    {signedUrls[analysis.id] ? (
                      <img src={signedUrls[analysis.id]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform · Niche */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{analysis.platform}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{analysis.niche}</p>
                </div>

                {/* Score badge */}
                <div>
                  <ScoreBadge score={analysis.overall_score} />
                </div>

                {/* Score bar */}
                <div className="hidden lg:block">
                  <ScoreBar score={analysis.overall_score} />
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(analysis.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/analysis/${analysis.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 rounded-md transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/analysis/${analysis.id}#ai-improver`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 rounded-md transition"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Improve
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
