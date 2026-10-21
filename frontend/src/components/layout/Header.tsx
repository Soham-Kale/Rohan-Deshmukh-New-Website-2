import { useEffect, useRef, useState, useSyncExternalStore, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useLayout } from '@/lib/layout'
import { useTranslations } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { normalizeNav, type NavNode } from '@/lib/nav'
import { cn, isExternal } from '@/lib/utils'

/* top-level menu item: plain text, with a short saffron underline under the active section */
const navItem =
  "relative flex items-center gap-1 whitespace-nowrap px-3 py-2 text-[1.02rem] text-charcoal-900 transition-colors after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-transparent after:content-['']"

const NavLink = ({ node, className, onClick, children }: { node: NavNode; className?: string; onClick?: () => void; children: ReactNode }) => {
  if (!node.url) return <span className={className}>{children}</span>
  if (isExternal(node.url) || node.newTab)
    return (
      <a href={node.url} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    )
  return (
    <Link to={node.url} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

/** The home page's full-screen photo carries data-hero-overlay: the header watches the page for it */
const pageHasHero = () => Boolean(document.querySelector('[data-hero-overlay]'))
const watchPage = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => observer.disconnect()
}

const maskStyle = (logoUrl: string) => ({
  maskImage: `url(${logoUrl})`,
  WebkitMaskImage: `url(${logoUrl})`,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'left center',
  WebkitMaskPosition: 'left center',
})

/**
 * Site header, identical on every page (official-site layout): one sticky white bar —
 * logo on the left and the menu (the "Get in touch" button was removed in Oct 2026; Contact stays in the menu).
 * On the home page, on phones and tablets, it is see-through while it sits over the full-screen photo.
 */
export function Header() {
  const { header, settings } = useLayout()
  const tn = useTranslations('nav')
  const nav = normalizeNav(header.nav as never)
  const siteName = settings.siteName
  const logoUrl = mediaUrl(settings.logoLight)
  const logoDarkUrl = mediaUrl(settings.logoDark)

  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // a new page closes the menus (reset while rendering the new page, so there is no extra render pass)
  const [menusFor, setMenusFor] = useState(pathname)
  if (menusFor !== pathname) {
    setMenusFor(pathname)
    setMobileOpen(false)
    setOpen(null)
  }

  // solid white header on every page; only on the home page on phones/tablets it is see-through while it sits over
  // the full-screen photo (until the visitor scrolls). Done with max-lg: classes, so there is no flash on load.
  const overHero = useSyncExternalStore(watchPage, pageHasHero, () => false)
  const heroTop = overHero && !scrolled

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isActive = (n: NavNode): boolean =>
    Boolean((n.url && n.url !== '/' && pathname.startsWith(n.url)) || (n.url === '/' && pathname === '/') || n.children?.some(isActive))

  const enter = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(i)
  }
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160)
  }

  const activeClass = 'text-saffron-700 after:bg-saffron-500'

  return (
    <>
      <header
        className={cn(
          'group/h sticky top-0 z-50 transition-[background-color,box-shadow,color] duration-300',
          heroTop
            ? 'text-charcoal-900 max-lg:bg-transparent max-lg:text-white lg:bg-white lg:shadow-[0_1px_0_var(--color-line)]'
            : cn('bg-white text-charcoal-900', scrolled ? 'shadow-[0_8px_24px_-16px_rgba(20,33,61,.28)]' : 'shadow-[0_1px_0_var(--color-line)]'),
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center gap-2 sm:gap-4 lg:h-20">
          <Link to="/" className="flex min-h-11 min-w-0 shrink items-center" aria-label={siteName}>
            {heroTop && logoUrl && (
              /* white logo over the photo (phones/tablets) */
              <img src={logoUrl} alt={siteName} width={190} height={48} fetchPriority="high" className="h-9 w-auto max-w-full object-contain object-left sm:h-10 lg:hidden" />
            )}
            {logoDarkUrl ? (
              <img src={logoDarkUrl} alt={siteName} width={190} height={48} fetchPriority="high" className={cn('h-9 w-auto max-w-full object-contain object-left sm:h-10', heroTop && logoUrl && 'max-lg:hidden')} />
            ) : logoUrl ? (
              /* the white logo drawn in ink through a mask (upload a "logo for light backgrounds" to replace it) */
              <span role="img" aria-label={siteName} className={cn('block h-9 w-[133px] bg-charcoal-900 sm:h-10 sm:w-[148px]', heroTop && 'max-lg:hidden')} style={maskStyle(logoUrl)} />
            ) : (
              <span className="font-display text-2xl leading-none">{siteName}</span>
            )}
          </Link>

          {/* menu sits at the right end; -mr-3 lines the last item's text up with the page content's right edge */}
          <nav aria-label="Main" className="-mr-3 ml-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item, i) => {
                const hasKids = Boolean(item.children?.length)
                const isMega = item.children?.some((c) => c.children?.length)
                // one group (e.g. लोकमंगल → लोकमंगल फाऊंडेशन) = narrow column; several groups = wide mega menu
                const groups = isMega ? item.children!.length : 0
                return (
                  <li key={item.id ?? i} className="relative" onMouseEnter={() => hasKids && enter(i)} onMouseLeave={() => hasKids && leave()}>
                    {hasKids ? (
                      <button
                        type="button"
                        aria-expanded={open === i}
                        onClick={() => setOpen(open === i ? null : i)}
                        className={cn(navItem, 'hover:text-saffron-700', isActive(item) && activeClass)}
                      >
                        {item.label}
                        <ChevronDown className={cn('size-4 transition-transform', open === i && 'rotate-180')} />
                      </button>
                    ) : (
                      <NavLink node={item} className={cn(navItem, 'hover:text-saffron-700', isActive(item) && activeClass)}>
                        {item.label}
                      </NavLink>
                    )}

                    <AnimatePresence>
                      {hasKids && open === i && (
                        <m.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
                          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
                          className={cn('absolute top-full pt-3', groups > 1 ? 'left-1/2 -translate-x-1/2' : i === nav.length - 1 ? 'right-0' : 'left-0')}
                        >
                          <div className={cn('rounded-2xl bg-white p-3 text-ink shadow-[0_24px_60px_-24px_rgba(20,33,61,.35)] ring-1 ring-charcoal-900/[0.06]', isMega ? cn('grid gap-2 p-5', groups === 1 ? 'w-72' : groups === 2 ? 'w-[min(520px,90vw)] grid-cols-2' : 'w-[min(760px,90vw)] grid-cols-3') : 'min-w-64')}>
                            {item.children!.map((c, j) =>
                              isMega ? (
                                <div key={c.id ?? j}>
                                  <NavLink node={c} className="mb-2 block font-display text-lg text-charcoal-900 hover:text-saffron-700">
                                    {c.label}
                                  </NavLink>
                                  <ul className="space-y-0.5">
                                    {c.children?.map((g, k) => (
                                      <li key={g.id ?? k}>
                                        <NavLink node={g} className="block rounded-lg px-2 py-1.5 text-[0.95rem] text-muted hover:bg-saffron-50 hover:text-charcoal-900">
                                          {g.label}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <NavLink
                                  key={c.id ?? j}
                                  node={c}
                                  className={cn('flex items-center justify-between gap-6 rounded-xl px-3 py-2.5 text-[0.98rem] hover:bg-saffron-50 hover:text-charcoal-900', isActive(c) && 'bg-saffron-50 text-saffron-700')}
                                >
                                  {c.label}
                                  {(isExternal(c.url) || c.newTab) && <ArrowUpRight className="size-4 opacity-50" />}
                                </NavLink>
                              ),
                            )}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 xl:ml-0 xl:hidden">
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn('grid size-11 place-items-center rounded-full xl:hidden', heroTop ? 'bg-cream text-charcoal-900 max-lg:bg-white/15 max-lg:text-white' : 'bg-cream text-charcoal-900')}
              aria-label={tn('menu')}
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] overflow-hidden xl:hidden" role="dialog" aria-modal="true" aria-label={tn('menu')}>
            <m.div
              className="absolute inset-0 bg-charcoal-950/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
            <m.aside
              className="absolute inset-y-0 right-0 flex w-[min(420px,100%)] flex-col bg-white text-charcoal-900 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
                {logoUrl && !logoDarkUrl ? (
                  <span role="img" aria-label={siteName} className="block h-9 w-[133px] bg-charcoal-900" style={maskStyle(logoUrl)} />
                ) : (
                  <span className="font-display text-xl text-charcoal-900">{siteName}</span>
                )}
                <button type="button" onClick={() => setMobileOpen(false)} className="grid size-11 place-items-center rounded-full bg-cream" aria-label={tn('close')} autoFocus>
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 pb-6 pt-2" aria-label="Mobile">
                <MobileList nodes={nav} depth={0} expanded={mobileExpanded} setExpanded={setMobileExpanded} onNavigate={() => setMobileOpen(false)} />
              </nav>
            </m.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function MobileList({
  nodes, depth, expanded, setExpanded, onNavigate, prefix = '',
}: {
  nodes: NavNode[]; depth: number; expanded: Record<string, boolean>
  setExpanded: Dispatch<SetStateAction<Record<string, boolean>>>; onNavigate: () => void; prefix?: string
}) {
  return (
    <ul className={cn(depth > 0 ? 'mb-2 ml-3 border-l-2 border-saffron-200 pl-2' : 'divide-y divide-line')}>
      {nodes.map((n, i) => {
        const key = `${prefix}${i}`
        const kids = n.children?.length
        return (
          <li key={key}>
            <div className="flex items-center">
              <NavLink node={n} onClick={onNavigate} className={cn('flex-1 rounded-lg px-3 py-3', depth === 0 ? 'text-[1.15rem] text-charcoal-900' : 'py-2.5 text-[1.02rem] text-muted hover:text-saffron-700', !n.url && !!kids && 'cursor-pointer')}>
                <span onClick={() => !n.url && kids && setExpanded((e) => ({ ...e, [key]: !e[key] }))}>{n.label}</span>
              </NavLink>
              {kids ? (
                <button type="button" aria-label="Expand" aria-expanded={!!expanded[key]} onClick={() => setExpanded((e) => ({ ...e, [key]: !e[key] }))} className="grid size-11 place-items-center rounded-lg text-muted hover:bg-cream">
                  <ChevronDown className={cn('size-5 transition-transform', expanded[key] && 'rotate-180')} />
                </button>
              ) : null}
            </div>
            {kids && expanded[key] ? (
              <MobileList nodes={n.children!} depth={depth + 1} expanded={expanded} setExpanded={setExpanded} onNavigate={onNavigate} prefix={`${key}-`} />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
