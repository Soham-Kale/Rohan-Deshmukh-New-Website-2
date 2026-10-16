import { cn } from '@/lib/utils'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  children?: React.ReactNode
  className?: string
  dark?: boolean
  action?: React.ReactNode
  intro?: string | null
  id?: string
  /** centred heading (sections that show a list or grid) */
  center?: boolean
}

/** Section heading on its own: eyebrow → title → intro (left or centred) */
export function SectionHead({ eyebrow, heading, intro, center, className, as: Tag = 'h2' }: { eyebrow?: string | null; heading?: string | null; intro?: string | null; center?: boolean; className?: string; as?: 'h2' | 'h3' }) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <div className={cn('section-head', center && 'is-center', className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {heading && <Tag className="h-section">{heading}</Tag>}
      {intro && <p className="lead">{intro}</p>}
    </div>
  )
}

/** A full-width band with the standard vertical rhythm and heading */
export function Section({ eyebrow, heading, children, className, dark, action, intro, id, center }: Props) {
  const head = <SectionHead eyebrow={eyebrow} heading={heading} intro={intro} center={center && !action} />
  return (
    <section id={id} className={cn('section', dark && 'on-dark grain bg-charcoal-900 text-white', className)}>
      <div className="container-x">
        {action ? (
          <div className="section-head-row">
            {head}
            <div className="shrink-0">{action}</div>
          </div>
        ) : (
          head
        )}
        {children}
      </div>
    </section>
  )
}
