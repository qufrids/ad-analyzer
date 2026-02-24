import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import ScoreChart, { ChartPoint } from "@/components/dashboard/ScoreChart";
import HistoryFilters from "@/components/dashboard/HistoryFilters";

const PAGE_SIZE = 10;

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 border-green-200 dark:border-green-400/20"
      : score >= 40
      ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20"
      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border-red-200 dark:border-red-400/20";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}
    </span>
  );
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    platform?: string;
    niche?: string;
    sort?: string;
    minScore?: string;
    maxScore?: string;
  };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const sort = searchParams.sort ?? "newest";
  const platform = searchParams.platform ?? "";
  const niche = searchParams.niche ?? "";
  const minScore = searchParams.minScore ? parseInt(searchParams.minScore, 10) : null;
  const maxScore = searchParams.maxScore ? parseInt(searchParams.maxScore, 10) : null;

  // Determine sort order
  const ascending = sort === "oldest" || sort === "lowest";
  const orderCol = sort === "highest" || sort === "lowest" ? "overall_score" : "created_at";

  // Filtered + paginated query
  let query = supabase
    .from("analyses")
    .select("id, overall_score, platform, niche, created_at, image_url", { count: "exact" })
    .eq("user_id", user.id)
    .order(orderCol, { ascending })
    .range(from, to);

  if (platform) query = query.eq("platform", platform);
  if (niche) query = query.eq("niche", niche);
  if (minScore !== null) query = query.gte("overall_score", minScore);
  if (maxScore !== null) query = query.lte("overall_score", maxScore);

  // All analyses for chart (unfiltered, oldest-first)
  const [{ data: analyses, count }, { data: allForChart }] = await Promise.all([
    query,
    supabase
      .from("analyses")
      .select("id, overall_score, platform, niche, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Signed URLs
  const signedUrls: Record<string, string> = {};
  for (const a of (analyses ?? []).filter((a) => a.image_url)) {
    const path = a.image_url.split("/ad-images/").pop();
    if (!path) continue;
    const { data } = await supabase.storage
      .from("ad-images")
      .createSignedUrl(decodeURIComponent(path), 3600);
    if (data?.signedUrl) signedUrls[a.id] = data.signedUrl;
  }

  // Chart data from all analyses
  const chartData: ChartPoint[] = (allForChart ?? []).map((a) => ({
    id: a.id,
    score: a.overall_score,
    platform: a.platform,
    niche: a.niche,
    date: new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullDate: new Date(a.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {totalCount} {totalCount === 1 ? "analysis" : "analyses"} total
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

      {/* Score Chart */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Score Trend</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All analyses over time</p>
          </div>
          {chartData.length >= 2 && (
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />≥70</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />40–70</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />&lt;40</span>
            </div>
          )}
        </div>
        <ScoreChart data={chartData} height={200} />
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <HistoryFilters />
      </Suspense>

      {/* Results */}
      {!analyses || analyses.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">
            {platform || niche || minScore !== null || maxScore !== null
              ? "No analyses match your filters"
              : "No analyses yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {platform || niche || minScore !== null || maxScore !== null
              ? "Try adjusting or clearing your filters."
              : "Your analysis history will appear here once you create your first one."}
          </p>
          {!(platform || niche || minScore !== null || maxScore !== null) && (
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition"
            >
              Create your first analysis
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[56px_1fr_90px_130px_120px] gap-4 px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/40">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Ad</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Platform · Niche</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Score</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Date</span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Actions</span>
            </div>

            {analyses.map((analysis, idx) => (
              <div
                key={analysis.id}
                className={`grid grid-cols-1 sm:grid-cols-[56px_1fr_90px_130px_120px] gap-4 px-5 py-4 items-center hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition ${
                  idx < analyses.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="hidden sm:block">
                  <div className="w-12 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden">
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

                {/* Score */}
                <div>
                  <ScoreBadge score={analysis.overall_score} />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {currentPage > 1 && (
                <Link
                  href={`/history?page=${currentPage - 1}${platform ? `&platform=${platform}` : ""}${niche ? `&niche=${niche}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}${minScore !== null ? `&minScore=${minScore}` : ""}${maxScore !== null ? `&maxScore=${maxScore}` : ""}`}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/history?page=${page}${platform ? `&platform=${platform}` : ""}${niche ? `&niche=${niche}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}${minScore !== null ? `&minScore=${minScore}` : ""}${maxScore !== null ? `&maxScore=${maxScore}` : ""}`}
                  className={`px-3 py-2 text-sm rounded-lg transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={`/history?page=${currentPage + 1}${platform ? `&platform=${platform}` : ""}${niche ? `&niche=${niche}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}${minScore !== null ? `&minScore=${minScore}` : ""}${maxScore !== null ? `&maxScore=${maxScore}` : ""}`}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
