import type { CollectionConfig } from 'payload'
import { superAdmin, superAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'Settings', defaultColumns: ['name', 'email', 'role'] },
  auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  access: {
    read: ({ req }) => (req.user?.role === 'super-admin' ? true : { id: { equals: req.user?.id } }),
    create: superAdmin,
    delete: superAdmin,
    update: ({ req }) => (req.user?.role === 'super-admin' ? true : { id: { equals: req.user?.id } }),
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: superAdminField, create: superAdminField },
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor (content)', value: 'editor' },
        { label: 'Media Uploader', value: 'media-uploader' },
      ],
    },
  ],
}
