import { Link } from '@/i18n/navigation'
import { isExternal } from '@/lib/utils'

type Props = { url?: string | null; newTab?: boolean | null; className?: string; children: React.ReactNode; 'aria-label'?: string }

export function CMSLink({ url, newTab, className, children, ...rest }: Props) {
  if (!url) return <span className={className}>{children}</span>
  if (isExternal(url) || url.startsWith('mailto:') || url.startsWith('tel:') || newTab)
    return (
      <a href={url} className={className} target={isExternal(url) || newTab ? '_blank' : undefined} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  return (
    <Link href={url} className={className} {...rest}>
      {children}
    </Link>
  )
}
