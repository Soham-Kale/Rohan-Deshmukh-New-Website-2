'use client'

import { useTranslations } from 'next-intl'
import { submitApplication, submitContact, submitGrievance } from '@/lib/forms'
import { Field, FileField, FormShell, useForm } from './Fields'

export function ContactForm({ offices }: { offices: { value: string; label: string }[] }) {
  const t = useTranslations('forms')
  const { state, formAction, pending } = useForm(submitContact, 'contact')
  const e = state?.errors ?? {}
  return (
    <FormShell state={state} pending={pending} action={formAction}>
      <Field name="name" label={t('name')} required error={e.name} autoComplete="name" />
      <Field name="mobile" label={t('mobile')} required error={e.mobile} type="tel" inputMode="tel" autoComplete="tel" />
      <Field name="email" label={t('email')} required error={e.email} type="email" autoComplete="email" />
      <Field name="subject" label={t('subject')} required error={e.subject} />
      <Field name="office" label={t('office')} required error={e.office} as="select" options={offices} full defaultValue={offices.length === 1 ? offices[0].value : undefined} />
      <Field name="message" label={t('message')} as="textarea" full />
      <FileField name="attachment" label={t('attachment')} accept=".pdf,.jpg,.jpeg,.png,.webp" error={e.attachment} />
    </FormShell>
  )
}

export function GrievanceForm() {
  const t = useTranslations('forms')
  const { state, formAction, pending } = useForm(submitGrievance, 'grievance')
  const e = state?.errors ?? {}
  return (
    <FormShell state={state} pending={pending} action={formAction}>
      <fieldset className="md:col-span-2">
        <legend className="mb-2 text-sm font-semibold text-maroon-900">{t('type')}</legend>
        <div className="flex gap-3">
          {(['grievance', 'suggestion'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 has-[:checked]:border-saffron-500 has-[:checked]:bg-saffron-50">
              <input type="radio" name="type" value={v} defaultChecked={v === 'grievance'} className="accent-saffron-600" /> {t(v)}
            </label>
          ))}
        </div>
      </fieldset>
      <Field name="name" label={t('name')} required error={e.name} autoComplete="name" />
      <Field name="mobile" label={t('mobile')} required error={e.mobile} type="tel" inputMode="tel" autoComplete="tel" />
      <Field name="email" label={t('email')} error={e.email} type="email" autoComplete="email" full />
      <Field name="address" label={t('address')} required error={e.address} as="textarea" rows={3} full />
      <Field name="issue" label={t('issue')} required error={e.issue} as="textarea" rows={6} full />
      <FileField name="attachment" label={t('attachment')} accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" error={e.attachment} />
    </FormShell>
  )
}

export function CareerForm({ jobs }: { jobs: { value: string; label: string }[] }) {
  const t = useTranslations('forms')
  const { state, formAction, pending } = useForm(submitApplication, 'careers')
  const e = state?.errors ?? {}
  return (
    <FormShell state={state} pending={pending} action={formAction} submitLabel={t('apply')}>
      {jobs.length > 0 && <Field name="job" label={t('subject')} as="select" options={jobs} full />}
      <Field name="name" label={t('name')} required error={e.name} autoComplete="name" />
      <Field name="mobile" label={t('mobile')} required error={e.mobile} type="tel" inputMode="tel" autoComplete="tel" />
      <Field name="email" label={t('email')} required error={e.email} type="email" autoComplete="email" full />
      <Field name="message" label={t('message')} as="textarea" full />
      <FileField name="cv" label={t('cv')} accept=".pdf,.doc,.docx" error={e.cv} />
    </FormShell>
  )
}
