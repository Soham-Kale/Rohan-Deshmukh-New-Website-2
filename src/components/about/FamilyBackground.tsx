import Image from 'next/image'
import type { Page } from '@/payload-types'
import { mediaAlt, mediaUrl, photoFit } from '@/lib/utils'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { RichText } from '@/components/ui/RichText'
import { FamilySpotlight, type SpotlightMember } from './FamilySpotlight'

type Block = NonNullable<Page['layout']>[number]
type MediaText = Extract<Block, { blockType: 'mediaText' }>
type Content = Extract<Block, { blockType: 'content' }>

const LABELS = {
  mr: { list: 'कुटुंबातील सदस्य', prev: 'मागील', next: 'पुढील' },
  en: { list: 'Family members', prev: 'Previous', next: 'Next' },
}

/** "Sureshchandra Deshmukh" → "SD"; Marathi names → first letter */
const initials = (name: string) => {
  const words = name.replace(/^(कै\.|मा\.|श्री\.|Late|Hon\.|Shri\.?)\s*/g, '').split(/[\s,]+/).filter(Boolean)
  return /[ऀ-ॿ]/.test(name) ? (words[0]?.[0] ?? '') : words.slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

/**
 * कौटुंबिक पार्श्वभूमी page in the "spotlight" layout: the family introduction beside its heading,
 * then the family members (the page's consecutive Media + text blocks, edited under Pages in the admin)
 * as chips with one large story card. Blocks before/after (e.g. the closing call to action) render as usual.
 */
export function FamilyBackground({ blocks, locale }: { blocks?: Block[] | null; locale: 'mr' | 'en' }) {
  const list = (blocks ?? []).filter((b) => !('hidden' in b && b.hidden))
  const start = list.findIndex((b) => b.blockType === 'mediaText')
  let end = start
  while (end >= 0 && list[end]?.blockType === 'mediaText') end++
  if (start < 0) return <PageBlocks blocks={list} />

  const members = list.slice(start, end) as MediaText[]
  const introIdx = start > 0 && list[start - 1].blockType === 'content' ? start - 1 : -1
  const intro = introIdx >= 0 ? (list[introIdx] as Content) : null
  const before = list.slice(0, introIdx >= 0 ? introIdx : start)
  const after = list.slice(end)

  const chips: SpotlightMember[] = members.map((m, i) => {
    const name = m.heading ?? ''
    return { key: m.id ?? String(i), name: name.split(',')[0], title: name, relation: m.eyebrow ?? '', thumb: mediaUrl(m.image, 'thumb'), initials: initials(name) }
  })
  const panels = members.map((m) => {
    const img = mediaUrl(m.image, 'card')
    return {
      media: img ? (
        /* photo on a soft cream backdrop; shown whole when its shape is far from the frame (faces never cropped) */
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-cream">
          <Image src={img} alt={mediaAlt(m.image, m.heading ?? '')} fill sizes="(max-width:768px) 92vw, 360px" className="h-full w-full" style={photoFit(m.image, 0.8, 0.3)} />
        </div>
      ) : null,
      body: <RichText data={m.body} />,
    }
  })

  return (
    <div className="space-y-14 md:space-y-16">
      {before.length > 0 && <PageBlocks blocks={before} />}

      <section>
        {intro && (
          <div className="mb-9 grid gap-4 md:mb-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-10">
            <div>
              {intro.eyebrow && <p className="eyebrow">{intro.eyebrow}</p>}
              {intro.heading && <h2 className="mt-1 text-2xl text-charcoal-900 md:text-3xl">{intro.heading}</h2>}
            </div>
            <RichText data={intro.body} />
          </div>
        )}
        <FamilySpotlight members={chips} panels={panels} labels={LABELS[locale] ?? LABELS.mr} />
      </section>

      {after.length > 0 && <PageBlocks blocks={after} />}
    </div>
  )
}
