export type NavNode = { id?: string | null; label: string; url?: string | null; newTab?: boolean | null; children?: NavNode[] | null }

type Raw = { id?: string | null; label: string; url?: string | null; newTab?: boolean | null; children?: Raw[] | null; subItems?: Raw[] | null }

/** CMS stores level 3 as "subItems" (DB naming); expose a uniform `children` tree to the UI */
export const normalizeNav = (items: Raw[] | null | undefined): NavNode[] =>
  (items ?? []).map((n) => ({ id: n.id, label: n.label, url: n.url, newTab: n.newTab, children: normalizeNav(n.children ?? n.subItems) }))
