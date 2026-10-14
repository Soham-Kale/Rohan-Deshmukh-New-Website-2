import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/**
 * Pages removed from the site (Oct 2026 restructure) — old links go to the closest page.
 * Keep in sync with REMOVED_PATHS in src/lib/removed.ts.
 */
const REMOVED = [
  ['/about/achievements', '/about/biography'],
  ['/about/party-organisation', '/political-career'],
  ['/about/thoughts', '/blog'],
  ['/about/leaders', '/about/biography'],
  ['/lokmangal/vishwamangal', '/lokmangal/foundation'],
  ['/media/downloads', '/media/photos'],
  ['/grievance', '/contact'],
  ['/careers', '/contact'],
  ['/search', '/'],
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return REMOVED.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `/en${from}`, destination: to === '/' ? '/en' : `/en${to}`, permanent: true },
    ])
  },
  // Dev and production builds live in separate folders so they never overwrite each other
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
