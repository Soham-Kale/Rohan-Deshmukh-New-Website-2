'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CMSLink } from '../ui/CMSLink'
import { cn } from '@/lib/utils'

export type Slide = {
  image: string
  position?: string
  mobileImage?: string | null
  mobilePosition?: string
  /** width ÷ height of the photo (and of the phone photo) — phones and tablets show the photo at its own shape */
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
 * Hero slideshow.
 * Desktop: full-screen photos cross-fade under a dark tint, the photo stays put while the page scrolls,
 * and the kicker / heading / buttons slide in over it; numbered pager on the right.
 * Phones and tablets: the photo is shown full width at its own shape (nothing cropped — the banners carry
 * their own lettering), with the heading, buttons and pager underneath on white.
 * Autoplay pauses on hover, on focus and when the tab is hidden.
 */
export function HeroSlider({ slides, autoplay = 5 }: { slides: Slide[]; autoplay?: number }) {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const bgRef = useRef<HTMLDivElement>(null)
  const touch = useRef<number | null>(null)
  const count = slides.length

  const [ready, setReady] = useState(false)
  const indexRef = useRef(0)

  const go = useCallback(
    (to: number) => {
      const cur = indexRef.current
      const next = (to + count) % count
      if (next === cur) return
      indexRef.current = next
      setPrev(cur)
      setIndex(next)
    },
    [count],
  )

  // first slide animates in after hydration (text is still in the HTML for search engines)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  // autoplay
  useEffect(() => {
    if (count < 2 || paused) return
    const id = window.setTimeout(() => go(index + 1), autoplay * 1000)
    return () => window.clearTimeout(id)
  }, [index, paused, autoplay, count, go])

  // pause while the tab is hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // photo stays (almost) fixed while the page scrolls over it — transform-based, so it also works on iOS
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return // phones/tablets: photo sits above the text, no parallax
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
      className="relative isolate overflow-hidden bg-white text-charcoal-900 lg:h-[calc(100svh-6.75rem)] lg:min-h-[600px] lg:bg-charcoal-950 lg:text-white"
      style={{ ['--hero-ratio' as string]: String(slides[0]?.mobileRatio ?? slides[0]?.ratio ?? 2.4) }}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touch.current = null
      }}
    >
      {/* photos */}
      <div ref={bgRef} className="relative aspect-[var(--hero-ratio)] w-full overflow-hidden bg-cream lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto lg:bg-transparent lg:will-change-transform">
        {slides.map((s, i) => {
          const active = i === index
          const leaving = i === prev
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={cn(
                'absolute inset-0 transition-opacity duration-[1200ms] ease-out',
                active ? 'z-10 opacity-100' : leaving ? 'z-0 opacity-0' : 'z-0 opacity-0',
              )}
            >
              <Image
                src={s.image}
                alt={active ? s.alt : ''}
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectPosition: s.position }}
                className={cn(
                  'object-cover transition-transform duration-[7000ms] ease-out',
                  s.mobileImage && 'max-lg:hidden',
                  active ? 'lg:scale-110' : 'lg:scale-100',
                )}
              />
              {s.mobileImage && (
                <Image
                  src={s.mobileImage}
                  alt={active ? s.alt : ''}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectPosition: s.mobilePosition }}
                  className="object-cover lg:hidden"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* tint — flat like the reference, a little deeper at the bottom for the text on phones */}
      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-overlay lg:block" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 hidden h-1/3 bg-gradient-to-t from-charcoal-950/40 to-transparent lg:block" />

      {/* text */}
      <div className="container-x relative pb-4 pt-7 lg:flex lg:h-full lg:items-center lg:py-0 lg:pr-36">
        {/* all slides share one grid cell, so the block keeps the height of the tallest text and nothing below it jumps */}
        <div className="relative grid w-full max-w-4xl">
          {slides.map((s, i) => {
            const state = i === index ? (ready ? 'in' : 'pre') : i === prev ? 'out' : 'idle'
            return (
              <div
                key={i}
                aria-hidden={state === 'out' || state === 'idle'}
                className={cn('[grid-area:1/1]', (state === 'out' || state === 'idle') && 'pointer-events-none', state === 'idle' && 'invisible')}
              >
                {s.kicker && (
                  <p className="hero-line hero-kicker mb-3 text-base font-light uppercase text-saffron-700 sm:text-xl lg:mb-4 lg:text-2xl lg:text-saffron-300" data-state={state} style={{ ['--hero-x' as string]: '100px', transitionDelay: state === 'in' ? '150ms' : '0ms' }}>
                    {s.kicker}
                  </p>
                )}
                {i === 0 ? (
                  <h1 className="hero-line text-[2.1rem] font-semibold leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl" data-state={state} style={{ ['--hero-x' as string]: '200px', transitionDelay: state === 'in' ? '250ms' : '0ms' }}>
                    {s.heading}
                  </h1>
                ) : (
                  <p className="hero-line font-display text-[2.1rem] font-semibold leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl" data-state={state} style={{ ['--hero-x' as string]: '200px', transitionDelay: state === 'in' ? '250ms' : '0ms' }}>
                    {s.heading}
                  </p>
                )}
                {s.subheading && (
                  <p className="hero-line mt-4 max-w-2xl text-base text-muted sm:text-lg lg:mt-5 lg:text-xl lg:text-white/85" data-state={state} style={{ ['--hero-x' as string]: '300px', transitionDelay: state === 'in' ? '350ms' : '0ms' }}>
                    {s.subheading}
                  </p>
                )}
                {s.buttons.length > 0 && (
                  <div className="hero-line mt-6 flex flex-wrap gap-3 lg:mt-9" data-state={state} style={{ ['--hero-x' as string]: '400px', transitionDelay: state === 'in' ? '450ms' : '0ms' }}>
                    {s.buttons.map((b, j) => (
                      <CMSLink key={j} url={b.url} tabIndex={state === 'in' ? undefined : -1} className={cn('btn text-base', j === 0 ? 'btn-primary' : 'btn-ghost text-charcoal-900 lg:text-white')}>
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

      {/* numbered pager: vertical on the right (desktop/tablet), horizontal at the bottom (phones) */}
      {count > 1 && (
        <nav aria-label="Slides" className="container-x relative z-10 pb-8 lg:absolute lg:right-20 lg:top-1/2 lg:w-auto lg:max-w-none lg:-translate-y-1/2 lg:p-0">
          <ol className="flex gap-5 lg:flex-col lg:items-end lg:gap-6">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn('group flex min-h-10 items-center gap-3 py-1 text-base tabular-nums transition-colors lg:text-lg', i === index ? 'text-charcoal-900 lg:text-white' : 'text-muted hover:text-charcoal-900 lg:text-white/55 lg:hover:text-white')}
                >
                  <span aria-hidden className={cn('h-0.5 bg-saffron-500 transition-all duration-500 lg:h-px lg:bg-white', i === index ? 'w-8 lg:w-12' : 'w-0 group-hover:w-4')} />
                  {pad(i + 1)}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </section>
  )
}
