import { useLoaderData } from 'react-router'
import { cms } from '@/lib/api'
import { useLayout } from '@/lib/layout'
import { mediaUrl } from '@/lib/media'
import { HomeSections, type HomeExtras } from '@/components/home/HomeSections'
import { Seo } from '@/components/layout/Seo'

/** The homepage, plus the extra content some of its sections show (only what the visible sections need) */
export async function loader() {
  const home = await cms.global('home')
  const sections = (home.sections ?? []).filter((s) => !s.hidden)
  const has = (type: string) => sections.some((s) => s.blockType === type)
  const blog = sections.find((s) => s.blockType === 'latestBlog')
  const postCount = Math.max(4, ((blog?.blockType === 'latestBlog' ? blog.limit : null) ?? 3) + 1)

  const hero = sections.some((s) => s.blockType === 'heroSlider')
  const [events, posts, foundationPage, videos, tickerPosts, tickerInitiatives] = await Promise.all([
    has('homeEvents') ? cms.find('events', { limit: 50, sort: 'createdAt', depth: 1 }).then((r) => r.docs) : [],
    has('latestBlog') ? cms.find('posts', { limit: postCount, sort: '-publishedAt', depth: 1 }).then((r) => r.docs) : [],
    has('initiativesShowcase') ? cms.findOne('pages', { where: { path: { equals: '/lokmangal/foundation' } }, depth: 1 }) : null,
    has('socialFeeds') ? cms.find('videos', { limit: 3, sort: '-publishedAt' }).then((r) => r.docs) : [],
    // the news ticker under the hero: the latest articles and the Lokmangal projects
    hero ? cms.find('posts', { limit: 5, sort: '-publishedAt', depth: 0 }).then((r) => r.docs) : [],
    hero ? cms.find('initiatives', { limit: 8, sort: 'order', depth: 0 }).then((r) => r.docs) : [],
  ])
  const ticker = [
    ...tickerPosts.map((d) => ({ label: d.title, url: `/blog/${d.slug}` })),
    ...tickerInitiatives.map((d) => ({ label: d.title, url: `/social-work/${d.slug}` })),
  ].filter((x) => x.label)
  const extras: HomeExtras = { events, posts, foundationPage, videos, ticker }
  return { home, extras }
}

export default function HomePage() {
  const { home, extras } = useLoaderData<typeof loader>()
  const { settings } = useLayout()
  const meta = home.meta
  return (
    <>
      <Seo title={meta?.title || settings.siteName} absoluteTitle description={meta?.description || settings.tagline} image={mediaUrl(meta?.image, 'card')} />
      <HomeSections sections={home.sections ?? []} extras={extras} />
    </>
  )
}
