import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-400 bg-green-400/10 border-green-400/20"
      : score >= 60
      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      : "text-red-400 bg-red-400/10 border-red-400/20";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold border ${color}`}>
      {score}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: analyses, count: totalCount } = await supabase
    .from("analyses")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Generate signed URLs for images (bucket is private)
  const signedUrls: Record<string, string> = {};
  if (analyses && analyses.length > 0) {
    const paths = analyses
      .filter((a) => a.image_url)
      .map((a) => {
        const path = a.image_url.split("/ad-images/").pop();
        return path ? { id: a.id, path: decodeURIComponent(path) } : null;
      })
      .filter(Boolean) as { id: string; path: string }[];

    for (const { id, path } of paths) {
      const { data } = await supabase.storage
        .from("ad-images")
        .createSignedUrl(path, 3600);
      if (data?.signedUrl) signedUrls[id] = data.signedUrl;
    }
  }

  const totalAnalyses = totalCount ?? 0;
  const avgScore =
    analyses && analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.overall_score, 0) / analyses.length)
      : 0;

  const creditsDisplay =
    profile?.subscription_status === "active"
      ? "Unlimited"
      : `${profile?.credits_remaining ?? 0} / 3`;

  const userName = profile?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s an overview of your ad analysis activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Credits Remaining</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{creditsDisplay}</p>
          {profile?.subscription_status !== "active" && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Free plan</p>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Analyses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalAnalyses}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {totalAnalyses > 0 ? avgScore : "—"}
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/analyze"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Analysis
      </Link>

      {/* Recent Analyses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Analyses</h2>
          {totalAnalyses > 0 && (
            <Link href="/history" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition">
              View all
            </Link>
          )}
        </div>

        {!analyses || analyses.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-1">No analyses yet</h3>
            <p className="text-gray-500 text-sm mb-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analysis/${analysis.id}`}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition group"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                  {signedUrls[analysis.id] ? (
                    <img
                      src={signedUrls[analysis.id]}
                      alt="Ad creative"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <ScoreBadge score={analysis.overall_score} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                      {analysis.platform}
                    </span>
                    <span className="text-gray-400 dark:text-gray-700">·</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {analysis.niche}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(analysis.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
