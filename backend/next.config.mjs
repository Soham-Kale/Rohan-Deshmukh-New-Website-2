import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Backend (application tier): Next.js only hosts Payload here — the admin panel at /admin and the
 * REST/GraphQL API at /api. The public website is the separate frontend app.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // nothing public lives on the backend's own home page — send visitors to the admin panel
  async redirects() {
    return [{ source: '/', destination: '/admin', permanent: false }]
  },
  // Dev and production builds live in separate folders so they never overwrite each other
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
