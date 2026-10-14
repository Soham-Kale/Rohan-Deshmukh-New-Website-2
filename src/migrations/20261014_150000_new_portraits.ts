import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyPortraits } from '../seed/content-updates'

/**
 * Content migration (no schema change): latest portraits (Aug 2026 shoot, files in public/images/portraits)
 * on the homepage परिचय and कौटुंबिक पार्श्वभूमी sections and the कौटुंबिक पार्श्वभूमी page banner.
 * Skipped on an empty database (the seed already uses them).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'pages' })
  if (!totalDocs) return
  await applyPortraits(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // photos are not swapped back automatically; pick another photo in the admin if needed
}
