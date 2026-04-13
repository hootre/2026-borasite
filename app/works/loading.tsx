export default function WorksLoading() {
  return (
    <div className="min-h-screen pt-20 animate-pulse">
      {/* Page header */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="h-4 w-20 bg-white/5 rounded mb-3" />
        <div className="h-14 w-64 bg-white/5 rounded mb-4" />
        <div className="h-5 w-72 bg-white/5 rounded" />
      </div>

      <section className="py-24 max-w-7xl mx-auto px-6">
        {/* Filter skeleton */}
        <div className="flex gap-2 mb-10">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-9 w-20 bg-white/5 rounded-full" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden border border-white/5">
              <div className="aspect-video bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-4 w-3/4 bg-white/5 rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-12 bg-white/5 rounded-full" />
                  <div className="h-5 w-16 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
