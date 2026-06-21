// Skeleton for project detail page — the user reports this is the slowest page
export default function Loading() {
  return (
    <main className="min-h-screen bg-white pt-16 md:pt-0 animate-pulse">
      {/* Hero Split Skeleton */}
      <section className="flex flex-col md:flex-row items-center min-h-screen">
        {/* Left Column: Info skeleton */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:py-16 md:pl-12 md:pr-6">
          <div className="space-y-4">
            {/* Category + Year */}
            <div className="h-2.5 w-28 bg-[#f0f0f0] rounded" />
            {/* Title */}
            <div className="space-y-2 pb-4">
              <div className="h-8 w-[75%] bg-[#f0f0f0] rounded" />
              <div className="h-8 w-[50%] bg-[#f0f0f0] rounded" />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#f5f5f5] rounded" />
              <div className="h-3 w-[90%] bg-[#f5f5f5] rounded" />
              <div className="h-3 w-[70%] bg-[#f5f5f5] rounded" />
            </div>
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2 pt-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-6 w-16 bg-[#f5f5f5] border border-[#ebebeb] rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Image skeleton */}
        <div className="w-full md:w-1/2 px-6 py-8 md:py-16 md:pr-12 md:pl-6 flex items-center justify-center">
          <div className="w-full aspect-[4/3] bg-[#f5f5f5] border border-[#ebebeb]" />
        </div>
      </section>

      {/* Case Study Grid Skeleton */}
      <section className="px-6 md:px-12 w-full py-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-2 w-4 bg-[#e8e8e8] rounded" />
          <div className="w-6 h-px bg-[#e8e8e8]" />
          <div className="h-2 w-20 bg-[#e8e8e8] rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-3 w-12 bg-[#f0f0f0] rounded" />
              <div className="space-y-2">
                <div className="h-2.5 w-full bg-[#f5f5f5] rounded" />
                <div className="h-2.5 w-[85%] bg-[#f5f5f5] rounded" />
                <div className="h-2.5 w-[60%] bg-[#f5f5f5] rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
