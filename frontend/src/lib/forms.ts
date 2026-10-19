'use server'

import { headers } from 'next/headers'
import { cmsUrl } from './cms'

export type FormState = { ok: boolean; message?: string; ref?: string; errors?: Record<string, string> } | null

/** Text fields the contact form sends (the attachment travels separately as `file`) */
const FIELDS = ['name', 'mobile', 'email', 'subject', 'message', 'office', 'website', 'captcha']

/**
 * Contact form: forwarded to the backend's /api/forms/contact (three-tier — only the backend writes to the database).
 * Spam checks, validation and saving all happen there; this just passes the form on with the visitor's IP
 * (vouched for with the shared INTERNAL_API_SECRET so the backend's per-IP rate limit still works).
 */
export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  const fields: Record<string, string> = {}
  for (const k of FIELDS) fields[k] = String(fd.get(k) ?? '')

  const body = new FormData()
  body.set('_payload', JSON.stringify(fields))
  const file = fd.get('attachment')
  if (file && typeof file !== 'string' && file.size > 0) body.set('file', file, file.name)

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || ''
  try {
    const res = await fetch(`${cmsUrl()}/api/forms/contact`, {
      method: 'POST',
      body,
      headers: { 'x-internal-secret': process.env.INTERNAL_API_SECRET || '', 'x-visitor-ip': ip },
      cache: 'no-store',
    })
    const data = (await res.json().catch(() => null)) as FormState
    return data ?? { ok: false, message: 'error' }
  } catch (e) {
    console.error('Contact form could not reach the backend', e)
    return { ok: false, message: 'error' }
  }
}
