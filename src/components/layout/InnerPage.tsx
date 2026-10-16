import type { Locale } from '@/i18n/routing'
import { getSectionMenu } from '@/lib/section-menu'
import { PageBanner, type Crumb } from './PageBanner'

type Props = {
  path: string
  locale: Locale
  title: string
  subtitle?: string | null
  image?: string | null
  /** object-position for the banner photo (focal point) */
  imagePosition?: string
  crumbs?: Crumb[]
  /** show the section's sibling pages (as tabs on the banner) */
  sideMenu?: boolean
  /** kept for older callers; every page now uses the full content width */
  wide?: boolean
  menuStyle?: 'side' | 'tabs'
  children: React.ReactNode
}

/**
 * Standard inner-page template, identical on every page:
 * banner (breadcrumb, title, sibling pages as tabs) → content on the site grid, starting at the same
 * left edge as the title. Blocks inside decide their own reading width.
 */
export async function InnerPage({ path, locale, title, subtitle, image, imagePosition, crumbs, sideMenu = true, children }: Props) {
  const menu = await getSectionMenu(path, locale)
  const autoCrumbs: Crumb[] = crumbs ?? [...(menu.title && menu.title !== title ? [{ label: menu.title, href: menu.sectionHref }] : []), { label: title }]
  const tabs = sideMenu && menu.items.length > 1 ? menu.items.map((it) => ({ ...it, active: it.href === path })) : undefined
  return (
    <>
      <PageBanner title={title} subtitle={subtitle} crumbs={autoCrumbs} image={image} imagePosition={imagePosition} tabs={tabs} tabsLabel={menu.title ?? undefined} path={path} />
      <div className="container-x pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="min-w-0">{children}</div>
      </div>
    </>
  )
}
