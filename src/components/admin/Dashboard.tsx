import Link from 'next/link'
import type { ServerProps } from 'payload'

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d))

const greeting = () => {
  const h = Number(new Intl.DateTimeFormat('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()))
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

/** Custom dashboard shown above Payload's collection cards */
export async function Dashboard({ payload, user }: ServerProps) {
  const count = (collection: Parameters<typeof payload.count>[0]['collection'], where?: object) =>
    payload.count({ collection, where: where as never, overrideAccess: false, user }).then((r) => r.totalDocs).catch(() => 0)

  const [newMessages, pages, posts, initiatives, albums, photos] = await Promise.all([
    count('contact-messages', { status: { equals: 'new' } }),
    count('pages'),
    count('posts'),
    count('initiatives'),
    count('albums'),
    count('media'),
  ])

  const recent = async (collection: 'contact-messages', label: string) => {
    try {
      const r = await payload.find({ collection, limit: 5, sort: '-createdAt', depth: 0, overrideAccess: false, user })
      return r.docs.map((d: Record<string, any>) => ({ id: d.id, collection, label, name: d.name, sub: d.subject || d.issue || d.message || '', status: d.status, ref: d.referenceNo, at: d.createdAt }))
    } catch {
      return []
    }
  }
  const inbox = (await recent('contact-messages', 'Contact')).slice(0, 6)

  const newTotal = newMessages
  const site = process.env.NEXT_PUBLIC_SITE_URL || '/'

  const actions = [
    { href: '/admin/globals/home', title: 'Edit homepage', text: 'Slider, sections & order', icon: '🏠' },
    { href: '/admin/collections/posts/create', title: 'Write a blog post', text: 'Marathi + English', icon: '✍️' },
    { href: '/admin/collections/albums/create', title: 'New photo album', text: 'Upload event photos', icon: '📸' },
    { href: '/admin/collections/initiatives', title: 'Social initiatives', text: 'Counters, galleries, videos', icon: '🤝' },
    { href: '/admin/globals/header', title: 'Edit menu', text: '3-level mega menu', icon: '🧭' },
    { href: '/admin/globals/popup', title: 'Site popup', text: 'Announcements on/off', icon: '📣' },
  ]

  const stats = [
    { label: 'Pages', value: pages, href: '/admin/collections/pages' },
    { label: 'Blog posts', value: posts, href: '/admin/collections/posts' },
    { label: 'Initiatives', value: initiatives, href: '/admin/collections/initiatives' },
    { label: 'Photo albums', value: albums, href: '/admin/collections/albums' },
    { label: 'Photos', value: photos, href: '/admin/collections/media' },
  ]

  return (
    <div className="rd-dash">
      <section className="rd-dash__hero">
        <div>
          <p className="rd-dash__eyebrow">{greeting()}{user && 'name' in user && user.name ? `, ${String(user.name)}` : ''} 👋</p>
          <h1 className="rd-dash__title">रोहन सुभाष देशमुख — Website</h1>
          <p className="rd-dash__lead">Manage pages, social work, photos, blog and messages from one place. Every text field has a मराठी and an English version — switch with the locale button at the top right.</p>
        </div>
        <div className="rd-dash__hero-actions">
          <a className="rd-btn rd-btn--light" href={site} target="_blank" rel="noopener noreferrer">View website ↗</a>
          <Link className="rd-btn rd-btn--ghost" href="/admin/collections/contact-messages">Open inbox{newTotal ? ` (${newTotal} new)` : ''}</Link>
        </div>
      </section>

      <section className="rd-dash__inbox-stats">
        {[
          { label: 'New contact messages', value: newMessages, href: '/admin/collections/contact-messages?where[status][equals]=new' },
        ].map((s) => (
          <Link key={s.label} href={s.href} className={`rd-stat ${s.value ? 'rd-stat--alert' : ''}`}>
            <span className="rd-stat__value">{s.value}</span>
            <span className="rd-stat__label">{s.label}</span>
          </Link>
        ))}
      </section>

      <div className="rd-dash__grid">
        <section className="rd-panel">
          <h2 className="rd-panel__title">Quick actions</h2>
          <div className="rd-actions">
            {actions.map((a) => (
              <Link key={a.href} href={a.href} className="rd-action">
                <span className="rd-action__icon" aria-hidden>{a.icon}</span>
                <span>
                  <span className="rd-action__title">{a.title}</span>
                  <span className="rd-action__text">{a.text}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="rd-mini-stats">
            {stats.map((s) => (
              <Link key={s.label} href={s.href} className="rd-mini-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rd-panel">
          <div className="rd-panel__head">
            <h2 className="rd-panel__title">Latest inbox</h2>
            <Link href="/admin/collections/contact-messages" className="rd-link">See all →</Link>
          </div>
          {inbox.length ? (
            <ul className="rd-inbox">
              {inbox.map((m) => (
                <li key={`${m.collection}-${m.id}`}>
                  <Link href={`/admin/collections/${m.collection}/${m.id}`} className="rd-inbox__item">
                    <span className={`rd-pill rd-pill--${m.status || 'new'}`}>{m.status || 'new'}</span>
                    <span className="rd-inbox__main">
                      <span className="rd-inbox__name">{m.name} <em>· {m.label}{m.ref ? ` ${m.ref}` : ''}</em></span>
                      <span className="rd-inbox__sub">{String(m.sub).slice(0, 90)}</span>
                    </span>
                    <span className="rd-inbox__at">{fmtDate(m.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rd-empty">No messages yet. Contact form submissions will appear here.</p>
          )}
        </section>
      </div>

      <h2 className="rd-dash__section-title">All content</h2>
    </div>
  )
}
