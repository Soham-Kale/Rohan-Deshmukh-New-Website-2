import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { pageBlocks } from '../blocks/page-blocks'
import { revalidateAfterChange } from '../hooks/revalidate'

export const SECTIONS = [
  { label: 'About', value: 'about' },
  { label: 'Lokmangal', value: 'lokmangal' },
  { label: 'Pune Graduate Constituency', value: 'constituency' },
  { label: 'Political Career', value: 'political' },
  { label: 'Vision / Appeal', value: 'vision' },
  { label: 'Engagement', value: 'engage' },
  { label: 'Legal', value: 'legal' },
  { label: 'Other', value: 'other' },
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'path', 'section', '_status', 'updatedAt'],
    description: 'Content pages (Biography, Party & Organisation, Lokmangal Parivar, Privacy Policy…)',
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL}${doc.path}`,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Page URL, e.g. /about/biography' },
      hooks: {
        beforeValidate: [({ value }) => (value ? '/' + String(value).trim().replace(/^\/+|\/+$/g, '').toLowerCase() : value)],
      },
    },
    { name: 'section', type: 'select', options: SECTIONS, defaultValue: 'other', admin: { position: 'sidebar', description: 'Pages in the same section are listed in the side menu' } },
    { name: 'menuOrder', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
    { name: 'showSideMenu', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Banner',
          fields: [
            { name: 'subtitle', type: 'textarea', localized: true },
            { name: 'bannerImage', type: 'upload', relationTo: 'media' },
          ],
        },
        { label: 'Content', fields: [{ name: 'layout', type: 'blocks', blocks: pageBlocks, localized: false }] },
      ],
    },
  ],
}
