// Skeleton loading for public pages — shown while server components fetch data
export default function Loading() {
  return (
    <main className="min-h-screen bg-white animate-pulse">
      {/* Hero Skeleton */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-16 md:pt-0">
        <div className="space-y-8 max-w-2xl">
          {/* Role label */}
          <div className="h-3 w-32 bg-[#f0f0f0] rounded" />
          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 w-[80%] bg-[#f0f0f0] rounded" />
            <div className="h-12 w-[55%] bg-[#f0f0f0] rounded" />
          </div>
          {/* Subtitle */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-px bg-[#e8e8e8]" />
            <div className="h-2.5 w-48 bg-[#f5f5f5] rounded" />
          </div>
        </div>
      </section>
    </main>
  );
}
