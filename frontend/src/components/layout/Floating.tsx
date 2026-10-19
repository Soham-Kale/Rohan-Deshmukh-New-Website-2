'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, X } from 'lucide-react'
import Image from 'next/image'
import { SocialIcon, socialLabels } from '../ui/SocialIcon'
import { cn, isExternal } from '@/lib/utils'

export function SocialBar({ social }: { social: Record<string, string | null | undefined> }) {
  const items = Object.entries(social).filter(([, v]) => v)
  if (!items.length) return null
  return (
    <aside aria-label="Social media" className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col overflow-hidden rounded-r-2xl bg-charcoal-900/90 shadow-lg backdrop-blur">
        {items.map(([k, v]) => (
          <li key={k}>
            <a href={v!} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[k] ?? k} className="grid size-11 place-items-center text-white/80 transition hover:bg-saffron-500 hover:text-white">
              <SocialIcon name={k === 'whatsappChannel' ? 'whatsapp' : k} className="size-[18px]" />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function ConnectTag({ label, url }: { label?: string | null; url?: string | null }) {
  if (!label || !url) return null
  return (
    <a
      href={url}
      target={isExternal(url) ? '_blank' : undefined}
      rel="noopener"
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 rotate-180 rounded-r-xl bg-saffron-500 px-2 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition [writing-mode:vertical-rl] hover:bg-saffron-600 md:block"
    >
      {label}
    </a>
  )
}

/** back-to-top button (the floating WhatsApp chat button was removed, Oct 2026) */
export function FloatingButtons({ labels }: { labels: { top: string } }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const f = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label={labels.top}
        className={cn('btn-icon size-11 shadow-lg', show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0')}
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  )
}

type PopupData = { image?: string | null; title?: string | null; text?: string | null; linkLabel?: string | null; linkUrl?: string | null; delaySeconds?: number | null; key: string }

export function SitePopup({ data, closeLabel }: { data: PopupData | null; closeLabel: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!data) return
    let seen = false
    try {
      seen = sessionStorage.getItem('rd-popup') === data.key
    } catch {}
    if (seen) return
    const id = setTimeout(() => setOpen(true), (data.delaySeconds ?? 2) * 1000)
    return () => clearTimeout(id)
  }, [data])
  if (!data || !open) return null
  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem('rd-popup', data.key)
    } catch {}
  }
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-charcoal-950/70 p-4" role="dialog" aria-modal="true" onClick={close}>
      <div className="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} aria-label={closeLabel} className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 shadow">
          <X className="size-5" />
        </button>
        {data.image && (
          <div className="relative aspect-[4/3] w-full">
            <Image src={data.image} alt={data.title ?? ''} fill className="object-cover" sizes="512px" />
          </div>
        )}
        {(data.title || data.text || data.linkUrl) && (
          <div className="p-6">
            {data.title && <h2 className="font-display text-2xl text-charcoal-900">{data.title}</h2>}
            {data.text && <p className="mt-2 text-muted">{data.text}</p>}
            {data.linkUrl && (
              <a href={data.linkUrl} onClick={close} className="btn btn-primary mt-5">
                {data.linkLabel || '→'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
