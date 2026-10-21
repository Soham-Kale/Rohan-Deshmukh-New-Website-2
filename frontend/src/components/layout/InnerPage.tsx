import type { ReactNode } from 'react'
import { useLayout } from '@/lib/layout'
import { getSectionMenu } from '@/lib/section-menu'
import { PageBanner, type Crumb } from './PageBanner'

type Props = {
  path: string
  title: string
  subtitle?: string | null
  image?: string | null
  /** object-position for the banner photo (focal point) */
  imagePosition?: string
  crumbs?: Crumb[]
  /** show the section's sibling pages (as tabs on the banner) */
  sideMenu?: boolean
  /** Stitch page header: 'navy' or 'light' (no photo); without it the standard banner */
  variant?: 'navy' | 'light'
  /** small label above the title (Stitch header) */
  eyebrow?: string | null
  children: ReactNode
}

/**
 * Standard inner-page template, identical on every page:
 * banner (breadcrumb, title, sibling pages as tabs) → content on the site grid, starting at the same
 * left edge as the title. Blocks inside decide their own reading width.
 */
export function InnerPage({ path, title, subtitle, image, imagePosition, crumbs, sideMenu = true, variant, eyebrow, children }: Props) {
  const { header } = useLayout()
  const menu = getSectionMenu(path, header)
  const autoCrumbs: Crumb[] = crumbs ?? [...(menu.title && menu.title !== title ? [{ label: menu.title, href: menu.sectionHref }] : []), { label: title }]
  const tabs = sideMenu && menu.items.length > 1 ? menu.items.map((it) => ({ ...it, active: it.href === path })) : undefined
  return (
    <>
      <PageBanner title={title} subtitle={subtitle} crumbs={autoCrumbs} image={image} imagePosition={imagePosition} tabs={tabs} tabsLabel={menu.title ?? undefined} path={path} variant={variant} eyebrow={eyebrow} />
      <div className={variant ? 'container-x pb-20 pt-12 md:pb-28 md:pt-16' : 'container-x pb-20 pt-10 md:pb-24 md:pt-12'}>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  )
}
