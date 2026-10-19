import { addDataAndFileToRequest, type Endpoint, type PayloadRequest } from 'payload'
import { internalSecret } from '../lib/urls'

/**
 * POST /api/forms/contact — the Contact page form (application tier).
 * Previously a server action inside the website that wrote to the database directly; in the three-tier setup
 * the website forwards the form here and only the backend writes to the database.
 *
 * Request: multipart/form-data with `_payload` (JSON of the text fields) and an optional `file` (attachment).
 * Response: the same FormState the website already understands — { ok, message?, errors? }.
 */
type FormState = { ok: boolean; message?: string; errors?: Record<string, string> }

const MAX_FILE = 5 * 1024 * 1024
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const hits = new Map<string, number[]>()

const str = (d: Record<string, unknown>, k: string, max = 2000) => String(d[k] ?? '').trim().slice(0, max)
const validMobile = (m: string) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(m.replace(/\s/g, ''))
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const json = (body: FormState, status = 200) => Response.json(body, { status })

/** The visitor's IP: forwarded by the website (trusted only with the shared secret), else the request's own */
function clientIp(req: PayloadRequest) {
  const fromSite = req.headers.get('x-internal-secret') === internalSecret() && internalSecret()
  const header = fromSite ? req.headers.get('x-visitor-ip') : req.headers.get('x-forwarded-for')
  return header?.split(',')[0]?.trim() || 'local'
}

/** Honeypot, per-IP rate limit (5 per 10 minutes) and reCAPTCHA v3 when configured */
async function guard(req: PayloadRequest, data: Record<string, unknown>, action: string): Promise<string | null> {
  if (String(data.website ?? '').length > 0) return 'spam'
  const ip = clientIp(req)
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (list.length >= 5) return 'rate'
  list.push(now)
  hits.set(ip, list)
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (secret) {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: String(data.captcha ?? '') }),
    }).then((x) => x.json()).catch(() => null)
    if (!r?.success || (r.score ?? 0) < 0.5 || (r.action && r.action !== action)) return 'captcha'
  }
  return null
}

const fail = (reason: string): FormState => ({
  ok: false,
  message: reason === 'rate' ? 'Too many submissions. Please try again later.' : reason === 'captcha' ? 'Captcha verification failed. Please retry.' : 'error',
})

export const contactEndpoint: Endpoint = {
  path: '/forms/contact',
  method: 'post',
  handler: async (req) => {
    try {
      await addDataAndFileToRequest(req)
    } catch {
      return json({ ok: false, message: 'error' }, 400)
    }
    const raw = (req.data ?? {}) as Record<string, unknown>
    const g = await guard(req, raw, 'contact')
    if (g === 'spam') return json({ ok: true }) // bots get a quiet "thanks"
    if (g) return json(fail(g), g === 'rate' ? 429 : 400)

    const data = { name: str(raw, 'name', 120), mobile: str(raw, 'mobile', 20), email: str(raw, 'email', 160), subject: str(raw, 'subject', 200), message: str(raw, 'message', 5000), office: Number(raw.office) || undefined }
    const errors: Record<string, string> = {}
    if (!data.name) errors.name = 'required'
    if (!validMobile(data.mobile)) errors.mobile = 'invalidMobile'
    if (!validEmail(data.email)) errors.email = 'required'
    if (!data.subject) errors.subject = 'required'
    if (!data.office) errors.office = 'required'
    if (Object.keys(errors).length) return json({ ok: false, errors }, 400)

    try {
      let attachment: number | undefined
      const f = req.file
      if (f && f.size > 0) {
        if (f.size > MAX_FILE || !ALLOWED.includes(f.mimetype)) return json({ ok: false, errors: { attachment: 'fileType' } }, 400)
        const doc = await req.payload.create({
          collection: 'form-uploads',
          data: {},
          file: { data: f.data, mimetype: f.mimetype, name: f.name.replace(/[^\w.\-]/g, '_'), size: f.size },
          overrideAccess: true,
        })
        attachment = doc.id as number
      }
      await req.payload.create({ collection: 'contact-messages', data: { ...data, attachment }, overrideAccess: true })
      return json({ ok: true })
    } catch (e) {
      req.payload.logger.error({ err: e, msg: 'Contact form could not be saved' })
      return json({ ok: false, message: 'error' }, 500)
    }
  },
}
