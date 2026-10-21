import { m, type Variants } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Motion helpers for the whole site (Stitch design, Oct 2026). They use the light `m` components, so they work inside
 * the site's <LazyMotion> (RootLayout); <MotionConfig reducedMotion="user"> there turns the movement off for visitors who
 * ask their device for reduced motion.
 * - Reveal: a block fades and rises once as it scrolls into view.
 * - Stagger + StaggerItem: the items of a row or grid come in one after another.
 * - Lift: a card that rises a little on hover and presses down on tap.
 */

const EASE = [0.2, 0.7, 0.2, 1] as const

type Tag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'dl' | 'p' | 'span' | 'article' | 'figure'

type Props = { as?: Tag; className?: string; children?: ReactNode; id?: string; style?: CSSProperties }

export function Reveal({ as = 'div', className, delay = 0, y = 28, children, id, style }: Props & { delay?: number; y?: number }) {
  const M = m[as] as typeof m.div
  return (
    <M
      id={id}
      style={style}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}

export function Stagger({ as = 'div', className, children, style }: Props) {
  const M = m[as] as typeof m.div
  return (
    <M className={className} style={style} variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1, margin: '0px 0px -8% 0px' }}>
      {children}
    </M>
  )
}

export function StaggerItem({ as = 'div', className, children, style }: Props) {
  const M = m[as] as typeof m.div
  return (
    <M className={className} style={style} variants={item}>
      {children}
    </M>
  )
}

/** hover lift for cards (desktop) and a gentle press on tap (phones) */
export function Lift({ as = 'div', className, children }: Props) {
  const M = m[as] as typeof m.div
  return (
    <M className={className} whileHover={{ y: -6 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
      {children}
    </M>
  )
}
