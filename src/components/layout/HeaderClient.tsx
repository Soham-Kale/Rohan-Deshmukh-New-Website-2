'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { ChevronDown, Menu, X, Languages, ArrowUpRight } from 'lucide-react'
import { cn, isExternal } from '@/lib/utils'

export type NavNode = { id?: string | null; label: string; url?: string | null; newTab?: boolean | null; children?: NavNode[] | null }

type Props = {
  nav: NavNode[]
  locale: 'mr' | 'en'
  siteName: string
  logoUrl?: string | null
  t: { menu: string; close: string; language: string }
}

const NavLink = ({ node, className, onClick, children }: { node: NavNode; className?: string; onClick?: () => void; children: React.ReactNode }) => {
  if (!node.url) return <span className={className}>{children}</span>
  if (isExternal(node.url) || node.newTab)
    return (
      <a href={node.url} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    )
  return (
    <Link href={node.url} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

export function HeaderClient({ nav, locale, siteName, logoUrl, t }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpen(null)
  }, [pathname])

  // see-through header while it sits over a full-screen hero photo (home page)
  const [overHero, setOverHero] = useState(pathname === '/')
  useEffect(() => {
    setOverHero(Boolean(document.querySelector('[data-hero-overlay]')))
  }, [pathname])
  const transparent = overHero && !scrolled

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
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
          'sticky top-0 z-50 text-white transition-[background,box-shadow,padding] duration-300',
          transparent
            ? 'bg-gradient-to-b from-charcoal-950/60 to-transparent'
            : scrolled
              ? 'bg-charcoal-900/95 shadow-[0_10px_30px_-18px_rgba(14,24,48,.6)] backdrop-blur'
              : 'bg-charcoal-900',
        )}
      >
        <div className={cn('container-x flex items-center gap-2 transition-[height] duration-300 sm:gap-4', scrolled ? 'h-16' : 'h-20')}>
          <Link href="/" className="flex min-w-0 shrink items-center" aria-label={siteName}>
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={190} height={48} priority className={cn('w-auto max-w-full object-contain object-left transition-all', scrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-11')} />
            ) : (
              <span className="font-display text-2xl leading-none">{siteName}</span>
            )}
          </Link>

          <nav aria-label="Main" className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item, i) => {
                const hasKids = Boolean(item.children?.length)
                const isMega = item.children?.some((c) => c.children?.length)
                return (
                  <li key={item.id ?? i} className="relative" onMouseEnter={() => hasKids && enter(i)} onMouseLeave={() => hasKids && leave()}>
                    {hasKids ? (
                      <button
                        type="button"
                        aria-expanded={open === i}
                        onClick={() => setOpen(open === i ? null : i)}
                        className={cn('flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.97rem] font-medium transition-colors hover:bg-white/10', isActive(item) && 'text-saffron-300')}
                      >
                        {item.label}
                        <ChevronDown className={cn('size-4 transition-transform', open === i && 'rotate-180')} />
                      </button>
                    ) : (
                      <NavLink node={item} className={cn('block whitespace-nowrap rounded-full px-2.5 py-2 text-[0.97rem] font-medium transition-colors hover:bg-white/10', isActive(item) && 'text-saffron-300')}>
                        {item.label}
                      </NavLink>
                    )}

                    {hasKids && open === i && (
                      <div
                        className={cn(
                          'animate-fade-up absolute top-full pt-3',
                          isMega ? 'left-1/2 -translate-x-1/2' : 'left-0',
                        )}
                      >
                        <div className={cn('rounded-2xl border border-line bg-white p-3 text-ink shadow-2xl', isMega ? 'grid w-[min(760px,90vw)] grid-cols-3 gap-2 p-5' : 'min-w-64')}>
                          {item.children!.map((c, j) =>
                            isMega ? (
                              <div key={c.id ?? j}>
                                <NavLink node={c} className="mb-2 block font-display text-lg text-charcoal-900 hover:text-saffron-600">
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
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 xl:ml-2">
            <Link
              href={pathname}
              locale={locale === 'mr' ? 'en' : 'mr'}
              className="flex h-10 items-center gap-1.5 rounded-full px-2 text-sm font-semibold hover:bg-white/10 sm:px-3"
              aria-label={t.language}
            >
              <Languages className="hidden size-4 sm:block" />
              <span>{t.language}</span>
            </Link>
            <button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-full bg-white/10 xl:hidden" aria-label={t.menu} aria-expanded={mobileOpen}>
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-[60] overflow-hidden transition-[visibility] xl:hidden', mobileOpen ? 'pointer-events-auto visible delay-0' : 'pointer-events-none invisible delay-300')} aria-hidden={!mobileOpen}>
        <div className={cn('absolute inset-0 bg-charcoal-950/60 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setMobileOpen(false)} />
        <aside
          className={cn(
            'absolute inset-y-0 right-0 flex w-[min(420px,100%)] flex-col bg-charcoal-900 text-white shadow-2xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display text-xl">{siteName}</span>
            <button type="button" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-full bg-white/10" aria-label={t.close}>
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 pb-6" aria-label="Mobile">
            <MobileList nodes={nav} depth={0} expanded={mobileExpanded} setExpanded={setMobileExpanded} onNavigate={() => setMobileOpen(false)} />
          </nav>
        </aside>
      </div>

    </>
  )
}

function MobileList({
  nodes, depth, expanded, setExpanded, onNavigate, prefix = '',
}: {
  nodes: NavNode[]; depth: number; expanded: Record<string, boolean>
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; onNavigate: () => void; prefix?: string
}) {
  return (
    <ul className={cn(depth > 0 && 'ml-3 border-l border-white/10 pl-2')}>
      {nodes.map((n, i) => {
        const key = `${prefix}${i}`
        const kids = n.children?.length
        return (
          <li key={key}>
            <div className="flex items-center">
              <NavLink node={n} onClick={onNavigate} className={cn('flex-1 rounded-lg px-3 py-3', depth === 0 ? 'text-lg font-medium' : 'text-[0.98rem] text-white/85', !n.url && !!kids && 'cursor-pointer')}>
                <span onClick={() => !n.url && kids && setExpanded((e) => ({ ...e, [key]: !e[key] }))}>{n.label}</span>
              </NavLink>
              {kids ? (
                <button type="button" aria-label="Expand" aria-expanded={!!expanded[key]} onClick={() => setExpanded((e) => ({ ...e, [key]: !e[key] }))} className="grid size-11 place-items-center rounded-lg hover:bg-white/10">
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
