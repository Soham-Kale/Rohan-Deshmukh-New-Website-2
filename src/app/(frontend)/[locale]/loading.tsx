/** Shown instantly while the next page loads (keeps navigation feeling immediate) */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="on-dark bg-maroon-900">
        <div className="container-x py-14 md:py-20">
          <div className="h-4 w-40 animate-pulse rounded-full bg-white/15" />
          <div className="mt-5 h-12 w-3/4 max-w-xl animate-pulse rounded-2xl bg-white/15 md:h-16" />
          <div className="mt-4 h-5 w-2/3 max-w-lg animate-pulse rounded-full bg-white/10" />
        </div>
      </section>
      <div className="container-x grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[20px] border border-line bg-white">
            <div className="aspect-[16/10] animate-pulse bg-cream" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-cream" />
              <div className="h-4 w-full animate-pulse rounded-full bg-cream" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-cream" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
