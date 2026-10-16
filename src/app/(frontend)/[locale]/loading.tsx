/** Shown instantly while the next page loads — same banner and grid as the real page, so nothing jumps */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="bg-cream">
        <div className="container-x flex min-h-[17rem] flex-col justify-end pb-10 pt-12 md:min-h-[22rem] md:pb-14 md:pt-16">
          <div className="h-5 w-40 animate-pulse rounded-full bg-charcoal-900/10" />
          <div className="mt-5 h-11 w-3/4 max-w-xl animate-pulse rounded-2xl bg-charcoal-900/10 md:h-16" />
          <div className="mt-4 h-6 w-2/3 max-w-lg animate-pulse rounded-full bg-charcoal-900/[0.07]" />
        </div>
      </section>
      <div className="container-x grid gap-x-7 gap-y-12 pb-20 pt-12 sm:grid-cols-2 md:pt-16 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[16/10] animate-pulse rounded-[1.25rem] bg-cream" />
            <div className="mt-5 space-y-3">
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
