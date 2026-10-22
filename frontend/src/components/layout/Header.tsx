import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useLayout } from '@/lib/layout'
import { useTranslations } from '@/lib/i18n'
import { isMedia, mediaUrl } from '@/lib/media'
import { normalizeNav, type NavNode } from '@/lib/nav'
import { cn, isExternal } from '@/lib/utils'

/* Stitch header: refined navigation item styles */
const navItem = 'relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-all duration-200'
const navItemActive = 'bg-gradient-to-r from-saffron-500/15 via-saffron-500/10 to-saffron-600/15 text-saffron-800 font-bold border border-saffron-300/80 shadow-xs'
const navItemInactive = 'text-charcoal-900/90 hover:bg-saffron-500/10 hover:text-saffron-700'

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

/**
 * The site's own name logo (रोहन सुभाष देशमुख) traced as a vector (Oct 2026), so it stays sharp on phone screens; the
 * uploaded file is only 373 px wide and looked soft and faint there. Used while the logo in Site settings is that original file —
 * a different logo uploaded in the admin is shown as uploaded.
 */
const VECTOR_LOGO = '/brand/logo-name.svg'
const ORIGINAL_LOGO = 'logo-light.webp'

/** the logo for light backgrounds (or the white one drawn in navy through a mask) */
function Logo({ siteName, logoUrl, logoDarkUrl, small }: { siteName: string; logoUrl?: string | null; logoDarkUrl?: string | null; small?: boolean }) {
  if (logoDarkUrl) return <img src={logoDarkUrl} alt={siteName} width={190} height={48} fetchPriority="high" className={cn('w-auto shrink-0 object-contain object-left transition-transform duration-300 hover:scale-[1.02]', small ? 'h-8' : 'h-10')} />
  if (logoUrl) return <span role="img" aria-label={siteName} className={cn('block shrink-0 bg-charcoal-950 transition-transform duration-300 hover:scale-[1.02]', small ? 'h-9 w-[134px]' : 'h-11 w-[164px] xl:h-10 xl:w-[148px]')} style={maskStyle(logoUrl)} />
  return <span className="font-display text-xl font-bold text-charcoal-950 transition-colors hover:text-saffron-600">{siteName}</span>
}

/**
 * Site header: a sticky ivory bar with backdrop blur — logo on the left,
 * refined navigation on desktop with glassmorphism dropdowns, and an elegant mobile drawer.
 */
