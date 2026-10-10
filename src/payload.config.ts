import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media, Documents, FormUploads } from './collections/Media'
import { Pages } from './collections/Pages'
import {
  Initiatives, Events, Posts, Categories, Albums, Videos, DownloadPhotos,
  Quotes, LeaderMeetings, Awards, Offices, Jobs,
} from './collections/Content'
import { ContactMessages, Grievances, JobApplications } from './collections/Inbox'
import { SiteSettings, Header, Footer, Home, Popup } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plainText = (v: unknown): string => {
  if (!v) return ''
  if (typeof v === 'string') return v
  const walk = (n: any): string => (n?.text ?? '') + (n?.children?.map(walk).join(' ') ?? '')
  return walk((v as any).root ?? v).slice(0, 400)
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — Rohan Deshmukh Admin' },
    importMap: { baseDir: path.resolve(dirname) },
    components: { graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Logo#Icon' } },
  },
  collections: [
    Pages, Posts, Categories, Initiatives, Events, Albums, Videos, DownloadPhotos, Quotes,
    LeaderMeetings, Awards, Jobs, Offices, ContactMessages, Grievances, JobApplications,
    Media, Documents, FormUploads, Users,
  ],
  globals: [Home, Header, Footer, SiteSettings, Popup],
  localization: {
    locales: [
      { label: 'मराठी', code: 'mr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'mr',
    fallback: true,
  },
  i18n: { fallbackLanguage: 'en' },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }),
  sharp,
  upload: { limits: { fileSize: 15_000_000 } },
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: (process.env.EMAIL_FROM || '').match(/<(.+)>/)?.[1] || 'noreply@rohandeshmukh.in',
        defaultFromName: 'Rohan Deshmukh',
      })
    : undefined,
  plugins: [
    seoPlugin({
      collections: ['pages', 'posts', 'initiatives'],
      globals: ['home'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `${doc?.title ?? ''} | रोहन सुभाष देशमुख`,
      generateDescription: ({ doc }) => doc?.excerpt || doc?.subtitle || '',
    }),
    searchPlugin({
      collections: ['pages', 'posts', 'initiatives'],
      localize: true,
      defaultPriorities: { pages: 10, initiatives: 20, posts: 30 },
      searchOverrides: {
        admin: { group: 'Settings' },
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: 'excerpt', type: 'textarea', localized: true },
          { name: 'url', type: 'text' },
        ],
      },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        excerpt: originalDoc?.excerpt || originalDoc?.subtitle || plainText(originalDoc?.content ?? originalDoc?.body),
        url:
          searchDoc.doc.relationTo === 'pages'
            ? originalDoc?.path
            : searchDoc.doc.relationTo === 'posts'
              ? `/blog/${originalDoc?.slug}`
              : `/social-work/${originalDoc?.slug}`,
      }),
    }),
    importExportPlugin({
      collections: [
        { slug: 'contact-messages' },
        { slug: 'grievances' },
        { slug: 'job-applications' },
      ],
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, documents: true, 'form-uploads': true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
