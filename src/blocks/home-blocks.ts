import type { Block, Field } from 'payload'
import { counterArray, linkFields } from '../fields'

const base: Field[] = [
  { name: 'hidden', type: 'checkbox', defaultValue: false, admin: { description: 'Hide this section on the homepage' } },
  { name: 'eyebrow', type: 'text', localized: true },
  { name: 'heading', type: 'text', localized: true },
]

export const HeroSlider: Block = {
  slug: 'heroSlider',
  labels: { singular: 'Hero slider', plural: 'Hero sliders' },
  fields: [
    { name: 'hidden', type: 'checkbox', defaultValue: false },
    { name: 'autoplaySeconds', type: 'number', defaultValue: 6 },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'subheading', type: 'textarea', localized: true },
        { name: 'buttons', type: 'array', maxRows: 2, fields: linkFields },
      ],
    },
    counterArray('badge', 'Small counter badge (optional)'),
  ],
}

export const QuickLinks: Block = {
  slug: 'quickLinks',
  labels: { singular: 'Quick links', plural: 'Quick links' },
  fields: [
    ...base,
    {
      name: 'items',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'icon', type: 'select', defaultValue: 'info', options: ['user', 'heart', 'book', 'camera', 'video', 'vote', 'pen', 'phone', 'info', 'flag', 'leaf', 'award'] },
        ...linkFields,
      ],
    },
  ],
}

export const AboutIntro: Block = {
  slug: 'aboutIntro',
  labels: { singular: 'About block', plural: 'About blocks' },
  fields: [
    ...base,
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'pledge', type: 'textarea', localized: true, admin: { description: 'Personal pledge quote' } },
    counterArray('stats', 'Counters'),
    { name: 'buttonLabel', type: 'text', localized: true },
    { name: 'buttonUrl', type: 'text' },
  ],
}

export const Biography: Block = {
  slug: 'biography',
  labels: { singular: 'Biography highlights', plural: 'Biography highlights' },
  fields: [
    ...base,
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const FeaturedVideo: Block = {
  slug: 'featuredVideo',
  labels: { singular: 'Featured video', plural: 'Featured videos' },
  fields: [
    ...base,
    { name: 'youtubeUrl', type: 'text', required: true },
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'links',
      type: 'array',
      maxRows: 4,
      fields: [...linkFields, { name: 'description', type: 'text', localized: true }],
    },
  ],
}

export const WorkHighlights: Block = {
  slug: 'workHighlights',
  labels: { singular: 'Work highlights', plural: 'Work highlights' },
  fields: [
    ...base,
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const InitiativesShowcase: Block = {
  slug: 'initiativesShowcase',
  labels: { singular: 'Initiatives showcase', plural: 'Initiatives showcases' },
  fields: [
    ...base,
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'initiatives', type: 'relationship', relationTo: 'initiatives', hasMany: true, admin: { description: 'Leave empty to show featured initiatives automatically' } },
  ],
}

export const Family: Block = {
  slug: 'family',
  labels: { singular: 'Family background', plural: 'Family background' },
  fields: [
    ...base,
    {
      name: 'members',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'relation', type: 'text', localized: true },
        { name: 'name', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}

export const HomeGallery: Block = {
  slug: 'homeGallery',
  labels: { singular: 'Photo strip', plural: 'Photo strips' },
  fields: [...base, { name: 'images', type: 'upload', relationTo: 'media', hasMany: true }],
}

export const HomeStats: Block = {
  slug: 'homeStats',
  labels: { singular: 'Impact counters', plural: 'Impact counters' },
  fields: [
    ...base,
    { name: 'image', type: 'upload', relationTo: 'media' },
    counterArray('items', 'Counters'),
    { name: 'buttonLabel', type: 'text', localized: true },
    { name: 'buttonUrl', type: 'text' },
  ],
}

export const HomeFaq: Block = {
  slug: 'homeFaq',
  labels: { singular: 'FAQs', plural: 'FAQs' },
  fields: [
    ...base,
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', localized: true, required: true },
        { name: 'answer', type: 'richText', localized: true },
      ],
    },
    { name: 'buttons', type: 'array', maxRows: 2, fields: linkFields },
  ],
}

export const LatestBlog: Block = {
  slug: 'latestBlog',
  labels: { singular: 'Latest blog posts', plural: 'Latest blog posts' },
  fields: [...base, { name: 'limit', type: 'number', defaultValue: 3 }],
}

export const SocialFeeds: Block = {
  slug: 'socialFeeds',
  labels: { singular: 'Social feeds', plural: 'Social feeds' },
  fields: [
    ...base,
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'instagramPosts',
      type: 'array',
      admin: { description: 'Instagram post/reel URLs to embed' },
      fields: [
        { name: 'url', type: 'text', required: true },
        { name: 'title', type: 'text', localized: true },
      ],
    },
    { name: 'showFacebook', type: 'checkbox', defaultValue: true },
    { name: 'showYoutube', type: 'checkbox', defaultValue: true, admin: { description: 'Shows latest videos from the Video Gallery' } },
  ],
}

export const AppealBand: Block = {
  slug: 'appealBand',
  labels: { singular: 'Appeal band', plural: 'Appeal bands' },
  fields: [
    ...base,
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'buttonLabel', type: 'text', localized: true },
    { name: 'buttonUrl', type: 'text' },
  ],
}

export const homeBlocks: Block[] = [
  HeroSlider,
  QuickLinks,
  AboutIntro,
  Biography,
  FeaturedVideo,
  WorkHighlights,
  InitiativesShowcase,
  Family,
  HomeGallery,
  HomeStats,
  HomeFaq,
  LatestBlog,
  SocialFeeds,
  AppealBand,
]
