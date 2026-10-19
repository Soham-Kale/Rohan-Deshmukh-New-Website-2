/**
 * Addresses the backend needs to know (three-tier setup: frontend ↔ backend ↔ db).
 *  - PAYLOAD_PUBLIC_SERVER_URL: this backend's own public address (admin panel, API, uploaded files)
 *  - FRONTEND_URL: the public website (previews, "View website", cache refresh after edits)
 *  - INTERNAL_API_SECRET: shared with the frontend; proves a request really comes from the other tier
 */
const trim = (u: string) => u.replace(/\/$/, '')

export const backendUrl = () => trim(process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001')
export const frontendUrl = () => trim(process.env.FRONTEND_URL || 'http://localhost:3000')
export const internalSecret = () => process.env.INTERNAL_API_SECRET || ''
