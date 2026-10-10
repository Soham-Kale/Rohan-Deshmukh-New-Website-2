import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/** Clear the Next.js cache so edits appear on the live site immediately */
const run = async () => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    /* outside Next runtime (seed script) */
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await run()
  return doc
}
export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await run()
  return doc
}
