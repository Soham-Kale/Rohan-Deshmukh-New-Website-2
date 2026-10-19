import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAG } from '@/lib/cms'

/**
 * POST /api/revalidate — called by the backend after every edit in the admin, so changes appear on the
 * website immediately instead of after the 5-minute refresh. Only accepted with the shared INTERNAL_API_SECRET.
 */
export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET
  if (!secret || req.headers.get('x-internal-secret') !== secret) {
    return Response.json({ ok: false }, { status: 401 })
  }
  revalidateTag(CACHE_TAG)
  revalidatePath('/', 'layout')
  return Response.json({ ok: true, revalidated: true })
}
