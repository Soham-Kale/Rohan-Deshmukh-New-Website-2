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
import { contactEndpoint } from './endpoints/contact'
import { backendUrl, frontendUrl } from './lib/urls'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plainText = (v: unknown): string => {
  if (!v) return ''
  if (typeof v === 'string') return v
  const walk = (n: any): string => (n?.text ?? '') + (n?.children?.map(walk).join(' ') ?? '')
  return walk((v as any).root ?? v).slice(0, 400)
}

export default buildConfig({
  // three-tier: this is the backend's own address (admin, API, uploaded files); the website is FRONTEND_URL
  serverURL: backendUrl(),
  // the website's server calls the API directly; browsers on the website may also load uploaded files
  cors: [frontendUrl()],
  csrf: [frontendUrl(), backendUrl()],
  endpoints: [contactEndpoint],
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Rohan Deshmukh Admin',
      // same "रो" icon as the website (src/app/favicon.ico, icon.png, apple-icon.png)
      icons: [
        { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
        { rel: 'apple-touch-icon', url: '/apple-icon.png' },
      ],
    },
    importMap: { baseDir: path.resolve(dirname) },
    avatar: 'default',
    components: {
      graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Logo#Icon' },
      beforeLogin: ['/components/admin/LoginIntro#LoginIntro'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
      beforeNavLinks: ['/components/admin/NavExtras#NavInbox'],
      afterNavLinks: ['/components/admin/NavExtras#NavSite'],
    },
  },
  collections: [
    Pages, Jobs, ContactMessages, Grievances, JobApplications, Posts, Categories, Initiatives, Events,
    Albums, Videos, DownloadPhotos, Media, Documents, Quotes, LeaderMeetings, Awards, Offices, FormUploads, Users,
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
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || process.env.DATABASE_URL || '' } }),
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
        admin: { group: 'Settings', hidden: true },
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
      // keep the same database columns with or without Blob (local vs Vercel)
      alwaysInsertFields: true,
      collections: { media: true, documents: true, 'form-uploads': true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
