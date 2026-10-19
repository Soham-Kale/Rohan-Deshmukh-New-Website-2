import 'server-only'
import { getGlobal } from './cms'
import type { Locale } from '@/i18n/routing'
import { isExternal } from './utils'
import { normalizeNav } from './nav'

type Node = { label: string; url?: string | null; children?: Node[] | null }

/**
 * Side menu = siblings of the current page in the header mega-menu.
 * Returns the parent label (used as breadcrumb/section title) and the sibling links.
 */
export async function getSectionMenu(path: string, locale: Locale) {
  const header = await getGlobal('header', locale)
  const nav = normalizeNav(header.nav as never) as Node[]
  const walk = (nodes: Node[], parent: Node | null): { parent: Node | null; siblings: Node[] } | null => {
    // Prefer the deepest match (a section parent often links to its first child page)
    for (const n of nodes) {
      if (n.children?.length) {
        const r = walk(n.children, n)
        if (r) return r
      }
    }
    for (const n of nodes) if (n.url === path) return { parent, siblings: nodes }
    return null
  }
  const found = walk(nav, null)
  if (!found?.parent) return { title: null as string | null, sectionHref: undefined as string | undefined, items: [] as { label: string; href: string }[] }
  return {
    title: found.parent.label,
    sectionHref: found.parent.url ?? undefined,
    items: found.siblings.filter((s) => s.url && !isExternal(s.url)).map((s) => ({ label: s.label, href: s.url! })),
  }
}
