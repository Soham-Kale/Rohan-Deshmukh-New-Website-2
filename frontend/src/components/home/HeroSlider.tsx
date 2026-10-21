import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type Slide = {
  image: string
  position?: string
  mobileImage?: string | null
  mobilePosition?: string
  /** width ÷ height of the photos (kept for callers; the layout no longer depends on it) */
  ratio?: number
  mobileRatio?: number
  alt: string
  kicker?: string | null
  heading?: string | null
  subheading?: string | null
  buttons: { label?: string | null; url?: string | null }[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Full-screen hero slideshow.
 * Photos cross-fade, the kicker / heading / buttons slide in one after another, numbered pager on the right.
 * Desktop: the slide photos under a dark tint, text centred on the left.
 * Phones & tablets: full-screen portrait photos ("mobile image" of each slide) under the see-through header,
 * text at the bottom over a dark fade. Only slides that have a mobile image are shown there (all of them if none has one).
 * Autoplay pauses on hover, on focus and when the tab is hidden.
 */
export function HeroSlider({ slides, autoplay = 5 }: { slides: Slide[]; autoplay?: number }) {
  const count = slides.length
  const mobileList = useMemo(() => slides.map((s, i) => (s.mobileImage ? i : -1)).filter((i) => i >= 0), [slides])
  const hasMobile = mobileList.length > 0

  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touch = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const indexRef = useRef(0)

  // which slides take part right now (phones: only those with a mobile photo)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const on = () => setIsMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const order = useMemo(() => (isMobile && hasMobile ? mobileList : slides.map((_, i) => i)), [isMobile, hasMobile, mobileList, slides])

  const show = useCallback((next: number) => {
    const cur = indexRef.current
    if (next === cur) return
    indexRef.current = next
    setPrev(cur)
    setIndex(next)
  }, [])
  /** step through the slides that take part (dir +1 / -1) */
  const step = useCallback(
    (dir: number) => {
      const pos = Math.max(0, order.indexOf(indexRef.current))
      show(order[(pos + dir + order.length) % order.length])
    },
    [order, show],
  )
  // a slide without a phone photo is never left on screen after switching to the phone layout
  useEffect(() => {
    if (!order.includes(indexRef.current)) show(order[0])
  }, [order, show])

  // first slide animates in after hydration (text is still in the HTML for search engines)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  // autoplay
  useEffect(() => {
    if (order.length < 2 || paused) return
    const id = window.setTimeout(() => step(1), autoplay * 1000)
    return () => window.clearTimeout(id)
  }, [index, paused, autoplay, order, step])

  // pause while the tab is hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // the previous slide only needs to stay mounted while it fades out
  useEffect(() => {
    if (prev === null) return
    const id = window.setTimeout(() => setPrev(null), 1300)
    return () => window.clearTimeout(id)
  }, [prev, index])

  if (!count) return null

  return (
    <section
      data-hero-overlay
      className="relative isolate flex flex-col overflow-hidden bg-charcoal-950 text-white max-lg:-mt-[4.5rem] lg:min-h-[560px]"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      {/* cover photos removed (Oct 2026): the slides show their words on the navy band; the photos stay in the admin */}

      {/* text */}
      <div className="container-x relative flex flex-1 items-end pb-12 pr-16 pt-36 sm:pb-16 sm:pt-40 lg:items-center lg:pb-28 lg:pr-36 lg:pt-20">
        {/* all slides share one grid cell, so the block keeps one height and nothing jumps */}
        <div className="relative grid w-full max-w-4xl">
          {slides.map((s, i) => {
            const state = i === index ? (ready ? 'in' : 'pre') : i === prev ? 'out' : 'idle'
            return (
              <div
                key={i}
                aria-hidden={state === 'out' || state === 'idle'}
                className={cn(
                  '[grid-area:1/1] max-lg:self-end lg:self-center',
                  (state === 'out' || state === 'idle') && 'pointer-events-none',
                  state === 'idle' && 'invisible',
                  hasMobile && !s.mobileImage && 'max-lg:hidden',
                )}
              >
                {s.kicker && (
                  <p className="hero-line hero-kicker mb-3 text-[0.95rem] font-light uppercase text-saffron-300 sm:text-xl lg:mb-4 lg:text-2xl" data-state={state} style={{ ['--hero-x' as string]: '100px', transitionDelay: state === 'in' ? '150ms' : '0ms' }}>
                    {s.kicker}
                  </p>
                )}
                {i === 0 ? (
                  <h1 className="hero-line text-[2.3rem] font-semibold leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl" data-state={state} style={{ ['--hero-x' as string]: '200px', transitionDelay: state === 'in' ? '250ms' : '0ms' }}>
                    {s.heading}
                  </h1>
                ) : (
                  <p className="hero-line font-display text-[2.3rem] font-semibold leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl" data-state={state} style={{ ['--hero-x' as string]: '200px', transitionDelay: state === 'in' ? '250ms' : '0ms' }}>
                    {s.heading}
                  </p>
                )}
                {s.subheading && (
                  <p className="hero-line mt-4 max-w-2xl text-base text-white/85 sm:text-lg lg:mt-5 lg:text-xl" data-state={state} style={{ ['--hero-x' as string]: '300px', transitionDelay: state === 'in' ? '350ms' : '0ms' }}>
                    {s.subheading}
                  </p>
                )}
                {/* buttons removed from the cover (Oct 2026); the slides' buttons stay in the admin */}
              </div>
            )
          })}
        </div>
      </div>

      {/* numbered pager on the right — phones: lower right beside the text; desktop: centred */}
      {order.length > 1 && (
        <nav aria-label="Slides" className="absolute right-4 top-24 z-10 sm:right-8 sm:top-28 md:right-16 lg:right-20 lg:top-1/2 lg:-translate-y-1/2">
          <ol className="flex flex-col items-end gap-3 lg:gap-6">
            {slides.map((s, i) => {
              const mobilePos = mobileList.indexOf(i)
              return (
                <li key={i} className={cn(hasMobile && !s.mobileImage && 'max-lg:hidden')}>
                  <button
                    type="button"
                    onClick={() => show(i)}
                    aria-current={i === index ? 'true' : undefined}
                    className={cn('group flex min-h-9 items-center gap-3 py-1 text-base tabular-nums transition-colors lg:text-lg', i === index ? 'text-white' : 'text-white/55 hover:text-white')}
                  >
                    <span aria-hidden className={cn('h-px bg-white transition-all duration-500', i === index ? 'w-8 lg:w-12' : 'w-0 group-hover:w-4')} />
                    {/* the name is read from the content, so it always contains the number that is shown */}
                    <span className="sr-only">Slide</span>
                    {hasMobile ? (
                      <>
                        <span className="lg:hidden">{pad(mobilePos + 1)}</span>
                        <span className="max-lg:hidden">{pad(i + 1)}</span>
                      </>
                    ) : (
                      pad(i + 1)
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      )}
    </section>
  )
}
