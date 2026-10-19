import 'server-only'
import { cache } from 'react'
import { stringify } from 'qs-esm'
import type { Where } from 'payload'
import type { Config } from '@/payload-types'
import type { Locale } from '@/i18n/routing'

/**
 * The website's only door to content: the backend's REST API (three-tier — the website never touches the database).
 * Same call shape as Payload's Local API that pages used before (find / findGlobal / findByID / count with
 * collection, where, sort, limit, page, depth, locale, draft, select), so page code reads the same.
 *
 * Responses are cached for 5 minutes (the pages' own refresh interval) and tagged "cms";
 * the backend clears the tag through /api/revalidate as soon as something is edited in the admin.
 */
type Collections = Config['collections']
type Globals = Config['globals']
type CollectionSlug = keyof Collections
type GlobalSlug = keyof Globals

export type PaginatedDocs<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

type Common = { depth?: number; locale?: Locale; draft?: boolean }
type FindArgs<T extends CollectionSlug> = Common & {
  collection: T
  where?: Where
  sort?: string
  limit?: number
  page?: number
  pagination?: boolean
  select?: Record<string, boolean>
}

export const CACHE_TAG = 'cms'
const REVALIDATE_SECONDS = 300
export const cmsUrl = () => (process.env.CMS_URL || 'http://localhost:3001').replace(/\/$/, '')

async function get<T>(path: string, query: Record<string, unknown>, draft?: boolean): Promise<T> {
  const qs = stringify(query, { addQueryPrefix: true, skipNulls: true })
  const res = await fetch(`${cmsUrl()}/api${path}${qs}`, {
    headers: { Accept: 'application/json' },
    ...(draft ? { cache: 'no-store' as const } : { next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] } }),
  })
  if (!res.ok) throw new Error(`CMS request failed (${res.status}) for ${path}: ${(await res.text()).slice(0, 200)}`)
  return res.json() as Promise<T>
}

/** query-string fields shared by every request (undefined values are left out) */
const common = ({ depth, locale, draft }: Common) => ({ depth, locale, draft: draft ? 'true' : undefined })

const client = {
  find<T extends CollectionSlug>({ collection, where, sort, limit, page, pagination, select, ...rest }: FindArgs<T>) {
    return get<PaginatedDocs<Collections[T]>>(
      `/${String(collection)}`,
      { ...common(rest), where, sort, limit, page, pagination: pagination === false ? 'false' : undefined, select },
      rest.draft,
    )
  },
  findByID<T extends CollectionSlug>({ collection, id, ...rest }: Common & { collection: T; id: number | string }) {
    return get<Collections[T]>(`/${String(collection)}/${id}`, common(rest), rest.draft)
  },
  findGlobal<T extends GlobalSlug>({ slug, ...rest }: Common & { slug: T }) {
    return get<Globals[T]>(`/globals/${String(slug)}`, common(rest), rest.draft)
  },
  count<T extends CollectionSlug>({ collection, where, ...rest }: Common & { collection: T; where?: Where }) {
    return get<{ totalDocs: number }>(`/${String(collection)}/count`, { ...common(rest), where }, rest.draft)
  },
}

/** `const c = await cms()` — kept async so call sites read like the Local API they replaced */
export const cms = cache(async () => client)

export const getGlobal = cache(async <T extends 'site-settings' | 'header' | 'footer' | 'home' | 'popup'>(slug: T, locale: Locale) => {
  const c = await cms()
  return c.findGlobal({ slug, locale, depth: 2 })
})
