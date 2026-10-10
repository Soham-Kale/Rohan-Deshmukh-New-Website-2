'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }

export function InstagramEmbeds({ urls }: { urls: { url: string; title: string }[] }) {
  useEffect(() => { window.instgrm?.Embeds.process() }, [urls])
  return (
    <>
      <div className="no-scrollbar relative -mx-4 flex snap-x gap-4 overflow-x-auto overflow-y-hidden px-4 pb-2">
        {urls.map((u) => (
          <div key={u.url} className="relative w-[300px] shrink-0 snap-start overflow-hidden sm:w-[328px]">
            <blockquote className="instagram-media" data-instgrm-permalink={u.url} data-instgrm-version="14" style={{ margin: 0, minWidth: 0, width: '100%', borderRadius: 16 }}>
              <a href={u.url} target="_blank" rel="noopener" className="block rounded-2xl border border-line bg-white p-6 text-maroon-900">{u.title || u.url}</a>
            </blockquote>
          </div>
        ))}
      </div>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" onLoad={() => window.instgrm?.Embeds.process()} />
    </>
  )
}
