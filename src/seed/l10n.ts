/** Marks a bilingual value. English is optional (Marathi is the fallback on the site). */
export type L<T = unknown> = { __l: true; mr: T; en?: T }
export const L = <T>(mr: T, en?: T): L<T> => ({ __l: true, mr, en })
const isL = (v: unknown): v is L => Boolean(v && typeof v === 'object' && (v as L).__l === true)

/** Await every promise nested anywhere in the structure */
export async function resolveDeep<T>(v: T): Promise<T> {
  const x = await v
  if (Array.isArray(x)) return (await Promise.all(x.map(resolveDeep))) as T
  if (x && typeof x === 'object' && !(x instanceof Date) && !Buffer.isBuffer(x)) {
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(x)) out[k] = await resolveDeep(val)
    return out as T
  }
  return x
}

/** Pick one locale from a structure containing L() values */
export function pick<T>(v: T, locale: 'mr' | 'en'): T {
  if (isL(v)) return (locale === 'en' ? v.en : v.mr) as T
  if (Array.isArray(v)) return v.map((x) => pick(x, locale)) as T
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(v)) {
      const p = pick(val, locale)
      if (p !== undefined) out[k] = p
    }
    return out as T
  }
  return v
}

export function hasEnglish(v: unknown): boolean {
  if (isL(v)) return v.en !== undefined
  if (Array.isArray(v)) return v.some(hasEnglish)
  if (v && typeof v === 'object') return Object.values(v).some(hasEnglish)
  return false
}

/**
 * Build the English update payload: same shape as the saved Marathi doc (keeps array/block row ids),
 * replacing only the bilingual leaves that have an English value.
 */
const western = (s: string) => s.replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d))).replace(/ कोटी/g, ' Cr').replace(/ लाख/g, ' lakh').replace(/ वर्षे/g, ' years').replace(/ एकर/g, ' acres')

export function englishOver(source: unknown, saved: unknown, copyMissing = false, key = ''): unknown {
  if (key === 'value' && typeof source === 'string' && /[०-९]/.test(source)) return western(source)
  if (isL(source)) return source.en !== undefined ? source.en : copyMissing ? saved : null
  if (Array.isArray(source) && Array.isArray(saved)) return source.map((s, i) => englishOver(s, saved[i], copyMissing, key))
  if (source && typeof source === 'object' && saved && typeof saved === 'object' && !(source instanceof Date)) {
    const out: Record<string, unknown> = { ...(saved as object) }
    for (const [k, val] of Object.entries(source)) out[k] = englishOver(val, (saved as Record<string, unknown>)[k], copyMissing, k)
    return out
  }
  return saved ?? source
}
