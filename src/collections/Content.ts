import type { CollectionConfig } from 'payload'
import { anyone, editors, mediaTeam, publishedOrLoggedIn } from '../access'
import { cell, counterArray, publishedDate, slugField } from '../fields'
import { revalidateAfterChange } from '../hooks/revalidate'

const hooks = { afterChange: [revalidateAfterChange] }

export const INITIATIVE_CATEGORIES = [
  { label: 'आरोग्य / Health', value: 'health' },
  { label: 'ज्येष्ठ नागरिक / Senior Citizens', value: 'senior-citizens' },
  { label: 'शिक्षण / Education', value: 'education' },
  { label: 'महिला / Women', value: 'women' },
  { label: 'शेती व पाणी / Agriculture & Water', value: 'agriculture' },
  { label: 'युवा व रोजगार / Youth & Employment', value: 'youth' },
  { label: 'संस्कृती / Culture', value: 'culture' },
  { label: 'सामाजिक / Community', value: 'community' },
]

export const Initiatives: CollectionConfig = {
  slug: 'initiatives',
  admin: { useAsTitle: 'title', group: 'Social Work', defaultColumns: ['title', 'heroImage', 'category', 'featured', '_status'], pagination: { defaultLimit: 25 } },
  versions: { drafts: true },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  defaultSort: 'order',
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField(),
    { name: 'category', type: 'select', options: INITIATIVE_CATEGORIES, required: true, admin: { position: 'sidebar' } },
    {
      name: 'organisation',
      type: 'select',
      defaultValue: 'foundation',
      admin: { position: 'sidebar' },
      options: [
        { label: 'लोकमंगल फाऊंडेशन', value: 'foundation' },
        { label: 'लोकमंगल परिवार', value: 'parivar' },
        { label: 'विश्वमंगल', value: 'vishwamangal' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on homepage', ...cell('BooleanCell') } },
    { name: 'order', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media', admin: { ...cell('ThumbCell') } },
    { name: 'body', type: 'richText', localized: true },
    counterArray('counters', 'Impact counters (beneficiaries, years, locations)'),
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'youtubeUrl', type: 'text' },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
  ],
}

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title', group: 'Social Work', defaultColumns: ['title', 'coverImage', 'initiative'], description: 'Recurring events with year-wise galleries (e.g. Samudayik Vivah)' },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField(),
    { name: 'initiative', type: 'relationship', relationTo: 'initiatives', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', admin: { ...cell('ThumbCell') } },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'group', type: 'select',
      options: [{ label: 'Youth & Education / युवा व शिक्षण', value: 'youth' }, { label: 'Sports / क्रीडा', value: 'sports' }],
      admin: { position: 'sidebar', description: 'Section on the Lokmangal Foundation → कार्यक्रम tab' },
    },
    { name: 'tagline', type: 'text', localized: true, admin: { description: 'Short line under the title, e.g. "A stage for thousands of young talents"' } },
    { name: 'body', label: 'About this event', type: 'textarea', localized: true },
    {
      name: 'facts', label: 'Key facts', type: 'array',
      labels: { singular: 'Fact', plural: 'Facts' },
      admin: { description: 'e.g. Year → 2011, Solapur · Partner → Solapur University' },
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'value', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'editions',
      type: 'array',
      labels: { singular: 'Year', plural: 'Years' },
      admin: { description: 'Optional: year-wise photo galleries' },
      fields: [
        { name: 'year', type: 'number', required: true },
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
      ],
    },
  ],
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'title', group: 'Blog' },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [{ name: 'title', type: 'text', localized: true, required: true }, slugField()],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', group: 'Blog', defaultColumns: ['title', 'coverImage', 'publishedAt', '_status'] },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  defaultSort: '-publishedAt',
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'subtitle', type: 'text', localized: true },
    slugField(),
    publishedDate,
    { name: 'author', type: 'text', localized: true, defaultValue: 'रोहन देशमुख', admin: { position: 'sidebar' } },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', admin: { ...cell('ThumbCell') } },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
  ],
}

export const ALBUM_CATEGORIES = [
  { label: 'कार्यक्रम / Events', value: 'events' },
  { label: 'सामाजिक कार्य / Social Work', value: 'social' },
  { label: 'राजकीय / Political', value: 'political' },
  { label: 'जनसंपर्क / Public Connect', value: 'public' },
]

