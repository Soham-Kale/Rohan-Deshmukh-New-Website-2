import type { Access, FieldAccess } from 'payload'

type Role = 'super-admin' | 'editor' | 'media-uploader'
const hasRole = (user: unknown, roles: Role[]) =>
  Boolean(user && roles.includes((user as { role?: Role }).role as Role))

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => Boolean(req.user)
export const superAdmin: Access = ({ req }) => hasRole(req.user, ['super-admin'])
export const editors: Access = ({ req }) => hasRole(req.user, ['super-admin', 'editor'])
export const mediaTeam: Access = ({ req }) =>
  hasRole(req.user, ['super-admin', 'editor', 'media-uploader'])
export const superAdminField: FieldAccess = ({ req }) => hasRole(req.user, ['super-admin'])

/** Published docs are public; drafts only for logged-in users */
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
