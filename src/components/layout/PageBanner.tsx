import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href?: string }
export type BannerTab = { label: string; href: string; active?: boolean }

/**
 * Real photos of Rohan among people, used behind the page title when a page has no banner photo of its own.
 * Each section of the site keeps its own photo, so moving between sibling pages never changes the picture.
 */
const DEFAULT_BANNERS: { match: RegExp; src: string; position: string }[] = [
  { match: /^\/about/, src: '/images/portraits/rohan-deshmukh-office.webp', position: '60% 12%' },
  { match: /^\/(political-career|appeal|vision)/, src: '/images/gallery/political/rd-political-26.webp', position: '50% 22%' },
  { match: /^\/(lokmangal|social-work)/, src: '/images/gallery/political/rd-political-12.webp', position: '50% 20%' },
  { match: /^\/(media|events)/, src: '/images/gallery/political/rd-political-03.webp', position: '50% 22%' },
  { match: /.*/, src: '/images/gallery/political/rd-political-04.webp', position: '50% 14%' },
]

export function defaultBanner(path?: string) {
  const p = path || '/'
  return DEFAULT_BANNERS.find((b) => b.match.test(p))!
}

/**
 * The top of every inner page — one design everywhere:
 * a wide photo with the breadcrumb, title and one line of introduction over its left side, then the section's
 * sibling pages in a white bar underneath. Same height, spacing and type on every page, so nothing jumps.
 * `light` (articles) swaps the photo for a warm paper band, so long headlines read like a newspaper.
 */
export async function PageBanner({
  title, subtitle, crumbs = [], image, imagePosition, tabs, tabsLabel, compact, eyebrow, children, path, light,
}: {
  title: string; eyebrow?: string | null; subtitle?: string | null; crumbs?: Crumb[]; image?: string | null; imagePosition?: string
  tabs?: BannerTab[]; tabsLabel?: string
  /** article pages: long headline in a smaller size */
  compact?: boolean
  /** extra line under the title (e.g. article byline) */
  children?: React.ReactNode
  /** page path — picks the section's default photo when the page has none */
  path?: string
  /** no photo: warm paper band with dark text */
  light?: boolean
}) {
  const t = await getTranslations('common')
  const fallback = defaultBanner(path)
  const photo = light ? null : (image ?? fallback.src)
  const position = image ? imagePosition : fallback.position
  const onPhoto = !!photo

  return (
    <>
      <section className={cn('relative isolate overflow-hidden', onPhoto ? 'on-dark bg-charcoal-900 text-white' : 'bg-cream text-charcoal-900')}>
        {photo ? (
          <>
            <Image src={photo} alt="" fill priority sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: position }} />
            {/* neutral ink wash from the left (where the text sits); the right side of the photo stays clear */}
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950/80 via-charcoal-950/45 to-transparent max-md:from-charcoal-950/75 max-md:via-charcoal-950/55 max-md:to-charcoal-950/25" />
          </>
        ) : (
          <div aria-hidden className="absolute -right-24 -top-24 -z-10 size-96 rounded-full border-[40px] border-saffron-500/[0.08]" />
        )}

        <div className={cn('container-x flex flex-col justify-end pb-10 pt-12 md:pb-14 md:pt-16', onPhoto && 'min-h-[17rem] md:min-h-[22rem]')}>
          <nav aria-label="Breadcrumb">
            <ol className={cn('flex flex-wrap items-center gap-1.5 text-[0.95rem]', onPhoto ? 'text-white/80' : 'text-muted')}>
              <li>
                <Link href="/" className={cn('transition', onPhoto ? 'hover:text-saffron-300' : 'hover:text-saffron-700')}>{t('home')}</Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex min-w-0 items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-70" />
                  {c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href} className={cn('transition', onPhoto ? 'hover:text-saffron-300' : 'hover:text-saffron-700')}>{c.label}</Link>
                  ) : (
                    <span aria-current={i === crumbs.length - 1 ? 'page' : undefined} className={cn(i === crumbs.length - 1 && cn('line-clamp-1', onPhoto ? 'text-white' : 'text-charcoal-900'))}>{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {eyebrow && <p className="eyebrow mt-6">{eyebrow}</p>}
          <h1
            className={cn(
              'animate-fade-up max-w-4xl',
              onPhoto ? 'text-white [text-shadow:0_2px_24px_rgb(14_24_48/0.35)]' : 'text-charcoal-900',
              eyebrow ? 'mt-2' : 'mt-4',
              compact ? 'text-[1.9rem] leading-[1.3] md:text-[2.7rem]' : 'text-[2.2rem] leading-[1.18] md:text-[3.2rem]',
            )}
          >
            {title}
          </h1>
          {/* short saffron rule under the title — the site's signature mark */}
          {!compact && <span aria-hidden className="mt-5 block h-[3px] w-14 rounded-full bg-saffron-500" />}
          {subtitle && <p className={cn('mt-4 max-w-2xl text-[1.1rem] leading-relaxed md:text-[1.2rem]', onPhoto ? 'text-white/90' : 'text-muted')}>{subtitle}</p>}
          {children}
        </div>
      </section>

      {/* the section's pages as a clean white bar under the banner (underline marks the current page) */}
      {!!tabs?.length && (
        <nav aria-label={tabsLabel} className="border-b border-line bg-white">
          <div className="container-x">
            <ul className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:gap-2 md:px-0">
              {tabs.map((tab) => (
                <li key={tab.href} className="shrink-0">
                  <Link
                    href={tab.href}
                    aria-current={tab.active ? 'page' : undefined}
                    className={cn(
                      'relative block px-3 py-4 text-[1rem] transition-colors md:px-4',
                      "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:transition-colors after:content-[''] md:after:inset-x-4",
                      tab.active ? 'text-charcoal-900 after:bg-saffron-500' : 'text-muted after:bg-transparent hover:text-charcoal-900 hover:after:bg-line',
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  )
}
