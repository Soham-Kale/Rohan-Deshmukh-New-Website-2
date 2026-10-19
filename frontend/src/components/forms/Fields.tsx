'use client'

import { useActionState, useEffect, useRef } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Loader2, Paperclip } from 'lucide-react'
import type { FormState } from '@/lib/forms'
import { cn } from '@/lib/utils'

declare global { interface Window { grecaptcha?: { ready: (cb: () => void) => void; execute: (k: string, o: { action: string }) => Promise<string> } } }

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export function useForm(action: (s: FormState, fd: FormData) => Promise<FormState>, captchaAction: string) {
  const [state, formAction, pending] = useActionState(async (prev: FormState, fd: FormData) => {
    if (SITE_KEY && window.grecaptcha) {
      const token = await new Promise<string>((res) => window.grecaptcha!.ready(() => window.grecaptcha!.execute(SITE_KEY, { action: captchaAction }).then(res)))
      fd.set('captcha', token)
    }
    const r = await action(prev, fd)
    if (r?.ok && typeof window !== 'undefined' && 'gtag' in window) (window as unknown as { gtag: (...a: unknown[]) => void }).gtag('event', 'generate_lead', { form: captchaAction })
    return r
  }, null)
  return { state, formAction, pending }
}

export function FormShell({ state, pending, children, action, submitLabel }: { state: FormState; pending: boolean; children: React.ReactNode; action: (fd: FormData) => void; submitLabel?: string }) {
  const t = useTranslations('forms')
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => { if (state?.ok) ref.current?.reset() }, [state])
  if (state?.ok)
    return (
      <div className="rounded-3xl border border-saffron-300 bg-saffron-50 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-12 text-saffron-600" />
        <p className="mt-4 text-xl font-semibold text-charcoal-900">{state.ref ? t('successRef') : t('success')}</p>
        {state.ref && <p className="mt-2 font-display text-3xl tracking-wide text-saffron-700">{state.ref}</p>}
      </div>
    )
  return (
    <form ref={ref} action={action} className="grid gap-5 rounded-[1.75rem] bg-white p-6 shadow-[0_30px_70px_-45px_rgb(20_33_61/0.4)] ring-1 ring-charcoal-900/[0.04] md:grid-cols-2 md:p-10" noValidate>
      {SITE_KEY && <Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`} strategy="lazyOnload" />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {children}
      {state && !state.ok && (state.message || state.errors) && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2" role="alert">{state.message && state.message !== 'error' ? state.message : t('error')}</p>
      )}
      <label className="flex items-start gap-3 text-sm text-muted md:col-span-2">
        <input type="checkbox" required className="mt-1 size-4 accent-saffron-600" /> {t('consent')}
      </label>
      <div className="md:col-span-2">
        <button type="submit" disabled={pending} className="btn btn-primary min-w-40 text-base disabled:opacity-60">
          {pending ? <><Loader2 className="size-4 animate-spin" /> {t('sending')}</> : submitLabel ?? t('submit')}
        </button>
        {SITE_KEY && <p className="mt-3 text-xs text-muted">Protected by reCAPTCHA — Google <a className="underline" href="https://policies.google.com/privacy">Privacy</a> & <a className="underline" href="https://policies.google.com/terms">Terms</a>.</p>}
      </div>
    </form>
  )
}

type FieldProps = { name: string; label: string; required?: boolean; error?: string; full?: boolean; type?: string; as?: 'input' | 'textarea' | 'select'; options?: { value: string; label: string }[]; rows?: number; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; autoComplete?: string; defaultValue?: string }

export function Field({ name, label, required, error, full, type = 'text', as = 'input', options, rows = 5, inputMode, autoComplete, defaultValue }: FieldProps) {
  const t = useTranslations('forms')
  const id = `f-${name}`
  const cls = cn('w-full rounded-xl border bg-paper px-4 py-3 outline-none transition focus:border-saffron-500 focus:ring-4 focus:ring-saffron-100', error ? 'border-red-400' : 'border-line')
  return (
    <div className={cn(full && 'md:col-span-2')}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-charcoal-900">
        {label} {required && <span className="text-saffron-600">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea id={id} name={name} required={required} rows={rows} className={cls} aria-invalid={!!error} defaultValue={defaultValue} />
      ) : as === 'select' ? (
        <select id={id} name={name} required={required} className={cls} aria-invalid={!!error} defaultValue={defaultValue ?? ''}>
          <option value="" disabled>—</option>
          {options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input id={id} name={name} type={type} required={required} className={cls} aria-invalid={!!error} inputMode={inputMode} autoComplete={autoComplete} defaultValue={defaultValue} />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{t.has(error as never) ? t(error as never) : error}</p>}
    </div>
  )
}

export function FileField({ name, label, accept, error }: { name: string; label: string; accept: string; error?: string }) {
  const t = useTranslations('forms')
  return (
    <div className="md:col-span-2">
      <label htmlFor={`f-${name}`} className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-900"><Paperclip className="size-4" /> {label}</label>
      <input id={`f-${name}`} name={name} type="file" accept={accept}
        onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size > 5 * 1024 * 1024) { alert(t('fileTooBig')); e.target.value = '' } }}
        className="block w-full rounded-xl border border-dashed border-line bg-paper px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-charcoal-900 file:px-4 file:py-2 file:text-white" />
      {error && <p className="mt-1 text-sm text-red-600">{t(error as never)}</p>}
    </div>
  )
}
