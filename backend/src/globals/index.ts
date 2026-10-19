import type { Field, GlobalConfig } from 'payload'
import { anyone, editors } from '../access'
import { homeBlocks } from '../blocks/home-blocks'
import { linkFields } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'

const access = { read: anyone, update: editors }
const hooks = { afterChange: [revalidateGlobal] }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access,
  hooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', localized: true, required: true, defaultValue: 'रोहन सुभाष देशमुख' },
            { name: 'tagline', type: 'textarea', localized: true },
            { name: 'logoLight', type: 'upload', relationTo: 'media', admin: { description: 'Logo for dark backgrounds' } },
            { name: 'logoDark', type: 'upload', relationTo: 'media', admin: { description: 'Logo for light backgrounds' } },
            { name: 'defaultShareImage', type: 'upload', relationTo: 'media' },
            { name: 'profilePdf', type: 'upload', relationTo: 'documents', admin: { description: 'Profile PDF (Biography download)' } },
          ],
        },
        {
          label: 'Contact & social',
          fields: [
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'textarea', localized: true },
            { name: 'whatsappNumber', type: 'text', admin: { description: 'For click-to-chat button, digits only with country code, e.g. 918208737624' } },
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'facebook', type: 'text' },
                { name: 'instagram', type: 'text' },
                { name: 'twitter', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'linkedin', type: 'text' },
                { name: 'whatsappChannel', type: 'text' },
                { name: 'telegram', type: 'text' },
              ],
            },
          ],
        },
        // {
        //   label: 'Call to action',
        //   fields: [
        //     { name: 'ctaLabel', type: 'text', localized: true, admin: { description: 'Header button, e.g. साथ द्या' } },
        //     { name: 'ctaUrl', type: 'text' },
        //     { name: 'connectTagLabel', type: 'text', defaultValue: '#ConnectWithRohan' },
        //     { name: 'connectTagUrl', type: 'text' },
        //     { name: 'appealHeading', type: 'text', localized: true, admin: { description: 'Footer appeal band' } },
        //     { name: 'appealButtonLabel', type: 'text', localized: true },
        //     { name: 'appealButtonUrl', type: 'text' },
        //   ],
        // },
        {
          label: 'Forms',
          fields: [
            { name: 'formNotifyEmails', type: 'text', hasMany: true, admin: { description: 'Default recipients for all form submissions' } },
            { name: 'formConsentText', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}

const navItem = (depth: number): Field[] => {
  const base: Field[] = [
    { name: 'label', type: 'text', localized: true, required: true },
    { name: 'url', type: 'text', admin: { description: 'Leave empty for a heading-only item' } },
    { name: 'newTab', type: 'checkbox', defaultValue: false },
  ]
  if (depth >= 3) return base
  return [
    ...base,
    {
      name: depth === 1 ? 'children' : 'subItems',
      type: 'array',
      labels: { singular: depth === 1 ? 'Sub-item' : 'Third-level item', plural: depth === 1 ? 'Sub-items' : 'Third-level items' },
      admin: { initCollapsed: true },
      fields: navItem(depth + 1),
    },
  ]
}

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Menu (header)',
  admin: { group: 'Settings', description: 'Main mega-menu — up to 3 levels' },
  access,
  hooks,
  fields: [{ name: 'nav', type: 'array', admin: { initCollapsed: true }, fields: navItem(1) }],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access,
  hooks,
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'links', type: 'array', fields: linkFields },
      ],
    },
    { name: 'legalLinks', type: 'array', fields: linkFields },
    { name: 'copyright', type: 'text', localized: true },
    { name: 'developerCredit', type: 'text' },
    { name: 'developerUrl', type: 'text' },
  ],
}

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Homepage',
  admin: { group: 'Content', description: 'Drag sections to reorder, tick "hidden" to hide one' },
  access,
  hooks,
  versions: { drafts: true, max: 20 },
  fields: [{ name: 'sections', type: 'blocks', blocks: homeBlocks, admin: { initCollapsed: true } }],
}

export const Popup: GlobalConfig = {
  slug: 'popup',
  label: 'Site popup',
  admin: { group: 'Settings', description: 'Optional popup shown once per visit' },
  access,
  hooks,
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'title', type: 'text', localized: true },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'linkLabel', type: 'text', localized: true },
    { name: 'linkUrl', type: 'text' },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'delaySeconds', type: 'number', defaultValue: 2 },
  ],
}
