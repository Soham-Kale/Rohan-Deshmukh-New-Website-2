'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Share } from '@/components/ui/Share'

type Q = { id: number; text: string; image: { src: string; thumb: string } | null; url: string }

export function QuoteGrid({ quotes, shareLabel }: { quotes: Q[]; shareLabel: string }) {
  const [index, setIndex] = useState(-1)
  const withImg = quotes.filter((q) => q.image)
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q) => (
          <article key={q.id} id={`q-${q.id}`} className="card flex scroll-mt-28 flex-col">
            {q.image ? (
              <button type="button" onClick={() => setIndex(withImg.indexOf(q))} className="relative aspect-square overflow-hidden bg-cream" aria-label={q.text.slice(0, 60)}>
                <Image src={q.image.thumb} alt={q.text.slice(0, 120)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition hover:scale-105" />
              </button>
            ) : (
              <div className="grain flex aspect-square flex-col justify-between bg-charcoal-900 p-7 text-white">
                <Quote className="size-9 text-saffron-500" />
                <p className="font-display text-xl leading-relaxed md:text-2xl">{q.text}</p>
                <p className="text-sm text-saffron-300">— रोहन सुभाष देशमुख</p>
              </div>
            )}
            <div className="p-4"><Share url={q.url} title={q.text} label={shareLabel} /></div>
          </article>
        ))}
      </div>
      <Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={withImg.map((q) => ({ src: q.image!.src, alt: q.text }))} />
    </>
  )
}
