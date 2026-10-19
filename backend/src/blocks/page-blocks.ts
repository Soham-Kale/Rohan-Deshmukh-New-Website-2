import type { Block, Field } from 'payload'
import { counterArray, linkFields } from '../fields'

const common: Field[] = [
  { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Small label above the heading' } },
  { name: 'heading', type: 'text', localized: true },
  { name: 'hidden', type: 'checkbox', defaultValue: false, admin: { description: 'Hide this block on the site' } },
]

export const ContentBlock: Block = {
  slug: 'content',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [...common, { name: 'body', type: 'richText', localized: true }],
}

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    ...common,
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imagePosition', type: 'select', defaultValue: 'left', options: ['left', 'right'] },
    { name: 'body', type: 'richText', localized: true },
    { name: 'buttons', type: 'array', fields: linkFields },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Counters', plural: 'Counters' },
  fields: [...common, counterArray('items', 'Counters')],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Photo gallery', plural: 'Photo galleries' },
  fields: [
    ...common,
    { name: 'layout', type: 'select', defaultValue: 'grid', options: ['grid', 'masonry'] },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}

export const CardsBlock: Block = {
  slug: 'cards',
  labels: { singular: 'Cards', plural: 'Cards' },
  fields: [
    ...common,
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'columns', type: 'select', defaultValue: '3', options: ['2', '3', '4'] },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Not shown on the website (emoji are not used)' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'meta', type: 'text', localized: true, admin: { description: 'e.g. "स्थापना: २००२"' } },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'tags', type: 'text', localized: true, hasMany: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ accordion', plural: 'FAQ accordions' },
  fields: [
    ...common,
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', localized: true, required: true },
        { name: 'answer', type: 'richText', localized: true },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    ...common,
    { name: 'text', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'buttons', type: 'array', fields: linkFields },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'YouTube video', plural: 'YouTube videos' },
  fields: [...common, { name: 'youtubeUrl', type: 'text', required: true }, { name: 'caption', type: 'text', localized: true }],
}

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Pull quote', plural: 'Pull quotes' },
  fields: [
    { name: 'hidden', type: 'checkbox', defaultValue: false },
    { name: 'text', type: 'textarea', localized: true, required: true },
    { name: 'author', type: 'text', localized: true },
  ],
}

export const DownloadsBlock: Block = {
  slug: 'downloads',
  labels: { singular: 'File downloads', plural: 'File downloads' },
  fields: [
    ...common,
    {
      name: 'files',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'file', type: 'upload', relationTo: 'documents', required: true },
      ],
    },
  ],
}

const basePageBlocks: Block[] = [
  ContentBlock,
  MediaTextBlock,
  StatsBlock,
  CardsBlock,
  GalleryBlock,
  FaqBlock,
  VideoBlock,
  QuoteBlock,
  DownloadsBlock,
  CtaBlock,
]

/** Readable block headers in the admin (section heading instead of "Untitled") */
export const withAdminLabels = (blocks: Block[]): Block[] =>
  blocks.map((b) => ({
    ...b,
    admin: {
      ...b.admin,
      disableBlockName: true,
      components: { ...b.admin?.components, Label: { path: '/components/admin/BlockLabel#BlockLabel', clientProps: { label: String(b.labels?.singular ?? b.slug) } } },
    },
  }))

export const pageBlocks: Block[] = withAdminLabels(basePageBlocks)
