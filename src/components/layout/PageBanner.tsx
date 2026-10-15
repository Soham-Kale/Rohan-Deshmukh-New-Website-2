import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href?: string }
export type BannerTab = { label: string; href: string; active?: boolean }

export async function PageBanner({ title, subtitle, crumbs = [], image, imagePosition, tabs, tabsLabel }: { title: string; subtitle?: string | null; crumbs?: Crumb[]; image?: string | null; imagePosition?: string; tabs?: BannerTab[]; tabsLabel?: string }) {
  const t = await getTranslations('common')
  return (
    <section className="on-dark grain relative overflow-hidden bg-charcoal-900 text-white">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" style={{ objectPosition: imagePosition }} />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/85 to-charcoal-900/40" />
        </>
      )}
      <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full border-[40px] border-saffron-500/10" />
      <div className={cn('container-x relative py-14 md:py-20', !!tabs?.length && 'pb-10 md:pb-12')}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            <li>
              <Link href="/" className="hover:text-saffron-300">{t('home')}</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" />
                {c.href && i < crumbs.length - 1 ? (
                  <Link href={c.href} className="hover:text-saffron-300">{c.label}</Link>
                ) : (
                  <span aria-current={i === crumbs.length - 1 ? 'page' : undefined} className={i === crumbs.length - 1 ? 'text-white' : ''}>{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="animate-fade-up mt-4 max-w-4xl text-4xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/75">{subtitle}</p>}
      </div>
      {/* sibling pages as tabs sitting on the bottom edge of the banner; the active one opens into the page */}
      {!!tabs?.length && (
        <nav aria-label={tabsLabel} className="container-x relative">
          <ul className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
            {tabs.map((tab) => (
              <li key={tab.href} className="shrink-0">
                <Link
                  href={tab.href}
                  aria-current={tab.active ? 'page' : undefined}
                  className={cn(
                    'block rounded-t-2xl px-5 py-3.5 text-[0.95rem] font-medium transition',
                    tab.active ? 'bg-paper font-semibold text-charcoal-900' : 'text-white/75 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  )
}
