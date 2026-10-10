import type { Field } from 'payload'

/** URL-safe slug, auto-generated from a source field when empty */
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  required: true,
  admin: { position: 'sidebar', description: 'URL part, e.g. "annapurna-yojana". Auto-filled from the title if empty.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return slugify(String(value))
        const src = data?.[source]
        const str = typeof src === 'object' && src ? (src.en ?? src.mr ?? '') : src
        return str ? slugify(String(str)) : value
      },
    ],
  },
})

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

export const linkFields: Field[] = [
  { name: 'label', type: 'text', localized: true },
  { name: 'url', type: 'text', admin: { description: 'Internal path like /about/biography or full https:// link' } },
  { name: 'newTab', type: 'checkbox', defaultValue: false },
]

export const counterArray = (name = 'counters', label = 'Impact counters'): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    { name: 'value', type: 'text', localized: true, required: true, admin: { description: 'e.g. ३,२२१+ (Marathi) / 3,221+ (English)' } },
    { name: 'label', type: 'text', localized: true, required: true },
  ],
})

export const publishedDate: Field = {
  name: 'publishedAt',
  type: 'date',
  admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
  defaultValue: () => new Date().toISOString(),
}
