export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content skeleton */}
        <section className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="flex gap-8 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
