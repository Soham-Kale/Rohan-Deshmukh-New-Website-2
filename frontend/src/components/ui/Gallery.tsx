import { lazy, Suspense, useState } from 'react'
import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/lib/media'
import { Img } from './Img'

const Lightbox = lazy(() => import('./Lightbox'))

/** A grid or masonry of photos; a click opens the full-size photo in a lightbox with zoom and captions */
export function Gallery({ images, layout = 'grid', wide = false, className }: { images: GalleryImage[]; layout?: 'grid' | 'masonry'; wide?: boolean; className?: string }) {
  const [index, setIndex] = useState(-1)
  if (!images.length) return null
  return (
    <>
      <div className={cn(layout === 'masonry' ? (wide ? 'columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5 [&>*]:mb-3' : 'columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3') : 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4', className)}>
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn('group relative block w-full overflow-hidden rounded-2xl bg-cream', layout === 'grid' && 'aspect-[4/3]')}
            aria-label={img.alt || `Photo ${i + 1}`}
          >
            {layout === 'grid' ? (
              <Img
                media={img.media}
                src={img.media ? undefined : img.thumb}
                variant="card"
                alt={img.alt}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                style={{ objectPosition: img.width && img.height && img.height > img.width * 1.1 ? '50% 22%' : '50% 50%' }}
              />
            ) : (
              <Img
                media={img.media}
                src={img.media ? undefined : img.thumb}
                variant="card"
                alt={img.alt}
                width={img.width || 800}
                height={img.height || 600}
                sizes="(max-width:768px) 50vw, 25vw"
                className="h-auto w-full transition duration-500 group-hover:scale-105"
              />
            )}
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-950/75 to-transparent p-3 text-left text-sm text-white opacity-0 transition group-hover:opacity-100">{img.caption}</span>
            )}
          </button>
        ))}
      </div>
      {index >= 0 && (
        <Suspense fallback={null}>
          <Lightbox slides={images.map((i) => ({ src: i.src, alt: i.alt, title: i.caption ?? undefined }))} index={index} onClose={() => setIndex(-1)} />
        </Suspense>
      )}
    </>
  )
}
