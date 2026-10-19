import Image from 'next/image'
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, Radio, Sparkles, Tag, TrendingUp } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Category, Post } from '@/payload-types'
import { longDate, primaryCategory, readTimeLabel } from '@/lib/blog'
import { cn, formatDate, mediaAlt, mediaUrl, photoFit, toMarathiDigits } from '@/lib/utils'

/* ---------- small pieces ---------- */

export function SectionTitle({ children, aside, className }: { children: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      {/* same heading as every other section: navy title with a short saffron bar under it */}
      <h2 className="h-section !mt-0 !text-[1.6rem] md:!text-[2rem]">{children}</h2>
      {aside}
    </div>
  )
}

export function CategoryChip({ cat, dark }: { cat: Category | null; dark?: boolean }) {
  if (!cat) return null
  return (
    <Link
      href={`/blog?category=${cat.slug}`}
      className={cn(
        'relative z-10 inline-flex transition',
        dark ? 'rounded-full bg-white/90 px-2.5 py-0.5 text-xs text-charcoal-900 hover:bg-white' : 'text-[0.85rem] text-saffron-700 hover:text-charcoal-900',
      )}
    >
      {cat.title}
    </Link>
  )
}

export function PostMeta({ post, locale, className, withCategory = true }: { post: Post; locale: string; className?: string; withCategory?: boolean }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] text-muted', className)}>
      {withCategory && <CategoryChip cat={primaryCategory(post)} />}
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5 text-saffron-600" />
        <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt, locale)}</time>
      </span>
      <span aria-hidden className="size-1 rounded-full bg-line" />
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" />
        {readTimeLabel(post, locale)}
      </span>
    </div>
  )
}

/* ---------- masthead: newspaper date line + ticker ---------- */

