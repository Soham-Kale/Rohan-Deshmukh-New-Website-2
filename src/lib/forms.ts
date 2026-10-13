'use server'

import { headers } from 'next/headers'
import { payload } from './payload'

export type FormState = { ok: boolean; message?: string; ref?: string; errors?: Record<string, string> } | null

const MAX_FILE = 5 * 1024 * 1024
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const hits = new Map<string, number[]>()

async function guard(fd: FormData, action: string): Promise<string | null> {
  // Honeypot: bots fill hidden fields
  if (String(fd.get('website') ?? '').length > 0) return 'spam'
  // Simple per-IP rate limit: 5 submissions / 10 minutes
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (list.length >= 5) return 'rate'
  list.push(now)
  hits.set(ip, list)
  // reCAPTCHA v3 (only when configured)
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (secret) {
    const token = String(fd.get('captcha') ?? '')
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
    }).then((x) => x.json()).catch(() => null)
    if (!r?.success || (r.score ?? 0) < 0.5 || (r.action && r.action !== action)) return 'captcha'
  }
  return null
}

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max)
const validMobile = (m: string) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(m.replace(/\s/g, ''))
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

async function saveFile(fd: FormData, key: string): Promise<number | undefined | 'invalid'> {
  const f = fd.get(key)
  if (!f || typeof f === 'string' || f.size === 0) return undefined
  if (f.size > MAX_FILE || !ALLOWED.includes(f.type)) return 'invalid'
  const p = await payload()
  const doc = await p.create({
    collection: 'form-uploads',
    data: {},
    file: { data: Buffer.from(await f.arrayBuffer()), mimetype: f.type, name: f.name.replace(/[^\w.\-]/g, '_'), size: f.size },
    overrideAccess: true,
  })
  return doc.id as number
}

const fail = (reason: string): FormState => ({
  ok: false,
  message: reason === 'rate' ? 'Too many submissions. Please try again later.' : reason === 'captcha' ? 'Captcha verification failed. Please retry.' : 'error',
})

export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  const g = await guard(fd, 'contact')
  if (g === 'spam') return { ok: true }
  if (g) return fail(g)
  const data = { name: str(fd, 'name', 120), mobile: str(fd, 'mobile', 20), email: str(fd, 'email', 160), subject: str(fd, 'subject', 200), message: str(fd, 'message', 5000), office: Number(fd.get('office')) || undefined }
  const errors: Record<string, string> = {}
  if (!data.name) errors.name = 'required'
  if (!validMobile(data.mobile)) errors.mobile = 'invalidMobile'
  if (!validEmail(data.email)) errors.email = 'required'
  if (!data.subject) errors.subject = 'required'
  if (!data.office) errors.office = 'required'
  if (Object.keys(errors).length) return { ok: false, errors }
  try {
    const attachment = await saveFile(fd, 'attachment')
    if (attachment === 'invalid') return { ok: false, errors: { attachment: 'fileType' } }
    await (await payload()).create({ collection: 'contact-messages', data: { ...data, attachment }, overrideAccess: true })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, message: 'error' }
  }
}

