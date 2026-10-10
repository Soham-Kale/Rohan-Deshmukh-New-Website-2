import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function SideMenu({ title, items, current }: { title: string; items: { label: string; href: string }[]; current: string }) {
  if (items.length < 2) return null
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="eyebrow mb-3">{title}</p>
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0">
        {items.map((it) => {
          const active = it.href === current
          return (
            <li key={it.href} className="shrink-0">
              <Link
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block rounded-full border px-4 py-2 text-[0.98rem] transition lg:rounded-xl lg:border-0 lg:border-l-4 lg:px-4 lg:py-2.5',
                  active ? 'border-saffron-500 bg-saffron-50 font-semibold text-maroon-900' : 'border-line text-muted hover:bg-cream hover:text-maroon-900 lg:border-transparent',
                )}
              >
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
