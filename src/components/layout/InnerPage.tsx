import type { Locale } from '@/i18n/routing'
import { getSectionMenu } from '@/lib/section-menu'
import { PageBanner, type Crumb } from './PageBanner'
import { SideMenu } from './SideMenu'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'

type Props = {
  path: string
  locale: Locale
  title: string
  subtitle?: string | null
  image?: string | null
  /** object-position for the banner photo (focal point) */
  imagePosition?: string
  crumbs?: Crumb[]
  sideMenu?: boolean
  wide?: boolean
  /** 'tabs': sibling pages as tabs on the banner instead of the side menu */
  menuStyle?: 'side' | 'tabs'
  children: React.ReactNode
}

/** Standard inner-page template: banner with breadcrumb + optional sibling side menu */
export async function InnerPage({ path, locale, title, subtitle, image, imagePosition, crumbs, sideMenu = true, wide, menuStyle = 'side', children }: Props) {
  const menu = await getSectionMenu(path, locale)
  const t = await getTranslations('common')
  const autoCrumbs: Crumb[] = crumbs ?? [...(menu.title && menu.title !== title ? [{ label: menu.title, href: menu.sectionHref }] : []), { label: title }]
  const tabs = menuStyle === 'tabs' && menu.items.length > 1 ? menu.items.map((it) => ({ ...it, active: it.href === path })) : undefined
  const showMenu = !tabs && sideMenu && menu.items.length > 1
  return (
    <>
      <PageBanner title={title} subtitle={subtitle} crumbs={autoCrumbs} image={image} imagePosition={imagePosition} tabs={tabs} tabsLabel={menu.title ?? undefined} />
      <div className={cn('container-x py-12 md:py-16', tabs && 'pt-10 md:pt-14', showMenu && 'grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14')}>
        {showMenu && <SideMenu title={menu.title ?? t('inThisSection')} items={menu.items} current={path} />}
        <div className={cn('min-w-0', !showMenu && !wide && !tabs && 'mx-auto max-w-4xl')}>{children}</div>
      </div>
    </>
  )
}
