'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CMSLink } from '../ui/CMSLink'
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
  const bgRef = useRef<HTMLDivElement>(null)
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

  // photo stays (almost) fixed while the page scrolls over it — transform-based, so it also works on iOS
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight)
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.45}px, 0)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
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
      className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-charcoal-950 text-white max-lg:-mt-[4.5rem] lg:h-[calc(100svh-5rem)] lg:max-h-[780px] lg:min-h-[580px]"
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
      {/* photos */}
      <div ref={bgRef} className="absolute inset-0 -z-20 will-change-transform">
        {slides.map((s, i) => {
          const active = i === index
          const leaving = i === prev
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={cn('absolute inset-0 transition-opacity duration-[1200ms] ease-out', active ? 'z-10 opacity-100' : leaving ? 'z-0 opacity-0' : 'z-0 opacity-0')}
            >
              <Image
                src={s.image}
                alt={active ? s.alt : ''}
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectPosition: s.position }}
                className={cn('object-cover transition-transform duration-[7000ms] ease-out', s.mobileImage && 'max-lg:hidden', active ? 'scale-110' : 'scale-100')}
              />
              {s.mobileImage && (
                <Image
                  src={s.mobileImage}
                  alt={active ? s.alt : ''}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectPosition: s.mobilePosition }}
                  className={cn('object-cover transition-transform duration-[7000ms] ease-out lg:hidden', active ? 'scale-105' : 'scale-100')}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* tint — desktop: flat; phones: clear in the middle, darker at the top (header) and deep at the bottom (text) */}
      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-overlay lg:block" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 hidden h-1/3 bg-gradient-to-t from-charcoal-950/40 to-transparent lg:block" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-charcoal-950/60 to-transparent lg:hidden" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/60 to-transparent lg:hidden" />

      {/* text */}
      <div className="container-x relative flex h-full items-end pb-12 pr-16 pt-28 sm:pb-16 lg:items-center lg:pb-20 lg:pr-36">
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
                {s.buttons.length > 0 && (
                  <div className="hero-line mt-6 flex flex-wrap gap-3 lg:mt-9" data-state={state} style={{ ['--hero-x' as string]: '400px', transitionDelay: state === 'in' ? '450ms' : '0ms' }}>
                    {s.buttons.map((b, j) => (
                      <CMSLink key={j} url={b.url} tabIndex={state === 'in' ? undefined : -1} className={cn('btn text-base max-lg:!min-h-11 max-lg:px-5 max-lg:text-[0.95rem]', j === 0 ? 'btn-primary' : 'btn-ghost text-white')}>
                        {b.label} <ArrowRight className="size-4" />
                      </CMSLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* numbered pager on the right — phones: lower right beside the text; desktop: centred */}
      {order.length > 1 && (
        <nav aria-label="Slides" className="absolute right-4 top-[44%] z-10 sm:right-8 md:right-16 lg:right-20 lg:top-1/2 lg:-translate-y-1/2">
          <ol className="flex flex-col items-end gap-3 lg:gap-6">
            {slides.map((s, i) => {
              const mobilePos = mobileList.indexOf(i)
              return (
                <li key={i} className={cn(hasMobile && !s.mobileImage && 'max-lg:hidden')}>
                  <button
                    type="button"
                    onClick={() => show(i)}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                    className={cn('group flex min-h-9 items-center gap-3 py-1 text-base tabular-nums transition-colors lg:text-lg', i === index ? 'text-white' : 'text-white/55 hover:text-white')}
                  >
                    <span aria-hidden className={cn('h-px bg-white transition-all duration-500', i === index ? 'w-8 lg:w-12' : 'w-0 group-hover:w-4')} />
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
