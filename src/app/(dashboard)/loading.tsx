export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div>
        <div className="h-8 w-56 bg-gray-800 rounded" />
        <div className="h-4 w-80 bg-gray-800/60 rounded mt-2" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="h-4 w-28 bg-gray-800 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className="h-12 w-44 bg-gray-800 rounded-lg" />

      {/* Cards skeleton */}
      <div>
        <div className="h-6 w-40 bg-gray-800 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-800" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-24 bg-gray-800 rounded" />
                <div className="h-3 w-16 bg-gray-800/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
