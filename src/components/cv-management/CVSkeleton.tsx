export const CVSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Skeleton for horizontal CV card */}
      <div className="w-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 p-4 h-auto sm:h-[140px]">
          {/* Left: Thumbnail skeleton */}
          <div className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-full bg-gray-200 rounded-lg" />

          {/* Right: Content skeleton */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Top section */}
            <div>
              {/* Title and badges */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                  </div>
                </div>

                {/* Menu button skeleton */}
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex items-center justify-between gap-4">
              {/* Info skeleton */}
              <div className="flex items-center gap-3 text-sm">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>

              {/* Actions skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-20 h-8 bg-gray-200 rounded-lg" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CVGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Vertical card skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[280px]">
            {/* Thumbnail area */}
            <div className="h-32 bg-gray-200" />
            
            {/* Content area */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
              
              {/* Info */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <div className="h-8 bg-gray-200 rounded flex-1" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CVPageSkeleton = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-3 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main content skeleton */}
        <section className="space-y-6 min-w-0 max-w-5xl mx-auto w-full">
          {/* Header skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Active CV section skeleton */}
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl p-6 shadow-md animate-pulse">
            <div className="h-6 bg-white/30 rounded w-1/4 mb-4" />
            <CVSkeleton />
          </div>

          {/* Tabs skeleton */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex gap-8 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="py-4">
                    <div className="h-5 bg-gray-200 rounded w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <CVGridSkeleton count={6} />
          </div>
        </section>
      </div>
    </main>
  );
};
