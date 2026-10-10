import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
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
