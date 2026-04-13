export default function WorkDetailLoading() {
  return (
    <div className="min-h-screen pt-20 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          <div className="h-4 w-12 bg-white/5 rounded" />
          <div className="h-4 w-2 bg-white/5 rounded" />
          <div className="h-4 w-14 bg-white/5 rounded" />
          <div className="h-4 w-2 bg-white/5 rounded" />
          <div className="h-4 w-40 bg-white/5 rounded" />
        </div>

        {/* Video player skeleton */}
        <div className="glass rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-white/5">
          <div className="aspect-video bg-white/5 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Info skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-9 w-3/4 bg-white/5 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-white/5 rounded-full" />
              <div className="h-6 w-20 bg-white/5 rounded-full" />
              <div className="h-6 w-14 bg-white/5 rounded-full" />
            </div>
          </div>
          <div className="glass rounded-xl p-5 sm:p-6 border border-white/5 space-y-4 h-fit">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-16 bg-white/5 rounded" />
                <div className="h-4 w-24 bg-white/5 rounded" />
              </div>
            ))}
            <div className="h-10 w-full bg-white/5 rounded-lg mt-2" />
          </div>
        </div>

        {/* Related works skeleton */}
        <div>
          <div className="h-6 w-24 bg-white/5 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="aspect-video bg-white/5" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-16 bg-white/5 rounded" />
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