export function BlogMasthead({ posts, locale, edition, breaking }: { posts: Post[]; locale: string; edition: string; breaking: string }) {
  const today = longDate(new Date(), locale)
  const items = posts.slice(0, 6)
  return (
    <div className="border-b border-line bg-white">
      <div className="container-x flex flex-col gap-2 py-2.5 text-[0.82rem] md:flex-row md:items-center md:gap-6">
        <p className="flex shrink-0 items-center gap-2 text-muted">
          <CalendarDays className="size-4 text-saffron-600" />
          <span className="font-medium text-charcoal-800">{today}</span>
          <span aria-hidden className="size-1 rounded-full bg-line" />
          <span className="hidden sm:inline">{edition}</span>
        </p>
        {items.length > 0 && (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
              <Radio className="size-3.5" /> {breaking}:
            </span>
            <div className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
              <div className="flex w-max animate-[ticker_40s_linear_infinite] gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                {[...items, ...items].map((p, i) => (
                  <Link key={i} href={`/blog/${p.slug}`} aria-hidden={i >= items.length} tabIndex={i >= items.length ? -1 : undefined} className="whitespace-nowrap font-medium text-charcoal-900 hover:text-saffron-700">
                    {p.title}
                  </Link>
                ))}
              </div>
              <style>{`@keyframes ticker{to{transform:translateX(-50%)}}`}</style>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- lead story (big photo with headline on it) ---------- */

export function LeadStory({ post, locale, badge, readFull }: { post: Post; locale: string; badge: string; readFull: string }) {
  const img = mediaUrl(post.coverImage, 'hero') ?? mediaUrl(post.coverImage, 'card')
  const cat = primaryCategory(post)
  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-charcoal-900 sm:aspect-[16/10]">
        {img && (
          <Image src={img} alt={mediaAlt(post.coverImage, post.title)} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" style={photoFit(post.coverImage, 1.6, 0.6)} />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-900/25 to-transparent" />
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-saffron-600 px-3 py-1 text-xs font-semibold text-white">
          <Sparkles className="size-3.5" /> {badge}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <CategoryChip cat={cat} dark />
          <h3 className="mt-3 line-clamp-3 text-2xl leading-snug text-white md:text-[2rem]">
            <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
          </h3>
        </div>
      </div>
      {post.excerpt && <p className="mt-6 line-clamp-3 text-[1.05rem] leading-relaxed text-ink">{post.excerpt}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <PostMeta post={post} locale={locale} withCategory={false} />
        <Link href={`/blog/${post.slug}`} className="more-link text-sm">
          {readFull} <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}

export function LatestList({ posts, locale, title, footer }: { posts: Post[]; locale: string; title: string; footer?: string }) {
  return (
    <aside className="flex flex-col">
      <h3 className="flex items-center gap-2.5 border-b-2 border-charcoal-900 pb-3 text-lg text-charcoal-900">
        <span aria-hidden className="h-0.5 w-6 shrink-0 rounded-full bg-saffron-500" /> {title}
      </h3>
      <ul className="divide-y divide-line">
        {posts.map((p) => {
          const img = mediaUrl(p.coverImage, 'thumb') ?? mediaUrl(p.coverImage, 'card')
          const cat = primaryCategory(p)
          return (
            <li key={p.id} className="group relative grid grid-cols-[1fr_5.5rem] gap-4 py-5">
              <div className="min-w-0">
                {cat && <p className="text-[0.75rem] font-semibold text-saffron-700">{cat.title}</p>}
                <h4 className="mt-0.5 line-clamp-2 text-[1rem] font-semibold leading-snug text-charcoal-900 transition group-hover:text-saffron-700">
                  <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0">{p.title}</Link>
                </h4>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted"><CalendarDays className="size-3.5" />{formatDate(p.publishedAt, locale)}</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream">
                {img && <Image src={img} alt="" fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(p.coverImage, 4 / 3, 0.6)} />}
              </div>
            </li>
          )
        })}
      </ul>
      {footer && <p className="mt-auto border-t border-line pt-3 text-center text-xs text-muted">{footer}</p>}
    </aside>
  )
}

export function BlogRow({ post, locale, readMore, share }: { post: Post; locale: string; readMore: string; share?: React.ReactNode }) {
  const img = mediaUrl(post.coverImage, 'card')
  return (
    <article className="group relative grid grid-cols-[1fr_6.5rem] gap-4 py-6 sm:grid-cols-[1fr_13rem] sm:gap-6 md:py-7">
      <div className="min-w-0">
        <PostMeta post={post} locale={locale} />
        <h3 className="mt-2.5 line-clamp-2 text-lg leading-snug text-charcoal-900 group-hover:text-saffron-700 sm:text-xl md:text-[1.4rem]">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-muted sm:line-clamp-3">{post.excerpt}</p>}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-700">
            {readMore} <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          {share && <div className="relative z-10">{share}</div>}
        </div>
      </div>
      <div className="relative aspect-square self-start overflow-hidden rounded-xl bg-cream sm:aspect-[16/10]">
        {img && <Image src={img} alt={mediaAlt(post.coverImage, post.title)} fill sizes="(max-width:640px) 110px, 220px" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(post.coverImage, 1.6, 0.6)} />}
      </div>
    </article>
  )
}

/* ---------- sidebar: topics + numbered recent list ---------- */

export function TopicsCard({ cats, active, title, allLabel }: { cats: Category[]; active?: string; title: string; allLabel: string }) {
  const items = [{ slug: '', title: allLabel }, ...cats.map((c) => ({ slug: c.slug, title: c.title }))]
  return (
    <section>
      <h3 className="flex items-center gap-2.5 border-b-2 border-charcoal-900 pb-3 text-lg text-charcoal-900"><Tag className="size-5 text-saffron-600" /> {title}</h3>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((c) => {
          const on = (active ?? '') === c.slug
          return (
            <Link key={c.slug || 'all'} href={c.slug ? `/blog?category=${c.slug}` : '/blog'} aria-current={on ? 'true' : undefined}
              className={cn('inline-flex min-h-10 items-center rounded-xl px-3.5 py-1.5 text-sm font-medium transition', on ? 'bg-btn text-white' : 'bg-white text-charcoal-800 hover:bg-btn hover:text-white')}>
              {c.title}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function RecentList({ posts, locale, title }: { posts: Post[]; locale: string; title: string }) {
  return (
    <section>
      <h3 className="flex items-center gap-2.5 border-b-2 border-charcoal-900 pb-3 text-lg text-charcoal-900"><TrendingUp className="size-5 text-saffron-600" /> {title}</h3>
      <ol className="divide-y divide-line">
        {posts.map((p, i) => (
          <li key={p.id} className="group relative flex gap-4 py-4">
            <span className="font-display text-xl leading-none text-saffron-500">
              {locale === 'mr' ? toMarathiDigits(i + 1) : i + 1}
            </span>
            <div className="min-w-0">
              <h4 className="line-clamp-2 text-[0.97rem] font-semibold leading-snug text-charcoal-900 transition group-hover:text-saffron-700">
                <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0">{p.title}</Link>
              </h4>
              <p className="mt-1 text-xs text-muted">{primaryCategory(p)?.title ? `${primaryCategory(p)!.title} • ` : ''}{formatDate(p.publishedAt, locale)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function NewsCard({ post, locale }: { post: Post; locale: string }) {
  const img = mediaUrl(post.coverImage, 'card')
  return (
    <article className="tile group">
      <div className="tile-media aspect-[16/10]">
        {img && <Image src={img} alt={mediaAlt(post.coverImage, post.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" style={photoFit(post.coverImage, 1.6, 0.6)} />}
        <span className="absolute left-3 top-3 z-10"><CategoryChip cat={primaryCategory(post)} dark /></span>
      </div>
      <div className="tile-body">
        <h3 className="tile-title line-clamp-2 text-lg">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h3>
        {post.excerpt && <p className="tile-text line-clamp-3 text-[0.95rem]">{post.excerpt}</p>}
        <PostMeta post={post} locale={locale} withCategory={false} className="mt-auto pt-4 [&>span[aria-hidden]]:hidden" />
      </div>
    </article>
  )
}

