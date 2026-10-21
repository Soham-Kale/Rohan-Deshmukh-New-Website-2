import type { ReactNode } from 'react'
import { Link } from 'react-router'
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
 * then the section's sibling pages as a white tab bar (the breadcrumb row was removed, Oct 2026).
 * `light` (articles) leaves the photo out, so long headlines get the full width.
 */
export function PageBanner({
  title, subtitle, image, imagePosition, tabs, tabsLabel, compact, eyebrow, children, path, light, variant,
}: {
  title: string; eyebrow?: string | null; subtitle?: string | null; /** kept so existing pages can still pass it; no longer shown (breadcrumbs removed, Oct 2026) */
  crumbs?: Crumb[]; image?: string | null; imagePosition?: string
  tabs?: BannerTab[]; tabsLabel?: string
  /** article pages: long headline in a smaller size */
  compact?: boolean
  /** extra line under the title (e.g. article byline) */
  children?: ReactNode
  /** page path — picks the section's default photo when the page has none */
  path?: string
  /** no photo: full-width title */
  light?: boolean
  /** Stitch page header (Oct 2026): 'navy' = deep navy band with kesariya & green glows, 'light' = warm ivory band */
  variant?: 'navy' | 'light'
}) {
  const fallback = defaultBanner(path)
  const photo = light ? null : (image ?? fallback.src)
  const position = image ? imagePosition : fallback.position

  if (variant) return <StitchBanner title={title} subtitle={subtitle} eyebrow={eyebrow} tabs={tabs} tabsLabel={tabsLabel} variant={variant} />

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

    </>
  )
}

/**
 * Stitch page header (Oct 2026): the eyebrow, the page title and its subtitle (no breadcrumb — removed Oct 2026) — on deep navy with soft kesariya / green glows ('navy'), or on warm ivory ('light', where the subtitle sits in
 * a card beside the title). The section's sibling pages follow as a row of pills.
 */
function StitchBanner({
  title, subtitle, eyebrow, tabs, tabsLabel, variant,
}: {
  title: string; subtitle?: string | null; eyebrow?: string | null; tabs?: BannerTab[]; tabsLabel?: string; variant: 'navy' | 'light'
}) {
  const navy = variant === 'navy'
  return (
    <>
      <section className={cn('relative isolate w-full overflow-hidden', navy ? 'bg-gradient-to-b from-charcoal-950 via-[#0c1a2e] to-[#10233d] text-white' : 'bg-ivory text-charcoal-950')}>
        <div aria-hidden className={cn('pointer-events-none absolute -top-40 right-0 -z-10 size-[36rem] rounded-full blur-[140px]', navy ? 'bg-saffron-600/20' : 'bg-saffron-500/10')} />
        <div aria-hidden className={cn('pointer-events-none absolute bottom-0 left-10 -z-10 size-[28rem] rounded-full blur-[150px]', navy ? 'bg-leaf-600/15' : 'bg-leaf-600/5')} />
        {navy && <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.035] [background-size:24px_24px]" />}
        <div className={cn('container-x relative', navy ? 'pb-16 pt-10 lg:pb-24 lg:pt-14' : 'pb-14 pt-10 lg:pb-16')}>

          {navy ? (
            <div className="max-w-4xl space-y-5">
              {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-500">{eyebrow}</p>}
              <h1 className="animate-fade-up text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
              {subtitle && <p className="max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">{subtitle}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="flex flex-col gap-4 lg:col-span-8">
                {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-saffron-600">{eyebrow}</p>}
                <h1 className="animate-fade-up text-4xl font-bold leading-tight tracking-tight text-charcoal-950 sm:text-5xl">{title}</h1>
              </div>
              {subtitle && (
                <div className="rounded-xl border-l-4 border-saffron-500 bg-cream p-6 shadow-sm lg:col-span-4">
                  <p className="leading-relaxed text-gray-700">{subtitle}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* the section's pages as pills under the header (the current page in kesariya) */}
      {!!tabs?.length && (
        <nav aria-label={tabsLabel} className="border-b border-saffron-100 bg-white">
          <div className="container-x">
            <ul className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 py-3 md:mx-0 md:px-0">
              {tabs.map((tab) => (
                <li key={tab.href} className="shrink-0">
                  <Link
                    to={tab.href}
                    aria-current={tab.active ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                      tab.active ? 'bg-gradient-to-r from-saffron-600 to-saffron-500 text-white shadow-sm' : 'text-charcoal-900 hover:bg-saffron-50 hover:text-saffron-600',
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
