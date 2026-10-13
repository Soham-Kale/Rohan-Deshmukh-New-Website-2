'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { cn } from '@/lib/utils'

export type GalleryImage = { src: string; thumb: string; alt: string; caption?: string | null; width?: number | null; height?: number | null }

export function Gallery({ images, layout = 'grid', className }: { images: GalleryImage[]; layout?: 'grid' | 'masonry'; className?: string }) {
  const [index, setIndex] = useState(-1)
  if (!images.length) return null
  return (
    <>
      <div className={cn(layout === 'masonry' ? 'columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3' : 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4', className)}>
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn('group relative block w-full overflow-hidden rounded-2xl bg-cream', layout === 'grid' && 'aspect-[4/3]')}
            aria-label={img.alt || `Photo ${i + 1}`}
          >
            {layout === 'grid' ? (
              <Image src={img.thumb} alt={img.alt} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: img.width && img.height && img.height > img.width * 1.1 ? '50% 22%' : '50% 50%' }} />
            ) : (
              <Image src={img.thumb} alt={img.alt} width={img.width || 800} height={img.height || 600} sizes="(max-width:768px) 50vw, 25vw" className="h-auto w-full transition duration-500 group-hover:scale-105" />
            )}
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-sm text-white opacity-0 transition group-hover:opacity-100">{img.caption}</span>
            )}
          </button>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((i) => ({ src: i.src, alt: i.alt, title: i.caption ?? undefined }))}
        plugins={[Captions, Zoom]}
        styles={{ container: { backgroundColor: 'rgba(11,11,11,.95)' } }}
      />
    </>
  )
}
