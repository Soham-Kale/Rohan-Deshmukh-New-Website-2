import { useCallback, useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { SocialIcon } from '../ui/SocialIcon'

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

/**
 * Layout (after supriyassule.in): the social links as a slim vertical rail on the left edge (wide screens), the words at the bottom
 * left and the slide markers as short dashes right under them.
 *
 * Home hero (Oct 2026, after ashishsood.in): each slide is a full-width photo under a dark veil, with a small kesariya line,
 * a large white headline and the subheading at the bottom left (clear of the face — the photos are anchored near their top through
 * their focal point), and the slide numbers (01, 02…) stacked on the right — the current one marked with a short line. Slides cross-fade; autoplay pauses on hover, on focus, when the tab is hidden and for visitors
 * who ask their device for reduced motion. Phones get each slide's own 3:4 photo (360 × 480) and can swipe; the words sit
 * at the bottom there. Desktop photos are 1600 × 1067. The "Text only" hero style (admin) shows the words on navy.
 */
export function HeroSlider({
  slides, autoplay = 5, textOnly = false, labels, social = [],
}: {
  slides: Slide[]; autoplay?: number; textOnly?: boolean
  /** social links, shown as a vertical rail on the left edge on wide screens */
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
      className={cn(
        'relative isolate w-full overflow-hidden bg-charcoal-950 text-white',
        // phones: the 3:4 phone photo at full width; tablets and desktops: the 3:2 photo, never taller than the screen
        textOnly ? 'min-h-[420px] md:min-h-[520px]' : 'aspect-[3/4] max-h-[calc(100svh-4rem)] min-h-[420px] md:aspect-[3/2] md:max-h-[calc(100svh-5rem)] md:min-h-[520px]',
      )}
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
      {/* photos: all slides stacked, the current one faded in (with a very slow zoom) */}
      {textOnly ? (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-[#12233c]" />
      ) : (
        slides.map((s, i) => {
          const active = i === index
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={cn('absolute inset-0 transition-opacity duration-[1200ms] ease-in-out', active ? 'opacity-100' : 'opacity-0')}
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
                  className={cn('absolute inset-0 size-full object-cover transition-transform ease-out', active && !stopped ? 'scale-105 duration-[8000ms]' : 'scale-100 duration-[1200ms]')}
                  style={{ objectPosition: s.position }}
                />
              </picture>
            </div>
          )
        })
      )}

      {/* the veil: even all over (as on the reference), darker at the bottom where the words sit */}
      {!textOnly && (
        <>
          <div aria-hidden className="absolute inset-0 bg-black/30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent md:from-black/70 md:via-black/15" />
        </>
      )}

      {/* words: at the bottom left on every screen, so they sit over the shoulders / crowd and never across Rohan's face */}
      <div className={cn('container-x relative z-10 flex h-full flex-col justify-end pb-20 pt-24 md:pb-24 md:pt-16', social.length > 0 && 'lg:pl-24')}>
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
                variants={{ in: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.25 } }, out: { opacity: 0, transition: { duration: 0.35 } } }}
              >
                {s.kicker && (
                  <m.p
                    variants={{ in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }, out: { opacity: 0, y: 18 } }}
                    className="mb-3 text-[0.8rem] font-medium uppercase tracking-[0.2em] text-saffron-500 sm:text-sm md:mb-4 md:text-lg md:tracking-[0.18em]"
                  >
                    {s.kicker}
                  </m.p>
                )}
                {s.heading && (
                  <Heading
                    variants={{ in: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }, out: { opacity: 0, y: 26 } }}
                    className="font-display text-[1.85rem] font-bold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl"
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
        {count > 1 && (
          <ol aria-label={labels ? `${labels.prev} / ${labels.next}` : 'Slides'} className="mt-8 flex items-center gap-2 md:mt-10">
            {slides.map((_, i) => {
              const active = i === index
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => show(i)}
                    aria-label={`Slide ${i + 1} of ${count}`}
                    aria-current={active ? 'true' : undefined}
                    className="group flex min-h-11 items-center md:min-h-6"
                  >
                    <span aria-hidden className={cn('block h-1 rounded-full transition-all duration-500', active ? 'w-10 bg-saffron-500' : 'w-6 bg-white/50 group-hover:bg-white')} />
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {/* social links: a slim vertical rail on the left edge (wide screens) */}
      {social.length > 0 && (
        <ul aria-label="Social" className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex xl:left-8">
          {social.map((s) => (
            <li key={s.key}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-saffron-500 hover:bg-saffron-600">
                <SocialIcon name={s.key === 'whatsappChannel' ? 'whatsapp' : s.key} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
