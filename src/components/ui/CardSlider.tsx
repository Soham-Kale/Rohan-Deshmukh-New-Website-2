'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type SlideCard = {
  href: string
  title: string
  text?: string | null
  image?: string | null
  imageStyle?: React.CSSProperties
  meta?: string | null
}

/**
 * Card slider (photo on top, title, short text, "read more") with square arrow buttons on both sides —
 * 1 card on phones, 2 on tablets, 3 on desktop. Swipe or drag on touch screens.
 */
export function CardSlider({ cards, readMore, prevLabel = 'Previous', nextLabel = 'Next' }: { cards: SlideCard[]; readMore: string; prevLabel?: string; nextLabel?: string }) {
  const [ref, api] = useEmblaCarousel({ align: 'start', loop: cards.length > 3, slidesToScroll: 1 })
  const [can, setCan] = useState({ prev: false, next: true })
  const [index, setIndex] = useState(0)
  const [snaps, setSnaps] = useState(0)

  const update = useCallback(() => {
    if (!api) return
    setCan({ prev: api.canScrollPrev(), next: api.canScrollNext() })
    setIndex(api.selectedScrollSnap())
    setSnaps(api.scrollSnapList().length)
  }, [api])

  useEffect(() => {
    if (!api) return
    update()
    api.on('select', update).on('reInit', update)
    return () => void api.off('select', update).off('reInit', update)
  }, [api, update])

  const scrollable = can.prev || can.next
  const arrow = 'grid size-11 shrink-0 place-items-center rounded-md border border-saffron-500 bg-white text-saffron-600 shadow-sm transition hover:bg-saffron-500 hover:text-white disabled:pointer-events-none disabled:opacity-30'

  return (
    <div className="relative">
      <div className="flex items-center gap-3 md:gap-4">
        <button type="button" onClick={() => api?.scrollPrev()} disabled={!can.prev} aria-label={prevLabel} className={cn(arrow, scrollable ? 'hidden sm:grid' : 'hidden')}>
          <ChevronLeft className="size-5" />
        </button>

        <div className="min-w-0 flex-1 overflow-hidden" ref={ref}>
          <ul className="-ml-4 flex touch-pan-y md:-ml-5">
            {cards.map((c, i) => (
              <li key={c.href + i} className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-1/2 md:pl-5 lg:basis-1/3">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_6px_24px_-18px_rgba(20,33,61,.3)] transition hover:shadow-[0_16px_40px_-22px_rgba(20,33,61,.35)]">
                  <div className="relative aspect-[2/1] overflow-hidden bg-cream">
                    {c.image ? (
                      <Image src={c.image} alt="" fill sizes="(max-width:640px) 88vw, (max-width:1024px) 45vw, 360px" className="object-cover transition duration-500 group-hover:scale-105" style={c.imageStyle} />
                    ) : (
                      // no photo yet: branded placeholder with the first letter
                      <div aria-hidden className="grid h-full place-items-center bg-gradient-to-br from-saffron-50 via-paper to-saffron-100">
                        <span className="grid size-16 place-items-center rounded-full bg-white font-display text-3xl text-saffron-600 shadow-sm ring-1 ring-saffron-100">{c.title.trim().charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {c.meta && <p className="mb-1 text-xs font-semibold text-saffron-700">{c.meta}</p>}
                    <h3 className="text-[1.2rem] leading-snug text-charcoal-900 md:text-[1.3rem]">
                      <Link href={c.href} className="after:absolute after:inset-0">{c.title}</Link>
                    </h3>
                    {c.text && <p className="mt-2 line-clamp-4 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-saffron-700">
                      {readMore} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" onClick={() => api?.scrollNext()} disabled={!can.next} aria-label={nextLabel} className={cn(arrow, scrollable ? 'hidden sm:grid' : 'hidden')}>
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* phones: arrows + position under the cards */}
      {snaps > 1 && scrollable && (
        <div className="mt-5 flex items-center justify-center gap-4 sm:hidden">
          <button type="button" onClick={() => api?.scrollPrev()} disabled={!can.prev} aria-label={prevLabel} className={arrow}><ChevronLeft className="size-5" /></button>
          <span className="min-w-14 text-center text-sm tabular-nums text-muted">{index + 1} / {snaps}</span>
          <button type="button" onClick={() => api?.scrollNext()} disabled={!can.next} aria-label={nextLabel} className={arrow}><ChevronRight className="size-5" /></button>
        </div>
      )}
    </div>
  )
}
