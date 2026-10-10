import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, Camera, Flag, Heart, Info, Leaf, PenLine, Phone, User, Video, Vote, Quote,
} from 'lucide-react'
import type { Home, Initiative, Post, Video as VideoDoc } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { cn, formatDate, mediaAlt, mediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { CMSLink } from '../ui/CMSLink'
import { Section } from '../ui/Section'
import { RichText } from '../ui/RichText'
import { YouTube } from '../ui/YouTube'
import { HeroSlider } from './HeroSlider'
import { FaqAccordion } from './FaqAccordion'
import { Marquee } from './Marquee'
import { InstagramEmbeds } from './InstagramEmbeds'

type Block = NonNullable<Home['sections']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>

const icons = { user: User, heart: Heart, book: BookOpen, camera: Camera, video: Video, vote: Vote, pen: PenLine, phone: Phone, info: Info, flag: Flag, leaf: Leaf, award: Award }

export async function HomeSections({ sections, locale }: { sections: Block[]; locale: Locale }) {
  const visible = sections.filter((s) => !s.hidden)
  return (
    <>
      {visible.map((b, i) => {
        const key = b.id ?? i
        switch (b.blockType) {
          case 'heroSlider': return <Hero key={key} b={b} />
          case 'quickLinks': return <QuickLinksSection key={key} b={b} />
          case 'aboutIntro': return <AboutIntroSection key={key} b={b} />
          case 'biography': return <BiographySection key={key} b={b} />
          case 'featuredVideo': return <FeaturedVideoSection key={key} b={b} />
          case 'workHighlights': return <WorkHighlightsSection key={key} b={b} />
          case 'initiativesShowcase': return <InitiativesSection key={key} b={b} locale={locale} />
          case 'family': return <FamilySection key={key} b={b} />
          case 'homeGallery': return <GallerySection key={key} b={b} />
          case 'homeStats': return <StatsSection key={key} b={b} />
          case 'homeFaq': return <FaqSection key={key} b={b} />
          case 'latestBlog': return <BlogSection key={key} b={b} locale={locale} />
          case 'socialFeeds': return <SocialSection key={key} b={b} locale={locale} />
          case 'appealBand': return <AppealSection key={key} b={b} />
          default: return null
        }
      })}
    </>
  )
}

function Hero({ b }: { b: Of<'heroSlider'> }) {
  const slides = (b.slides ?? [])
    .map((s) => ({ image: mediaUrl(s.image, 'hero') ?? '', alt: mediaAlt(s.image, s.heading ?? ''), heading: s.heading, subheading: s.subheading, buttons: s.buttons ?? [] }))
    .filter((s) => s.image)
  if (!slides.length) return null
  const badge = b.badge?.[0] ? { value: b.badge[0].value, label: b.badge[0].label } : null
  return <HeroSlider slides={slides} autoplay={b.autoplaySeconds ?? 6} badge={badge} thumbs={slides.slice(1, 4).map((s) => s.image)} />
}

function QuickLinksSection({ b }: { b: Of<'quickLinks'> }) {
  if (!b.items?.length) return null
  return (
    <section className="relative z-10 -mt-14 md:-mt-16">
      <div className="container-x">
        <ul className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-35px_rgba(33,17,24,.45)] sm:grid-cols-3 lg:grid-cols-6">
          {b.items.map((it) => {
            const Icon = icons[(it.icon as keyof typeof icons) ?? 'info'] ?? Info
            return (
              <li key={it.id} className="border-b border-r border-line last:border-r-0">
                <CMSLink url={it.url} newTab={it.newTab} className="group flex h-full flex-col items-center gap-3 px-3 py-6 text-center transition hover:bg-saffron-50">
                  <span className="grid size-12 place-items-center rounded-2xl bg-saffron-50 text-saffron-600 transition group-hover:bg-saffron-500 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-[0.98rem] font-semibold leading-snug text-maroon-900">{it.label}</span>
                </CMSLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Stat({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div>
      <p className={cn('font-display text-4xl md:text-5xl', dark ? 'text-saffron-300' : 'text-saffron-600')}>{value}</p>
      <p className={cn('mt-1', dark ? 'text-white/70' : 'text-muted')}>{label}</p>
    </div>
  )
}

function AboutIntroSection({ b }: { b: Of<'aboutIntro'> }) {
  const img = mediaUrl(b.image, 'card')
  return (
    <section className="py-16 md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border-2 border-saffron-300 md:-left-6 md:-top-6" />
          {img && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" />
            </div>
          )}
          {b.stats?.[0] && (
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-maroon-900 px-6 py-4 text-white shadow-xl md:right-[-1.5rem]">
              <p className="font-display text-3xl text-saffron-300">{b.stats[0].value}</p>
              <p className="text-sm text-white/75">{b.stats[0].label}</p>
            </div>
          )}
        </div>
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="mt-6 text-lg text-muted md:text-xl">{b.text}</p>}
          {b.pledge && (
            <blockquote className="relative mt-8 rounded-2xl bg-saffron-50 p-6 pl-14">
              <Quote className="absolute left-5 top-6 size-6 text-saffron-500" />
              <p className="font-display text-xl leading-relaxed text-maroon-900">{b.pledge}</p>
            </blockquote>
          )}
          {(b.stats?.length ?? 0) > 1 && (
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-8">
              {b.stats!.slice(1).map((s) => <Stat key={s.id} value={s.value} label={s.label} />)}
            </div>
          )}
          {b.buttonUrl && (
            <CMSLink url={b.buttonUrl} className="btn btn-dark mt-8">
              {b.buttonLabel} <ArrowRight className="size-4" />
            </CMSLink>
          )}
        </div>
      </div>
    </section>
  )
}

function BiographySection({ b }: { b: Of<'biography'> }) {
  const img = mediaUrl(b.image, 'card')
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.intro && <p className="mt-6 font-display text-2xl leading-relaxed text-maroon-800">“{b.intro}”</p>}
          {img && (
            <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-3xl">
              <Image src={img} alt={mediaAlt(b.image)} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
            </div>
          )}
        </div>
        <ol className="space-y-4 self-center">
          {b.items?.map((it, i) => (
            <li key={it.id}>
              <CMSLink url={it.url} className="card card-hover group flex gap-5 p-6 md:p-7">
                <span className="font-display text-3xl text-saffron-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className="block font-display text-xl text-maroon-900">{it.title}</span>
                  <span className="mt-2 block text-muted">{it.text}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-saffron-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </CMSLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FeaturedVideoSection({ b }: { b: Of<'featuredVideo'> }) {
  return (
    <Section dark eyebrow={b.eyebrow} heading={b.heading} intro={b.text}>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <YouTube url={b.youtubeUrl} title={b.heading} />
        <ul className="grid gap-4">
          {b.links?.map((l) => (
            <li key={l.id}>
              <CMSLink url={l.url} newTab={l.newTab} className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-saffron-300 hover:bg-white/10">
                <span>
                  <span className="block font-display text-xl text-white">{l.label}</span>
                  {l.description && <span className="mt-1 block text-sm text-white/65">{l.description}</span>}
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-saffron-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </CMSLink>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function WorkHighlightsSection({ b }: { b: Of<'workHighlights'> }) {
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading}>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {b.items?.map((it, i) => {
          const img = mediaUrl(it.image, 'card')
          return (
            <CMSLink key={it.id} url={it.url} className={cn('card card-hover group flex flex-col', i === 0 && 'lg:col-span-2 lg:row-span-2')}>
              {img && (
                <div className={cn('relative overflow-hidden bg-cream', i === 0 ? 'aspect-[16/10] lg:aspect-auto lg:flex-1' : 'aspect-[16/10]')}>
                  <Image src={img} alt={mediaAlt(it.image, it.title ?? '')} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6">
                <h3 className={cn('text-maroon-900', i === 0 ? 'text-2xl md:text-3xl' : 'text-xl')}>{it.title}</h3>
                {it.text && <p className="mt-2 line-clamp-3 text-muted">{it.text}</p>}
              </div>
            </CMSLink>
          )
        })}
      </div>
    </Section>
  )
}

async function InitiativesSection({ b, locale }: { b: Of<'initiativesShowcase'>; locale: Locale }) {
  const t = await getTranslations('common')
  const tp = await getTranslations('pages')
  let items = (b.initiatives ?? []).filter((x): x is Initiative => typeof x === 'object')
  if (!items.length) {
    const p = await payload()
    items = (await p.find({ collection: 'initiatives', where: { featured: { equals: true } }, sort: 'order', limit: 4, locale, depth: 1 })).docs
  }
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.intro} className="bg-cream"
      action={<Link href="/social-work" className="btn btn-dark">{tp('allInitiatives')} <ArrowRight className="size-4" /></Link>}>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it) => {
          const img = mediaUrl(it.heroImage, 'card')
          return (
            <Link key={it.id} href={`/social-work/${it.slug}`} className="card card-hover group grid sm:grid-cols-[0.85fr_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream sm:aspect-auto">
                {img && <Image src={img} alt={mediaAlt(it.heroImage, it.title)} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="flex flex-col p-6">
                <h3 className="text-xl text-maroon-900">{it.title}</h3>
                <p className="mt-2 line-clamp-4 text-[0.98rem] text-muted">{it.excerpt}</p>
                {it.counters?.[0] && (
                  <p className="mt-4 text-sm">
                    <span className="font-display text-2xl text-saffron-600">{it.counters[0].value}</span> <span className="text-muted">{it.counters[0].label}</span>
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold text-saffron-700">
                  {t('moreInfo')} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

function FamilySection({ b }: { b: Of<'family'> }) {
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading}>
      <div className="grid gap-6 lg:grid-cols-3">
        {b.members?.map((m) => {
          const img = mediaUrl(m.image, 'card')
          const paras = (m.text ?? '').split(/\n\s*\n/)
          return (
            <article key={m.id} className="card flex flex-col">
              <div className="relative aspect-[4/3] bg-cream">
                {img && <Image src={img} alt={`${m.relation} — ${m.name}`} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover object-top" />}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-saffron-700">{m.relation}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl text-maroon-900">{m.name}</h3>
                <p className="mt-3 text-muted">{paras[0]}</p>
                {paras.length > 1 && (
                  <details className="group mt-3">
                    <summary className="cursor-pointer list-none font-semibold text-saffron-700 marker:hidden">
                      <span className="group-open:hidden">अधिक वाचा / Read more +</span>
                      <span className="hidden group-open:inline">कमी करा −</span>
                    </summary>
                    <div className="mt-3 space-y-3 text-muted">{paras.slice(1).map((p, i) => <p key={i}>{p}</p>)}</div>
                  </details>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

function GallerySection({ b }: { b: Of<'homeGallery'> }) {
  const imgs = (b.images ?? []).map((m) => ({ src: mediaUrl(m, 'card') ?? '', alt: mediaAlt(m, b.heading ?? '') })).filter((i) => i.src)
  return (
    <section className="overflow-hidden py-16 md:py-24">
      <div className="container-x mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
        </div>
        <Link href="/media/photos" className="btn btn-dark self-start">{b.heading} <ArrowRight className="size-4" /></Link>
      </div>
      <Marquee images={imgs} />
    </section>
  )
}

function StatsSection({ b }: { b: Of<'homeStats'> }) {
  const img = mediaUrl(b.image, 'hero')
  return (
    <section className="on-dark grain relative overflow-hidden bg-maroon-900 py-20 text-white md:py-28">
      {img && (
        <>
          <Image src={img} alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 to-maroon-900/70" />
        </>
      )}
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.buttonUrl && (
            <CMSLink url={b.buttonUrl} className="btn btn-light mt-8">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>
          )}
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {b.items?.map((s) => (
            <div key={s.id} className="border-l-2 border-saffron-500 pl-5">
              <Stat value={s.value} label={s.label} dark />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ b }: { b: Of<'homeFaq'> }) {
  return (
    <Section className="bg-cream">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="mt-4 text-lg text-muted">{b.text}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {b.buttons?.map((l, i) => (
              <CMSLink key={l.id} url={l.url} newTab={l.newTab} className={cn('btn', i === 0 ? 'btn-primary' : 'btn-ghost text-maroon-900')}>{l.label}</CMSLink>
            ))}
          </div>
        </div>
        <FaqAccordion items={(b.items ?? []).map((f) => ({ q: f.question, a: <RichText data={f.answer} className="!text-base !text-muted" /> }))} />
      </div>
    </Section>
  )
}

async function BlogSection({ b, locale }: { b: Of<'latestBlog'>; locale: Locale }) {
  const p = await payload()
  const t = await getTranslations('common')
  const posts = (await p.find({ collection: 'posts', limit: b.limit ?? 3, sort: '-publishedAt', locale, depth: 1, where: { _status: { equals: 'published' } } })).docs as Post[]
  if (!posts.length) return null
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} action={<Link href="/blog" className="btn btn-dark">{t('viewAll')} <ArrowRight className="size-4" /></Link>}>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => <PostCard key={post.id} post={post} locale={locale} />)}
      </div>
    </Section>
  )
}

export function PostCard({ post, locale }: { post: Post; locale: string }) {
  const img = mediaUrl(post.coverImage, 'card')
  return (
    <Link href={`/blog/${post.slug}`} className="card card-hover group flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-cream">
        {img && <Image src={img} alt={mediaAlt(post.coverImage, post.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted">{formatDate(post.publishedAt, locale)} · {post.author}</p>
        <h3 className="mt-2 line-clamp-3 text-xl text-maroon-900 group-hover:text-saffron-700">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-[0.98rem] text-muted">{post.excerpt}</p>}
      </div>
    </Link>
  )
}

async function SocialSection({ b, locale }: { b: Of<'socialFeeds'>; locale: Locale }) {
  const p = await payload()
  const settings = await p.findGlobal({ slug: 'site-settings', locale })
  const videos = b.showYoutube ? ((await p.find({ collection: 'videos', limit: 3, sort: '-publishedAt', locale })).docs as VideoDoc[]) : []
  const fb = settings.social?.facebook
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.text} className="bg-cream"
      action={
        <div className="flex flex-wrap gap-3">
          {settings.social?.instagram && <a href={settings.social.instagram} target="_blank" rel="noopener" className="btn btn-dark">Instagram <ArrowUpRight className="size-4" /></a>}
          {fb && <a href={fb} target="_blank" rel="noopener" className="btn btn-ghost text-maroon-900">Facebook <ArrowUpRight className="size-4" /></a>}
        </div>
      }>
      {!!b.instagramPosts?.length && <InstagramEmbeds urls={b.instagramPosts.map((x) => ({ url: x.url, title: x.title ?? '' }))} />}
      <div className={cn('mt-8 grid gap-6', fb && b.showFacebook ? 'lg:grid-cols-[1fr_380px]' : '')}>
        {videos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {videos.slice(0, 2).map((v) => <YouTube key={v.id} url={v.youtubeUrl} title={v.title} />)}
            <Link href="/media/videos" className="btn btn-dark self-start sm:col-span-2 sm:justify-self-start">YouTube <ArrowRight className="size-4" /></Link>
          </div>
        )}
        {fb && b.showFacebook && (
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <iframe
              title="Facebook"
              loading="lazy"
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(fb)}&tabs=timeline&width=380&height=520&small_header=true&hide_cover=false&show_facepile=false`}
              width="100%"
              height="520"
              style={{ border: 0 }}
              allow="encrypted-media"
            />
          </div>
        )}
      </div>
    </Section>
  )
}

function AppealSection({ b }: { b: Of<'appealBand'> }) {
  const img = mediaUrl(b.image, 'hero')
  return (
    <section className="relative isolate overflow-hidden bg-saffron-500 text-white">
      {img && <Image src={img} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25 mix-blend-multiply" />}
      <div className="container-x flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-3xl">
          {b.eyebrow && <p className="font-semibold text-white/85">{b.eyebrow}</p>}
          <h2 className="mt-2 text-3xl md:text-5xl">{b.heading}</h2>
        </div>
        {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn bg-maroon-900 px-7 py-4 text-lg text-white hover:bg-maroon-800">{b.buttonLabel} <ArrowRight className="size-5" /></CMSLink>}
      </div>
    </section>
  )
}
