import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-8xl text-saffron-500">४०४</p>
        <h1 className="mt-4 text-3xl text-maroon-900">पृष्ठ सापडले नाही / Page not found</h1>
        <Link href="/" className="btn btn-dark mt-8">मुख्य पृष्ठ / Home</Link>
      </div>
    </section>
  )
}
