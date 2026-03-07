import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function ImprovePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, overall_score, platform, niche, created_at, image_url, improved_image_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Signed URLs for thumbnails
  const signedUrls: Record<string, string> = {};
  for (const a of (analyses ?? []).filter((a) => a.image_url)) {
    const path = a.image_url.split("/ad-images/").pop();
    if (!path) continue;
    const { data } = await supabase.storage
      .from("ad-images")
      .createSignedUrl(decodeURIComponent(path), 3600);
    if (data?.signedUrl) signedUrls[a.id] = data.signedUrl;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          AI Improver
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Select an ad to generate improved copy and a new AI-created visual.
        </p>
      </div>

      {/* How it works banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          The AI Improver rewrites your headlines, body copy, and CTA — then generates a new ad image using DALL-E. Click <strong>Improve</strong> on any analysis below to get started.
        </p>
      </div>

      {/* Analyses list */}
      {!analyses || analyses.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">No analyses yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Analyze an ad first, then come back to improve it.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition"
          >
            Analyze your first ad
          </Link>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[56px_1fr_90px_130px_140px] gap-4 px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/40">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Ad</span>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Platform · Niche</span>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Score</span>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Date</span>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Action</span>
          </div>

          {analyses.map((analysis, idx) => (
            <div
              key={analysis.id}
              className={`grid grid-cols-1 sm:grid-cols-[56px_1fr_90px_130px_140px] gap-4 px-5 py-4 items-center hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition ${
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

              {/* Action */}
              <div className="flex items-center gap-2">
                {analysis.improved_image_url && (
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 px-1.5 py-0.5 rounded">
                    Improved
                  </span>
                )}
                <Link
                  href={`/analysis/${analysis.id}#ai-improver`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition"
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
  );
}
