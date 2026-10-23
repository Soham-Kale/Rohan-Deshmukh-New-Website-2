import { useCallback, useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type Slide = {
  image: string
  position?: string
  /** the phone photo (360 × 480); the desktop photo is used when there is none */
  mobileImage?: string | null
  mobilePosition?: string
  /** width ÷ height of the photos (kept for callers; the layout does not depend on it) */
  ratio?: number
  mobileRatio?: number
  alt: string
  kicker?: string | null
  heading?: string | null
  subheading?: string | null
  buttons: { label?: string | null; url?: string | null }[]
}

export type HeroSocial = { key: string; url: string; label: string }

const EASE = [0.2, 0.7, 0.2, 1] as const

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Home hero (Oct 2026, after the slider on ashishsood.in): a photo slider that fills the screen right under the header — each slide's photo
 * fills the screen under an even dark veil, the words sit at the bottom left, under the faces: a light kesariya line in wide-spaced capitals,
 * a large bold white headline (and the subheading when there is one) — and the slide numbers (01, 02) stand on the right, the current
 * one marked with a short white line. Slides move in from the right while they fade (the photo settles, the words rise in after it);
 * autoplay pauses on hover, on focus, when the tab is hidden and for visitors who ask their device for reduced motion. Phones get
 * each slide's own phone photo when there is one and can swipe. The "Text only" hero style (admin) shows the words on navy.
 */
export function HeroSlider({
  slides, autoplay = 5, textOnly = false, labels,
}: {
  slides: Slide[]; autoplay?: number; textOnly?: boolean
  /** kept for callers: this hero shows no social links */
  social?: HeroSocial[]
  place?: string
  labels?: { prev: string; next: string }
}) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const stopped = usePrefersReducedMotion()
  const touch = useRef<number | null>(null)

  const show = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count < 2 || paused || stopped) return
    const id = window.setTimeout(() => show(index + 1), Math.max(3, autoplay) * 1000)
    return () => window.clearTimeout(id)
  }, [index, paused, stopped, autoplay, count, show])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  if (!count) return null

  return (
    <section
      data-hero-overlay
      className="relative isolate h-[460px] w-full overflow-hidden bg-charcoal-950 text-white sm:h-[540px] md:h-[600px] lg:h-[calc(100svh-5rem)] lg:max-h-[900px] lg:min-h-[560px]"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') show(index + 1)
        if (e.key === 'ArrowLeft') show(index - 1)
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1))
        touch.current = null
      }}
    >
      {/* photos: all slides stacked; the current one slides in from the right while it fades in */}
      {textOnly ? (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-[#12233c]" />
      ) : (
        slides.map((s, i) => {
          const active = i === index
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={cn(
                'absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity',
                active ? 'z-[1] translate-x-0 opacity-100' : 'z-0 opacity-0 motion-safe:translate-x-[8%]',
              )}
            >
              <picture>
                {s.mobileImage && <source media="(max-width: 767px)" srcSet={s.mobileImage} width={360} height={480} />}
                <img
                  src={s.image}
                  alt={active ? s.alt : ''}
                  width={1600}
                  height={1067}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  className={cn('absolute inset-0 size-full object-cover transition-transform ease-out', active && !stopped ? 'scale-105 duration-[7000ms]' : 'scale-100 duration-[1100ms]')}
                  style={{ objectPosition: s.position }}
                />
              </picture>
            </div>
          )
        })
      )}

      {/* the veil: even all over, as on the reference */}
      {!textOnly && (
        <>
          <div aria-hidden className="absolute inset-0 z-[2] bg-black/30" />
          <div aria-hidden className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}

      {/* words: at the bottom left, under the faces (the photos are anchored near their top), just above the card that overlaps the bottom */}
      <div className="container-x relative z-10 flex h-full items-end pb-20 pr-16 pt-6 md:pb-24 md:pr-28 lg:pb-28">
        <div className="grid w-full max-w-3xl">
          {slides.map((s, i) => {
            const active = i === index
            const Heading = i === 0 ? m.h1 : m.p
            return (
              <m.div
                key={i}
                aria-hidden={!active}
                className={cn('[grid-area:1/1] self-end', !active && 'pointer-events-none')}
                initial={false}
                animate={active ? 'in' : 'out'}
                variants={{ in: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.35 } }, out: { opacity: 0, transition: { duration: 0.3 } } }}
              >
                {s.kicker && (
                  <m.p
                    variants={{ in: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } }, out: { opacity: 0, x: -30 } }}
                    className="mb-2 text-[0.9rem] font-light uppercase tracking-[2px] text-saffron-500 sm:text-xl sm:tracking-[3px] md:mb-4 lg:text-[1.875rem] lg:leading-tight"
                  >
                    {s.kicker}
                  </m.p>
                )}
                {s.heading && (
                  <Heading
                    variants={{ in: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }, out: { opacity: 0, y: 30 } }}
                    className="font-sans text-[1.6rem] font-bold capitalize leading-[1.12] tracking-[0.5px] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-[2.5rem] sm:tracking-[1px] lg:text-[3.125rem] lg:leading-none lg:tracking-[2px]"
                  >
                    {s.heading}
                  </Heading>
                )}
                {s.subheading && (
                  <m.p
                    variants={{ in: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }, out: { opacity: 0, y: 20 } }}
                    className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-white/85 sm:text-lg md:mt-6"
                  >
                    {s.subheading}
                  </m.p>
                )}
              </m.div>
            )
          })}
        </div>
      </div>

      {/* slide numbers: stacked on the right — centred in the height on wide screens, lower down on phones */}
      {count > 1 && (
        <ol
          aria-label={labels ? `${labels.prev} / ${labels.next}` : 'Slides'}
          className="absolute bottom-24 right-4 z-20 flex flex-col gap-0 sm:right-6 md:bottom-auto md:right-10 md:top-1/2 md:-translate-y-1/2 md:gap-4 lg:right-16"
        >
          {slides.map((_, i) => {
            const active = i === index
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => show(i)}
                  aria-label={`Slide ${i + 1} of ${count}`}
                  aria-current={active ? 'true' : undefined}
                  className={cn('flex min-h-11 items-center justify-end gap-3 font-sans text-sm tabular-nums transition-colors md:min-h-8 md:text-base', active ? 'text-white' : 'text-white/55 hover:text-white')}
                >
                  <span aria-hidden className={cn('h-px bg-white transition-all duration-500', active ? 'w-6 md:w-9' : 'w-0')} />
                  {pad(i + 1)}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
