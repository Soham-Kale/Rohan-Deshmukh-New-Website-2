import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useTranslations } from '@/lib/i18n'
import { mediaPosition, mediaUrl, srcSetOf, type MaybeMedia } from '@/lib/media'
import { usePrefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { CMSLink } from '../ui/CMSLink'

export type Slide = {
  kicker?: string | null
  heading?: string | null
  subheading?: string | null
  buttons: { label?: string | null; url?: string | null; newTab?: boolean | null }[]
}

/** The photo behind the text: a wide one for large screens and, if there is one, a portrait one for phones and tablets */
export type HeroPhoto = { wide?: MaybeMedia; tall?: MaybeMedia; alt: string }

const pad = (n: number) => String(n).padStart(2, '0')

/** the last two words of a headline get the kesariya gradient (Stitch: "… is a *big one*", "… at the *grassroots*") */
function Headline({ text }: { text?: string | null }) {
  if (!text) return null
  const words = text.trim().split(/\s+/)
  if (words.length < 3) return <>{text}</>
  const cut = words.length - 2
  return (
    <>
      {words.slice(0, cut).join(' ')}{' '}
      <span className="bg-gradient-to-r from-saffron-500 to-[#ffa726] bg-clip-text text-transparent">{words.slice(cut).join(' ')}</span>
    </>
  )
}

/**
 * The homepage hero: a stable photo of Rohan with the slides' words on top and one clear next step (the slide's first button).
 *
 *  - With a photo (the default): large screens show the wide photo under a dark tint on the left, where the words are; phones show
 *    the portrait photo full height under the see-through header, words at the bottom over a dark fade.
 *    Without a photo — or when the hero style is "Text only" in the admin — the words sit on the navy band, without buttons.
 *  - The first slide is on screen from the first paint (no entrance animation), so the heading is the largest contentful paint;
 *    later slides fade in line by line. Nothing slides sideways.
 *  - Autoplay pauses on hover and focus, while the tab is hidden, and with the Pause button (WCAG 2.2.2).
 *    People who ask for reduced motion get no autoplay unless they press Play.
 */
export function HeroSlider({ slides, photo, autoplay = 5 }: { slides: Slide[]; photo?: HeroPhoto | null; autoplay?: number }) {
  const t = useTranslations('common')
  const count = slides.length
  const wideMedia = photo?.wide ?? photo?.tall
  const tallMedia = photo?.tall ?? photo?.wide
  const wideUrl = mediaUrl(wideMedia, 'hero')
  const tallUrl = mediaUrl(tallMedia, 'card')
  const withPhoto = Boolean(wideUrl)
  const headingSize = withPhoto ? 'lg:text-5xl xl:text-[length:clamp(3.5rem,4.4vw,4rem)]' : 'lg:text-7xl'

  const line = { in: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } }, out: { opacity: 0, x: -24 } }
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [hold, setHold] = useState(false) // pointer or focus inside, or the tab is hidden
  const [choice, setChoice] = useState<boolean | null>(null) // true = the visitor pressed Pause, false = Play
  const reduced = usePrefersReducedMotion()
  const touch = useRef<number | null>(null)
  const indexRef = useRef(0)

  const paused = choice ?? reduced
  const playing = count > 1 && !paused && !hold

  const show = useCallback((next: number) => {
    if (next === indexRef.current) return
    indexRef.current = next
    setIndex(next)
  }, [])
  const step = useCallback((dir: number) => show((indexRef.current + dir + count) % count), [count, show])

  // autoplay
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => step(1), autoplay * 1000)
    return () => window.clearTimeout(id)
  }, [index, playing, autoplay, step])

  useEffect(() => {
    const onVis = () => setHold(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // the previous slide only has to stay on screen while it fades out
  useEffect(() => {
    if (prev === null) return
    const id = window.setTimeout(() => setPrev(null), 700)
    return () => window.clearTimeout(id)
  }, [prev, index])

  if (!count) return null
  const pos = Math.max(0, order.indexOf(index))

  /* dots, previous / next and the place line — under the words on desktop, under the photo on phones */
  const controls = (className: string) =>
    order.length > 1 && (
      <div className={cn('flex items-center gap-6', className)}>
        <div className="flex items-center gap-2">
          {order.map((i, n) => (
            <button
              key={i}
              type="button"
              onClick={() => show(i)}
              aria-label={`Slide ${n + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className="grid h-6 place-items-center"
            >
              <span className={cn('block h-2 rounded-full transition-all', i === index ? 'w-10 bg-gradient-to-r from-saffron-600 to-saffron-500 shadow-lg shadow-saffron-500/40' : 'w-3 bg-white/30 hover:bg-white/60')} />
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label={labels?.prev ?? 'Previous slide'} className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-white transition-colors hover:bg-saffron-500">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={labels?.next ?? 'Next slide'} className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-white transition-colors hover:bg-saffron-500">
            <ChevronRight className="size-5" />
          </button>
        </div>
        {place && <span className="hidden text-xs font-bold uppercase tracking-wider text-saffron-200 sm:inline-block">{place.replace(/,\s*/g, ' • ')} • New India</span>}
      </div>
    )

  return (
    <section
      data-hero-overlay
      className={cn(
        'relative isolate flex flex-col overflow-hidden bg-charcoal-950 text-white max-lg:-mt-[4.5rem]',
        withPhoto ? 'min-h-[min(100svh,46rem)] lg:min-h-[640px]' : 'lg:min-h-[560px]',
      )}
      aria-roledescription="carousel"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      {withPhoto && (
        <>
          {/* one photo for every slide; the browser fetches only the copy that suits the screen */}
          <picture className="absolute inset-0 -z-20">
            {/* on a phone the portrait photo is cropped to the screen's height, so it is drawn about 1.3 times as wide as the screen */}
            {tallUrl && wideUrl && tallUrl !== wideUrl && <source media="(max-width: 1023px)" srcSet={srcSetOf(tallMedia) ?? tallUrl} sizes="(max-width: 600px) 130vw, 100vw" />}
            <img
              src={wideUrl!}
              srcSet={srcSetOf(wideMedia)}
              sizes="100vw"
              alt={photo?.alt ?? ''}
              decoding="async"
              fetchPriority="high"
              className="size-full object-cover [object-position:var(--pos-wide)] max-lg:[object-position:var(--pos-tall)]"
              style={{ ['--pos-wide' as string]: mediaPosition(wideMedia), ['--pos-tall' as string]: mediaPosition(tallMedia) } as CSSProperties}
            />
          </picture>
          {/* tint: large screens — dark where the words are, clear where Rohan is; phones — a little darker under the header
              (the dark fade behind the words is attached to the words below, so it follows them whatever their height) */}
          <div aria-hidden className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-charcoal-950 from-0% via-charcoal-950/80 via-45% to-charcoal-950/5 lg:block" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-charcoal-950/60 to-transparent lg:hidden" />
        </>
      )}

      {/* text */}
      <div className="container-x relative flex flex-1 items-end pb-[4.5rem] pt-36 sm:pt-40 lg:items-center lg:pb-28 lg:pr-36 lg:pt-20">
        {/* all slides share one grid cell, so the block keeps one height and nothing jumps.
            With the photo, Rohan's face sits at about 56 % of the screen's width (the photo scales with the screen): the words get a column
            that ends before it (32rem under 1280 px, 38rem above) and a heading that grows with the screen (3rem, then 3.5rem → 4rem).
            On the plain navy band there is no face to avoid, so the words keep the full width and the big heading. */}
        <div className={cn('relative grid w-full', withPhoto ? 'max-w-2xl lg:max-w-lg xl:max-w-[38rem]' : 'max-w-4xl')}>
          {/* phones and tablets: a deep fade from the bottom edge up to a little above the first line, full width — the words (and the pager
              under them) always sit on a dark ground, even where the photo is light (the kurta) */}
          {withPhoto && <div aria-hidden className="absolute -inset-x-[100vw] -bottom-[4.5rem] -top-28 -z-10 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/90 via-80% to-transparent lg:hidden" />}
          {slides.map((s, i) => {
            const state = i === index ? 'in' : i === prev ? 'out' : 'idle'
            const delay = (ms: number) => ({ transitionDelay: state === 'in' ? `${ms}ms` : '0ms' })
            return (
              <div
                key={i}
                aria-hidden={state !== 'in'}
                className={cn('[grid-area:1/1] max-lg:self-end lg:self-center', state !== 'in' && 'pointer-events-none', state === 'idle' && 'invisible')}
              >
                {s.kicker && (
                  <p className={cn('hero-line hero-kicker mb-3 text-[0.95rem] font-light uppercase text-saffron-300 sm:text-xl lg:mb-4', withPhoto ? 'lg:text-xl xl:text-[1.4rem]' : 'lg:text-2xl')} data-state={state} style={delay(0)}>
                    {s.kicker}
                  </p>
                )}
                {i === 0 ? (
                  <h1 className={cn('hero-line text-[2.3rem] font-semibold leading-[1.12] sm:text-5xl md:text-6xl', headingSize)} data-state={state} style={delay(60)}>
                    {s.heading}
                  </h1>
                ) : (
                  <p className={cn('hero-line font-display text-[2.3rem] font-semibold leading-[1.12] sm:text-5xl md:text-6xl', headingSize)} data-state={state} style={delay(60)}>
                    {s.heading}
                  </p>
                )}
                {s.subheading && (
                  <p className="hero-line mt-4 max-w-2xl text-base text-white sm:text-lg lg:mt-5 lg:text-xl" data-state={state} style={delay(120)}>
                    {s.subheading}
                  </p>
                )}
                {withPhoto && s.buttons.length > 0 && (
                  <div className="hero-line mt-6 flex flex-wrap gap-3 lg:mt-9" data-state={state} style={delay(180)}>
                    {s.buttons.slice(0, 2).map((b, j) => (
                      <CMSLink
                        key={j}
                        url={b.url}
                        newTab={b.newTab}
                        tabIndex={state === 'in' ? undefined : -1}
                        onClick={() => trackEvent('hero_cta_click', { label: b.label, url: b.url, slide: i + 1, button: j === 0 ? 'primary' : 'secondary' })}
                        className={cn('btn text-base max-lg:!min-h-12 max-lg:px-5 max-lg:text-[0.95rem]', j === 0 ? 'btn-primary' : 'btn-outline-light')}
                      >
                        {b.label} <ArrowRight className="size-4" />
                      </CMSLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* numbered pager with Pause / Play — phones and tablets: a row along the bottom, on the dark fade; desktop: a column at the
          right edge, on a dark pill (so the numbers stay readable over any part of the photo) */}
      {count > 1 && (
        <nav aria-label={t('slides')} className="absolute bottom-3 left-4 z-10 md:left-8 lg:bottom-auto lg:left-auto lg:right-12 lg:top-1/2 lg:-translate-y-1/2 xl:right-16">
          <ol className="flex items-center lg:flex-col lg:items-end lg:gap-1 lg:rounded-full lg:bg-charcoal-950/60 lg:px-2 lg:py-2.5 lg:backdrop-blur-sm">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => show(i)}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn('group relative flex min-h-11 min-w-11 items-center justify-center gap-3 px-2 text-base tabular-nums transition-colors lg:justify-end lg:text-lg', i === index ? 'font-semibold text-white' : 'text-white/90 hover:text-white')}
                >
                  {/* the current slide: an underline on phones, a line before the number on desktop */}
                  <span aria-hidden className={cn('absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-white transition-opacity lg:hidden', i === index ? 'opacity-100' : 'opacity-0')} />
                  <span aria-hidden className={cn('hidden h-px bg-white transition-all duration-500 lg:block', i === index ? 'w-12' : 'w-0 group-hover:w-4')} />
                  <span className="sr-only">{t('slide')} </span>
                  {pad(i + 1)}
                </button>
              </li>
            ))}
            <li className="ml-1 lg:ml-0 lg:mt-1">
              <button
                type="button"
                onClick={() => setChoice(!paused)}
                aria-label={paused ? t('playSlides') : t('pauseSlides')}
                title={paused ? t('playSlides') : t('pauseSlides')}
                className="grid size-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/60 transition-colors hover:bg-white/25"
              >
                {paused ? <Play aria-hidden className="size-4 fill-current" /> : <Pause aria-hidden className="size-4 fill-current" />}
              </button>
            </li>
          </ol>
        </nav>
      )}
    </section>
  )
}
