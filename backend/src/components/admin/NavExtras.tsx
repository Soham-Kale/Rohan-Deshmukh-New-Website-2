import Link from 'next/link'
import type { ServerProps } from 'payload'
import { frontendUrl } from '@/lib/urls'

/** Above the menu: inbox shortcut with unread count */
export async function NavInbox({ payload, user }: ServerProps) {
  let n = 0
  try {
    n = (await payload.count({ collection: 'contact-messages', where: { status: { equals: 'new' } }, overrideAccess: false, user })).totalDocs
  } catch {}
  return (
    <div className="rd-nav-top">
      <Link href="/admin" className="rd-nav-top__link">🏠 Dashboard</Link>
      <Link href="/admin/collections/contact-messages" className="rd-nav-top__link">
        📥 Inbox {n > 0 && <span className="rd-badge">{n}</span>}
      </Link>
    </div>
  )
}

/** Below the menu: open the public website */
export function NavSite() {
  const site = frontendUrl()
  return (
    <div className="rd-nav-bottom">
      <a href={site} target="_blank" rel="noopener noreferrer" className="rd-nav-site">🌐 View website ↗</a>
      <a href={`${site.replace(/\/$/, '')}/en`} target="_blank" rel="noopener noreferrer" className="rd-nav-site rd-nav-site--muted">English version ↗</a>
    </div>
  )
}