export const Albums: CollectionConfig = {
  slug: 'albums',
  admin: { useAsTitle: 'title', group: 'Media', defaultColumns: ['title', 'cover', 'category', 'date'], description: 'Photo Gallery albums. Use bulk upload in Media, then pick the photos here.' },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  defaultSort: '-date',
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField(),
    { name: 'category', type: 'select', options: ALBUM_CATEGORIES, defaultValue: 'events', admin: { position: 'sidebar' } },
    { name: 'date', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'cover', type: 'upload', relationTo: 'media', admin: { ...cell('ThumbCell') } },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true, required: true },
  ],
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: { useAsTitle: 'title', group: 'Media', defaultColumns: ['title', 'playlist', 'publishedAt'] },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  defaultSort: '-publishedAt',
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'youtubeUrl', type: 'text', required: true },
    { name: 'playlist', type: 'text', localized: true, admin: { description: 'Category / playlist name, e.g. "लोकमंगल फाऊंडेशन"' } },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    publishedDate,
  ],
}

export const DownloadPhotos: CollectionConfig = {
  slug: 'download-photos',
  labels: { singular: 'Official photo', plural: 'Official photos (download)' },
  admin: { hidden: true, /* removed from the website (Oct 2026); data kept */ useAsTitle: 'title', group: 'Media', description: 'High-resolution official photos for media use', defaultColumns: ['title', 'image', 'credit'] },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { ...cell('ThumbCell') } },
    { name: 'credit', type: 'text' },
  ],
}

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  labels: { singular: 'Thought / Quote', plural: 'Thoughts / Quotes' },
  admin: { hidden: true, /* removed from the website (Oct 2026); data kept */ useAsTitle: 'text', group: 'About', defaultColumns: ['text', 'image', 'category', 'publishedAt'] },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  defaultSort: '-publishedAt',
  hooks,
  fields: [
    { name: 'text', type: 'textarea', localized: true, required: true, admin: { description: 'The quote text (also used when no image is uploaded)' } },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Designed quote graphic (optional)', ...cell('ThumbCell') } },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'inspiration',
      options: [
        { label: 'प्रेरणा / Inspiration', value: 'inspiration' },
        { label: 'समाजसेवा / Service', value: 'service' },
        { label: 'नवभारत / New India', value: 'new-india' },
        { label: 'उद्योजकता / Entrepreneurship', value: 'entrepreneurship' },
        { label: 'युवा / Youth', value: 'youth' },
      ],
    },
    publishedDate,
  ],
}

export const LeaderMeetings: CollectionConfig = {
  slug: 'leader-meetings',
  labels: { singular: 'Meeting with leader', plural: 'Meetings with leaders' },
  admin: { hidden: true, /* removed from the website (Oct 2026); data kept */ useAsTitle: 'leaderName', group: 'About', defaultColumns: ['leaderName', 'image', 'level', 'date'] },
  access: { read: anyone, create: mediaTeam, update: mediaTeam, delete: editors },
  defaultSort: '-date',
  hooks,
  fields: [
    { name: 'leaderName', type: 'text', localized: true, required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { ...cell('ThumbCell') } },
    { name: 'caption', type: 'text', localized: true },
    { name: 'level', type: 'select', defaultValue: 'national', options: [{ label: 'National', value: 'national' }, { label: 'State', value: 'state' }, { label: 'Other', value: 'other' }] },
    { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
  ],
}

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: { hidden: true, /* removed from the website (Oct 2026); data kept */ useAsTitle: 'title', group: 'About', defaultColumns: ['title', 'image', 'year', 'awardingBody'] },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: '-year',
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'year', type: 'number' },
    { name: 'awardingBody', type: 'text', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { ...cell('ThumbCell') } },
    { name: 'description', type: 'textarea', localized: true },
  ],
}

export const Offices: CollectionConfig = {
  slug: 'offices',
  admin: { useAsTitle: 'name', group: 'Settings', defaultColumns: ['name', 'phone', 'email', 'order'], description: 'Office locations (Contact page) and who receives form emails' },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: 'order',
  hooks,
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'address', type: 'textarea', localized: true },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'notifyEmails', type: 'text', hasMany: true, admin: { description: 'Form submissions for this office are emailed here' } },
    { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps → Share → Embed a map → copy the src URL' } },
    { name: 'order', type: 'number', defaultValue: 10 },
  ],
}

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Opening', plural: 'Career openings' },
  admin: { hidden: true, /* removed from the website (Oct 2026); data kept */ useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'location', 'active', 'lastDate'] },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'location', type: 'text', localized: true },
    { name: 'type', type: 'select', defaultValue: 'full-time', options: ['full-time', 'part-time', 'internship', 'volunteer'] },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'lastDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { ...cell('BooleanCell') } },
  ],
}
