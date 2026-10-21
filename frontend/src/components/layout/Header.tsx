import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useLayout } from '@/lib/layout'
import { useTranslations } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { normalizeNav, type NavNode } from '@/lib/nav'
import { cn, isExternal } from '@/lib/utils'

/* Stitch header: plain navy items, the current section as a kesariya pill */
const navItem = 'flex items-center gap-1 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors'
const pill = 'bg-gradient-to-r from-saffron-600 to-saffron-500 text-white shadow-sm'

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

/** the logo for light backgrounds (or the white one drawn in navy through a mask) */
function Logo({ siteName, logoUrl, logoDarkUrl, small }: { siteName: string; logoUrl?: string | null; logoDarkUrl?: string | null; small?: boolean }) {
  if (logoDarkUrl) return <img src={logoDarkUrl} alt={siteName} width={190} height={48} fetchPriority="high" className={cn('w-auto shrink-0 object-contain object-left', small ? 'h-8' : 'h-10')} />
  if (logoUrl) return <span role="img" aria-label={siteName} className={cn('block shrink-0 bg-charcoal-950', small ? 'h-8 w-[118px]' : 'h-10 w-[148px]')} style={maskStyle(logoUrl)} />
  return <span className="font-display text-xl font-bold text-charcoal-950">{siteName}</span>
}

/**
 * Site header (Stitch design, Oct 2026): a sticky ivory bar with a soft blur — the logo on the left, the menu on the right
 * (the current section as a kesariya pill, white dropdown cards), and on phones a drawer that lists every page under its section.
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
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

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-saffron-100 bg-ivory/90 backdrop-blur-xl transition-shadow duration-300',
          scrolled ? 'shadow-[0_6px_24px_rgba(14,30,52,0.08)]' : 'shadow-[0_2px_15px_rgba(14,30,52,0.05)]',
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

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item, i) => {
                const hasKids = Boolean(item.children?.length)
                const isMega = item.children?.some((c) => c.children?.length)
                const groups = isMega ? item.children!.length : 0
                const active = isActive(item)
                return (
                  <li key={item.id ?? i} className="relative" onMouseEnter={() => hasKids && enter(i)} onMouseLeave={() => hasKids && leave()}>
                    {hasKids ? (
                      <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className={cn(navItem, active ? pill : 'text-charcoal-900 hover:text-saffron-600')}>
                        {item.label}
                        <ChevronDown className={cn('size-4 transition-transform', open === i && 'rotate-180')} />
                      </button>
                    ) : (
                      <NavLink node={item} className={cn(navItem, active ? cn(pill, 'font-bold') : 'text-charcoal-900 hover:text-saffron-600')}>
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
                          className={cn('absolute top-full pt-2', groups > 1 ? 'left-1/2 -translate-x-1/2' : i === nav.length - 1 ? 'right-0' : 'left-0')}
                        >
                          <div className={cn('rounded-xl border border-saffron-100 bg-white p-2 shadow-xl', isMega ? cn('grid gap-2 p-4', groups === 1 ? 'w-72' : groups === 2 ? 'w-[min(520px,90vw)] grid-cols-2' : 'w-[min(760px,90vw)] grid-cols-3') : 'flex w-60 flex-col gap-1')}>
                            {item.children!.map((c, j) =>
                              isMega ? (
                                <div key={c.id ?? j}>
                                  <NavLink node={c} className="mb-1 block px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-600">
                                    {c.label}
                                  </NavLink>
                                  <ul className="space-y-0.5">
                                    {c.children?.map((g, k) => (
                                      <li key={g.id ?? k}>
                                        <NavLink node={g} className={cn('block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-saffron-50 hover:text-saffron-600', isActive(g) && 'bg-saffron-50 text-saffron-600')}>
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
                                  className={cn('flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-saffron-50 hover:text-saffron-600', isActive(c) && 'bg-saffron-50 font-semibold text-saffron-600')}
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

          <button
            ref={menuButton}
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-11 shrink-0 place-items-center rounded-lg text-charcoal-900 transition-colors hover:bg-saffron-50 hover:text-saffron-600 xl:hidden"
            aria-label={tn('menu')}
            aria-expanded={mobileOpen}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* phone & tablet drawer: every section's pages listed under a small kesariya label */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] overflow-hidden xl:hidden" role="dialog" aria-modal="true" aria-label={tn('menu')}>
            <m.div
              className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
            <m.aside
              className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="mx-6 flex items-center justify-between border-b border-saffron-100 pb-4 pt-6">
                <Logo siteName={siteName} logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} small />
                <button type="button" onClick={() => setMobileOpen(false)} className="grid size-11 place-items-center rounded-lg text-gray-500 hover:bg-saffron-50 hover:text-saffron-600" aria-label={tn('close')} autoFocus>
                  <X className="size-6" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-6 py-4" aria-label="Mobile">
                {nav.map((n, i) =>
                  n.children?.length ? (
                    <div key={n.id ?? i} className="flex flex-col gap-1">
                      <NavLink node={n} onClick={() => setMobileOpen(false)} className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-saffron-600">
                        {n.label}
                      </NavLink>
                      {n.children.map((c, j) => (
                        <NavLink key={c.id ?? j} node={c} onClick={() => setMobileOpen(false)} className={cn('rounded-lg py-2.5 pl-8 pr-4 text-[0.95rem] transition-colors hover:bg-saffron-50 hover:text-saffron-600', isActive(c) ? 'bg-saffron-50 font-semibold text-saffron-600' : 'text-gray-700')}>
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  ) : (
                    <NavLink key={n.id ?? i} node={n} onClick={() => setMobileOpen(false)} className={cn('rounded-lg px-4 py-2.5 text-[0.95rem] font-semibold transition-colors', isActive(n) ? pill : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600')}>
                      {n.label}
                    </NavLink>
                  ),
                )}
              </nav>
            </m.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