export function Header() {
  const { header, settings } = useLayout()
  const tn = useTranslations('nav')
  const nav = normalizeNav(header.nav as never)
  const siteName = settings.siteName
  const logoUrl = isMedia(settings.logoLight) && settings.logoLight.filename === ORIGINAL_LOGO ? VECTOR_LOGO : mediaUrl(settings.logoLight)
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

  // a new page closes the menus
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
    closeTimer.current = setTimeout(() => setOpen(null), 180)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-saffron-100/80 bg-ivory/95 backdrop-blur-xl transition-all duration-300',
          scrolled ? 'shadow-[0_8px_30px_rgba(14,30,52,0.08)] bg-ivory/98' : 'shadow-[0_2px_15px_rgba(14,30,52,0.04)]',
        )}
      >
        <div className="container-x flex h-16 sm:h-[4.5rem] lg:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex min-h-11 min-w-0 shrink-0 items-center" aria-label={siteName}>
            <Logo siteName={siteName} logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <nav aria-label="Main">
              <ul className="flex items-center gap-1 xl:gap-1.5">
                {nav.map((item, i) => {
                  const hasKids = Boolean(item.children?.length)
                  const isMega = item.children?.some((c) => c.children?.length)
                  const groups = isMega ? item.children!.length : 0
                  const active = isActive(item)
                  return (
                    <li key={item.id ?? i} className="relative" onMouseEnter={() => hasKids && enter(i)} onMouseLeave={() => hasKids && leave()}>
                      {hasKids ? (
                        <button
                          type="button"
                          aria-expanded={open === i}
                          onClick={() => setOpen(open === i ? null : i)}
                          className={cn(navItem, active ? navItemActive : navItemInactive)}
                        >
                          {active && <span className="size-1.5 rounded-full bg-saffron-600 shrink-0" aria-hidden />}
                          <span>{item.label}</span>
                          <ChevronDown className={cn('size-3.5 transition-transform duration-200 opacity-70', open === i && 'rotate-180 opacity-100')} />
                        </button>
                      ) : (
                        <NavLink node={item} className={cn(navItem, active ? navItemActive : navItemInactive)}>
                          {active && <span className="size-1.5 rounded-full bg-saffron-600 shrink-0" aria-hidden />}
                          <span>{item.label}</span>
                        </NavLink>
                      )}

                      <AnimatePresence>
                        {hasKids && open === i && (
                          <m.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.12 } }}
                            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                            className={cn('absolute top-full pt-2', groups > 1 ? 'left-1/2 -translate-x-1/2' : i === nav.length - 1 ? 'right-0' : 'left-0')}
                          >
                            <div
                              className={cn(
                                'rounded-2xl border border-saffron-200/70 bg-white/98 backdrop-blur-2xl p-2.5 shadow-[0_22px_50px_-10px_rgba(14,30,52,0.18)] ring-1 ring-black/5',
                                isMega ? cn('grid gap-2 p-4', groups === 1 ? 'w-72' : groups === 2 ? 'w-[min(520px,90vw)] grid-cols-2' : 'w-[min(760px,90vw)] grid-cols-3') : 'flex w-64 flex-col gap-1',
                              )}
                            >
                              {item.children!.map((c, j) =>
                                isMega ? (
                                  <div key={c.id ?? j}>
                                    <NavLink node={c} className="mb-1 block px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-600">
                                      {c.label}
                                    </NavLink>
                                    <ul className="space-y-0.5">
                                      {c.children?.map((g, k) => (
                                        <li key={g.id ?? k}>
                                          <NavLink
                                            node={g}
                                            className={cn(
                                              'block rounded-xl px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-saffron-50 hover:text-saffron-700 hover:translate-x-1',
                                              isActive(g) && 'bg-saffron-50/90 font-semibold text-saffron-700 border-l-2 border-saffron-500',
                                            )}
                                          >
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
                                    className={cn(
                                      'group flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200',
                                      isActive(c)
                                        ? 'bg-gradient-to-r from-saffron-50 to-orange-50/40 font-semibold text-saffron-700 border-l-2 border-saffron-500 shadow-2xs'
                                        : 'text-gray-700 hover:bg-saffron-50/80 hover:text-saffron-700 hover:translate-x-1',
                                    )}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className={cn('size-1.5 rounded-full transition-colors', isActive(c) ? 'bg-saffron-500' : 'bg-transparent group-hover:bg-saffron-400')} />
                                      {c.label}
                                    </span>
                                    {(isExternal(c.url) || c.newTab) && <ArrowUpRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
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

            {/* Quick Contact CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-saffron-600 to-saffron-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-saffron-600/30 transition-all duration-200 hover:from-saffron-500 hover:to-saffron-600 hover:shadow-md hover:scale-102"
            >
              <span>{tn('contact') || 'Connect'}</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button - Right Aligned */}
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMobileOpen(true)}
            className="ml-auto grid size-11 place-items-center rounded-xl border border-saffron-200/80 bg-white/90 text-charcoal-900 shadow-2xs transition-all hover:border-saffron-300 hover:bg-saffron-50 hover:text-saffron-700 lg:hidden"
            aria-label={tn('menu')}
            aria-expanded={mobileOpen}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* phone & tablet drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] overflow-hidden lg:hidden" role="dialog" aria-modal="true" aria-label={tn('menu')}>
            <m.div
              className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
            <m.aside
              className="absolute inset-y-0 right-0 flex w-[330px] max-w-[88vw] flex-col bg-white shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-saffron-100/90 px-6 py-4 bg-ivory/80">
                <Logo siteName={siteName} logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} small />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid size-9 place-items-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-saffron-100 hover:text-saffron-700"
                  aria-label={tn('close')}
                  autoFocus
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Portal Info Pill */}
              <div className="mx-6 mt-4 rounded-xl border border-saffron-100 bg-gradient-to-br from-saffron-50/70 via-white to-amber-50/30 p-3 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-saffron-600">Official Portal</p>
                <p className="text-xs font-semibold text-charcoal-900">रोहन सुभाष देशमुख | Solapur</p>
              </div>

              {/* Navigation List */}
              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-4" aria-label="Mobile">
                {nav.map((n, i) =>
                  n.children?.length ? (
                    <div key={n.id ?? i} className="rounded-xl border border-stone-100 bg-stone-50/40 p-2">
                      <NavLink node={n} onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-saffron-600">
                        <span>{n.label}</span>
                        <ChevronDown className="size-3.5 opacity-60" />
                      </NavLink>
                      <div className="mt-1 flex flex-col gap-0.5">
                        {n.children.map((c, j) => (
                          <NavLink
                            key={c.id ?? j}
                            node={c}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-2 rounded-lg py-2 pl-4 pr-3 text-[0.92rem] transition-colors',
                              isActive(c)
                                ? 'bg-gradient-to-r from-saffron-50 to-orange-50/40 font-semibold text-saffron-700 border-l-2 border-saffron-500'
                                : 'text-gray-700 hover:bg-saffron-50/80 hover:text-saffron-600',
                            )}
                          >
                            <span className={cn('size-1.5 rounded-full', isActive(c) ? 'bg-saffron-500' : 'bg-stone-300')} />
                            <span>{c.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      key={n.id ?? i}
                      node={n}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[0.95rem] font-semibold transition-all',
                        isActive(n)
                          ? 'bg-gradient-to-r from-saffron-500/15 to-saffron-600/15 text-saffron-800 border border-saffron-300/80 shadow-2xs font-bold'
                          : 'text-charcoal-900 hover:bg-saffron-50 hover:text-saffron-600',
                      )}
                    >
                      {isActive(n) && <span className="size-1.5 rounded-full bg-saffron-600" />}
                      <span>{n.label}</span>
                    </NavLink>
                  ),
                )}
              </nav>

              {/* Drawer Bottom CTA */}
              <div className="border-t border-saffron-100 p-5 bg-ivory/60">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-500 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-saffron-600/25 transition-transform active:scale-98"
                >
                  <span>{tn('contact') || 'Connect / संपर्क साधा'}</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </m.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
