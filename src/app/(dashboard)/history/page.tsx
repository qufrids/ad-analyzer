import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const PAGE_SIZE = 10;

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-400 bg-green-400/10 border-green-400/20"
      : score >= 60
      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      : "text-red-400 bg-red-400/10 border-red-400/20";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {score}
    </span>
  );
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: analyses, count } = await supabase
    .from("analyses")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analysis History</h1>
        <p className="text-gray-400 mt-1">
          {totalCount} {totalCount === 1 ? "analysis" : "analyses"} total
        </p>
      </div>

      {!analyses || analyses.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-1">No analyses yet</h3>
          <p className="text-gray-500 text-sm mb-4">
            Your analysis history will appear here once you create your first one.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition"
          >
            Create your first analysis
          </Link>
        </div>
      ) : (
        <>
          {/* Grid view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {analyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analysis/${analysis.id}`}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition group"
              >
                <div className="aspect-video bg-gray-800 relative">
                  {analysis.image_url ? (
                    <img
                      src={analysis.image_url}
                      alt="Ad creative"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className="text-xs font-medium text-blue-400 uppercase">
                      {analysis.platform}
                    </span>
                    <span className="text-gray-700">·</span>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {currentPage > 1 && (
                <Link
                  href={`/history?page=${currentPage - 1}`}
                  className="px-3 py-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/history?page=${page}`}
                  className={`px-3 py-2 text-sm rounded-lg transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {page}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={`/history?page=${currentPage + 1}`}
                  className="px-3 py-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition"
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
