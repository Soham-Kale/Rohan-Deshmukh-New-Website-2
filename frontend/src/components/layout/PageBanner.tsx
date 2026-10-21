import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Img } from '../ui/Img'

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

function defaultBanner(path?: string) {
  const p = path || '/'
  return DEFAULT_BANNERS.find((b) => b.match.test(p))!
}

/**
 * The top of every inner page — one design everywhere (official-site layout):
 * a light band with the page title on the left and a photo on the right that fades into the band,
 * then the section's sibling pages as a white tab bar, then the breadcrumb on its own row.
 * `light` (articles) leaves the photo out, so long headlines get the full width.
 */
export function PageBanner({
  title, subtitle, crumbs = [], image, imagePosition, tabs, tabsLabel, compact, eyebrow, children, path, light,
}: {
  title: string; eyebrow?: string | null; subtitle?: string | null; crumbs?: Crumb[]; image?: string | null; imagePosition?: string
  tabs?: BannerTab[]; tabsLabel?: string
  /** article pages: long headline in a smaller size */
  compact?: boolean
  /** extra line under the title (e.g. article byline) */
  children?: ReactNode
  /** page path — picks the section's default photo when the page has none */
  path?: string
  /** no photo: full-width title */
  light?: boolean
}) {
  const t = useTranslations('common')
  const fallback = defaultBanner(path)
  const photo = light ? null : (image ?? fallback.src)
  const position = image ? imagePosition : fallback.position

  return (
    <>
      <section className="relative isolate overflow-hidden bg-cream text-charcoal-900">
        {photo && (
          <div aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-[46%] md:block">
            <Img src={photo} alt="" fill priority className="object-cover" style={{ objectPosition: position }} sizes="46vw" />
            {/* the photo melts into the band on its left edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/40 to-transparent" />
          </div>
        )}
        <div className={cn('container-x flex flex-col justify-center py-10 md:py-12', photo ? 'min-h-[12rem] md:min-h-[16rem]' : 'min-h-[11rem] md:min-h-[13rem]')}>
          <div className={cn(photo && 'md:max-w-[52%]')}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1
              className={cn(
                'animate-fade-up h-section !mt-1 text-charcoal-900',
                compact ? '!text-[1.75rem] !leading-[1.35] md:!text-[2.4rem]' : '!text-[2rem] md:!text-[2.85rem]',
              )}
            >
              {title}
            </h1>
            {subtitle && <p className="mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-muted md:text-[1.15rem]">{subtitle}</p>}
            {children}
          </div>
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
                    to={tab.href}
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

      {/* breadcrumb on its own row, under the banner */}
      <nav aria-label="Breadcrumb" className="container-x pt-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-[0.92rem] text-muted">
          <li>
            <Link to="/" className="text-charcoal-900 underline underline-offset-4 transition hover:text-saffron-700">{t('home')}</Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={i} className="flex min-w-0 items-center gap-1.5">
              <span aria-hidden className="opacity-60">/</span>
              {c.href && i < crumbs.length - 1 ? (
                <Link to={c.href} className="text-charcoal-900 underline underline-offset-4 transition hover:text-saffron-700">{c.label}</Link>
              ) : (
                <span aria-current={i === crumbs.length - 1 ? 'page' : undefined} className="line-clamp-1">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
