'use client'

import { useTranslations } from 'next-intl'
import { submitContact } from '@/lib/forms'
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

