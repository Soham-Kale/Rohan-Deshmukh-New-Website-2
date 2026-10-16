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
  alt: string
  kicker?: string | null
  heading?: string | null
  subheading?: string | null
  buttons: { label?: string | null; url?: string | null }[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Full-screen hero slideshow ("dragon" style):
 * photos cross-fade under a dark tint, the photo stays put while the page scrolls over it,
 * and the kicker / heading / buttons slide in from the right one after another.
 * Numbered pager on the right (bottom on phones). Autoplay pauses on hover, on focus and when the tab is hidden.
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
      className="relative isolate -mt-[4.5rem] h-[100svh] min-h-[560px] overflow-hidden bg-charcoal-950 text-white md:min-h-[640px]"
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
      <div ref={bgRef} className="absolute inset-0 -z-20 will-change-transform">
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
                  s.mobileImage && 'max-md:hidden',
                  active ? 'scale-110' : 'scale-100',
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
                  className={cn('object-cover transition-transform duration-[7000ms] ease-out md:hidden', active ? 'scale-110' : 'scale-100')}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* tint — flat like the reference, a little deeper at the bottom for the text on phones */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-overlay" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-charcoal-950/40 to-transparent md:h-1/3" />

      {/* text */}
      <div className="container-x relative flex h-full items-end pb-28 pt-28 md:items-center md:pb-0 md:pr-36">
        <div className="relative w-full max-w-4xl">
          {slides.map((s, i) => {
            const state = i === index ? (ready ? 'in' : 'pre') : i === prev ? 'out' : 'idle'
            return (
              <div
                key={i}
                aria-hidden={state === 'out' || state === 'idle'}
                className={cn(state === 'in' || state === 'pre' ? 'relative' : 'pointer-events-none absolute inset-x-0 bottom-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2', state === 'idle' && 'invisible')}
              >
                {s.kicker && (
                  <p className="hero-line hero-kicker mb-3 text-base font-light uppercase text-saffron-400 sm:text-xl md:mb-4 md:text-2xl" data-state={state} style={{ ['--hero-x' as string]: '100px', transitionDelay: state === 'in' ? '150ms' : '0ms' }}>
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
                  <p className="hero-line mt-5 max-w-2xl text-base text-white/85 sm:text-lg md:text-xl" data-state={state} style={{ ['--hero-x' as string]: '300px', transitionDelay: state === 'in' ? '350ms' : '0ms' }}>
                    {s.subheading}
                  </p>
                )}
                {s.buttons.length > 0 && (
                  <div className="hero-line mt-7 flex flex-wrap gap-3 md:mt-9" data-state={state} style={{ ['--hero-x' as string]: '400px', transitionDelay: state === 'in' ? '450ms' : '0ms' }}>
                    {s.buttons.map((b, j) => (
                      <CMSLink key={j} url={b.url} tabIndex={state === 'in' ? undefined : -1} className={cn('btn text-base', j === 0 ? 'btn-primary' : 'btn-ghost text-white')}>
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
        <nav aria-label="Slides" className="absolute bottom-8 left-4 z-10 md:bottom-auto md:left-auto md:right-16 md:top-1/2 md:-translate-y-1/2 lg:right-20">
          <ol className="flex gap-5 md:flex-col md:items-end md:gap-6">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn('group flex items-center gap-3 py-1 text-base font-medium tabular-nums transition-colors md:text-lg', i === index ? 'text-white' : 'text-white/55 hover:text-white')}
                >
                  <span aria-hidden className={cn('h-px bg-white transition-all duration-500', i === index ? 'w-8 md:w-12' : 'w-0 group-hover:w-4')} />
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
