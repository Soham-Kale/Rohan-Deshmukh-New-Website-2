'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { CMSLink } from '../ui/CMSLink'
import { cn } from '@/lib/utils'

export type Slide = { image: string; alt: string; heading?: string | null; subheading?: string | null; buttons: { label?: string | null; url?: string | null }[] }

export function HeroSlider({ slides, autoplay = 6, badge, thumbs }: { slides: Slide[]; autoplay?: number; badge?: { value: string; label: string } | null; thumbs: string[] }) {
  const [ref, api] = useEmblaCarousel({ loop: slides.length > 1 }, slides.length > 1 ? [Autoplay({ delay: autoplay * 1000, stopOnInteraction: false, stopOnMouseEnter: true })] : [])
  const [index, setIndex] = useState(0)
  const onSelect = useCallback(() => api && setIndex(api.selectedScrollSnap()), [api])
  useEffect(() => {
    if (!api) return
    api.on('select', onSelect)
    return () => void api.off('select', onSelect)
  }, [api, onSelect])

  return (
    <section className="relative isolate overflow-hidden bg-maroon-950 text-white" aria-roledescription="carousel">
      <div ref={ref} className="overflow-hidden">
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>
              <div className="relative h-[82svh] min-h-[560px] max-h-[860px]">
                <Image src={s.image} alt={s.alt} fill priority={i === 0} sizes="100vw" className={cn('object-cover transition-transform duration-[7000ms] ease-out', index === i ? 'scale-105' : 'scale-100')} />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/55 to-maroon-950/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/80 via-transparent to-transparent" />
                <div className="container-x relative flex h-full flex-col justify-end pb-28 md:pb-36">
                  <div key={index === i ? 'on' : 'off'} className={cn('max-w-3xl', index === i && 'animate-fade-up')}>
                    {s.heading && <h1 className="text-4xl leading-[1.15] md:text-6xl lg:text-7xl">{s.heading}</h1>}
                    {s.subheading && <p className="mt-5 max-w-2xl text-lg text-white/85 md:text-xl">{s.subheading}</p>}
                    {s.buttons.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-3">
                        {s.buttons.map((b, j) => (
                          <CMSLink key={j} url={b.url} className={cn('btn text-base', j === 0 ? 'btn-primary' : 'btn-ghost text-white')}>
                            {b.label} <ArrowRight className="size-4" />
                          </CMSLink>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x pointer-events-none absolute inset-x-0 bottom-8 flex items-end justify-between gap-6 md:bottom-12">
        {badge ? (
          <div className="pointer-events-auto hidden items-center gap-3 rounded-full bg-white/10 py-2 pl-2 pr-5 backdrop-blur-md sm:flex">
            <div className="flex -space-x-3">
              {thumbs.slice(0, 3).map((t, i) => (
                <span key={i} className="relative size-11 overflow-hidden rounded-full ring-2 ring-maroon-900">
                  <Image src={t} alt="" fill sizes="44px" className="object-cover" />
                </span>
              ))}
            </div>
            <div className="leading-tight">
              <p className="font-display text-xl text-saffron-300">{badge.value}</p>
              <p className="text-sm text-white/80">{badge.label}</p>
            </div>
          </div>
        ) : (
          <span />
        )}
        {slides.length > 1 && (
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex gap-1.5 max-md:-translate-y-14">
              {slides.map((_, i) => (
                <button key={i} type="button" onClick={() => api?.scrollTo(i)} aria-label={`Slide ${i + 1}`} className={cn('h-1.5 rounded-full transition-all', index === i ? 'w-8 bg-saffron-500' : 'w-3 bg-white/40 hover:bg-white/70')} />
              ))}
            </div>
            <button type="button" onClick={() => api?.scrollPrev()} aria-label="Previous slide" className="hidden md:grid size-11 place-items-center rounded-full border border-white/30 hover:bg-white/10">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => api?.scrollNext()} aria-label="Next slide" className="hidden md:grid size-11 place-items-center rounded-full border border-white/30 hover:bg-white/10">
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
