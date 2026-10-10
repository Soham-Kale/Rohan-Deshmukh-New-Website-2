import type { CollectionConfig } from 'payload'
import { anyone, mediaTeam, editors } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Media', description: 'All photos. Uploads are converted to WebP automatically.' },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  folders: true,
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumb',
    focalPoint: true,
  },
  fields: [
    { name: 'alt', type: 'text', localized: true, admin: { description: 'Describe the photo (for accessibility & SEO)' } },
    { name: 'caption', type: 'text', localized: true },
  ],
}

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: { group: 'Media', description: 'PDFs: profile, reports, e-books' },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  upload: { mimeTypes: ['application/pdf'] },
  fields: [{ name: 'title', type: 'text', localized: true }],
}

/** Files attached to public form submissions — not publicly readable */
export const FormUploads: CollectionConfig = {
  slug: 'form-uploads',
  admin: { group: 'Inbox', hidden: ({ user }) => user?.role !== 'super-admin' },
  access: { read: editors, create: () => false, update: editors, delete: editors },
  upload: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  fields: [],
}
