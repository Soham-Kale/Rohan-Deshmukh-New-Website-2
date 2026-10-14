import type { MetadataRoute } from 'next'
import { payload } from '@/lib/payload'
import { siteUrl } from '@/lib/utils'
import { isRemovedPath } from '@/lib/removed'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const p = await payload()
  const statics = ['/', '/social-work', '/about/family', '/events', '/media/photos', '/media/videos', '/blog', '/contact']
  const [pages, posts, inits, albums, events] = await Promise.all([
    p.find({ collection: 'pages', limit: 500, depth: 0, select: { path: true, updatedAt: true } }),
    p.find({ collection: 'posts', limit: 1000, depth: 0, select: { slug: true, updatedAt: true }, where: { _status: { equals: 'published' } } }),
    p.find({ collection: 'initiatives', limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
    p.find({ collection: 'albums', limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
    p.find({ collection: 'events', limit: 100, depth: 0, select: { slug: true, updatedAt: true } }),
  ])
  const entries: { path: string; updatedAt?: string }[] = [
    ...statics.map((path) => ({ path })),
    ...pages.docs.filter((d) => !isRemovedPath(d.path)).map((d) => ({ path: d.path, updatedAt: d.updatedAt })),
    ...posts.docs.map((d) => ({ path: `/blog/${d.slug}`, updatedAt: d.updatedAt })),
    ...inits.docs.map((d) => ({ path: `/social-work/${d.slug}`, updatedAt: d.updatedAt })),
    ...albums.docs.map((d) => ({ path: `/media/photos/${d.slug}`, updatedAt: d.updatedAt })),
    ...events.docs.map((d) => ({ path: `/events/${d.slug}`, updatedAt: d.updatedAt })),
  ]
  return entries.map((e) => ({
    url: `${base}${e.path === '/' ? '' : e.path}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : undefined,
    alternates: { languages: { mr: `${base}${e.path === '/' ? '' : e.path}`, en: `${base}/en${e.path === '/' ? '' : e.path}` } },
  }))
}
