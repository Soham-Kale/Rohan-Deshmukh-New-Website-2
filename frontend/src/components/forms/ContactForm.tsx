import { useEffect, useState, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { useForm, type FieldError, type UseFormRegisterReturn } from 'react-hook-form'
import axios from 'axios'
import { CheckCircle2, Loader2, Paperclip } from 'lucide-react'
import { api } from '@/lib/api'
import { trackEvent } from '@/lib/analytics'
import { captchaEnabled, captchaToken, loadCaptcha } from '@/lib/captcha'
import { useTranslations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

type Values = { name: string; mobile: string; email: string; subject: string; office: string; message: string; consent: boolean; website: string }

const MAX_FILE = 5 * 1024 * 1024
const mobileOk = (v: string) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, ''))
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/**
 * The Contact page form (React Hook Form). Validated in the browser first, and again by the backend, which answers
 * with the same error codes ("required", "invalidMobile", "fileType"…) shown under the fields.
 */
export function ContactForm({ offices }: { offices: { value: string; label: string }[] }) {
  const t = useTranslations('forms')
  const {
    register, handleSubmit, setError, clearErrors, reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ defaultValues: { office: offices.length === 1 ? offices[0].value : '', consent: false, website: '' } })
  const [sent, setSent] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    void loadCaptcha()
  }, [])

  const required = { required: 'required' } as const

  const onSubmit = handleSubmit(async (v) => {
    setBanner(null)
    const body = new FormData()
    for (const k of ['name', 'mobile', 'email', 'subject', 'office', 'message', 'website'] as const) body.set(k, v[k] ?? '')
    if (file) body.set('attachment', file, file.name)
    const token = await captchaToken('contact')
    if (token) body.set('captcha', token)
    try {
      const res = await api.post('/api/forms/contact', body, { validateStatus: () => true })
      const data = res.data as { ok?: boolean; message?: string; errors?: Record<string, string> } | undefined
      if (data?.ok) {
        reset()
        setFile(null)
        setSent(true)
        trackEvent('generate_lead', { form: 'contact' })
        return
      }
      if (data?.errors) {
        for (const [field, code] of Object.entries(data.errors)) {
          if (field === 'attachment') setFileError(code)
          else setError(field as keyof Values, { type: 'server', message: code })
        }
        return
      }
      // a real failure (too many tries, captcha, server): a general message. Field mistakes are shown under their fields.
      setBanner(data?.message && data.message !== 'error' ? data.message : t('error'))
    } catch (e) {
      setBanner(axios.isAxiosError(e) && e.response?.data?.message ? String(e.response.data.message) : t('error'))
    }
  })

  if (sent)
    return (
      <div className="rounded-3xl border border-saffron-300 bg-saffron-50 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-12 text-saffron-600" />
        <p className="mt-4 text-xl font-semibold text-charcoal-900">{t('success')}</p>
      </div>
    )

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[1.75rem] bg-white p-6 shadow-[0_30px_70px_-45px_rgb(20_33_61/0.4)] ring-1 ring-charcoal-900/[0.04] md:grid-cols-2 md:p-10" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register('website')} />

      <Field id="name" label={t('name')} required error={errors.name} inputProps={{ autoComplete: 'name', ...register('name', { ...required, maxLength: 120 }) }} />
      <Field
        id="mobile" label={t('mobile')} required error={errors.mobile}
        inputProps={{ type: 'tel', inputMode: 'tel', autoComplete: 'tel', ...register('mobile', { ...required, validate: (v) => mobileOk(v) || 'invalidMobile' }) }}
      />
      <Field
        id="email" label={t('email')} required error={errors.email}
        inputProps={{ type: 'email', autoComplete: 'email', ...register('email', { ...required, validate: (v) => emailOk(v) || 'invalidEmail' }) }}
      />
      <Field id="subject" label={t('subject')} required error={errors.subject} inputProps={register('subject', { ...required, maxLength: 200 })} />

      <Field id="office" label={t('office')} required error={errors.office} full as="select" selectProps={{ ...register('office', required) }} options={offices} />
      <Field id="message" label={t('message')} error={errors.message} full as="textarea" textareaProps={{ rows: 5, ...register('message', { maxLength: 5000 }) }} />

      <div className="md:col-span-2">
        <label htmlFor="f-attachment" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-900"><Paperclip className="size-4" /> {t('attachment')}</label>
        <input
          id="f-attachment"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          aria-invalid={Boolean(fileError)}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            setFileError(null)
            setFile(null)
            if (!f) return
            if (f.size > MAX_FILE) {
              setFileError('fileTooBig')
              e.target.value = ''
            } else if (!/\.(pdf|jpe?g|png|webp)$/i.test(f.name)) {
              setFileError('fileType')
              e.target.value = ''
            } else setFile(f)
          }}
          className="block w-full rounded-xl border border-dashed border-line bg-paper px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-charcoal-900 file:px-4 file:py-2 file:text-white"
        />
        {fileError && <p className="mt-1 text-sm text-red-600">{t.has(fileError) ? t(fileError) : fileError}</p>}
      </div>

      {banner && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2" role="alert">{banner}</p>
      )}

      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1 size-4 accent-saffron-600" aria-invalid={Boolean(errors.consent)} {...register('consent', { required: 'required', onChange: () => clearErrors('consent') })} /> {t('consent')}
        </label>
        {errors.consent && <p className="mt-1 text-sm text-red-600">{t.has('required') ? t('required') : 'required'}</p>}
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary min-w-40 text-base disabled:opacity-60">
          {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> {t('sending')}</> : t('submit')}
        </button>
        {captchaEnabled && (
          <p className="mt-3 text-xs text-muted">
            Protected by reCAPTCHA — Google <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a> &amp; <a className="underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms</a>.
          </p>
        )}
      </div>
    </form>
  )
}

type FieldProps = {
  id: string
  label: string
  required?: boolean
  error?: FieldError
  full?: boolean
  as?: 'input' | 'textarea' | 'select'
  inputProps?: InputHTMLAttributes<HTMLInputElement> & Partial<UseFormRegisterReturn>
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement> & Partial<UseFormRegisterReturn>
  selectProps?: SelectHTMLAttributes<HTMLSelectElement> & Partial<UseFormRegisterReturn>
  options?: { value: string; label: string }[]
}

function Field({ id, label, required, error, full, as = 'input', inputProps, textareaProps, selectProps, options }: FieldProps) {
  const t = useTranslations('forms')
  const fieldId = `f-${id}`
  const cls = cn('w-full rounded-xl border bg-paper px-4 py-3 outline-none transition focus:border-saffron-500 focus:ring-4 focus:ring-saffron-100', error ? 'border-red-400' : 'border-line')
  const message = error?.message
  return (
    <div className={cn(full && 'md:col-span-2')}>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-semibold text-charcoal-900">
        {label} {required && <span className="text-saffron-600">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea id={fieldId} className={cls} aria-invalid={Boolean(error)} {...textareaProps} />
      ) : as === 'select' ? (
        <select id={fieldId} className={cls} aria-invalid={Boolean(error)} defaultValue="" {...selectProps}>
          <option value="" disabled>—</option>
          {options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input id={fieldId} className={cls} aria-invalid={Boolean(error)} {...inputProps} />
      )}
      {message && <p className="mt-1 text-sm text-red-600">{t.has(message) ? t(message) : message}</p>}
    </div>
  )
}
