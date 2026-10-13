import Image from 'next/image'
import { ArrowRight, Download, FileText, Quote } from 'lucide-react'
import type { Page } from '@/payload-types'
import { cn, mediaAlt, mediaPosition, mediaSize, mediaUrl, photoFit } from '@/lib/utils'
import { RichText } from '../ui/RichText'
import { CMSLink } from '../ui/CMSLink'
import { Gallery } from '../ui/Gallery'
import { toGallery } from '../ui/toGallery'
import { YouTube } from '../ui/YouTube'
import { FaqAccordion } from '../home/FaqAccordion'

type Block = NonNullable<Page['layout']>[number]

const Heading = ({ eyebrow, heading }: { eyebrow?: string | null; heading?: string | null }) =>
  eyebrow || heading ? (
    <div className="mb-6">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {heading && <h2 className="mt-1 text-2xl text-maroon-900 md:text-3xl">{heading}</h2>}
    </div>
  ) : null

export function PageBlocks({ blocks }: { blocks?: Block[] | null }) {
  if (!blocks?.length) return null
  return (
    <div className="space-y-14 md:space-y-16">
      {blocks.filter((b) => !('hidden' in b && b.hidden)).map((b, i) => (
        <div key={b.id ?? i} id={'heading' in b && b.heading ? `s-${i}` : undefined} className="scroll-mt-28">
          {render(b)}
        </div>
      ))}
    </div>
  )
}

function render(b: Block) {
  switch (b.blockType) {
    case 'content':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <RichText data={b.body} />
        </>
      )
    case 'mediaText': {
      const img = mediaUrl(b.image, 'card')
      return (
        <div className={cn('grid items-start gap-8 md:grid-cols-[0.8fr_1.2fr]', b.imagePosition === 'right' && 'md:grid-cols-[1.2fr_0.8fr]')}>
          {img && (
            /* full photo at its natural shape — never crop faces */
            <div className={cn('overflow-hidden rounded-3xl bg-cream md:sticky md:top-28', b.imagePosition === 'right' && 'md:order-2')}>
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} width={mediaSize(b.image).width} height={mediaSize(b.image).height} sizes="(max-width:768px) 100vw, 35vw" className="h-auto w-full" />
            </div>
          )}
          <div>
            <Heading eyebrow={b.eyebrow} heading={b.heading} />
            <RichText data={b.body} />
            {!!b.buttons?.length && (
              <div className="mt-6 flex flex-wrap gap-3">
                {b.buttons.map((l, i) => (
                  <CMSLink key={l.id} url={l.url} newTab={l.newTab} className={cn('btn', i === 0 ? 'btn-primary' : 'btn-ghost text-maroon-900')}>{l.label}</CMSLink>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
    case 'stats':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {b.items?.map((s) => (
              <div key={s.id} className="rounded-2xl bg-maroon-900 p-5 text-white">
                <p className="font-display text-3xl text-saffron-300 md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </>
      )
    case 'cards':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.intro && <p className="-mt-2 mb-6 text-lg text-muted">{b.intro}</p>}
          <div className={cn('grid gap-5', b.columns === '2' ? 'md:grid-cols-2' : b.columns === '4' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3')}>
            {b.items?.map((c) => {
              const img = mediaUrl(c.image, 'card')
              const inner = (
                <>
                  {img && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                      <Image src={img} alt={mediaAlt(c.image, c.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" style={photoFit(c.image, 1.6)} />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {c.icon && <span className="mb-2 text-2xl" aria-hidden>{c.icon}</span>}
                    <h3 className="text-lg text-maroon-900">{c.title}</h3>
                    {c.meta && <p className="mt-1 text-sm font-semibold text-saffron-700">{c.meta}</p>}
                    {c.text && <p className="mt-2 whitespace-pre-line text-[0.97rem] text-muted">{c.text}</p>}
                    {!!c.tags?.length && (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {c.tags.map((t, i) => <li key={i} className="rounded-full bg-saffron-50 px-2.5 py-1 text-xs font-medium text-saffron-700">{t}</li>)}
                      </ul>
                    )}
                    {c.url && <span className="mt-auto inline-flex items-center gap-1 pt-4 font-semibold text-saffron-700">→</span>}
                  </div>
                </>
              )
              return c.url ? (
                <CMSLink key={c.id} url={c.url} className="card card-hover flex flex-col">{inner}</CMSLink>
              ) : (
                <div key={c.id} className="card flex flex-col">{inner}</div>
              )
            })}
          </div>
        </>
      )
    case 'gallery':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <Gallery images={toGallery(b.images as never, b.heading ?? '')} layout={(b.layout as 'grid' | 'masonry') ?? 'grid'} />
        </>
      )
    case 'faq':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <FaqAccordion items={(b.items ?? []).map((f) => ({ q: f.question, a: <RichText data={f.answer} className="!text-base !text-muted" /> }))} />
        </>
      )
    case 'video':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <YouTube url={b.youtubeUrl} title={b.caption ?? b.heading} />
          {b.caption && <p className="mt-3 text-sm text-muted">{b.caption}</p>}
        </>
      )
    case 'quote':
      return (
        <figure className="relative rounded-3xl bg-maroon-900 p-8 text-white md:p-12">
          <Quote className="size-10 text-saffron-500" />
          <blockquote className="mt-4 font-display text-2xl leading-relaxed md:text-3xl">{b.text}</blockquote>
          {b.author && <figcaption className="mt-6 text-saffron-300">— {b.author}</figcaption>}
        </figure>
      )
    case 'downloads':
      return (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {b.files?.map((f) => {
              const url = typeof f.file === 'object' ? f.file?.url : null
              return (
                <li key={f.id}>
                  <a href={url ?? '#'} download className="card card-hover flex items-center gap-4 p-4">
                    <FileText className="size-8 text-saffron-600" />
                    <span className="flex-1 font-semibold text-maroon-900">{f.label}</span>
                    <Download className="size-5 text-muted" />
                  </a>
                </li>
              )
            })}
          </ul>
        </>
      )
    case 'cta': {
      const img = mediaUrl(b.image, 'card')
      return (
        <div className="grid overflow-hidden rounded-3xl bg-saffron-50 md:grid-cols-[1.3fr_1fr]">
          <div className="p-8 md:p-10">
            {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
            {b.heading && <h2 className="mt-1 text-2xl text-maroon-900 md:text-3xl">{b.heading}</h2>}
            {b.text && <p className="mt-3 whitespace-pre-line text-muted">{b.text}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {b.buttons?.map((l, i) => (
                <CMSLink key={l.id} url={l.url} newTab={l.newTab} className={cn('btn', i === 0 ? 'btn-primary' : 'btn-ghost text-maroon-900')}>
                  {l.label} <ArrowRight className="size-4" />
                </CMSLink>
              ))}
            </div>
          </div>
          {img && (
            <div className="relative min-h-56">
              <Image src={img} alt={mediaAlt(b.image)} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" style={{ objectPosition: mediaPosition(b.image) }} />
            </div>
          )}
        </div>
      )
    }
    default:
      return null
  }
}
