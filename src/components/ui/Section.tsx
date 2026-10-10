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
}

export function Section({ eyebrow, heading, children, className, dark, action, intro, id }: Props) {
  return (
    <section id={id} className={cn('py-16 md:py-24', dark && 'on-dark grain bg-maroon-900 text-white', className)}>
      <div className="container-x">
        {(eyebrow || heading || action) && (
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {heading && <h2 className="h-section">{heading}</h2>}
              {intro && <p className={cn('mt-4 text-lg', dark ? 'text-white/75' : 'text-muted')}>{intro}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
