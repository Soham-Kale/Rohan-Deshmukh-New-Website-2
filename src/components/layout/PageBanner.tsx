import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export type Crumb = { label: string; href?: string }

export async function PageBanner({ title, subtitle, crumbs = [], image, imagePosition }: { title: string; subtitle?: string | null; crumbs?: Crumb[]; image?: string | null; imagePosition?: string }) {
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
      <div className="container-x relative py-14 md:py-20">
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
    </section>
  )
}
