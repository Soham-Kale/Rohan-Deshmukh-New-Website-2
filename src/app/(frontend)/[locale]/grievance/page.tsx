import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { InnerPage } from '@/components/layout/InnerPage'
import { GrievanceForm } from '@/components/forms/Forms'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('grievance') }
}

export default async function GrievancePage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')
  return (
    <InnerPage path="/grievance" locale={locale} title={t('grievance')}
      subtitle={locale === 'mr' ? 'आपली तक्रार किंवा सूचना थेट आमच्यापर्यंत पोहोचवा. प्रत्येक अर्जाला संदर्भ क्रमांक दिला जातो.' : 'Send your grievance or suggestion directly to us. Every submission gets a reference number.'}>
      <GrievanceForm />
    </InnerPage>
  )
}
